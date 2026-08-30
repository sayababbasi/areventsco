import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { InvoicePdfData } from "@/lib/pdf/invoice-pdf";

export interface InvoiceFilterParams {
  search?: string;
  status?: string;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "newest" | "oldest" | "highest_amount" | "lowest_amount" | "event_date" | "balance_due";
  page?: number;
  limit?: number;
}

export interface RecordPaymentInput {
  amountMinor: number;
  paymentMethod: string; // BANK_TRANSFER, CASH, JAZZCASH, EASYPAISA, CARD, ONLINE
  paymentType?: string; // DEPOSIT, FULL, PARTIAL, ADJUSTMENT
  providerRef?: string;
  receiptImage?: string;
  notes?: string;
  paidAt?: Date | string;
  markVerified?: boolean;
}

export class InvoiceService {
  /**
   * List invoices with search, filters, pagination, and real-time dashboard statistics
   */
  static async listInvoices(params: InvoiceFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 15));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Search query
    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { invoiceNumber: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { customerEmail: { contains: q, mode: "insensitive" } },
        { customerPhone: { contains: q, mode: "insensitive" } },
        { booking: { reference: { contains: q, mode: "insensitive" } } },
      ];
    }

    // Status filter
    if (params.status && params.status !== "ALL") {
      where.status = params.status;
    }

    // City filter
    if (params.city && params.city !== "ALL") {
      where.booking = {
        ...where.booking,
        city: { contains: params.city, mode: "insensitive" },
      };
    }

    // Date range filter (issueDate / createdAt)
    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = new Date(params.dateFrom);
      if (params.dateTo) where.createdAt.lte = new Date(params.dateTo);
    }

    // Sorting
    let orderBy: any = { createdAt: "desc" };
    switch (params.sortBy) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "highest_amount":
        orderBy = { totalAmountMinor: "desc" };
        break;
      case "lowest_amount":
        orderBy = { totalAmountMinor: "asc" };
        break;
      case "balance_due":
        orderBy = { balanceDueMinor: "desc" };
        break;
      case "event_date":
        orderBy = { booking: { eventDate: "asc" } };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const [invoices, totalCount, allInvoicesStats] = await Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          booking: {
            select: {
              id: true,
              reference: true,
              eventDate: true,
              eventType: true,
              city: true,
              venueLocation: true,
              status: true,
              guestCount: true,
              package: { select: { title: true } },
              theme: { select: { title: true } },
            },
          },
          payments: {
            select: {
              id: true,
              amountMinor: true,
              status: true,
              paymentMethod: true,
              paidAt: true,
              createdAt: true,
            },
          },
          items: true,
        },
      }),
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        select: {
          status: true,
          totalAmountMinor: true,
          amountPaidMinor: true,
          balanceDueMinor: true,
          dueDate: true,
        },
      }),
    ]);

    // Aggregate real-time statistics
    const now = new Date();
    const stats = {
      totalInvoices: allInvoicesStats.length,
      draftCount: 0,
      issuedCount: 0,
      unpaidCount: 0,
      partiallyPaidCount: 0,
      paidCount: 0,
      overdueCount: 0,
      cancelledCount: 0,
      voidCount: 0,
      totalInvoicedMinor: 0,
      totalPaidMinor: 0,
      totalOutstandingMinor: 0,
    };

    allInvoicesStats.forEach((inv) => {
      stats.totalInvoicedMinor += inv.totalAmountMinor;
      stats.totalPaidMinor += inv.amountPaidMinor;
      stats.totalOutstandingMinor += inv.balanceDueMinor;

      const isOverdue = inv.balanceDueMinor > 0 && new Date(inv.dueDate) < now && inv.status !== "CANCELLED" && inv.status !== "VOID";
      if (isOverdue) stats.overdueCount++;

      switch (inv.status) {
        case "DRAFT":
          stats.draftCount++;
          break;
        case "ISSUED":
          stats.issuedCount++;
          break;
        case "UNPAID":
          stats.unpaidCount++;
          break;
        case "PARTIALLY_PAID":
          stats.partiallyPaidCount++;
          break;
        case "PAID":
          stats.paidCount++;
          break;
        case "CANCELLED":
          stats.cancelledCount++;
          break;
        case "VOID":
          stats.voidCount++;
          break;
      }
    });

    return {
      invoices,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
      stats,
    };
  }

  /**
   * Get single invoice with full details and authorization check
   */
  static async getInvoiceById(id: string, authUser?: { role?: string; email?: string }) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            package: true,
            theme: true,
            venue: true,
            customer: {
              include: { user: true },
            },
          },
        },
        items: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
        auditLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!invoice) return null;

    // Security Authorization Check
    if (authUser && authUser.role !== "ADMIN" && authUser.role !== "STAFF") {
      const isOwner =
        invoice.customerEmail.toLowerCase() === authUser.email?.toLowerCase() ||
        invoice.booking.customer?.user?.email?.toLowerCase() === authUser.email?.toLowerCase();

      if (!isOwner) {
        throw new Error("Unauthorized access to this invoice");
      }
    }

    return invoice;
  }

  /**
   * Get invoice by unique invoice number or booking reference
   */
  static async getInvoiceByNumber(invoiceNumber: string) {
    return prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: {
        booking: {
          include: {
            package: true,
            theme: true,
            venue: true,
            customer: true,
          },
        },
        items: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
        auditLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Record a payment against an invoice with automatic balance & status recalculations
   */
  static async recordPayment(
    invoiceId: string,
    input: RecordPaymentInput,
    performedBy: string = "Admin"
  ) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { booking: true },
    });

    if (!invoice) throw new Error("Invoice not found");
    if (invoice.status === "VOID" || invoice.status === "CANCELLED") {
      throw new Error(`Cannot record payment on a ${invoice.status} invoice`);
    }

    const paidAtDate = input.paidAt ? new Date(input.paidAt) : new Date();

    return prisma.$transaction(async (tx: any) => {
      // 1. Create Payment record
      const payment = await tx.payment.create({
        data: {
          bookingId: invoice.bookingId,
          invoiceId: invoice.id,
          amountMinor: input.amountMinor,
          paymentType: input.paymentType || "PARTIAL",
          paymentMethod: input.paymentMethod || "BANK_TRANSFER",
          status: input.markVerified !== false ? "VERIFIED" : "PENDING",
          providerRef: input.providerRef || null,
          receiptImage: input.receiptImage || null,
          notes: input.notes || null,
          paidAt: paidAtDate,
        },
      });

      // 2. Aggregate all verified payments for this invoice
      const allPayments = await tx.payment.findMany({
        where: {
          invoiceId: invoice.id,
          status: { in: ["VERIFIED", "PAID"] },
        },
      });

      const totalPaidMinor = allPayments.reduce(
        (sum: number, p: any) => sum + p.amountMinor,
        0
      );
      const balanceDueMinor = Math.max(0, invoice.totalAmountMinor - totalPaidMinor);

      let newStatus = invoice.status;
      if (balanceDueMinor === 0) {
        newStatus = "PAID";
      } else if (totalPaidMinor > 0) {
        newStatus = "PARTIALLY_PAID";
      } else {
        newStatus = "UNPAID";
      }

      // 3. Update Invoice
      const updatedInvoice = await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          amountPaidMinor: totalPaidMinor,
          balanceDueMinor,
          status: newStatus,
          paidAt: balanceDueMinor === 0 ? paidAtDate : invoice.paidAt,
        },
        include: {
          items: true,
          payments: true,
          booking: true,
        },
      });

      // 4. Update linked Booking
      await tx.booking.update({
        where: { id: invoice.bookingId },
        data: {
          amountPaidMinor: totalPaidMinor,
          balanceDueMinor,
          status:
            totalPaidMinor >= (invoice.depositRequiredMinor || 0) &&
            invoice.booking.status === "INQUIRY"
              ? "CONFIRMED"
              : invoice.booking.status,
        },
      });

      // 5. Create Invoice Audit Log
      await tx.invoiceAuditLog.create({
        data: {
          invoiceId: invoice.id,
          action: "PAYMENT_RECORDED",
          performedBy,
          details: `Recorded payment of PKR ${(input.amountMinor / 100).toLocaleString()} via ${input.paymentMethod.replace(/_/g, " ")}. New balance: PKR ${(balanceDueMinor / 100).toLocaleString()}`,
        },
      });

      return updatedInvoice;
    });
  }

  /**
   * Update invoice details, notes, due date, discounts, and custom line items
   */
  static async updateInvoice(
    invoiceId: string,
    updates: {
      status?: string;
      dueDate?: Date | string;
      customerNotes?: string;
      internalNotes?: string;
      additionalChargesMinor?: number;
      discountMinor?: number;
      items?: Array<{
        description: string;
        unitPriceMinor: number;
        quantity: number;
        totalPriceMinor: number;
      }>;
    },
    performedBy: string = "Admin"
  ) {
    const existing = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { items: true },
    });

    if (!existing) throw new Error("Invoice not found");

    return prisma.$transaction(async (tx: any) => {
      let subtotalMinor = existing.subtotalMinor;

      // Update line items if provided
      if (updates.items && updates.items.length > 0) {
        await tx.invoiceItem.deleteMany({ where: { invoiceId } });
        await tx.invoiceItem.createMany({
          data: updates.items.map((item) => ({
            invoiceId,
            description: item.description,
            unitPriceMinor: item.unitPriceMinor,
            quantity: item.quantity || 1,
            totalPriceMinor: item.totalPriceMinor,
            currency: "PKR",
          })),
        });

        subtotalMinor = updates.items.reduce((s, it) => s + it.totalPriceMinor, 0);
      }

      const discountMinor =
        updates.discountMinor !== undefined ? updates.discountMinor : existing.discountMinor;
      const additionalChargesMinor =
        updates.additionalChargesMinor !== undefined
          ? updates.additionalChargesMinor
          : existing.additionalChargesMinor;
      const taxMinor = existing.taxMinor;

      const totalAmountMinor = Math.max(
        0,
        subtotalMinor + additionalChargesMinor + taxMinor - discountMinor
      );
      const balanceDueMinor = Math.max(0, totalAmountMinor - existing.amountPaidMinor);

      let finalStatus = updates.status || existing.status;
      if (balanceDueMinor === 0 && existing.amountPaidMinor > 0) {
        finalStatus = "PAID";
      } else if (existing.amountPaidMinor > 0 && finalStatus !== "VOID" && finalStatus !== "CANCELLED") {
        finalStatus = "PARTIALLY_PAID";
      }

      const updated = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          subtotalMinor,
          discountMinor,
          additionalChargesMinor,
          totalAmountMinor,
          balanceDueMinor,
          status: finalStatus,
          dueDate: updates.dueDate ? new Date(updates.dueDate) : existing.dueDate,
          customerNotes:
            updates.customerNotes !== undefined ? updates.customerNotes : existing.customerNotes,
          internalNotes:
            updates.internalNotes !== undefined ? updates.internalNotes : existing.internalNotes,
        },
        include: {
          items: true,
          payments: true,
          booking: true,
          auditLogs: true,
        },
      });

      // Audit Log
      await tx.invoiceAuditLog.create({
        data: {
          invoiceId,
          action: "UPDATED",
          performedBy,
          details: `Invoice updated by ${performedBy}. Total: PKR ${(totalAmountMinor / 100).toLocaleString()}, Status: ${finalStatus}`,
        },
      });

      return updated;
    });
  }

  /**
   * Prepare complete structured PDF payload from live database records
   */
  static async getInvoicePdfPayload(invoiceId: string): Promise<InvoicePdfData> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        booking: {
          include: {
            package: true,
            theme: true,
            venue: true,
            customer: true,
          },
        },
        items: true,
        payments: {
          where: { status: { in: ["VERIFIED", "PAID"] } },
          orderBy: { paidAt: "desc" },
        },
      },
    });

    if (!invoice) throw new Error("Invoice not found");

    // Fetch Global Business Settings
    const settings = await prisma.setting.findMany();
    const settingsMap = settings.reduce((acc: any, s: any) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    return {
      invoiceNumber: invoice.invoiceNumber,
      bookingReference: invoice.booking.reference,
      status: invoice.status,
      issueDate: invoice.issuedAt || invoice.createdAt,
      dueDate: invoice.dueDate,
      paidAt: invoice.paidAt,
      customer: {
        name: invoice.customerName,
        email: invoice.customerEmail,
        phone: invoice.customerPhone,
        address: invoice.customerAddress,
        city: invoice.booking.city,
      },
      event: {
        eventType: invoice.booking.eventType,
        eventDate: invoice.booking.eventDate,
        startTime: invoice.booking.startTime,
        endTime: invoice.booking.endTime,
        guestCount: invoice.booking.guestCount,
        city: invoice.booking.city,
        venueLocation: invoice.booking.venueLocation || "Client Venue / Residence",
        packageTitle: invoice.booking.package?.title,
        themeTitle: invoice.booking.theme?.title,
      },
      items: invoice.items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unitPriceMinor: it.unitPriceMinor,
        totalPriceMinor: it.totalPriceMinor,
      })),
      financials: {
        subtotalMinor: invoice.subtotalMinor,
        discountMinor: invoice.discountMinor,
        additionalChargesMinor: invoice.additionalChargesMinor,
        taxMinor: invoice.taxMinor,
        totalAmountMinor: invoice.totalAmountMinor,
        amountPaidMinor: invoice.amountPaidMinor,
        balanceDueMinor: invoice.balanceDueMinor,
        depositRequiredMinor: invoice.depositRequiredMinor,
        currency: invoice.currency,
      },
      payments: invoice.payments.map((p) => ({
        paymentMethod: p.paymentMethod,
        amountMinor: p.amountMinor,
        status: p.status,
        providerRef: p.providerRef,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
      })),
      notes: {
        customerNotes: invoice.customerNotes,
      },
      businessSettings: {
        name: settingsMap["business_name"] || "AR Events Co.",
        tagline: settingsMap["business_tagline"] || "Islamabad & Rawalpindi's Premier Birthday & Event Planners",
        phone: settingsMap["support_phone"] || "+92 300 8555123",
        email: settingsMap["support_email"] || "info@areventsco.com",
        website: settingsMap["site_url"] || "https://areventsco.com",
        address: settingsMap["business_address"] || "Islamabad & Rawalpindi, Pakistan",
        bankName: settingsMap["bank_name"] || "Meezan Bank Ltd.",
        accountTitle: settingsMap["bank_account_title"] || "AR Events Co.",
        accountNumber: settingsMap["bank_account_number"] || "02010108932014",
        iban: settingsMap["bank_iban"] || "PK89MEZN0002010108932014",
      },
    };
  }
}
