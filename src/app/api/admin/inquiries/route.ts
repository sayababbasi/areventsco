import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET all CRM inquiries
export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create inquiry from admin
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, city, eventType, preferredTheme, budgetMinor, eventDate, message, status, notes } = body;

    if (!name || !phone || !message) {
      return NextResponse.json({ success: false, error: "Name, phone, and message are required." }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email: email || "pending@inquiry.com",
        phone,
        city: city || "Islamabad",
        eventType: eventType || "Birthday",
        preferredTheme: preferredTheme || null,
        budgetMinor: budgetMinor ? Number(budgetMinor) : null,
        eventDate: eventDate ? new Date(eventDate) : null,
        message,
        status: status || "NEW",
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update inquiry status / notes
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: "Inquiry ID required." }, { status: 400 });

    const updated = await prisma.inquiry.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE inquiry
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required." }, { status: 400 });

    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Inquiry deleted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
