import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const locations = await prisma.locationPage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, data: locations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      city = "Islamabad",
      headline,
      subheadline,
      introContent,
      coverageAreas,
      featuredImage,
      seoTitle,
      seoDescription,
      focusKeyword,
      secondaryKeywords,
      canonicalUrl,
      ogImage,
      noIndex,
      noFollow,
      sortOrder = 0,
      isActive = true,
    } = body;

    if (!name || !slug || !headline) {
      return NextResponse.json(
        { success: false, error: "Location Name, URL Slug, and Headline are required." },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const existing = await prisma.locationPage.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `A location page with slug "/locations/${cleanSlug}" already exists.` },
        { status: 400 }
      );
    }

    const location = await prisma.locationPage.create({
      data: {
        name,
        slug: cleanSlug,
        city,
        headline,
        subheadline,
        introContent: introContent || "",
        coverageAreas: typeof coverageAreas === "string" ? coverageAreas : JSON.stringify(coverageAreas || []),
        featuredImage,
        seoTitle,
        seoDescription,
        focusKeyword,
        secondaryKeywords: typeof secondaryKeywords === "string" ? secondaryKeywords : JSON.stringify(secondaryKeywords || []),
        canonicalUrl,
        ogImage,
        noIndex: !!noIndex,
        noFollow: !!noFollow,
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, data: location });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Location ID is required." }, { status: 400 });
    }

    if (data.slug) {
      data.slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    }

    if (data.coverageAreas && typeof data.coverageAreas !== "string") {
      data.coverageAreas = JSON.stringify(data.coverageAreas);
    }
    if (data.secondaryKeywords && typeof data.secondaryKeywords !== "string") {
      data.secondaryKeywords = JSON.stringify(data.secondaryKeywords);
    }

    const updated = await prisma.locationPage.update({
      where: { id },
      data,
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
      return NextResponse.json({ success: false, error: "Location ID is required." }, { status: 400 });
    }

    await prisma.locationPage.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Location deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
