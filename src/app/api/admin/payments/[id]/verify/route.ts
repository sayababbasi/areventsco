import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { PaymentService } from "@/lib/payments/payment-service";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    if (!payment.providerToken) {
      return NextResponse.json(
        { error: "This payment does not have a Safepay tracker token to verify" },
        { status: 400 }
      );
    }

    const result = await PaymentService.verifyAndSyncTracker(payment.providerToken);

    return NextResponse.json({
      success: result.success,
      status: result.status,
      error: result.error,
    });
  } catch (error: any) {
    console.error("[API verify error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify gateway status" },
      { status: 500 }
    );
  }
}
