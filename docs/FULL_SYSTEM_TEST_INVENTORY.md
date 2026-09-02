# AR EVENTS CO. — COMPLETE SYSTEM INVENTORY

**Date:** 2026-09-02  
**Baseline Framework:** Next.js 15.5.24 (App Router) | React 18.3.1 | Prisma 5.22.0 | PostgreSQL (Supabase)

---

## 1. PUBLIC & MARKETING PAGES (13 Routes)
- [x] `/` (Home Landing Page) — `src/app/(public)/page.tsx`
- [x] `/about` (About Us & Story) — `src/app/(public)/about/page.tsx`
- [x] `/packages` (Birthday & Event Packages) — `src/app/(public)/packages/page.tsx`
- [x] `/themes` (Theme Gallery & Catalog) — `src/app/(public)/themes/page.tsx`
- [x] `/themes/[slug]` (Dynamic Theme Detail Page) — `src/app/(public)/themes/[slug]/page.tsx`
- [x] `/services` (Turnkey Services) — `src/app/(public)/services/page.tsx`
- [x] `/venues` (Partner Venues & Halls) — `src/app/(public)/venues/page.tsx`
- [x] `/gallery` (Real Celebration Photography) — `src/app/(public)/gallery/page.tsx`
- [x] `/reviews` (Customer Testimonials & Social Proof) — `src/app/(public)/reviews/page.tsx`
- [x] `/faq` (Frequently Asked Questions) — `src/app/(public)/faq/page.tsx`
- [x] `/contact` (Contact & Inquiries) — `src/app/(public)/contact/page.tsx`
- [x] `/book` (Interactive 5-Step Booking Engine) — `src/app/(public)/book/page.tsx`
- [x] `/locations/[slug]` (Targeted City/Sector SEO Landing Pages) — `src/app/(public)/locations/[slug]/page.tsx`

---

## 2. CUSTOMER & ORDER TRACKING PAGES (4 Routes)
- [x] `/booking/[reference]` (Dynamic Order Tracking & Safepay Card Checkout) — `src/app/(public)/booking/[reference]/page.tsx`
- [x] `/login` (Customer Authentication) — `src/app/(customer)/login/page.tsx`
- [x] `/register` (Customer Registration) — `src/app/(customer)/register/page.tsx`
- [x] `/dashboard` (Customer Portal & Bookings Overview) — `src/app/(customer)/dashboard/page.tsx`

---

