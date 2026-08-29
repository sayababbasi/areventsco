import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET all packages
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";

    const where: any = {};
    if (activeOnly) where.isActive = true;

    const packages = await prisma.package.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        _count: { select: { bookings: true } },
      },
    });

    return NextResponse.json({ success: true, data: packages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create package
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      subtitle,
      description,
      basePriceMinor,
      guestCapacityMin,
      guestCapacityMax,
      estimatedDurationHours,
      featuredImage,
      features,
      isFeatured,
      isActive,
      sortOrder,
    } = body;

    if (!title || !slug || !description || !basePriceMinor) {
      return NextResponse.json(
        { success: false, error: "Title, slug, description, and base price are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.package.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A package with this slug already exists." },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.create({
      data: {
        title,
        slug,
        subtitle: subtitle || null,
        description,
        basePriceMinor: Number(basePriceMinor),
        guestCapacityMin: Number(guestCapacityMin) || 10,
        guestCapacityMax: Number(guestCapacityMax) || 100,
        estimatedDurationHours: Number(estimatedDurationHours) || 4,
        featuredImage: featuredImage || "/images/themes/theme_royal_midnight_prince.jpg",
        features: typeof features === "string" ? features : JSON.stringify(features || []),
        isFeatured: !!isFeatured,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "PACKAGE_CREATED",
        entityType: "Package",
        entityId: pkg.id,
        details: JSON.stringify({ title: pkg.title, basePriceMinor: pkg.basePriceMinor }),
      },
    });

    return NextResponse.json({ success: true, data: pkg });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update package
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Package ID is required." }, { status: 400 });
    }

    if (data.features && typeof data.features !== "string") {
      data.features = JSON.stringify(data.features);
    }
    if (data.basePriceMinor !== undefined) {
      data.basePriceMinor = Number(data.basePriceMinor);
    }

    const updated = await prisma.package.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        action: "PACKAGE_UPDATED",
        entityType: "Package",
        entityId: updated.id,
        details: JSON.stringify({ title: updated.title, price: updated.basePriceMinor }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE package
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Package ID is required." }, { status: 400 });
    }

    const bookingsCount = await prisma.booking.count({ where: { packageId: id } });

    if (bookingsCount > 0) {
      const deactivated = await prisma.package.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: "Package deactivated (preserved for historical bookings).",
        data: deactivated,
      });
    }

    await prisma.package.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "PACKAGE_DELETED",
        entityType: "Package",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true, message: "Package deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
