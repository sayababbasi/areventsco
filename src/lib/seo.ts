import type { Metadata } from "next";

export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://areventsco.com";

export interface SeoEntity {
  title?: string;
  name?: string;
  slug?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  focusKeyword?: string | null;
  secondaryKeywords?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  noIndex?: boolean;
  noFollow?: boolean;
  featuredImage?: string | null;
  heroImage?: string | null;
  image?: string | null;
  description?: string | null;
  introContent?: string | null;
}

export interface SeoAuditResult {
  score: number;
  status: "EXCELLENT" | "GOOD" | "NEEDS_WORK" | "CRITICAL";
  passedChecks: string[];
  issues: string[];
  recommendations: string[];
}

/**
 * Construct Next.js dynamic metadata for any public page/entity
 */
export function constructMetadata({
  title,
  description,
  canonicalPath,
  ogImage,
  noIndex = false,
  noFollow = false,
  keywords,
}: {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  keywords?: string[];
}): Metadata {
  const defaultDesc =
    "Your Celebration, Our Passion. AR Events Co. is Islamabad and Rawalpindi's premier luxury birthday decoration and event styling service. Book custom themes, balloon decor, backdrops, and complete party packages online.";

  const finalDesc = description || defaultDesc;
  const canonical = canonicalPath
    ? canonicalPath.startsWith("http")
      ? canonicalPath
      : `${APP_BASE_URL}${canonicalPath.startsWith("/") ? "" : "/"}${canonicalPath}`
    : APP_BASE_URL;

  const finalOgImage = ogImage || "/images/hero/hero_birthday_lawn.jpg";
  const ogImageUrl = finalOgImage.startsWith("http")
    ? finalOgImage
    : `${APP_BASE_URL}${finalOgImage.startsWith("/") ? "" : "/"}${finalOgImage}`;

  const defaultKeywords = [
    "Birthday Decoration Islamabad",
    "Birthday Decoration Rawalpindi",
    "Birthday Event Planner Islamabad",
    "Birthday Party Decorators Rawalpindi",
    "Kids Birthday Themes Islamabad",
    "Balloon Decoration Bahria Town",
    "Birthday Packages Islamabad",
    "AR Events Co",
  ];

  return {
    title,
    description: finalDesc,
    keywords: keywords && keywords.length > 0 ? keywords : defaultKeywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: finalDesc,
      url: canonical,
      siteName: "AR Events Co.",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - AR Events Co. Islamabad & Rawalpindi`,
        },
      ],
      type: "website",
      locale: "en_PK",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: finalDesc,
      images: [ogImageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Calculate SEO audit health score (0-100) and actionable diagnosis
 */
export function calculateSeoScore(entity: SeoEntity): SeoAuditResult {
  let score = 0;
  const passedChecks: string[] = [];
  const issues: string[] = [];
  const recommendations: string[] = [];

  const title = entity.seoTitle || entity.title || entity.name || "";
  const description =
    entity.seoDescription || entity.description || entity.introContent || "";
  const focusKeyword = entity.focusKeyword?.trim() || "";
  const image =
    entity.ogImage || entity.featuredImage || entity.heroImage || entity.image || "";

  // 1. Title Checks (25 Points)
  if (title.length >= 30 && title.length <= 65) {
    score += 25;
    passedChecks.push(`Title length is optimal (${title.length} characters)`);
  } else if (title.length > 0) {
    score += 15;
    if (title.length < 30) {
      issues.push(`Title is short (${title.length} chars). Aim for 30–65 characters.`);
      recommendations.push("Expand SEO title with location keywords (e.g. 'in Islamabad & Rawalpindi')");
    } else {
      issues.push(`Title may be truncated by Google (${title.length} chars). Keep under 65 chars.`);
      recommendations.push("Shorten title so it doesn't get clipped on mobile SERPs");
    }
  } else {
    issues.push("Missing SEO title");
    recommendations.push("Add a descriptive, keyword-rich SEO title");
  }

  // 2. Meta Description Checks (25 Points)
  if (description.length >= 120 && description.length <= 165) {
    score += 25;
    passedChecks.push(`Meta description length is ideal (${description.length} characters)`);
  } else if (description.length > 0) {
    score += 15;
    if (description.length < 120) {
      issues.push(`Meta description is short (${description.length} chars). Aim for 120–160 chars.`);
      recommendations.push("Include secondary service details and a compelling call-to-action");
    } else {
      issues.push(`Meta description exceeds 165 chars (${description.length} chars).`);
      recommendations.push("Trim description to avoid search engine truncation");
    }
  } else {
    issues.push("Missing meta description");
    recommendations.push("Write a compelling 140–160 character meta description");
  }

  // 3. Focus Keyword Checks (20 Points)
  if (focusKeyword.length > 0) {
    const kwLower = focusKeyword.toLowerCase();
    const hasInTitle = title.toLowerCase().includes(kwLower);
    const hasInDesc = description.toLowerCase().includes(kwLower);

    if (hasInTitle && hasInDesc) {
      score += 20;
      passedChecks.push(`Focus keyword "${focusKeyword}" present in both title and description`);
    } else if (hasInTitle || hasInDesc) {
      score += 12;
      passedChecks.push(`Focus keyword "${focusKeyword}" defined`);
      if (!hasInTitle) recommendations.push(`Include focus keyword "${focusKeyword}" in the SEO title`);
      if (!hasInDesc) recommendations.push(`Include focus keyword "${focusKeyword}" in the meta description`);
    } else {
      score += 8;
      issues.push(`Focus keyword "${focusKeyword}" not found in title or description`);
      recommendations.push("Naturally weave the focus keyword into the title and description");
    }
  } else {
    issues.push("No focus keyword assigned");
    recommendations.push("Set a primary target keyword (e.g. 'birthday decoration Islamabad')");
  }

  // 4. Image & Open Graph (15 Points)
  if (image) {
    score += 15;
    passedChecks.push("Featured / Social Share image is configured");
  } else {
    issues.push("Missing social preview / OG image");
    recommendations.push("Assign an authentic high-resolution setup photo for social sharing");
  }

  // 5. Indexing & Canonical (15 Points)
  if (!entity.noIndex) {
    score += 15;
    passedChecks.push("Page is set to Indexable (search engines can crawl & rank)");
  } else {
    issues.push("Page is set to NOINDEX (blocked from search engine index)");
    recommendations.push("Switch to Indexable if you want this page to rank on Google");
  }

  let status: "EXCELLENT" | "GOOD" | "NEEDS_WORK" | "CRITICAL" = "EXCELLENT";
  if (score >= 85) status = "EXCELLENT";
  else if (score >= 70) status = "GOOD";
  else if (score >= 50) status = "NEEDS_WORK";
  else status = "CRITICAL";

  return {
    score,
    status,
    passedChecks,
    issues,
    recommendations,
  };
}
