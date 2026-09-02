import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { reference: params.reference },
      include: {
        customer: {
          include: { user: true },
        },
        package: true,
        theme: true,
        venue: true,
        items: true,
        invoices: {
          include: {
            items: true,
            payments: {
              where: { status: { in: ["VERIFIED", "PAID"] } },
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        payments: {
          where: { status: { in: ["VERIFIED", "PAID"] } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const session = await getAuthSession();
    const isAdmin = session?.role === "ADMIN" || session?.role === "STAFF";
    const isCustomer =
      session?.email &&
      (booking.customer?.user?.email?.toLowerCase() === session.email.toLowerCase() ||
        booking.invoices[0]?.customerEmail.toLowerCase() === session.email.toLowerCase());

    // Public / direct booking lookup by exact reference is supported for customer confirmation
    const invoice = booking.invoices[0] || null;

    // Fetch business settings for bank transfer details
    const settings = await prisma.setting.findMany();
    const settingsMap = settings.reduce((acc: any, s: any) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    return NextResponse.json({
      booking: {
        reference: booking.reference,
        status: booking.status,
        eventDate: booking.eventDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        eventType: booking.eventType,
        city: booking.city,
        venueLocation: booking.venueLocation,
        guestCount: booking.guestCount,
        specialRequests: booking.specialRequests,
        package: booking.package,
        theme: booking.theme,
        venue: booking.venue,
        items: booking.items,
        depositRequiredMinor: booking.depositRequiredMinor,
        amountPaidMinor: booking.amountPaidMinor,
        balanceDueMinor: booking.balanceDueMinor,
        totalAmountMinor: booking.totalAmountMinor,
      },
      invoice: invoice
        ? {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            status: invoice.status,
            dueDate: invoice.dueDate,
            subtotalMinor: invoice.subtotalMinor,
            discountMinor: invoice.discountMinor,
            taxMinor: invoice.taxMinor,
            additionalChargesMinor: invoice.additionalChargesMinor,
            totalAmountMinor: invoice.totalAmountMinor,
            amountPaidMinor: invoice.amountPaidMinor,
            balanceDueMinor: invoice.balanceDueMinor,
            customerNotes: invoice.customerNotes,
            items: invoice.items,
            payments: invoice.payments,
          }
        : null,
      bankDetails: {
        bankName: settingsMap["bank_name"] || "Meezan Bank Ltd.",
        accountTitle: settingsMap["bank_account_title"] || "AR Events Co.",
        accountNumber: settingsMap["bank_account_number"] || "02010108932014",
        iban: settingsMap["bank_iban"] || "PK89MEZN0002010108932014",
        phone: settingsMap["support_phone"] || "+92 316 0513841",
      },
    });
  } catch (error: any) {
    console.error("GET /api/bookings/[reference]/invoice error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch invoice details" },
      { status: 500 }
    );
  }
}
