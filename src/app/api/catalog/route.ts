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

// In-memory catalog cache with 60s TTL
let cachedCatalog: { data: any; expiresAt: number } | null = null;

export async function GET() {
  const now = Date.now();
  if (cachedCatalog && cachedCatalog.expiresAt > now) {
    return NextResponse.json(
      { success: true, data: cachedCatalog.data, cached: true },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  }

  try {
    const [packages, themes, addons, venues] = await Promise.all([
      prisma.package.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.theme.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.addon.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.venue.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
    ]);

    if (packages.length > 0 && themes.length > 0) {
      const data = {
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
      };

      cachedCatalog = { data, expiresAt: now + 60_000 };

      return NextResponse.json(
        { success: true, data },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          },
        }
      );
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
