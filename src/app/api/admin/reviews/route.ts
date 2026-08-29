import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authorName, authorLocation, rating, eventTitle, comment, isFeatured, isActive } = body;

    if (!authorName || !comment) {
      return NextResponse.json({ success: false, error: "Author name and comment are required." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        authorName,
        authorLocation: authorLocation || "Islamabad",
        rating: Number(rating) || 5,
        eventTitle: eventTitle || "1st Birthday Party",
        comment,
        isVerified: true,
        isFeatured: !!isFeatured,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: "Review ID required." }, { status: 400 });

    const updated = await prisma.review.update({ where: { id }, data });
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

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Review deleted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
