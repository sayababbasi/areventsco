import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const addons = await prisma.addon.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, data: addons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, category, description, priceMinor, image, isActive, sortOrder } = body;

    if (!title || !slug || !priceMinor) {
      return NextResponse.json({ success: false, error: "Title, slug, and price are required." }, { status: 400 });
    }

    const addon = await prisma.addon.create({
      data: {
        title,
        slug,
        category: category || "Decor",
        description: description || null,
        priceMinor: Number(priceMinor),
        image: image || null,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, data: addon });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: "Addon ID required." }, { status: 400 });

    if (data.priceMinor !== undefined) data.priceMinor = Number(data.priceMinor);

    const updated = await prisma.addon.update({ where: { id }, data });
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

    await prisma.addon.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Addon deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
