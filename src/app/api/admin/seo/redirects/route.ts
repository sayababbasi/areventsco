import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const redirects = await prisma.redirect.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: redirects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fromPath, toPath, statusCode = 301, notes, isActive = true } = body;

    if (!fromPath || !toPath) {
      return NextResponse.json(
        { success: false, error: "Source path and Target destination are required." },
        { status: 400 }
      );
    }

    const cleanFrom = fromPath.startsWith("/") ? fromPath : `/${fromPath}`;
    const cleanTo = toPath.startsWith("/") || toPath.startsWith("http") ? toPath : `/${toPath}`;

    const existing = await prisma.redirect.findUnique({
      where: { fromPath: cleanFrom },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `A redirect rule for "${cleanFrom}" already exists.` },
        { status: 400 }
      );
    }

    const redirect = await prisma.redirect.create({
      data: {
        fromPath: cleanFrom,
        toPath: cleanTo,
        statusCode: Number(statusCode) || 301,
        notes,
        isActive: !!isActive,
      },
    });

    return NextResponse.json({ success: true, data: redirect });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, fromPath, toPath, statusCode, notes, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Redirect ID is required." }, { status: 400 });
    }

    const updateData: any = {};
    if (fromPath !== undefined) updateData.fromPath = fromPath.startsWith("/") ? fromPath : `/${fromPath}`;
    if (toPath !== undefined) updateData.toPath = toPath.startsWith("/") || toPath.startsWith("http") ? toPath : `/${toPath}`;
    if (statusCode !== undefined) updateData.statusCode = Number(statusCode);
    if (notes !== undefined) updateData.notes = notes;
    if (isActive !== undefined) updateData.isActive = !!isActive;

    const updated = await prisma.redirect.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Redirect ID is required." }, { status: 400 });
    }

    await prisma.redirect.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Redirect deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
