# AR EVENTS CO. — FULL TEST & VULNERABILITY BUG REPORT

**Date:** 2026-09-02  
**Framework Baseline:** Next.js 15.5.24 | React 18.3.1 | Prisma 5.22.0

---

### BUG-01: Realtime SSE Stream Unauthenticated Channel Access
- **ID:** BUG-01
- **Severity:** **CRITICAL**
- **Category:** Authorization / Data Leakage
- **Affected Route:** `GET /api/realtime/stream`
- **Steps to Reproduce:**
  1. Make an unauthenticated GET request to `/api/realtime/stream?channel=admin`.
  2. Emit a booking or payment event.
- **Expected Result:** Unauthenticated requests cannot subscribe to `admin` or private `booking:*` channels.
- **Actual Result (Before Fix):** Any anonymous connection received all live admin broadcasts including customer names, phone numbers, and payment amounts.
- **Root Cause:** SSE route handler lacked session cookie extraction and channel authorization filtering.
- **Fix Implemented:** Extracted `getAuthSession()` in `src/app/api/realtime/stream/route.ts`, filtered requested channels to only public (`general`, `system`) unless user holds a valid staff role.
- **Regression Test:** `scripts/full-enterprise-audit-suite.ts` (Section 4)
- **Status:** **FIXED & VERIFIED**

---

### BUG-02: Double-Booking Check-Then-Act Race Condition
- **ID:** BUG-02
- **Severity:** **CRITICAL**
- **Category:** Concurrency / Business Logic
- **Affected Function:** `BookingService.create()` in `src/server/services/booking.service.ts`
- **Steps to Reproduce:**
  1. Set event date to have 3 existing bookings (capacity = 4).
  2. Launch 20 concurrent booking checkout submissions simultaneously for that date.
- **Expected Result:** Exactly 1 booking succeeds; 19 fail safely.
- **Actual Result (Before Fix):** Availability check ran *outside* the transaction in `Promise.all()`. Multiple concurrent requests read `count = 3` before any wrote, causing 5+ bookings on a 4-capacity date.
- **Root Cause:** Non-atomic check-then-act pattern.
- **Fix Implemented:** Added an atomic active booking re-check directly inside the `prisma.$transaction` block. If `activeBookingsCount >= MAX_CONCURRENT_DAILY_EVENTS`, the transaction throws and rolls back.
- **Regression Test:** `scripts/full-enterprise-audit-suite.ts` (Section 8)
- **Status:** **FIXED & VERIFIED**

---

### BUG-03: Hardcoded Secret Keys Fallbacks in Source Code
- **ID:** BUG-03
- **Severity:** **HIGH**
- **Category:** Secrets Management / Security
- **Affected Files:** `src/lib/payments/safepay.ts`, `src/lib/auth.ts`, `src/middleware.ts`
- **Steps to Reproduce:**
  1. Inspect source files when environment variables are omitted.
- **Expected Result:** Application warns or fails safely without fallback to known hardcoded secrets.
- **Actual Result (Before Fix):** Code fell back to hardcoded strings like `"sec_8f267889..."` and `"dev-super-secret-key..."`.
- **Root Cause:** Developer convenience defaults left in production files.
- **Fix Implemented:** Replaced fallbacks with empty strings and loud startup warnings. Removed `docs/vercel.env` from Git tracking.
- **Status:** **FIXED & VERIFIED**

---

### BUG-04: Malicious SVG Upload Stored XSS Vulnerability
- **ID:** BUG-04
- **Severity:** **HIGH**
- **Category:** Cross-Site Scripting (XSS) / File Upload
- **Affected Function:** `uploadToSupabaseStorage()` in `src/lib/storage.ts`
- **Steps to Reproduce:**
  1. Upload an SVG file containing `<script>alert(1)</script>` or `onload=`.
- **Expected Result:** Executable scripts in SVG files rejected.
- **Actual Result (Before Fix):** MIME type `image/svg+xml` was permitted without inspecting buffer contents.
- **Root Cause:** Lack of SVG content sanitization before storage upload.
- **Fix Implemented:** Added binary buffer string inspection in `storage.ts` searching for `<script`, `javascript:`, `onload=`, `onerror=`, `onclick=`, `<iframe>`, `<object>`, and `<embed>`.
- **Regression Test:** `scripts/full-enterprise-audit-suite.ts` (Section 7)
- **Status:** **FIXED & VERIFIED**

---

### BUG-05: Missing Content-Security-Policy (CSP) Header
- **ID:** BUG-05
- **Severity:** **MEDIUM**
- **Category:** Security Headers
- **Affected File:** `next.config.mjs`
- **Steps to Reproduce:**
  1. Inspect HTTP response headers on production routes.
- **Expected Result:** `Content-Security-Policy` header present restricting script and frame origins.
- **Actual Result (Before Fix):** CSP header was absent.
- **Root Cause:** `next.config.mjs` had HSTS, X-Frame-Options, and X-Content-Type-Options but lacked CSP.
- **Fix Implemented:** Added comprehensive CSP allowing Safepay (`*.getsafepay.com`), Supabase (`*.supabase.co`), Google Fonts, and Unsplash.
- **Status:** **FIXED & VERIFIED**

---

### BUG-06: Next.js 15 Async `cookies()` Breaking Change
- **ID:** BUG-06
- **Severity:** **HIGH**
- **Category:** Framework Compatibility
- **Affected File:** `src/lib/auth.ts` (`getAuthSession()`)
- **Steps to Reproduce:**
  1. Run `npm run typecheck` after upgrading to Next.js 15.5.24.
- **Expected Result:** TypeScript compiles with 0 errors.
- **Actual Result (Before Fix):** `TS2339: Property 'get' does not exist on type 'Promise<ReadonlyRequestCookies>'`.
- **Root Cause:** Next.js 15 made `cookies()` an asynchronous function returning a Promise.
- **Fix Implemented:** Updated to `const cookieStore = await cookies();`.
- **Status:** **FIXED & VERIFIED**
