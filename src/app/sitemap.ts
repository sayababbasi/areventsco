import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://areventsco.com";
  const currentDate = new Date().toISOString();

  const routes = [
    "",
    "/about",
    "/packages",
    "/themes",
    "/services",
    "/venues",
    "/gallery",
    "/reviews",
    "/faq",
    "/contact",
    "/book",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : route === "/book" || route === "/packages" ? 0.9 : 0.8,
  }));
}
