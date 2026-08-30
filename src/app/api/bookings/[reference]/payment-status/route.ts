import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/payments/payment-service";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const { reference } = params;

    if (!reference) {
      return NextResponse.json({ error: "Booking reference is required" }, { status: 400 });
    }

    const status = await PaymentService.getBookingPaymentStatus(reference);

    if (!status) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(status);
  } catch (error: any) {
    console.error("[PAYMENT-STATUS-API] Error fetching status:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve payment status" },
      { status: 500 }
    );
  }
}
