import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const themes = await prisma.theme.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const addons = await prisma.addon.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        packages: packages.map((p) => ({
          ...p,
          features: typeof p.features === "string" ? JSON.parse(p.features || "[]") : p.features,
        })),
        themes: themes.map((t) => ({
          ...t,
          colorPalette: typeof t.colorPalette === "string" ? JSON.parse(t.colorPalette || "[]") : t.colorPalette,
          includedDecor: typeof t.includedDecor === "string" ? JSON.parse(t.includedDecor || "[]") : t.includedDecor,
        })),
        addons,
        venues,
      },
    });
  } catch (error: any) {
    console.error("Catalog API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
