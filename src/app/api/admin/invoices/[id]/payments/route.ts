import { NextRequest, NextResponse } from "next/server";
import { InvoiceService } from "@/server/services/invoice.service";
import { getAuthSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.amountMinor || body.amountMinor <= 0) {
      return NextResponse.json(
        { error: "Payment amount in Paisa is required and must be greater than 0" },
        { status: 400 }
      );
    }

    const updatedInvoice = await InvoiceService.recordPayment(
      params.id,
      {
        amountMinor: Number(body.amountMinor),
        paymentMethod: body.paymentMethod || "BANK_TRANSFER",
        paymentType: body.paymentType || "PARTIAL",
        providerRef: body.providerRef,
        receiptImage: body.receiptImage,
        notes: body.notes,
        paidAt: body.paidAt,
        markVerified: body.markVerified !== false,
      },
      session.name || session.email || "Admin"
    );

    return NextResponse.json({ invoice: updatedInvoice, success: true });
  } catch (error: any) {
    console.error("POST /api/admin/invoices/[id]/payments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record payment" },
      { status: 500 }
    );
  }
}
