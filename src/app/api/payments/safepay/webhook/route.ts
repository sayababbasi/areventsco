import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/payments/payment-service";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("x-sfpy-signature") ||
      req.headers.get("X-SFPY-SIGNATURE") ||
      req.headers.get("x-signature") ||
      "";

    console.log(`[WEBHOOK-API] Received Safepay webhook. Payload length: ${rawBody.length} bytes`);

    if (!rawBody) {
      return NextResponse.json({ error: "Empty webhook payload" }, { status: 400 });
    }

    const result = await PaymentService.processWebhook(rawBody, signature);

    if (!result.processed && result.error === "Invalid webhook signature") {
      console.warn("[WEBHOOK-API] Rejected due to invalid signature");
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({
      status: "received",
      processed: result.processed,
      message: result.message || "Webhook processed",
    });
  } catch (error: any) {
    console.error("[WEBHOOK-API] Unexpected error processing webhook:", error);
    return NextResponse.json(
      { error: error?.message || "Internal webhook processing error" },
      { status: 500 }
    );
  }
}
