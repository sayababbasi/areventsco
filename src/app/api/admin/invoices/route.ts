import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateInvoiceNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const status = searchParams.get("status");
    const id = searchParams.get("id");

    if (id) {
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          items: true,
          booking: {
            include: {
              customer: { include: { user: true } },
              package: true,
              theme: true,
              venue: true,
              payments: true,
            },
          },
        },
      });

      if (!invoice) return NextResponse.json({ success: false, error: "Invoice not found." }, { status: 404 });
      return NextResponse.json({ success: true, data: invoice });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        AND: [
          status && status !== "ALL" ? { status } : {},
          search
            ? {
                OR: [
                  { invoiceNumber: { contains: search } },
                  { customerName: { contains: search } },
                  { customerEmail: { contains: search } },
                  { customerPhone: { contains: search } },
                  { booking: { reference: { contains: search } } },
                ],
              }
            : {},
        ],
      },
      include: {
        items: true,
        booking: {
          include: {
            customer: { include: { user: true } },
            package: true,
            theme: true,
            venue: true,
            payments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalInvoicedMinor = invoices.reduce((sum, inv) => sum + (inv.totalAmountMinor || 0), 0);
    const totalCollectedMinor = invoices.reduce((sum, inv) => sum + (inv.amountPaidMinor || 0), 0);
    const totalOutstandingMinor = Math.max(0, totalInvoicedMinor - totalCollectedMinor);
    const overdueCount = invoices.filter(
      (inv) => (inv.status === "UNPAID" || inv.status === "PARTIALLY_PAID") && new Date(inv.dueDate) < new Date()
    ).length;

    return NextResponse.json({
      success: true,
      data: invoices,
      summary: {
        totalInvoices: invoices.length,
        totalInvoicedMinor,
        totalCollectedMinor,
        totalOutstandingMinor,
        overdueCount,
      },
    });
  } catch (error: any) {
    console.error("Invoices API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      bookingId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      dueDate,
      items,
      discountMinor = 0,
      taxMinor = 0,
    } = body;

    if (!bookingId || !customerName || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Booking ID, Customer Name, and at least one Line Item are required." },
        { status: 400 }
      );
    }

    const count = await prisma.invoice.count();
    const invoiceNumber = generateInvoiceNumber(count + 1);

    const subtotalMinor = items.reduce((sum: number, it: any) => sum + (Number(it.unitPriceMinor) * Number(it.quantity || 1)), 0);
    const totalAmountMinor = Math.max(0, subtotalMinor - Number(discountMinor) + Number(taxMinor));

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        bookingId,
        customerName: customerName.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : "customer@areventsco.com",
        customerPhone: customerPhone ? customerPhone.trim() : null,
        customerAddress: customerAddress ? customerAddress.trim() : null,
        subtotalMinor,
        discountMinor: Number(discountMinor),
        taxMinor: Number(taxMinor),
        totalAmountMinor,
        amountPaidMinor: 0,
        balanceDueMinor: totalAmountMinor,
        status: "UNPAID",
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        items: {
          create: items.map((it: any) => ({
            description: it.description,
            unitPriceMinor: Number(it.unitPriceMinor),
            quantity: Number(it.quantity || 1),
            totalPriceMinor: Number(it.unitPriceMinor) * Number(it.quantity || 1),
            currency: "PKR",
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error: any) {
    console.error("Create Invoice Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, dueDate, recordPaymentAmountMinor, paymentMethod, providerRef, notes } = body;

    if (!id) return NextResponse.json({ success: false, error: "Invoice ID required." }, { status: 400 });

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!invoice) return NextResponse.json({ success: false, error: "Invoice not found." }, { status: 404 });

    // Handle Payment Recording
    if (recordPaymentAmountMinor && Number(recordPaymentAmountMinor) > 0) {
      const paymentAmount = Number(recordPaymentAmountMinor);
      const newPaidAmount = (invoice.amountPaidMinor || 0) + paymentAmount;
      const newBalanceDue = Math.max(0, invoice.totalAmountMinor - newPaidAmount);
      const newStatus = newBalanceDue === 0 ? "PAID" : newPaidAmount > 0 ? "PARTIALLY_PAID" : invoice.status;

      const [updatedInvoice] = await prisma.$transaction([
        prisma.invoice.update({
          where: { id },
          data: {
            amountPaidMinor: newPaidAmount,
            balanceDueMinor: newBalanceDue,
            status: newStatus,
            paidAt: newBalanceDue === 0 ? new Date() : invoice.paidAt,
          },
        }),
        prisma.payment.create({
          data: {
            bookingId: invoice.bookingId,
            amountMinor: paymentAmount,
            paymentType: newBalanceDue === 0 ? "FULL" : "PARTIAL",
            paymentMethod: paymentMethod || "BANK_TRANSFER",
            status: "PAID",
            providerRef: providerRef || null,
            notes: notes || `Recorded against Invoice ${invoice.invoiceNumber}`,
            paidAt: new Date(),
          },
        }),
        prisma.booking.update({
          where: { id: invoice.bookingId },
          data: {
            amountPaidMinor: { increment: paymentAmount },
            balanceDueMinor: { decrement: paymentAmount },
            status: newPaidAmount >= invoice.booking.depositRequiredMinor ? "CONFIRMED" : invoice.booking.status,
          },
        }),
      ]);

      return NextResponse.json({ success: true, data: updatedInvoice });
    }

    // Normal Status / Due Date update
    const updateData: any = {};
    if (status) updateData.status = status;
    if (dueDate) updateData.dueDate = new Date(dueDate);

    const updated = await prisma.invoice.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Update Invoice Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, error: "Invoice ID required." }, { status: 400 });

    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) return NextResponse.json({ success: false, error: "Invoice not found." }, { status: 404 });

    if (invoice.amountPaidMinor > 0) {
      await prisma.invoice.update({
        where: { id },
        data: { status: "CANCELLED" },
      });
      return NextResponse.json({
        success: true,
        message: "Invoice cancelled (financial history preserved).",
      });
    }

    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Draft invoice deleted successfully." });
  } catch (error: any) {
    console.error("Delete Invoice Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
