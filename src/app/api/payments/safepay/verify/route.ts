import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/payments/payment-service";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Rate limiting: max 20 verifications per 5 minutes per IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = await rateLimit(`payment_verify_${ip}`, 20, 5 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many verification requests. Please wait." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Tracker token is required" }, { status: 400 });
    }

    const result = await PaymentService.verifyAndSyncTracker(token);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API] verify error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error verifying payment" },
      { status: 500 }
    );
  }
}
