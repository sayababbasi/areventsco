import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, category, description, priceType, basePriceMinor, image, isActive, sortOrder } = body;

    if (!title || !slug || !description) {
      return NextResponse.json({ success: false, error: "Title, slug, and description are required." }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        category: category || "Decoration",
        description,
        priceType: priceType || "FIXED",
        basePriceMinor: Number(basePriceMinor) || 0,
        image: image || null,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, data: service });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: "Service ID required." }, { status: 400 });

    if (data.basePriceMinor !== undefined) data.basePriceMinor = Number(data.basePriceMinor);

    const updated = await prisma.service.update({ where: { id }, data });
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

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Service deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