## 3. ADMIN MANAGEMENT CENTER (21 Pages)
- [x] `/admin` (Executive Operations Dashboard) — `src/app/admin/page.tsx`
- [x] `/admin/bookings` (Booking Operations & Dispatch) — `src/app/admin/bookings/page.tsx`
- [x] `/admin/calendar` (Interactive Date & Schedule View) — `src/app/admin/calendar/page.tsx`
- [x] `/admin/catalog` (Master Catalog Overview) — `src/app/admin/catalog/page.tsx`
- [x] `/admin/packages` (Package Management) — `src/app/admin/packages/page.tsx`
- [x] `/admin/themes` (Theme Portfolio) — `src/app/admin/themes/page.tsx`
- [x] `/admin/services` (Service Offerings) — `src/app/admin/services/page.tsx`
- [x] `/admin/addons` (Addon Enhancements) — `src/app/admin/addons/page.tsx`
- [x] `/admin/venues` (Venue Registry) — `src/app/admin/venues/page.tsx`
- [x] `/admin/invoices` (Financial Ledger & Invoices) — `src/app/admin/invoices/page.tsx`
- [x] `/admin/invoices/[id]` (Print-Ready Invoice Detail & Payment Record) — `src/app/admin/invoices/[id]/page.tsx`
- [x] `/admin/payments` (Transaction Reconciliation Ledger) — `src/app/admin/payments/page.tsx`
- [x] `/admin/payments/[id]` (Payment Gateway Audit Detail) — `src/app/admin/payments/[id]/page.tsx`
- [x] `/admin/customers` (Customer CRM & Profiles) — `src/app/admin/customers/page.tsx`
- [x] `/admin/inquiries` (Lead Pipeline & Contact Requests) — `src/app/admin/inquiries/page.tsx`
- [x] `/admin/inventory` (Physical Props & Warehouse Inventory) — `src/app/admin/inventory/page.tsx`
- [x] `/admin/faqs` (FAQ Content Management) — `src/app/admin/faqs/page.tsx`
- [x] `/admin/reviews` (Customer Reviews & Moderation) — `src/app/admin/reviews/page.tsx`
- [x] `/admin/gallery` (Media Assets & Photos) — `src/app/admin/gallery/page.tsx`
- [x] `/admin/staff` (Staff & Team Coordinator Dispatch) — `src/app/admin/staff/page.tsx`
- [x] `/admin/coupons` (Promotional Discounts) — `src/app/admin/coupons/page.tsx`
- [x] `/admin/seo` (SEO & Local Landing Pages CMS) — `src/app/admin/seo/page.tsx`
- [x] `/admin/seo/pages` (Meta Tags & OpenGraph Editor) — `src/app/admin/seo/pages/page.tsx`
- [x] `/admin/seo/locations` (Location Page Content Builder) — `src/app/admin/seo/locations/page.tsx`
- [x] `/admin/seo/redirects` (301/302 URL Redirect Engine) — `src/app/admin/seo/redirects/page.tsx`
- [x] `/admin/seo/settings` (Global SEO Configuration) — `src/app/admin/seo/settings/page.tsx`
- [x] `/admin/settings` (Platform Business Settings) — `src/app/admin/settings/page.tsx`

---

## 4. BACKEND API ENDPOINTS (35 Endpoints)

### Public & Customer APIs
- [x] `POST /api/auth/login` (Authentication & Session Cookie Dispatch)
- [x] `POST /api/auth/register` (Customer Account Creation)
- [x] `POST /api/auth/logout` (Session Termination)
- [x] `GET /api/catalog` (Public Catalog Snapshot)
- [x] `POST /api/pricing/calculate` (Server-Authoritative Price Calculation)
- [x] `POST /api/bookings` (Atomic Booking Creation)
- [x] `GET /api/bookings/[reference]/invoice` (Booking Invoice Retrieval)
- [x] `GET /api/bookings/[reference]/payment-status` (Live Payment Status Polling)
- [x] `POST /api/inquiries` (Public Contact & Event Inquiries)
- [x] `GET /api/invoices/[id]/pdf` (Authorized PDF Invoice Generation)
- [x] `GET /api/health` (System & Database Liveness Check)
- [x] `GET /api/redirects` (Middleware Redirect Resolution)
- [x] `GET /api/realtime/stream` (Authenticated SSE Event Stream)

### Safepay Payment Gateway APIs
- [x] `POST /api/payments/safepay/create-session` (Hosted Checkout Tracker Token)
- [x] `GET /api/payments/safepay/verify` (Authoritative Gateway Verification)
- [x] `POST /api/payments/safepay/webhook` (HMAC-SHA256 Idempotent Webhook Handler)

