import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  FALLBACK_PACKAGES,
  FALLBACK_THEMES,
  FALLBACK_VENUES,
  FALLBACK_ADDONS,
} from "@/lib/data-fallback";

export const dynamic = "force-dynamic";

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
        addons: addons.map((a) => {
          const s = (a.slug || a.id || "").toLowerCase();
          let img = a.image;
          if (!img || img.trim() === "") {
            if (s.includes("photo")) img = "/images/addons/addon_photography.jpg";
            else if (s.includes("video") || s.includes("cinematic") || s.includes("reel")) img = "/images/addons/addon_videography.jpg";
            else if (s.includes("cake") || s.includes("fondant")) img = "/images/addons/addon_fondant_cake.jpg";
            else if (s.includes("marquee") || s.includes("number") || s.includes("led")) img = "/images/addons/addon_marquee_numbers.jpg";
            else if (s.includes("spark") || s.includes("pyro") || s.includes("firework")) img = "/images/addons/addon_cold_spark.jpg";
            else if (s.includes("magic") || s.includes("puppet") || s.includes("show")) img = "/images/addons/addon_magic_show.jpg";
            else if (s.includes("cotton") || s.includes("popcorn") || s.includes("cart")) img = "/images/addons/addon_cotton_candy.jpg";
            else img = "/images/addons/addon_photography.jpg";
          }
          return { ...a, image: img };
        }),
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
