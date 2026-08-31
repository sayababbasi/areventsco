import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  FALLBACK_PACKAGES,
  FALLBACK_THEMES,
  FALLBACK_VENUES,
} from "@/lib/data-fallback";

export const dynamic = "force-dynamic";

const FALLBACK_ADDONS = [
  {
    id: "addon_photo_3hr",
    slug: "pro-photography-3hr",
    title: "3-Hour High-Res Event Photography",
    category: "Media",
    priceMinor: 1500000,
    priceType: "FIXED",
    description: "Professional DSLR photographer capturing candid moments, portraits & cake cutting.",
    isActive: true,
  },
  {
    id: "addon_marquee_numbers",
    slug: "4ft-led-marquee-numbers",
    title: "4-Foot LED Light-Up Marquee Numbers",
    category: "Lighting",
    priceMinor: 600000,
    priceType: "FIXED",
    description: "Glowing warm-white marquee numbers representing child's age or initials.",
    isActive: true,
  },
  {
    id: "addon_magic_show",
    slug: "interactive-magic-show",
    title: "Interactive Magic & Puppet Show",
    category: "Entertainment",
    priceMinor: 1000000,
    priceType: "FIXED",
    description: "45-minute interactive entertainment show for kids & family guests.",
    isActive: true,
  },
];

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

    if (packages.length > 0 && themes.length > 0) {
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
    }
  } catch (error: any) {
    console.warn("[CATALOG-API] Database unreachable. Serving offline fallback catalog:", error?.message);
  }

  // Graceful offline fallback catalog
  return NextResponse.json({
    success: true,
    isOfflineFallback: true,
    data: {
      packages: FALLBACK_PACKAGES.map((p) => ({
        ...p,
        features: JSON.parse(p.features || "[]"),
      })),
      themes: FALLBACK_THEMES.map((t) => ({
        ...t,
        colorPalette: JSON.parse(t.colorPalette || "[]"),
        includedDecor: JSON.parse(t.includedDecor || "[]"),
      })),
      addons: FALLBACK_ADDONS,
      venues: FALLBACK_VENUES,
    },
  });
}
