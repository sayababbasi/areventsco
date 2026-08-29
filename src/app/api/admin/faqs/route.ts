import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, answer, category, isFeatured, isActive, sortOrder } = body;

    if (!question || !answer) {
      return NextResponse.json({ success: false, error: "Question and answer are required." }, { status: 400 });
    }

    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        category: category || "General",
        isFeatured: !!isFeatured,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, data: faq });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: "FAQ ID required." }, { status: 400 });

    const updated = await prisma.faq.update({ where: { id }, data });
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

    await prisma.faq.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "FAQ deleted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
