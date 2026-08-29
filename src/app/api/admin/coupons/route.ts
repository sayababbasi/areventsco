import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, description, discountType, discountValue, minOrderMinor, maxUses } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ success: false, error: "Coupon code and discount value are required." }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        description: description || null,
        discountType: discountType || "PERCENTAGE",
        discountValue: Number(discountValue),
        minOrderMinor: Number(minOrderMinor) || 0,
        maxUses: Number(maxUses) || 100,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: coupon });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: "Coupon ID required." }, { status: 400 });

    const updated = await prisma.coupon.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required." }, { status: 400 });

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Coupon deleted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
