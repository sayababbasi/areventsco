import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const status = searchParams.get("status") || "ALL";
    const provider = searchParams.get("provider") || "ALL";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: any = {};

    if (status !== "ALL") {
      where.status = status;
    }

    if (provider !== "ALL") {
      where.provider = provider.toLowerCase();
    }

    if (query) {
      where.OR = [
        { providerRef: { contains: query, mode: "insensitive" } },
        { providerToken: { contains: query, mode: "insensitive" } },
        { notes: { contains: query, mode: "insensitive" } },
        {
          booking: {
            OR: [
              { reference: { contains: query, mode: "insensitive" } },
              { customerName: { contains: query, mode: "insensitive" } },
              { customerEmail: { contains: query, mode: "insensitive" } },
              { customerPhone: { contains: query, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    const [payments, totalCount, allPayments] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          booking: {
            include: {
              customer: { include: { user: true } },
              theme: true,
              package: true,
              invoices: true,
            },
          },
          invoice: true,
        },
      }),
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        select: {
          amountMinor: true,
          status: true,
          provider: true,
          createdAt: true,
          paidAt: true,
        },
      }),
    ]);

    // Aggregate statistics
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalCollectedMinor = 0;
    let successfulCount = 0;
    let pendingCount = 0;
    let failedCount = 0;
    let safepayCollectedMinor = 0;
    let todayRevenueMinor = 0;
    let thisMonthRevenueMinor = 0;

    for (const p of allPayments) {
      if (p.status === "PAID" || p.status === "VERIFIED") {
        totalCollectedMinor += p.amountMinor;
        successfulCount++;

        if (p.provider === "safepay") {
          safepayCollectedMinor += p.amountMinor;
        }

        const dateToCheck = p.paidAt || p.createdAt;
        if (dateToCheck >= startOfToday) {
          todayRevenueMinor += p.amountMinor;
        }
        if (dateToCheck >= startOfMonth) {
          thisMonthRevenueMinor += p.amountMinor;
        }
      } else if (p.status === "PENDING" || p.status === "PROCESSING") {
        pendingCount++;
      } else if (p.status === "FAILED" || p.status === "CANCELLED") {
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        payments,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
        stats: {
          totalCollectedMinor,
          successfulCount,
          pendingCount,
          failedCount,
          safepayCollectedMinor,
          todayRevenueMinor,
          thisMonthRevenueMinor,
        },
      },
    });
  } catch (error: any) {
    console.error("[API /api/admin/payments] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
