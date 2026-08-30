# AR Events Co. — Enterprise SEO Architecture & Local Search Engine

## 1. Executive Summary & Market Positioning

**AR Events Co.** (`areventsco.com`) is the premier luxury birthday decoration and event styling company serving **Islamabad and Rawalpindi, Pakistan**.

The platform is engineered to capture high-intent commercial organic search queries across Google Desktop, Mobile, and Local Map Pack searches, including:
- *"birthday decoration Islamabad"*
- *"birthday decorators Rawalpindi"*
- *"birthday themes Islamabad"*
- *"kids birthday party packages Islamabad"*
- *"balloon decoration Bahria Town Rawalpindi"*
- *"event decor DHA Islamabad"*

Rather than relying on static or hardcoded metadata, the SEO system is **100% database-driven**, reactive, and manageable directly from the enterprise Admin Panel without requiring developer code changes.

---

## 2. Technical SEO Pipeline & Next.js App Router Architecture

```
                                    DATABASE (Prisma SQLite)
                                               │
               ┌───────────────────────────────┼───────────────────────────────┐
               │                               │                               │
        Page / Package / Theme           LocationPage                      Redirects
        SEO Metadata & Keywords           Local Hubs & Sectors          301 / 302 Rules
               │                               │                               │
               ▼                               ▼                               ▼
       src/lib/seo.ts                 /locations/[slug]               src/middleware.ts
      Metadata Constructor            generateMetadata + UI          Instant 301 Routing
               │                               │                               │
               ▼                               ▼                               ▼
     Next.js Metadata API            JSON-LD Structured Data          XML Dynamic Sitemap
    Title, Meta Desc, OG Card        LocalBusiness & FAQPage          src/app/sitemap.ts
               │                               │                               │
               └───────────────────────────────┼───────────────────────────────┘
                                               │
                                               ▼
                                   GOOGLE / SEARCH ENGINES
```

### Key Technical Capabilities:
1. **Dynamic Metadata (`constructMetadata`)**: Automatically constructs RFC-compliant title tags (`%s | AR Events Co.`), meta descriptions (140–160 chars), Open Graph cards (1200x630), Twitter Summary cards, and canonical links.
2. **Dynamic XML Sitemap (`src/app/sitemap.ts`)**: Automatically indexes public pages, location hubs, and theme detail pages (`/themes/[slug]`), while respecting `noIndex` directives and excluding private admin or booking routes.
3. **Robots Directives (`src/app/robots.ts`)**: Disallows `/admin/*`, `/api/admin/*`, `/dashboard/*`, and `/booking/*` while granting unrestricted crawl access to indexable public catalog routes.
4. **301 / 302 Redirect Engine (`src/middleware.ts`)**: Edge-level request interceptor matching incoming request paths against the database `Redirect` table, seamlessly routing traffic and incrementing analytics hit counters.

---

## 3. Database Schema Reference

### A. Extended Entity Fields (`Package`, `Theme`, `Service`, `Venue`, `Page`)
```prisma
seoTitle          String?   // Custom SERP Title
seoDescription    String?   // Custom SERP Meta Description
focusKeyword      String?   // Target primary keyword
secondaryKeywords String?   // JSON list or comma-separated keywords
canonicalUrl      String?   // Custom canonical override
ogTitle           String?   // Open Graph Title
ogDescription     String?   // Open Graph Description
ogImage           String?   // 1200x630 Social Share Image
noIndex           Boolean   @default(false)
noFollow          Boolean   @default(false)
structuredData    String?   // Custom JSON-LD override
```

