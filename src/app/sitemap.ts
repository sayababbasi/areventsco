import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { APP_BASE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // 1. Static Core Pages
  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/packages", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/themes", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/venues", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/gallery", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/reviews", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/book", priority: 0.9, changeFrequency: "weekly" as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${APP_BASE_URL}${r.path}`,
    lastModified: currentDate,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  try {
    // 2. Dynamic Location Hubs (/locations/[slug])
    const locations = await prisma.locationPage.findMany({
      where: { isActive: true, noIndex: false },
      select: { slug: true, updatedAt: true },
    });
    for (const loc of locations) {
      sitemapEntries.push({
        url: `${APP_BASE_URL}/locations/${loc.slug}`,
        lastModified: loc.updatedAt.toISOString(),
        changeFrequency: "weekly",
        priority: 0.95, // High priority for local SEO
      });
    }

    // 3. Dynamic Themes (/themes/[slug])
    const themes = await prisma.theme.findMany({
      where: { isActive: true, noIndex: false },
      select: { slug: true, updatedAt: true },
    });
    for (const t of themes) {
      sitemapEntries.push({
        url: `${APP_BASE_URL}/themes/${t.slug}`,
        lastModified: t.updatedAt.toISOString(),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  } catch (err) {
    console.error("Error generating dynamic sitemap:", err);
  }

  return sitemapEntries;
}
