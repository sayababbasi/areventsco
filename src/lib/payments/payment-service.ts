import { prisma } from "@/lib/db";
import { SafepayGateway } from "./safepay";
import { CreatePaymentSessionParams, PaymentSessionResult, WebhookProcessingResult } from "./types";

export class PaymentService {
  /**
   * Create a Safepay checkout session for a verified booking
   */
  static async createPaymentSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    const { bookingReference, paymentType = "ADVANCE" } = params;

    console.log(`[PAYMENT-SERVICE] Creating payment session for ${bookingReference} (Type: ${paymentType})`);

    // 1. Fetch booking with invoice from database (Server-side single source of truth)
    const booking = await prisma.booking.findUnique({
      where: { reference: bookingReference },
      include: {
        invoices: true,
        customer: { include: { user: true } },
      },
    });

    if (!booking) {
      return { success: false, error: `Booking with reference ${bookingReference} not found` };
    }

    if (booking.status === "CANCELLED") {
      return { success: false, error: "Cannot process payment for a cancelled booking" };
    }

    // 2. Server-side authoritative calculation of payable amount
    let payableMinor = 0;
    const totalMinor = booking.totalAmountMinor;
    const depositRequiredMinor =
      booking.depositRequiredMinor > 0
        ? booking.depositRequiredMinor
        : Math.round(totalMinor * 0.3); // Default 30% advance deposit if not specified

    const balanceDueMinor = Math.max(0, totalMinor - booking.amountPaidMinor);

