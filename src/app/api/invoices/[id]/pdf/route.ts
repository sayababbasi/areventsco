import { NextRequest, NextResponse } from "next/server";
import { InvoiceService } from "@/server/services/invoice.service";
import { generateInvoicePdf } from "@/lib/pdf/invoice-pdf";
import { getAuthSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    // Fetch invoice to check ownership
    const invoice = await InvoiceService.getInvoiceById(params.id);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Security Authorization:
    // 1. Admin or Staff
    // 2. Authenticated Customer matching customerEmail
    // 3. Direct booking access with matching booking reference or ID
    const isAdmin = session?.role === "ADMIN" || session?.role === "STAFF";
    const isCustomerOwner =
      session?.email &&
      (session.email.toLowerCase() === invoice.customerEmail.toLowerCase() ||
        session.email.toLowerCase() === invoice.booking.customer?.user?.email?.toLowerCase());

    const isBookingTokenValid = token && token === invoice.booking.reference;

    if (!isAdmin && !isCustomerOwner && !isBookingTokenValid) {
      // If no valid session or token
      return NextResponse.json(
        { error: "Unauthorized. Please log in or provide a valid access token." },
        { status: 401 }
      );
    }

    // Build PDF
    const pdfData = await InvoiceService.getInvoicePdfPayload(params.id);
    const doc = generateInvoicePdf(pdfData);
    const pdfArrayBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("GET /api/invoices/[id]/pdf error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate PDF invoice" },
      { status: 500 }
    );
  }
}
