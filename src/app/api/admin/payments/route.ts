import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          include: {
            customer: { include: { user: true } },
            theme: true,
            package: true,
          },
        },
      },
    });

    const totalCollectedMinor = payments
      .filter((p) => p.status === "PAID")
      .reduce((acc, p) => acc + p.amountMinor, 0);

    return NextResponse.json({ success: true, data: { payments, totalCollectedMinor } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST record new payment for a booking
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, amountMinor, paymentType, paymentMethod, providerRef, notes } = body;

    if (!bookingId || !amountMinor) {
      return NextResponse.json({ success: false, error: "Booking ID and payment amount are required." }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { invoices: true },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }

    const amount = Number(amountMinor);

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amountMinor: amount,
        paymentType: paymentType || "DEPOSIT",
        paymentMethod: paymentMethod || "BANK_TRANSFER",
        status: "PAID",
        providerRef: providerRef || `MBL-TRX-${Date.now().toString().slice(-8)}`,
        notes: notes || null,
        paidAt: new Date(),
      },
    });

    // Update booking paid amount & balance
    const newAmountPaid = booking.amountPaidMinor + amount;
    const newBalanceDue = Math.max(0, booking.totalAmountMinor - newAmountPaid);
    const newStatus = booking.status === "INQUIRY" || booking.status === "PENDING" ? "CONFIRMED" : booking.status;

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        amountPaidMinor: newAmountPaid,
        balanceDueMinor: newBalanceDue,
        status: newStatus,
      },
    });

    // Update corresponding invoice if exists
    if (booking.invoices && booking.invoices.length > 0) {
      const invoice = booking.invoices[0];
      const invPaid = invoice.amountPaidMinor + amount;
      const invBalance = Math.max(0, invoice.totalAmountMinor - invPaid);
      const invStatus = invBalance === 0 ? "PAID" : "PARTIALLY_PAID";

      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          amountPaidMinor: invPaid,
          balanceDueMinor: invBalance,
          status: invStatus,
          paidAt: invBalance === 0 ? new Date() : undefined,
        },
      });
    }

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: "PAYMENT_RECORDED",
        entityType: "Payment",
        entityId: payment.id,
        details: JSON.stringify({ bookingReference: booking.reference, amountMinor: amount, paymentMethod }),
      },
    });

    return NextResponse.json({ success: true, data: payment });
  } catch (error: any) {
    console.error("Record Payment Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
