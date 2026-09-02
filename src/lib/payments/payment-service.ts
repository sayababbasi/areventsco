import { prisma } from "@/lib/db";
import { SafepayGateway } from "./safepay";
import {
  CreatePaymentSessionParams,
  PaymentSessionResult,
  SafepayTrackerData,
  WebhookProcessingResult,
} from "./types";
import { toSafepayAmount } from "./currency";
import { eventBus } from "@/lib/realtime/event-bus";

/**
 * Normalizes any external gateway field into a clean string or null.
 * Prevents Prisma runtime exceptions when Safepay returns integer IDs (e.g. 22778).
 */
export function normalizeSafepayRef(val: any): string | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof val === "number" || typeof val === "bigint") {
    return String(val);
  }
  if (typeof val === "object") {
    if (val.id !== undefined && val.id !== null) return String(val.id);
    if (val.token !== undefined && val.token !== null) return String(val.token);
    if (val.reference !== undefined && val.reference !== null) return String(val.reference);
  }
  return String(val);
}

/**
 * Structured, safe internal audit logger for financial operations.
 * Never logs API keys, secret tokens, or raw card data.
 */
function logPaymentAudit(action: string, payload: Record<string, any>) {
  const timestamp = new Date().toISOString();
  console.log(
    JSON.stringify({
      audit: "PAYMENT_LIFECYCLE",
      action,
      timestamp,
      ...payload,
    })
  );
}

export class PaymentService {
  /**
   * Create a Safepay checkout session for a verified booking
   */
  static async createPaymentSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    const { bookingReference, paymentType = "ADVANCE" } = params;

    logPaymentAudit("PAYMENT_SESSION_INITIATED", {
      bookingReference,
      paymentType,
    });

