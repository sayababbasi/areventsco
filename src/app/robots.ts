import { MetadataRoute } from "next";
import { APP_BASE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin/*",
          "/api/admin/",
          "/api/admin/*",
          "/dashboard/",
          "/dashboard/*",
          "/login",
          "/register",
          "/booking/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/admin/", "/dashboard/"],
      },
    ],
    sitemap: `${APP_BASE_URL}/sitemap.xml`,
    host: APP_BASE_URL,
  };
}
