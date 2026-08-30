import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const category = searchParams.get("category");

    const assets = await prisma.mediaAsset.findMany({
      where: {
        AND: [
          category && category !== "ALL" ? { category } : {},
          search
            ? {
                OR: [
                  { title: { contains: search } },
                  { caption: { contains: search } },
                  { altText: { contains: search } },
                  { tags: { contains: search } },
                ],
              }
            : {},
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    const totalAssets = assets.length;
    const publishedAssets = assets.filter((a) => a.isActive).length;
    const featuredAssets = assets.filter((a) => a.isFeatured).length;
    const categoriesCount = new Set(assets.map((a) => a.category)).size;

    return NextResponse.json({
      success: true,
      data: assets,
      summary: {
        totalAssets,
        publishedAssets,
        featuredAssets,
        categoriesCount,
      },
    });
  } catch (error: any) {
    console.error("Gallery API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, altText, caption, url, category, tags, isFeatured, isActive, sortOrder } = body;

    if (!title || !url) {
      return NextResponse.json({ success: false, error: "Title and Image URL are required." }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        title: title.trim(),
        altText: altText ? altText.trim() : title.trim(),
        caption: caption ? caption.trim() : null,
        url: url.trim(),
        category: category || "Gallery",
        tags: tags ? tags.trim() : null,
        isFeatured: isFeatured === true,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error: any) {
    console.error("Create Gallery Asset Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) return NextResponse.json({ success: false, error: "Asset ID required." }, { status: 400 });

    if (data.sortOrder !== undefined) data.sortOrder = Number(data.sortOrder);

    const updated = await prisma.mediaAsset.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Update Gallery Asset Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, error: "Asset ID required." }, { status: 400 });

    await prisma.mediaAsset.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Gallery asset deleted successfully." });
  } catch (error: any) {
    console.error("Delete Gallery Asset Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
