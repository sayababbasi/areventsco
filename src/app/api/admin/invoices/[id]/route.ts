import { NextRequest, NextResponse } from "next/server";
import { InvoiceService } from "@/server/services/invoice.service";
import { getAuthSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const invoice = await InvoiceService.getInvoiceById(id, {
      role: session.role,
      email: session.email,
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ invoice });
  } catch (error: any) {
    console.error("GET /api/admin/invoices/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await InvoiceService.updateInvoice(
      id,
      body,
      session.name || session.email || "Admin"
    );

    return NextResponse.json({ invoice: updated, success: true });
  } catch (error: any) {
    console.error("PATCH /api/admin/invoices/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update invoice" },
      { status: 500 }
    );
  }
}