### B. Local SEO Landing Hub Model (`LocationPage`)
```prisma
model LocationPage {
  id              String   @id @default(cuid())
  slug            String   @unique // "islamabad", "rawalpindi", "bahria-town", "dha-islamabad"
  name            String   // "Islamabad", "Rawalpindi", etc.
  city            String   // "Islamabad" or "Rawalpindi"
  headline        String
  subheadline     String?
  introContent    String   // Rich localized copy
  coverageAreas   String   // JSON list e.g. ["F-6", "F-7", "F-8", "E-11", "Chak Shahzad"]
  featuredImage   String?
  sortOrder       Int      @default(0)
  isActive        Boolean  @default(true)
  seoTitle        String?
  seoDescription  String?
  focusKeyword    String?
  secondaryKeywords String?
  canonicalUrl    String?
  ogImage         String?
  noIndex         Boolean  @default(false)
  noFollow        Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### C. Redirects Model (`Redirect`)
```prisma
model Redirect {
  id          String   @id @default(cuid())
  fromPath    String   @unique
  toPath      String
  statusCode  Int      @default(301) // 301 (Permanent), 302 (Temporary)
  isActive    Boolean  @default(true)
  hitCount    Int      @default(0)
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 4. Structured Data (JSON-LD) Implementations

All structured data is generated natively using standard Schema.org specifications:

1. **`LocalBusinessJsonLd`**:
   - Injected into root layout and localized landing pages.
   - Includes business name, legal address, official phone/WhatsApp (`+92 300 8555123`), price range in PKR, opening hours (`Mo-Su 10:00-22:00`), and exact GPS coordinates (`33.7294, 73.0931`).
2. **`ProductJsonLd`**:
   - Injected into Package pages with currency `PKR` and live minor unit calculations.
3. **`ServiceJsonLd`**:
   - Injected into A La Carte service listings.
4. **`EventVenueJsonLd`**:
   - Injected into partner venue listings with maximum guest capacities and addresses.
5. **`BreadcrumbJsonLd`**:
   - Automatically computed and paired with the `<Breadcrumbs />` visual navigation bar.
6. **`FaqPageJsonLd`**:
   - Automatically renders question-and-answer pairs for rich snippets in Google search results.

---

## 5. Local SEO & Twin Cities Geographic Coverage

### 1. Islamabad Core (`/locations/islamabad`)
- **Focus Keyword**: `birthday decoration Islamabad`
- **Sectors Covered**: Sector F-6, F-7, F-8, F-10, F-11, E-7, E-11, G-10, G-11, G-13, I-8, Bani Gala, Chak Shahzad, Park View City, Bahria Enclave.
- **Setup Capabilities**: Outdoor lawn pavilions, Margalla terrace celebrations, private residence lounges.

### 2. Rawalpindi Core (`/locations/rawalpindi`)
- **Focus Keyword**: `birthday decoration Rawalpindi`
- **Areas Covered**: Bahria Town (Phases 1–8), DHA Rawalpindi (Phases 1–5), Satellite Town, Rawalpindi Cantt, Chaklala Scheme 3, PWD Housing Society, Askari Schemes.
- **Setup Capabilities**: Banquet suite decoration, marquee letter illumination, birthday stages.

### 3. Bahria Town Hub (`/locations/bahria-town`)
- **Focus Keyword**: `birthday decoration Bahria Town`
- **Areas Covered**: Phase 1 to Phase 8, Safari Villas, Garden City, Executive Lodges.
- **Setup Capabilities**: Dedicated rapid-setup mobile crews on 3-hour deployment.

### 4. DHA Hub (`/locations/dha-islamabad`)
- **Focus Keyword**: `birthday decoration DHA Islamabad`
- **Areas Covered**: DHA Phase 1, Phase 2 (Sectors A–J), Phase 3, Phase 5, DHA Valley.

---

## 6. Admin Panel SEO Operations Guide

The enterprise SEO suite is accessible from **Admin → SEO & DISCOVERY**:

### A. SEO Health Dashboard (`/admin/seo`)
- Displays live site-wide SEO health score (0–100%).
- Real-time diagnostic action items (missing titles, missing descriptions, missing alt text, missing focus keywords).
- Quick links to `/sitemap.xml` and `/robots.txt`.

### B. Pages & Entity SEO Manager (`/admin/seo/pages`)
- Filter by entity type (`Core Pages`, `Packages`, `Themes`, `Services`, `Venues`, `Locations`).
- Live **Google SERP Desktop & Mobile Preview** + **Social Sharing (OG) Card**.
- Live character counter with green/amber alerts for Title (30–60 chars) and Description (120–160 chars).
- Edit title, description, focus keywords, canonical overrides, and index/noindex switches.

### C. Local SEO Hubs (`/admin/seo/locations`)
- Add or edit localized landing pages.
- Add coverage sectors and neighborhoods as tags.
- Customize H1 headlines and introductory rich copy.

### D. 301 / 302 Redirects Manager (`/admin/seo/redirects`)
- Create new 301 permanent or 302 temporary redirects.
- Track lifetime traffic hits rerouted through each rule.
- Instant pause/activate toggle switches.

### E. Global Business NAP Settings (`/admin/seo/settings`)
- Centralized management of official business phone, WhatsApp, physical address, GPS coordinates, and Google Search Console verification tokens.
