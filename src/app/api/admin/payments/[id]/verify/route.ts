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
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access. Admin privilege required." }, { status: 401 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        booking: {
          include: { invoices: true },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    if (!payment.providerToken) {
      return NextResponse.json(
        { error: "This payment does not have a Safepay tracker token to verify with the gateway." },
        { status: 400 }
      );
    }

    const result = await PaymentService.verifyAndSyncTracker(payment.providerToken);

    if (!result.success && result.status === "GATEWAY_UNREACHABLE") {
      return NextResponse.json(
        {
          success: false,
          status: "GATEWAY_UNREACHABLE",
          message: "Safepay Gateway is temporarily unreachable. Payment status remains unchanged.",
          error: result.error,
        },
        { status: 503 }
      );
    }

    // Refetch the updated payment with fresh booking and invoice relations
    const updatedPayment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        booking: {
          include: { invoices: true },
        },
        invoice: true,
      },
    });

    return NextResponse.json({
      success: result.success,
      status: result.status,
      message:
        result.status === "PAID"
          ? "Payment verified as PAID. Booking and Invoice synchronized."
          : `Gateway returned status: ${result.status}`,
      payment: updatedPayment,
      error: result.error,
    });
  } catch (error: any) {
    console.error("[API /api/admin/payments/[id]/verify] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Verification failed due to a server error. Status remains intact.",
        details: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