### Admin Management APIs
- [x] `GET /api/admin/dashboard` (KPI Aggregation)
- [x] `GET/POST /api/admin/bookings` & `PATCH /api/admin/bookings/[id]/status`
- [x] `GET/POST/PUT/DELETE /api/admin/packages`
- [x] `GET/POST/PUT/DELETE /api/admin/themes`
- [x] `GET/POST/PUT/DELETE /api/admin/services`
- [x] `GET/POST/PUT/DELETE /api/admin/addons`
- [x] `GET/POST/PUT/DELETE /api/admin/venues`
- [x] `GET /api/admin/customers`
- [x] `GET /api/admin/invoices` & `GET/PATCH /api/admin/invoices/[id]`
- [x] `POST /api/admin/invoices/[id]/payments` (Manual Payment Recording)
- [x] `GET /api/admin/payments` & `GET /api/admin/payments/[id]` & `POST /api/admin/payments/[id]/verify`
- [x] `GET/POST/PUT/DELETE /api/admin/inquiries`
- [x] `GET/POST/PUT/DELETE /api/admin/inventory`
- [x] `GET/POST/PUT/DELETE /api/admin/faqs`
- [x] `GET/POST/PUT/DELETE /api/admin/reviews`
- [x] `GET/POST/DELETE /api/admin/gallery`
- [x] `GET/POST/PUT/DELETE /api/admin/staff`
- [x] `GET/POST/PUT/DELETE /api/admin/coupons`
- [x] `GET/POST /api/admin/seo/dashboard`, `seo/pages`, `seo/locations`, `seo/redirects`, `seo/settings`
- [x] `GET/POST /api/admin/settings`
- [x] `POST /api/admin/upload` (Secured Media Asset Upload)

---

## 5. DATABASE SCHEMA (31 Models)
1. `User` (RBAC accounts, password hashes)
2. `CustomerProfile` (Customer contact, address, bookings)
3. `StaffProfile` (Assigned tasks, department, event dispatch)
4. `Package` (Catalog tiers, base price, feature bullets)
5. `Theme` (Visual themes, color palettes, decor items)
6. `Service` (Fixed/per-guest add-on services)
7. `Addon` (Individual enhancement products)
8. `Venue` (Indoor halls, outdoor lawns, fees)
9. `Booking` (Central event transaction record)
10. `BookingItem` (Snapshot line items with historical pricing)
11. `AvailabilitySlot` (Date blocking & concurrency controls)
12. `Payment` (Financial ledger, Safepay tokens, provider references)
13. `Invoice` (Customer billing record, status, due dates)
14. `InvoiceItem` (Invoice itemized billing)
15. `InvoiceAuditLog` (Immutable invoice audit trail)
16. `Coupon` (Promotional discount codes)
17. `Page` (CMS dynamic pages)
18. `Section` (CMS page layout blocks)
19. `Faq` (Public FAQ entries)
20. `Review` (Customer reviews and star ratings)
21. `MediaAsset` (Uploaded media assets)
22. `Notification` (In-app and system alerts)
23. `AuditLog` (System-wide administrative audit trail)
24. `Setting` (Key-value platform configuration)
25. `InventoryItem` (Warehouse props, condition, availability)
26. `Inquiry` (Public leads and custom event requests)
27. `Expense` (Event operational costs & vendor disbursements)
28. `Team` (Event setup and logistics crews)
29. `LocationPage` (SEO city/sector landing pages)
30. `Redirect` (Dynamic HTTP 301/302 redirects)
31. `SeoAuditLog` (SEO metadata change history)

---

## 6. CORE SERVICES & LIBRARIES
- **`PricingService`** (`src/server/services/pricing.service.ts`): Server-authoritative calculation.
- **`AvailabilityService`** (`src/server/services/availability.service.ts`): Concurrency & date capacity checks.
- **`BookingService`** (`src/server/services/booking.service.ts`): Atomic transaction creation.
- **`InvoiceService`** (`src/server/services/invoice.service.ts`): PDF rendering, balance calculations, payments.
- **`PaymentService`** (`src/lib/payments/payment-service.ts`): Gateway dispatch, webhook HMAC, state machine.
- **`SafepayGateway`** (`src/lib/payments/safepay.ts`): Safepay REST and SDK integration.
- **`EventBus`** (`src/lib/realtime/event-bus.ts`): Low-latency in-memory realtime dispatcher.
- **`RateLimiter`** (`src/lib/rate-limit.ts`): In-memory sliding-window protection.
- **`Storage`** (`src/lib/storage.ts`): Supabase binary storage with SVG XSS sanitizer.
- **`Auth`** (`src/lib/auth.ts`): Edge token HMAC signing and session cookie management.
