import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET all themes
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const activeOnly = searchParams.get("active") === "true";

    const where: any = {};
    if (category && category !== "All") where.category = category;
    if (activeOnly) where.isActive = true;

    const themes = await prisma.theme.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        _count: { select: { bookings: true } },
      },
    });

    return NextResponse.json({ success: true, data: themes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create new theme
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      category,
      description,
      colorPalette,
      heroImage,
      galleryImages,
      includedDecor,
      isPopular,
      isActive,
      sortOrder,
    } = body;

    if (!title || !slug || !description) {
      return NextResponse.json(
        { success: false, error: "Title, slug, and description are required." },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.theme.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A theme with this slug already exists." },
        { status: 400 }
      );
    }

    const theme = await prisma.theme.create({
      data: {
        title,
        slug,
        category: category || "Kids Birthday",
        description,
        colorPalette: typeof colorPalette === "string" ? colorPalette : JSON.stringify(colorPalette || []),
        heroImage: heroImage || "/images/themes/theme_lavender_dream.jpg",
        galleryImages: typeof galleryImages === "string" ? galleryImages : JSON.stringify(galleryImages || []),
        includedDecor: typeof includedDecor === "string" ? includedDecor : JSON.stringify(includedDecor || []),
        isPopular: !!isPopular,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: "THEME_CREATED",
        entityType: "Theme",
        entityId: theme.id,
        details: JSON.stringify({ title: theme.title, slug: theme.slug }),
      },
    });

    return NextResponse.json({ success: true, data: theme });
  } catch (error: any) {
    console.error("Create Theme Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update theme
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Theme ID is required." }, { status: 400 });
    }

    if (data.colorPalette && typeof data.colorPalette !== "string") {
      data.colorPalette = JSON.stringify(data.colorPalette);
    }
    if (data.includedDecor && typeof data.includedDecor !== "string") {
      data.includedDecor = JSON.stringify(data.includedDecor);
    }
    if (data.galleryImages && typeof data.galleryImages !== "string") {
      data.galleryImages = JSON.stringify(data.galleryImages);
    }

    const updated = await prisma.theme.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        action: "THEME_UPDATED",
        entityType: "Theme",
        entityId: updated.id,
        details: JSON.stringify({ title: updated.title }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE or toggle theme active status
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Theme ID is required." }, { status: 400 });
    }

    // Check if theme is referenced by bookings
    const bookingsCount = await prisma.booking.count({ where: { themeId: id } });

    if (bookingsCount > 0) {
      // Soft-deactivate to protect historical booking records
      const deactivated = await prisma.theme.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: "Theme deactivated (has active/past booking associations).",
        data: deactivated,
      });
    }

    // Otherwise hard delete
    await prisma.theme.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "THEME_DELETED",
        entityType: "Theme",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true, message: "Theme deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
