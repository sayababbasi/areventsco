import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { SafepayGateway } from "@/lib/payments/safepay";

export const dynamic = "force-dynamic";

export async function GET(
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
      include: {
        booking: {
          include: {
            customer: { include: { user: true } },
            package: true,
            theme: true,
            venue: true,
            items: true,
          },
        },
        invoice: {
          include: {
            items: true,
            payments: true,
            auditLogs: { orderBy: { createdAt: "desc" } },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    // Optionally fetch live Safepay tracker payload if token exists
    let liveGatewayTracker: any = null;
    if (payment.providerToken) {
      try {
        liveGatewayTracker = await SafepayGateway.getTrackerStatus(payment.providerToken);
      } catch (e) {
        console.warn("[API] Could not fetch live tracker for payment detail:", e);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        payment,
        liveGatewayTracker,
      },
    });
  } catch (error: any) {
    console.error("[API /api/admin/payments/[id]] Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
