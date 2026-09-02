import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/payments/payment-service";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: max 10 payment session creations per 10 minutes per IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = await rateLimit(`payment_session_${ip}`, 10, 10 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many payment requests. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

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
