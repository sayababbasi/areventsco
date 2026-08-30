import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/payments/payment-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
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
