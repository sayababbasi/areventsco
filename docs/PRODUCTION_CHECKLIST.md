# AR Events Co. — Pre-Launch & Production Checklist

Complete this checklist prior to announcing the public launch of `areventsco.com`.

---

## 1. Database & Infrastructure
- [ ] Supabase PostgreSQL database provisioned in chosen region.
- [ ] Database connection pooling configured with `DATABASE_URL` (Port 6543) and `DIRECT_URL` (Port 5432).
- [ ] `npx prisma db push` successfully executed against production database.
- [ ] Master seed data (`npx tsx prisma/seed.ts`) executed to populate catalog, themes, venues, and FAQs.
- [ ] Supabase Storage bucket `arevents-media` created and set to Public.
- [ ] Bucket policies allow public read access for media delivery.

---

## 2. Environment Variables & Security
- [ ] All required variables configured in Vercel Project Settings.
- [ ] `AUTH_SECRET` is a secure 64+ character random string.
- [ ] No private keys or database passwords committed in git repository.
- [ ] `.env` and `.env.local` files confirmed in `.gitignore`.
- [ ] Production HTTP security headers active in `next.config.mjs` (HSTS, CSP, X-Frame-Options).
- [ ] Admin routes (`/admin/*`) and Customer dashboard (`/dashboard/*`) protected by Edge Middleware and HMAC-SHA256 signature verification.

---

## 3. Core Customer Experience
- [ ] Public homepage (`/`) loads with hero photography, themes, services, and reviews.
- [ ] Packages page (`/packages`) displays pricing in PKR with full feature lists.
- [ ] Themes catalog (`/themes`) and Theme detail pages (`/themes/[slug]`) render properly.
- [ ] Services catalog (`/services`) and Add-ons display transparent pricing.
- [ ] Partner venues page (`/venues`) lists Islamabad & Rawalpindi spaces with capacities.
- [ ] Multi-step Booking Engine (`/book`) validates dates, packages, customer details, and creates a real `Booking` record in the database.
- [ ] Gallery (`/gallery`) renders real event media assets.
- [ ] FAQs (`/faq`) and Reviews (`/reviews`) display authentic customer proof.

---

## 4. Admin Management Modules
- [ ] Admin Login (`/login`) validates credentials and issues `ar_session` HTTP-only cookie.
- [ ] Admin Dashboard (`/admin`) computes live metrics from database records.
- [ ] Bookings Manager (`/admin/bookings`) updates booking statuses (`CONFIRMED`, `COMPLETED`, `CANCELLED`).
- [ ] Invoices & Ledger (`/admin/invoices`) generates printable invoices and records payments.
- [ ] Customers CRM (`/admin/customers`) displays client profiles and booking histories.
- [ ] Themes Manager (`/admin/themes`) & Packages Manager (`/admin/packages`) support full CRUD.
- [ ] Gallery Media Manager (`/admin/gallery`) uploads directly to Supabase Storage.
- [ ] FAQs Manager (`/admin/faqs`) allows adding and editing help center questions.
- [ ] SEO Discovery Suite (`/admin/seo`) displays live site audit score and allows editing SERP titles.

---

## 5. SEO, Domain & Performance
- [ ] Dynamic XML Sitemap accessible at `https://areventsco.com/sitemap.xml`.
- [ ] Dynamic Robots file accessible at `https://areventsco.com/robots.txt`.
- [ ] Dedicated Local Landing Hubs active:
  - `https://areventsco.com/locations/islamabad`
  - `https://areventsco.com/locations/rawalpindi`
  - `https://areventsco.com/locations/bahria-town`
  - `https://areventsco.com/locations/dha-islamabad`
- [ ] Schema.org JSON-LD microdata (`LocalBusiness`, `Service`, `Product`, `BreadcrumbList`, `FAQPage`) validated.
- [ ] Custom 404 page (`not-found.tsx`) and Error boundary (`error.tsx`) active.
- [ ] 301 Redirect engine routes legacy URLs without breaking link equity.
- [ ] Cloudflare SSL/TLS set to **Full (Strict)** with **Always Use HTTPS**.
- [ ] Next.js production build (`next build`) compiles 50+ routes with 0 errors.
