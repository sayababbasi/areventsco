import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { category: "asc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sku, name, category, image, totalQuantity, availableQuantity, condition, location, costMinor, status, notes } = body;

    if (!sku || !name) {
      return NextResponse.json({ success: false, error: "SKU and item name are required." }, { status: 400 });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        sku,
        name,
        category: category || "Props",
        image: image || null,
        totalQuantity: Number(totalQuantity) || 1,
        availableQuantity: Number(availableQuantity) !== undefined ? Number(availableQuantity) : Number(totalQuantity) || 1,
        condition: condition || "Excellent",
        location: location || "Main Warehouse, Islamabad",
        costMinor: Number(costMinor) || 0,
        status: status || "AVAILABLE",
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: "Item ID required." }, { status: 400 });

    if (data.totalQuantity !== undefined) data.totalQuantity = Number(data.totalQuantity);
    if (data.availableQuantity !== undefined) data.availableQuantity = Number(data.availableQuantity);
    if (data.costMinor !== undefined) data.costMinor = Number(data.costMinor);

    const updated = await prisma.inventoryItem.update({ where: { id }, data });
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

    await prisma.inventoryItem.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Inventory item deleted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