    if (paymentType === "ADVANCE") {
      // If advance is already satisfied, charge remaining balance or notify
      if (booking.amountPaidMinor >= depositRequiredMinor && balanceDueMinor > 0) {
        payableMinor = balanceDueMinor;
      } else {
        payableMinor = depositRequiredMinor - booking.amountPaidMinor;
      }
    } else if (paymentType === "BALANCE") {
      payableMinor = balanceDueMinor;
    } else {
      // FULL
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

      const customerName = booking.customer?.user?.name || "Customer";
      const customerEmail = booking.customer?.user?.email || "customer@example.com";
      const customerPhone = booking.customer?.user?.phone || "+92 300 8555123";

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
          depositRequiredMinor: depositRequiredMinor,
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
        error: `Could not initialize secure gateway: ${err.message || "Safepay service unavailable"}`,
      };
    }

    // 5. Generate internal unique payment reference for audit & deduplication
    const internalRef = `AREVENTS-${booking.reference}-${Date.now().toString(36).toUpperCase()}`;

    // 6. Record pending payment in database
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
        providerToken: trackerResult.token,
        notes: `Safepay ${paymentType} checkout initiated by client. Tracker: ${trackerResult.token}`,
        metadata: JSON.stringify({
          bookingReference: booking.reference,
          paymentType,
          totalAmountMinor: totalMinor,
          payableMinor,
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
      params.redirectUrl || `${baseUrl}/booking/${booking.reference}?payment=success&token=${trackerResult.token}`;
    const cancelRedirectUrl =
      params.cancelUrl || `${baseUrl}/booking/${booking.reference}?payment=cancelled&token=${trackerResult.token}`;

    // 8. Generate hosted checkout URL
    const checkoutUrl = SafepayGateway.generateCheckoutUrl({
      token: trackerResult.token,
      orderId: booking.reference,
      redirectUrl: successRedirectUrl,
      cancelUrl: cancelRedirectUrl,
    });

    console.log(`[PAYMENT-SERVICE] Checkout session created for payment ${payment.id}. Token: ${trackerResult.token}`);

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
   * Process Safepay Webhook Payload with raw signature verification and idempotency
   */
  static async processWebhook(rawBody: string, signature: string): Promise<WebhookProcessingResult> {
    console.log("[PAYMENT-SERVICE] Processing incoming Safepay webhook...");

    // 1. Verify webhook signature
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

    const token = data.token || data.beacon || data.tracker?.token;
    const trackerState = (data.state || data.tracker?.state || "").toUpperCase();
    const orderId = data.order_id || data.orderId || data.tracker?.order_id;
    const transactionId = data.transaction?.id || data.transaction_id || `txn_${Date.now()}`;

    console.log(`[PAYMENT-SERVICE] Webhook Event: ${event} | Token: ${token} | State: ${trackerState} | Order: ${orderId}`);

    if (!token && !orderId) {
      return {
        received: true,
        processed: false,
        error: "Webhook missing tracker token and order_id",
      };
    }

    // 3. Find payment record by providerToken or order reference
    let payment = await prisma.payment.findFirst({
      where: token ? { providerToken: token } : { providerRef: { contains: orderId } },
      include: {
        booking: {
          include: { invoices: true },
        },
        invoice: true,
      },
    });

    if (!payment) {
      console.warn(`[PAYMENT-SERVICE] Payment record not found for token ${token}. Attempting to locate booking ${orderId}...`);
      if (orderId) {
        const booking = await prisma.booking.findUnique({
          where: { reference: orderId },
          include: { invoices: true },
        });

        if (booking) {
          // Create retroactive payment record if necessary
          const amountMinor = data.amount || booking.depositRequiredMinor || 3000000;
          payment = await prisma.payment.create({
            data: {
              bookingId: booking.id,
              invoiceId: booking.invoices?.[0]?.id || null,
              amountMinor: Number(amountMinor),
              currency: data.currency || "PKR",
              paymentType: "DEPOSIT",
              paymentMethod: "SAFEPAY",
              status: "PROCESSING",
              provider: "safepay",
              providerToken: token,
              providerRef: transactionId,
              notes: "Created via Safepay webhook recovery",
            },
            include: {
              booking: { include: { invoices: true } },
              invoice: true,
            },
          });
        }
      }
    }

    if (!payment) {
      return {
        received: true,
        processed: false,
        error: `Payment and booking not found for token ${token} / order ${orderId}`,
      };
    }

    // 4. Idempotency Check: If payment is already marked PAID, return success without duplicate processing
    if (payment.status === "PAID" || payment.status === "VERIFIED") {
      console.log(`[PAYMENT-SERVICE] Payment ${payment.id} is already confirmed as ${payment.status}. Idempotent return.`);
      return {
        received: true,
        processed: true,
        paymentId: payment.id,
        bookingReference: payment.booking.reference,
        status: payment.status,
        message: "Payment already confirmed previously",
      };
    }

    // 5. Evaluate completion state
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
        message: "Payment successfully verified and records updated",
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
   * Verify a payment via direct Safepay API query and reconcile database
   */
  static async verifyAndSyncTracker(token: string): Promise<{ success: boolean; status: string; payment?: any; error?: string }> {
    console.log(`[PAYMENT-SERVICE] Actively verifying tracker ${token} with Safepay API...`);

    // 1. Query Safepay server-side authoritative state
    const tracker = await SafepayGateway.getTrackerStatus(token);
    if (!tracker) {
      return { success: false, status: "UNKNOWN", error: "Could not retrieve tracker status from Safepay" };
    }

    console.log(`[PAYMENT-SERVICE] Live Safepay Tracker state: ${tracker.state}`);

    // 2. Find local payment record
    const payment = await prisma.payment.findFirst({
      where: { providerToken: token },
      include: {
        booking: { include: { invoices: true } },
        invoice: true,
      },
    });

    if (!payment) {
      return { success: false, status: tracker.state, error: `No local payment found with token ${token}` };
    }

    // 3. If already marked PAID, return
    if (payment.status === "PAID" || payment.status === "VERIFIED") {
      return { success: true, status: payment.status, payment };
    }

    // 4. If Safepay confirms tracker ended / paid, reconcile
    const isCompleted = tracker.state === "TRACKER_ENDED" || tracker.state === "PAID";
    if (isCompleted) {
      const transactionId = tracker.transaction?.id || `sp_${Date.now()}`;
      await this.applySuccessfulPayment(payment, transactionId, tracker);
      return { success: true, status: "PAID", payment };
    } else if (tracker.state === "FAILED") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          failureReason: tracker.state_reason || "Payment failed",
        },
      });
      return { success: false, status: "FAILED", payment };
    }

    return { success: true, status: tracker.state, payment };
  }

  /**
   * Internal transactional application of verified payment
   */
  private static async applySuccessfulPayment(payment: any, transactionId: string, rawGatewayData: any) {
    const paymentAmountMinor = payment.amountMinor;
    const paidAt = new Date();

    console.log(`[PAYMENT-SERVICE] Applying successful payment ${payment.id} (PKR ${(paymentAmountMinor / 100).toLocaleString()}) to booking ${payment.booking.reference}`);

    await prisma.$transaction(async (tx) => {
      // 1. Mark Payment record as PAID
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paidAt,
          providerRef: transactionId,
          notes: `Confirmed via Safepay Gateway. Transaction ID: ${transactionId}`,
          metadata: JSON.stringify(rawGatewayData),
        },
      });

      // 2. Fetch fresh booking and invoice
      const freshBooking = await tx.booking.findUnique({
        where: { id: payment.bookingId },
        include: { invoices: true },
      });

      if (!freshBooking) return;

      const newBookingAmountPaid = freshBooking.amountPaidMinor + paymentAmountMinor;
      const newBookingBalanceDue = Math.max(0, freshBooking.totalAmountMinor - newBookingAmountPaid);

      // 3. Update Booking Payment & Status
      const depositRequired =
        freshBooking.depositRequiredMinor > 0
          ? freshBooking.depositRequiredMinor
          : Math.round(freshBooking.totalAmountMinor * 0.3);

      const isAdvanceMet = newBookingAmountPaid >= depositRequired;
      const newBookingStatus =
        freshBooking.status === "INQUIRY" || freshBooking.status === "DRAFT" || freshBooking.status === "PENDING"
          ? isAdvanceMet
            ? "CONFIRMED"
            : freshBooking.status
          : freshBooking.status;

      await tx.booking.update({
        where: { id: freshBooking.id },
        data: {
          amountPaidMinor: newBookingAmountPaid,
          balanceDueMinor: newBookingBalanceDue,
          status: newBookingStatus,
        },
      });

      // 4. Update Invoice & Record Audit Log
      const primaryInvoice = freshBooking.invoices?.[0];
      if (primaryInvoice) {
        const newInvoicePaid = primaryInvoice.amountPaidMinor + paymentAmountMinor;
        const newInvoiceBalance = Math.max(0, primaryInvoice.totalAmountMinor - newInvoicePaid);
        const newInvoiceStatus = newInvoiceBalance === 0 ? "PAID" : "PARTIALLY_PAID";

        await tx.invoice.update({
          where: { id: primaryInvoice.id },
          data: {
            amountPaidMinor: newInvoicePaid,
            balanceDueMinor: newInvoiceBalance,
            status: newInvoiceStatus,
            paidAt: newInvoiceBalance === 0 ? paidAt : primaryInvoice.paidAt,
          },
        });

        // Add Invoice Audit Log
        await tx.invoiceAuditLog.create({
          data: {
            invoiceId: primaryInvoice.id,
            action: "PAYMENT_RECORDED",
            performedBy: "Safepay Gateway",
            details: JSON.stringify({
              paymentId: payment.id,
              amountMinor: paymentAmountMinor,
              provider: "safepay",
              transactionId,
              newStatus: newInvoiceStatus,
              balanceDueMinor: newInvoiceBalance,
              timestamp: paidAt.toISOString(),
            }),
          },
        });
      }
    });

    console.log(`[PAYMENT-SERVICE] Payment successfully reconciled with Booking ${payment.booking.reference} and Invoice!`);
  }
}
