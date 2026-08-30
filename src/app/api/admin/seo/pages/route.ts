import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateSeoScore } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "ALL";
    const search = searchParams.get("search") || "";

    const [pages, packages, themes, services, venues, locations] = await Promise.all([
      prisma.page.findMany(),
      prisma.package.findMany(),
      prisma.theme.findMany(),
      prisma.service.findMany(),
      prisma.venue.findMany(),
      prisma.locationPage.findMany(),
    ]);

    let list = [
      ...pages.map((p) => ({
        id: p.id,
        entityType: "Page",
        title: p.title,
        slug: p.slug,
        url: `/${p.slug === "home" ? "" : p.slug}`,
        seoTitle: p.metaTitle || "",
        seoDescription: p.metaDescription || "",
        focusKeyword: p.focusKeyword || "",
        secondaryKeywords: p.secondaryKeywords || "",
        canonicalUrl: p.canonicalUrl || "",
        ogTitle: p.ogTitle || "",
        ogDescription: p.ogDescription || "",
        ogImage: p.ogImage || "",
        noIndex: !!p.noIndex,
        noFollow: !!p.noFollow,
        updatedAt: p.updatedAt,
      })),
      ...packages.map((pkg) => ({
        id: pkg.id,
        entityType: "Package",
        title: pkg.title,
        slug: pkg.slug,
        url: `/packages`,
        seoTitle: pkg.seoTitle || "",
        seoDescription: pkg.seoDescription || pkg.description || "",
        focusKeyword: pkg.focusKeyword || "",
        secondaryKeywords: pkg.secondaryKeywords || "",
        canonicalUrl: pkg.canonicalUrl || "",
        ogTitle: pkg.ogTitle || "",
        ogDescription: pkg.ogDescription || "",
        ogImage: pkg.ogImage || pkg.featuredImage || "",
        noIndex: !!pkg.noIndex,
        noFollow: !!pkg.noFollow,
        updatedAt: pkg.updatedAt,
      })),
      ...themes.map((t) => ({
        id: t.id,
        entityType: "Theme",
        title: t.title,
        slug: t.slug,
        url: `/themes/${t.slug}`,
        seoTitle: t.seoTitle || "",
        seoDescription: t.seoDescription || t.description || "",
        focusKeyword: t.focusKeyword || "",
        secondaryKeywords: t.secondaryKeywords || "",
        canonicalUrl: t.canonicalUrl || "",
        ogTitle: t.ogTitle || "",
        ogDescription: t.ogDescription || "",
        ogImage: t.ogImage || t.heroImage || "",
        noIndex: !!t.noIndex,
        noFollow: !!t.noFollow,
        updatedAt: t.updatedAt,
      })),
      ...services.map((s) => ({
        id: s.id,
        entityType: "Service",
        title: s.title,
        slug: s.slug,
        url: `/services`,
        seoTitle: s.seoTitle || "",
        seoDescription: s.seoDescription || s.description || "",
        focusKeyword: s.focusKeyword || "",
        secondaryKeywords: s.secondaryKeywords || "",
        canonicalUrl: s.canonicalUrl || "",
        ogTitle: s.ogTitle || "",
        ogDescription: s.ogDescription || "",
        ogImage: s.ogImage || s.image || "",
        noIndex: !!s.noIndex,
        noFollow: !!s.noFollow,
        updatedAt: s.updatedAt,
      })),
      ...venues.map((v) => ({
        id: v.id,
        entityType: "Venue",
        title: v.name,
        slug: v.slug,
        url: `/venues`,
        seoTitle: v.seoTitle || "",
        seoDescription: v.seoDescription || v.description || "",
        focusKeyword: v.focusKeyword || "",
        secondaryKeywords: v.secondaryKeywords || "",
        canonicalUrl: v.canonicalUrl || "",
        ogTitle: v.ogTitle || "",
        ogDescription: v.ogDescription || "",
        ogImage: v.ogImage || "",
        noIndex: !!v.noIndex,
        noFollow: !!v.noFollow,
        updatedAt: v.updatedAt,
      })),
      ...locations.map((l) => ({
        id: l.id,
        entityType: "Location",
        title: l.name,
        slug: l.slug,
        url: `/locations/${l.slug}`,
        seoTitle: l.seoTitle || "",
        seoDescription: l.seoDescription || l.introContent || "",
        focusKeyword: l.focusKeyword || "",
        secondaryKeywords: l.secondaryKeywords || "",
        canonicalUrl: l.canonicalUrl || "",
        ogTitle: l.ogTitle || "",
        ogDescription: l.ogDescription || "",
        ogImage: l.ogImage || l.featuredImage || "",
        noIndex: !!l.noIndex,
        noFollow: !!l.noFollow,
        updatedAt: l.updatedAt,
      })),
    ];

    if (type !== "ALL") {
      list = list.filter((item) => item.entityType.toLowerCase() === type.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.seoTitle.toLowerCase().includes(q) ||
          item.focusKeyword.toLowerCase().includes(q) ||
          item.slug.toLowerCase().includes(q)
      );
    }

    const formatted = list.map((item) => ({
      id: item.id,
      entityType: item.entityType,
      title: item.title,
      slug: item.slug,
      url: item.url,
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      focusKeyword: item.focusKeyword,
      secondaryKeywords: item.secondaryKeywords,
      canonicalUrl: item.canonicalUrl,
      ogTitle: item.ogTitle,
      ogDescription: item.ogDescription,
      ogImage: item.ogImage,
      noIndex: item.noIndex,
      noFollow: item.noFollow,
      audit: calculateSeoScore(item),
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      entityType,
      seoTitle,
      seoDescription,
      focusKeyword,
      secondaryKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      noIndex,
      noFollow,
      changedBy = "Admin",
    } = body;

    if (!id || !entityType) {
      return NextResponse.json(
        { success: false, error: "ID and Entity Type are required." },
        { status: 400 }
      );
    }

    const updatePayload = {
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      focusKeyword: focusKeyword || null,
      secondaryKeywords: secondaryKeywords || null,
      canonicalUrl: canonicalUrl || null,
      ogTitle: ogTitle || null,
      ogDescription: ogDescription || null,
      ogImage: ogImage || null,
      noIndex: !!noIndex,
      noFollow: !!noFollow,
    };

    let updatedRecord: any = null;

    if (entityType === "Page") {
      updatedRecord = await prisma.page.update({
        where: { id },
        data: {
          ...updatePayload,
          metaTitle: seoTitle || null,
          metaDescription: seoDescription || null,
        },
      });
    } else if (entityType === "Package") {
      updatedRecord = await prisma.package.update({ where: { id }, data: updatePayload });
    } else if (entityType === "Theme") {
      updatedRecord = await prisma.theme.update({ where: { id }, data: updatePayload });
    } else if (entityType === "Service") {
      updatedRecord = await prisma.service.update({ where: { id }, data: updatePayload });
    } else if (entityType === "Venue") {
      updatedRecord = await prisma.venue.update({ where: { id }, data: updatePayload });
    } else if (entityType === "Location") {
      updatedRecord = await prisma.locationPage.update({ where: { id }, data: updatePayload });
    } else {
      return NextResponse.json({ success: false, error: "Invalid entity type." }, { status: 400 });
    }

    // Log SEO audit change
    await prisma.seoAuditLog.create({
      data: {
        entityType,
        entityId: id,
        fieldName: "seoMetadata",
        oldValue: "Updated SEO Configuration",
        newValue: JSON.stringify({ seoTitle, focusKeyword, noIndex }),
        changedBy,
      },
    });

    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
