import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { bookings: true } } },
    });
    return NextResponse.json({ success: true, data: venues });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, city, address, capacity, venueType, feeMinor, description, isActive } = body;

    if (!name || !slug || !address) {
      return NextResponse.json({ success: false, error: "Name, slug, and address are required." }, { status: 400 });
    }

    const venue = await prisma.venue.create({
      data: {
        name,
        slug,
        city: city || "Islamabad",
        address,
        capacity: Number(capacity) || 100,
        venueType: venueType || "Indoor Hall",
        feeMinor: Number(feeMinor) || 0,
        description: description || null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, data: venue });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: "Venue ID required." }, { status: 400 });

    if (data.capacity !== undefined) data.capacity = Number(data.capacity);
    if (data.feeMinor !== undefined) data.feeMinor = Number(data.feeMinor);

    const updated = await prisma.venue.update({ where: { id }, data });
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

    const bookingsCount = await prisma.booking.count({ where: { venueId: id } });
    if (bookingsCount > 0) {
      const deactivated = await prisma.venue.update({ where: { id }, data: { isActive: false } });
      return NextResponse.json({ success: true, message: "Venue deactivated.", data: deactivated });
    }

    await prisma.venue.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Venue deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