    // 1. Fetch booking with customer and invoices from DB (Server-side single source of truth)
    const booking = await prisma.booking.findUnique({
      where: { reference: bookingReference },
      include: {
        invoices: true,
        customer: { include: { user: true } },
        payments: {
          where: { status: { in: ["PENDING", "PROCESSING", "PAID", "VERIFIED"] } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!booking) {
      return { success: false, error: `Booking with reference ${bookingReference} not found` };
    }

    if (booking.status === "CANCELLED" || booking.status === "REJECTED") {
      return { success: false, error: "Cannot process payment for a cancelled or rejected booking" };
    }

    // 2. Server-side authoritative calculation of payable amount
    const totalMinor = booking.totalAmountMinor;
    const depositRequiredMinor =
      booking.depositRequiredMinor > 0
        ? booking.depositRequiredMinor
        : Math.round(totalMinor * 0.3); // Default 30% advance deposit

    const balanceDueMinor = Math.max(0, totalMinor - booking.amountPaidMinor);

    let payableMinor = 0;

    if (paymentType === "ADVANCE") {
      if (booking.amountPaidMinor >= depositRequiredMinor) {
        if (balanceDueMinor > 0) {
          payableMinor = balanceDueMinor;
        } else {
          return {
            success: false,
            error: "The advance deposit for this booking is already paid in full.",
          };
        }
      } else {
        payableMinor = Math.min(depositRequiredMinor - booking.amountPaidMinor, balanceDueMinor);
      }
    } else if (paymentType === "BALANCE") {
      payableMinor = balanceDueMinor;
    } else {
      // FULL payment
      payableMinor = balanceDueMinor > 0 ? balanceDueMinor : totalMinor;
    }

    if (payableMinor <= 0) {
      return {
        success: false,
        error: "This booking is already fully paid. No further balance is due.",
      };
    }

    // 3. Ensure an Invoice exists for this booking
    let invoice = booking.invoices[0] || null;
    if (!invoice) {
      const year = new Date().getFullYear();
      const count = await prisma.invoice.count();
      const invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, "0")}`;

      const customerName = booking.customer?.user?.name || "Valued Client";
      const customerEmail = booking.customer?.user?.email || "customer@areventsco.com";
      const customerPhone = booking.customer?.user?.phone || "+92 316 0513841";

      invoice = await prisma.invoice.create({
        data: {
          bookingId: booking.id,
          invoiceNumber,
          customerName,
          customerEmail,
          customerPhone,
          subtotalMinor: booking.totalAmountMinor,
          totalAmountMinor: booking.totalAmountMinor,
          amountPaidMinor: booking.amountPaidMinor,
          balanceDueMinor: Math.max(0, booking.totalAmountMinor - booking.amountPaidMinor),
          depositRequiredMinor,
          status: booking.amountPaidMinor > 0 ? "PARTIALLY_PAID" : "UNPAID",
          dueDate: booking.eventDate,
        },
      });
    }

    // 4. Create Safepay Tracker Token via Official Safepay API
    let trackerResult;
    try {
      trackerResult = await SafepayGateway.createTracker(payableMinor, "PKR");
    } catch (err: any) {
      console.error("[PAYMENT-SERVICE] Safepay Tracker initialization failed:", err);
      return {
        success: false,
        error: `Could not initialize secure payment gateway: ${err.message || "Safepay service unavailable"}`,
      };
    }

    // 5. Generate internal unique payment reference for audit & deduplication
    const internalRef = `AREVENTS-${booking.reference}-${Date.now().toString(36).toUpperCase()}`;

    // 6. Record pending payment in database ledger
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        invoiceId: invoice.id,
        amountMinor: payableMinor,
        currency: "PKR",
        paymentType: paymentType === "ADVANCE" ? "DEPOSIT" : paymentType === "BALANCE" ? "PARTIAL" : "FULL",
        paymentMethod: "SAFEPAY",
        status: "PENDING",
        provider: "safepay",
        providerRef: internalRef,
        providerToken: normalizeSafepayRef(trackerResult.token),
        notes: `Safepay ${paymentType} checkout initiated by client. Tracker: ${trackerResult.token}`,
        metadata: JSON.stringify({
          bookingReference: booking.reference,
          paymentType,
          totalAmountMinor: totalMinor,
          payableMinor,
          displayPkr: toSafepayAmount(payableMinor),
          createdAt: new Date().toISOString(),
        }),
      },
    });

    // 7. Construct absolute redirect and cancel URLs
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

    const successRedirectUrl =
      params.redirectUrl || `${baseUrl}/booking/${booking.reference}`;
    const cancelRedirectUrl =
      params.cancelUrl || `${baseUrl}/booking/${booking.reference}`;

    // 8. Generate hosted checkout URL
    const checkoutUrl = SafepayGateway.generateCheckoutUrl({
      token: trackerResult.token,
      orderId: booking.reference,
      redirectUrl: successRedirectUrl,
      cancelUrl: cancelRedirectUrl,
    });

    logPaymentAudit("PAYMENT_SESSION_CREATED", {
      bookingReference: booking.reference,
      paymentId: payment.id,
      payableMinor,
      displayPkr: toSafepayAmount(payableMinor),
      trackerToken: trackerResult.token,
    });

    return {
      success: true,
      checkoutUrl,
      token: trackerResult.token,
      paymentId: payment.id,
      amountMinor: payableMinor,
      currency: "PKR",
    };
  }

  /**
   * Process Safepay Webhook Payload with HMAC signature verification and strict idempotency
   */
  static async processWebhook(rawBody: string, signature: string): Promise<WebhookProcessingResult> {
    logPaymentAudit("WEBHOOK_RECEIVED", {
      payloadLength: rawBody?.length || 0,
      hasSignature: !!signature,
    });

    // 1. Verify webhook signature if present
    const isValid = SafepayGateway.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.error("[PAYMENT-SERVICE] Webhook signature verification FAILED");
      return {
        received: true,
        processed: false,
        error: "Invalid webhook signature",
      };
    }

    // 2. Parse payload safely
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      console.error("[PAYMENT-SERVICE] Malformed JSON in webhook payload");
      return {
        received: true,
        processed: false,
        error: "Malformed JSON payload",
      };
    }

    const event = payload.event || payload.notification?.type || "payment.completed";
    const data = payload.data || payload.notification?.data || payload;

    const token = normalizeSafepayRef(data.token || data.beacon || data.tracker?.token);
    const trackerState = (data.state || data.tracker?.state || "").toUpperCase();
    const orderId = normalizeSafepayRef(data.order_id || data.orderId || data.tracker?.order_id);

    // Extract and normalize transaction identifier safely as String
    const rawTxId =
      data.transaction?.id ??
      data.transaction?.token ??
      data.transaction_id ??
      data.reference ??
      null;
    const transactionId = normalizeSafepayRef(rawTxId) || `sp_wh_${Date.now()}`;

    logPaymentAudit("WEBHOOK_PARSED", {
      event,
      token,
      trackerState,
      orderId,
      transactionId,
    });

    if (!token && !orderId) {
      return {
        received: true,
        processed: false,
        error: "Webhook missing tracker token and order_id",
      };
    }

    // 3. Find payment record by providerToken or order reference
    let payment: any = await prisma.payment.findFirst({
      where: token
        ? { providerToken: token }
        : orderId
        ? { providerRef: { contains: orderId } }
        : { id: "never_match" },
      include: {
        booking: { include: { invoices: true } },
        invoice: true,
      },
    });

    if (!payment && orderId) {
      console.warn(`[PAYMENT-SERVICE] Payment record not found for token ${token}. Attempting recovery via booking ${orderId}...`);
      const booking = await prisma.booking.findUnique({
        where: { reference: orderId },
        include: { invoices: true },
      });

      if (booking) {
        const receivedAmountPkr = Number(data.amount) || Number(data.tracker?.amount) || 0;
        const amountMinor = receivedAmountPkr > 0 ? Math.round(receivedAmountPkr * 100) : booking.depositRequiredMinor || 3000000;

        payment = await prisma.payment.create({
          data: {
            bookingId: booking.id,
            invoiceId: booking.invoices?.[0]?.id || null,
            amountMinor,
            currency: data.currency || "PKR",
            paymentType: "DEPOSIT",
            paymentMethod: "SAFEPAY",
            status: "PROCESSING",
            provider: "safepay",
            providerToken: token,
            providerRef: transactionId,
            notes: "Created via Safepay webhook automatic recovery",
            metadata: JSON.stringify(payload),
          },
          include: {
            booking: { include: { invoices: true } },
            invoice: true,
          },
        });
      }
    }

    if (!payment) {
      return {
        received: true,
        processed: false,
        error: `Payment record and booking not found for token ${token} / order ${orderId}`,
      };
    }

    // 4. Idempotency Check: If payment is already marked PAID, reconcile ledger and return success safely
    if (payment.status === "PAID" || payment.status === "VERIFIED") {
      logPaymentAudit("WEBHOOK_IDEMPOTENT_HIT", {
        paymentId: payment.id,
        status: payment.status,
      });

      // Still ensure booking and invoice are fully synchronized
      await this.syncLedgerState(payment.bookingId);

      return {
        received: true,
        processed: true,
        paymentId: payment.id,
        bookingReference: payment.booking.reference,
        status: payment.status,
        message: "Payment already confirmed previously (idempotent)",
      };
    }

    // 5. Strict Amount Reconciliation Check
    if (data.amount !== undefined && data.amount !== null) {
      const expectedPkr = toSafepayAmount(payment.amountMinor);
      const receivedPkr = Number(data.amount);
      if (Math.abs(receivedPkr - expectedPkr) > 0.01) {
        console.error(`[PAYMENT-SERVICE] ⚠ AMOUNT MISMATCH for payment ${payment.id}! Expected PKR ${expectedPkr}, got PKR ${receivedPkr}`);
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
            failureReason: `PAYMENT_AMOUNT_MISMATCH: Expected PKR ${expectedPkr}, received PKR ${receivedPkr}`,
            metadata: JSON.stringify(payload),
          },
        });

        return {
          received: true,
          processed: false,
          paymentId: payment.id,
          status: "FAILED",
          error: `PAYMENT_AMOUNT_MISMATCH: Expected PKR ${expectedPkr}, got PKR ${receivedPkr}`,
        };
      }
    }

    // 6. Evaluate completion state
    const isSuccess =
      trackerState === "TRACKER_ENDED" ||
      trackerState === "PAID" ||
      trackerState === "COMPLETED" ||
      event === "payment.completed" ||
      (event === "payment.created" && trackerState === "TRACKER_ENDED");

    if (isSuccess) {
      await this.applySuccessfulPayment(payment, transactionId, payload);

      return {
        received: true,
        processed: true,
        paymentId: payment.id,
        bookingReference: payment.booking.reference,
        status: "PAID",
        message: "Payment successfully verified and synchronized",
      };
    } else if (trackerState === "FAILED" || event === "payment.failed") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          failureReason: data.state_reason || "Payment declined or failed at gateway",
          metadata: JSON.stringify(payload),
        },
      });

      return {
        received: true,
        processed: true,
        paymentId: payment.id,
        status: "FAILED",
        message: "Payment marked as failed",
      };
    }

    return {
      received: true,
      processed: true,
      paymentId: payment.id,
      status: payment.status,
      message: `Received non-terminal event ${event} / ${trackerState}`,
    };
  }

  /**
   * Get live database payment status for a booking
   */
  static async getBookingPaymentStatus(reference: string) {
    const booking = await prisma.booking.findUnique({
      where: { reference },
      include: {
        customer: { include: { user: true } },
        invoices: {
          include: { items: true, payments: true, auditLogs: { orderBy: { createdAt: "desc" } } },
          orderBy: { createdAt: "desc" },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!booking) {
      return null;
    }

    const totalMinor = booking.totalAmountMinor;
    const paidMinor = booking.amountPaidMinor;
    const balanceMinor = Math.max(0, totalMinor - paidMinor);
    const depositRequiredMinor =
      booking.depositRequiredMinor > 0
        ? booking.depositRequiredMinor
        : Math.round(totalMinor * 0.3);

    const isFullyPaid = paidMinor >= totalMinor && totalMinor > 0;
    const isAdvancePaid = paidMinor >= depositRequiredMinor && depositRequiredMinor > 0;

    return {
      reference: booking.reference,
      status: booking.status,
      totalAmountMinor: totalMinor,
      totalAmountPkr: toSafepayAmount(totalMinor),
      amountPaidMinor: paidMinor,
      amountPaidPkr: toSafepayAmount(paidMinor),
      balanceDueMinor: balanceMinor,
      balanceDuePkr: toSafepayAmount(balanceMinor),
      depositRequiredMinor,
      depositRequiredPkr: toSafepayAmount(depositRequiredMinor),
      isFullyPaid,
      isAdvancePaid,
      invoice: booking.invoices[0] || null,
      payments: booking.payments,
    };
  }

  /**
   * Authoritatively verify a payment token via direct Safepay API query and atomically reconcile DB
   */
  static async verifyAndSyncTracker(
    token: string
  ): Promise<{ success: boolean; status: string; payment?: any; error?: string }> {
    const normalizedToken = normalizeSafepayRef(token);
    if (!normalizedToken) {
      return { success: false, status: "INVALID_TOKEN", error: "A valid tracker token is required" };
    }

    logPaymentAudit("GATEWAY_VERIFICATION_REQUESTED", { token: normalizedToken });

    // 1. Query Safepay server-side authoritative state
    const tracker = await SafepayGateway.getTrackerStatus(normalizedToken);
    if (!tracker) {
      return {
        success: false,
        status: "GATEWAY_UNREACHABLE",
        error: "Could not retrieve tracker status from Safepay. Gateway may be temporarily unreachable.",
      };
    }

    logPaymentAudit("GATEWAY_TRACKER_RETRIEVED", {
      token: normalizedToken,
      state: tracker.state,
      amount: tracker.amount,
      currency: tracker.currency,
    });

    // 2. Find local payment record
    const payment = await prisma.payment.findFirst({
      where: { providerToken: normalizedToken },
      include: {
        booking: { include: { invoices: true } },
        invoice: true,
      },
    });

    if (!payment) {
      return {
        success: false,
        status: tracker.state,
        error: `No local payment record found matching token ${normalizedToken}`,
      };
    }

    // 3. If already marked PAID, reconcile ledger and return cleanly
    if (payment.status === "PAID" || payment.status === "VERIFIED") {
      await this.syncLedgerState(payment.bookingId);
      return { success: true, status: payment.status, payment };
    }

    // 4. Strict Amount Reconciliation
    if (tracker.amount !== undefined && tracker.amount !== null) {
      const expectedPkr = toSafepayAmount(payment.amountMinor);
      const receivedPkr = Number(tracker.amount);
      if (Math.abs(receivedPkr - expectedPkr) > 0.01) {
        console.error(`[PAYMENT-SERVICE] ⚠ Tracker amount mismatch for ${normalizedToken}! Expected PKR ${expectedPkr}, got PKR ${receivedPkr}`);
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
            failureReason: `PAYMENT_AMOUNT_MISMATCH: Expected PKR ${expectedPkr}, received PKR ${receivedPkr}`,
            metadata: JSON.stringify(tracker),
          },
        });
        return {
          success: false,
          status: "FAILED",
          error: `Payment amount mismatch: Expected PKR ${expectedPkr}, received PKR ${receivedPkr}`,
        };
      }
    }

    // 5. Evaluate completion states
    const isCompleted =
      tracker.state === "TRACKER_ENDED" ||
      tracker.state === "PAID" ||
      tracker.state === "COMPLETED";

    if (isCompleted) {
      // Safely extract and normalize the transaction reference into a String
      const rawTxId =
        tracker.transaction?.id ??
        tracker.transaction?.token ??
        tracker.transaction?.reference ??
        tracker.token ??
        payment.providerRef;
      const transactionId = normalizeSafepayRef(rawTxId) || `sp_${Date.now()}`;

      await this.applySuccessfulPayment(payment, transactionId, tracker);

      const refreshedPayment = await prisma.payment.findUnique({
        where: { id: payment.id },
      });

      return { success: true, status: "PAID", payment: refreshedPayment };
    } else if (tracker.state === "FAILED") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          failureReason: tracker.state_reason || "Payment declined by issuing bank",
          metadata: JSON.stringify(tracker),
        },
      });
      return { success: false, status: "FAILED", payment };
    } else if (tracker.state === "CANCELLED") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "CANCELLED",
          failureReason: "Checkout was cancelled by user",
          metadata: JSON.stringify(tracker),
        },
      });
      return { success: false, status: "CANCELLED", payment };
    }

    // In-flight or pending checkout
    return { success: true, status: tracker.state, payment };
  }

  /**
   * Internal atomic application of a verified payment to the ledger, booking, and invoices.
   * Uses Prisma transaction with strict type normalization on every field.
   */
  private static async applySuccessfulPayment(
    payment: any,
    transactionId: string,
    rawGatewayData: any
  ) {
    const paymentAmountMinor = payment.amountMinor;
    const paidAt = new Date();
    const cleanTxId = normalizeSafepayRef(transactionId) || `sp_${Date.now()}`;

    logPaymentAudit("APPLYING_PAYMENT_TRANSACTION", {
      paymentId: payment.id,
      bookingId: payment.bookingId,
      amountMinor: paymentAmountMinor,
      transactionId: cleanTxId,
    });

    await prisma.$transaction(async (tx) => {
      // 1. Mark Payment record as PAID with normalized string providerRef
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paidAt,
          providerRef: cleanTxId,
          notes: `Confirmed via Safepay Gateway. Transaction ID: ${cleanTxId}`,
          metadata:
            typeof rawGatewayData === "string"
              ? rawGatewayData
              : JSON.stringify(rawGatewayData),
        },
      });

      // 2. Authoritative Ledger Calculation:
      // Sum all PAID / VERIFIED payments for this booking to eliminate any drift or duplicate counting
      const allPaidPayments = await tx.payment.findMany({
        where: {
          bookingId: payment.bookingId,
          status: { in: ["PAID", "VERIFIED"] },
        },
      });

      const totalPaidMinor = allPaidPayments.reduce((sum, p) => sum + p.amountMinor, 0);

      // 3. Fetch fresh booking
      const freshBooking = await tx.booking.findUnique({
        where: { id: payment.bookingId },
      });

      if (!freshBooking) return;

      const totalBookingMinor = freshBooking.totalAmountMinor;
      const newBookingBalanceDue = Math.max(0, totalBookingMinor - totalPaidMinor);
      const depositRequiredMinor =
        freshBooking.depositRequiredMinor > 0
          ? freshBooking.depositRequiredMinor
          : Math.round(totalBookingMinor * 0.3);

      const isFullyPaid = totalPaidMinor >= totalBookingMinor && totalBookingMinor > 0;
      const isAdvanceMet = totalPaidMinor >= depositRequiredMinor && depositRequiredMinor > 0;

      // Status State Machine: Advance or full payment transitions INQUIRY / PENDING -> CONFIRMED
      const newBookingStatus =
        freshBooking.status === "INQUIRY" ||
        freshBooking.status === "DRAFT" ||
        freshBooking.status === "PENDING" ||
        freshBooking.status === "AWAITING_PAYMENT"
          ? isAdvanceMet || isFullyPaid
            ? "CONFIRMED"
            : freshBooking.status
          : freshBooking.status;

      await tx.booking.update({
        where: { id: freshBooking.id },
        data: {
          amountPaidMinor: totalPaidMinor,
          balanceDueMinor: newBookingBalanceDue,
          status: newBookingStatus,
        },
      });

      // 4. Synchronize all Invoices for this Booking
      const invoices = await tx.invoice.findMany({
        where: { bookingId: freshBooking.id },
      });

      for (const inv of invoices) {
        const invTotal = inv.totalAmountMinor;
        const newInvoiceBalance = Math.max(0, invTotal - totalPaidMinor);
        const newInvoiceStatus =
          newInvoiceBalance === 0 ? "PAID" : totalPaidMinor > 0 ? "PARTIALLY_PAID" : "UNPAID";

        await tx.invoice.update({
          where: { id: inv.id },
          data: {
            amountPaidMinor: totalPaidMinor,
            balanceDueMinor: newInvoiceBalance,
            status: newInvoiceStatus,
            paidAt: newInvoiceBalance === 0 ? inv.paidAt || paidAt : inv.paidAt,
          },
        });

        // Add Invoice Audit Log
        await tx.invoiceAuditLog.create({
          data: {
            invoiceId: inv.id,
            action: "PAYMENT_RECORDED",
            performedBy: "Safepay Gateway",
            details: JSON.stringify({
              paymentId: payment.id,
              amountMinor: paymentAmountMinor,
              totalPaidMinor,
              provider: "safepay",
              transactionId: cleanTxId,
              newInvoiceStatus,
              balanceDueMinor: newInvoiceBalance,
              timestamp: paidAt.toISOString(),
            }),
          },
        });
      }
    });

    logPaymentAudit("PAYMENT_TRANSACTION_COMMITTED", {
      paymentId: payment.id,
      bookingId: payment.bookingId,
      transactionId: cleanTxId,
    });

    try {
      const refreshed = await prisma.booking.findUnique({
        where: { id: payment.bookingId },
        include: { invoices: true },
      });

      if (refreshed) {
        eventBus.broadcast(
          "PAYMENT_COMPLETED",
          `booking:${refreshed.reference}`,
          {
            paymentId: payment.id,
            bookingId: refreshed.id,
            bookingReference: refreshed.reference,
            amountPaidMinor: refreshed.amountPaidMinor,
            balanceDueMinor: refreshed.balanceDueMinor,
            status: refreshed.status,
            transactionId: cleanTxId,
          },
          true
        );

        eventBus.broadcast(
          "BOOKING_STATUS_UPDATED",
          `booking:${refreshed.reference}`,
          {
            bookingId: refreshed.id,
            reference: refreshed.reference,
            status: refreshed.status,
            amountPaidMinor: refreshed.amountPaidMinor,
            balanceDueMinor: refreshed.balanceDueMinor,
          },
          true
        );

        if (refreshed.invoices?.[0]) {
          eventBus.broadcast(
            "INVOICE_UPDATED",
            `booking:${refreshed.reference}`,
            {
              invoiceId: refreshed.invoices[0].id,
              invoiceNumber: refreshed.invoices[0].invoiceNumber,
              status: refreshed.invoices[0].status,
              amountPaidMinor: refreshed.invoices[0].amountPaidMinor,
              balanceDueMinor: refreshed.invoices[0].balanceDueMinor,
            },
            true
          );
        }
      }
    } catch (broadcastErr) {
      console.error("[PAYMENT-SERVICE] Error broadcasting realtime event:", broadcastErr);
    }
  }

  /**
   * Helper to recalculate and sync booking & invoice balances from the payment ledger.
   * Ensures 100% database consistency even if individual calls arrive out of order.
   */
  static async syncLedgerState(bookingId: string) {
    try {
      const allPaidPayments = await prisma.payment.findMany({
        where: {
          bookingId,
          status: { in: ["PAID", "VERIFIED"] },
        },
      });

      const totalPaidMinor = allPaidPayments.reduce((sum, p) => sum + p.amountMinor, 0);

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { invoices: true },
      });

      if (!booking) return;

      const totalBookingMinor = booking.totalAmountMinor;
      const newBookingBalanceDue = Math.max(0, totalBookingMinor - totalPaidMinor);
      const depositRequiredMinor =
        booking.depositRequiredMinor > 0
          ? booking.depositRequiredMinor
          : Math.round(totalBookingMinor * 0.3);

      const isFullyPaid = totalPaidMinor >= totalBookingMinor && totalBookingMinor > 0;
      const isAdvanceMet = totalPaidMinor >= depositRequiredMinor && depositRequiredMinor > 0;

      const newBookingStatus =
        booking.status === "INQUIRY" ||
        booking.status === "DRAFT" ||
        booking.status === "PENDING" ||
        booking.status === "AWAITING_PAYMENT"
          ? isAdvanceMet || isFullyPaid
            ? "CONFIRMED"
            : booking.status
          : booking.status;

      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          amountPaidMinor: totalPaidMinor,
          balanceDueMinor: newBookingBalanceDue,
          status: newBookingStatus,
        },
      });

      for (const inv of booking.invoices) {
        const invTotal = inv.totalAmountMinor;
        const newInvoiceBalance = Math.max(0, invTotal - totalPaidMinor);
        const newInvoiceStatus =
          newInvoiceBalance === 0 ? "PAID" : totalPaidMinor > 0 ? "PARTIALLY_PAID" : "UNPAID";

        await prisma.invoice.update({
          where: { id: inv.id },
          data: {
            amountPaidMinor: totalPaidMinor,
            balanceDueMinor: newInvoiceBalance,
            status: newInvoiceStatus,
            paidAt: newInvoiceBalance === 0 ? inv.paidAt || new Date() : inv.paidAt,
          },
        });
      }
    } catch (err) {
      console.error("[PAYMENT-SERVICE] Error syncing ledger state:", err);
    }
  }
}
