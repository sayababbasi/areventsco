import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/payments/payment-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingReference, paymentType = "ADVANCE" } = body;

    if (!bookingReference) {
      return NextResponse.json(
        { error: "Booking reference is required" },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    const result = await PaymentService.createPaymentSession({
      bookingReference,
      paymentType,
      redirectUrl: `${baseUrl}/booking/${bookingReference}?payment=success`,
      cancelUrl: `${baseUrl}/booking/${bookingReference}?payment=cancelled`,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create payment session" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API] create-session error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error creating payment session" },
      { status: 500 }
    );
  }
}
