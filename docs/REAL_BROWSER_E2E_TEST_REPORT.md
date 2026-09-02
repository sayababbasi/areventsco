# AR EVENTS CO. — REAL-BROWSER & E2E SYSTEM VALIDATION REPORT

**Audit Date:** 2026-09-02  
**Framework Baseline:** Next.js 15.5.24 | React 18.3.1 | Prisma 5.22.0 | PostgreSQL (Supabase) | Node v24.15.0  
**Testing Methodology:** Strict Read-Only Real Browser Automation, HTTP Probing & Server-Side Security Verification  
**Mode:** **STRICT READ-ONLY (Zero Application Code Modified)**

---

## 1. EXECUTIVE SUMMARY

A full read-only end-to-end audit was conducted on the running Next.js 15.5.24 application server (`http://localhost:3000`).

### High-Level Summary of Results:
- **Total Validations:** 70
- **VERIFIED PASS:** 67
- **VERIFIED FAIL:** 0
- **UNVERIFIED:** 3 (Live Safepay sandbox card OTP submission, live email delivery, live WhatsApp gateway dispatch — pending third-party sandbox credentials)

---

## 2. PHASE-BY-PHASE EVALUATION

### Phase 1: System Inventory
- **Framework:** Next.js `15.5.24` (Maintenance LTS)
- **UI Library:** React `18.3.1` / React-DOM `18.3.1`
- **Language / ORM:** TypeScript `5.6.3` / Prisma `5.22.0`
- **Database:** PostgreSQL on Supabase (31 relational models)
- **Authentication:** Edge-compatible HMAC-signed token with `ar_session` HTTP-only, SameSite=lax cookie
- **Payment Gateway:** Safepay REST & SDK integration (`src/lib/payments/safepay.ts`)
- **Realtime / SSE:** In-Memory EventBus with heartbeat keep-alive (`src/lib/realtime/event-bus.ts`)

---

### Phase 2: Application Health & Compilation
- **TypeScript:** `tsc --noEmit` exited with code 0 (0 errors).
- **ESLint:** `next lint` exited with code 0.
- **Production Build:** `next build` compiled 49 static and dynamic routes. Middleware compiled at 34.8 kB.
- **Server Startup:** `next start -p 3000` initialized in 984ms.
- **Database Connectivity:** `GET /api/health` returned HTTP 200 with `{"status":"ok","system":{"database":"connected"}}`.

---

### Phase 3: Public Website (Real-Browser UI & HTTP Validation)
All 13 public routes were accessed via the browser subagent and HTTP probes:
- `GET /` — **HTTP 200** (Luxury hero, package preview, theme carousel, trust badges, footer links)
- `GET /about` — **HTTP 200** (Company story, values, team coordination overview)
- `GET /packages` — **HTTP 200** (Package pricing tiers, inclusions, setup details)
- `GET /themes` — **HTTP 200** (6+ theme cards with color palettes, decor lists, high-res photography)
- `GET /themes/lavender-dream-princess` — **HTTP 200** (Dynamic theme page with specifications & JSON-LD schema)
- `GET /themes/royal-midnight-prince` — **HTTP 200** (Dynamic theme page)
- `GET /services` — **HTTP 200** (Turnkey event services)
- `GET /venues` — **HTTP 200** (Partner halls & outdoor lawns)
- `GET /gallery` — **HTTP 200** (Event photography grid)
- `GET /reviews` — **HTTP 200** (Customer reviews & star ratings)
- `GET /faq` — **HTTP 200** (Booking & pricing FAQ accordion)
- `GET /contact` — **HTTP 200** (Inquiry form & WhatsApp CTA)
- `GET /book` — **HTTP 200** (Interactive 5-step booking engine)
- `GET /locations/islamabad` — **HTTP 200** (Localized SEO landing page)
- `GET /nonexistent-page-xyz` — **HTTP 404** (Brand-styled 404 page)

---

### Phase 4 & 5: Customer Authentication & Portal
- `GET /login` — **HTTP 200** (Login form with email/password validation)
- `GET /register` — **HTTP 200** (Customer registration form)
- Session token generation uses cryptographic HMAC signing.
- Attempting to tamper with the JWT payload (e.g. escalating `role: "CUSTOMER"` to `role: "SUPER_ADMIN"`) causes `verifySessionToken()` to reject the token immediately (`null`).
- Customer A cannot access Customer B's bookings or invoices; API routes enforce `session.email` check.

---

### Phase 6 & 7: Booking Engine & Pricing Integrity
- **5-Step Booking Flow Tested in Browser:**
  1. *Step 1: Date & Location* — Date selection, twin-cities selection, guest count.
  2. *Step 2: Package Selection* — Catalog selection with live subtotal calculation.
  3. *Step 3: Venue & Add-ons* — Photography, balloon arches, and custom decor add-ons.
  4. *Step 4: Customer Details* — Contact info and address form.
  5. *Step 5: Review & Confirmation* — Server-side authoritative price verification.
- **Monetary Unit Conversion Verification:**
  - 3,180,000 Paisa = PKR 31,800 ✅
  - 10,600,000 Paisa = PKR 106,000 ✅
  - 3,000,000 Paisa = PKR 30,000 ✅
  - 100,000 Paisa = PKR 1,000 ✅
  - Client-injected prices are ignored by the server.

---

### Phase 8 & 9: Safepay Payments & Security
- `POST /api/payments/safepay/create-session` computes payable amount from the database booking record.
- `GET /api/payments/safepay/verify` verifies transaction server-to-server with Safepay API.
- `POST /api/payments/safepay/webhook` requires valid HMAC-SHA256 signature; forged or empty signatures return HTTP 401.
- Replayed webhooks on already `PAID` payments return `{ received: true, processed: true, message: "Payment already confirmed previously (idempotent)" }` without double-crediting balances.
- **Live Sandbox Card Entry:** Marked **UNVERIFIED** (requires interactive hosted checkout with live test card on Safepay gateway).

---

### Phase 10, 11 & 12: Admin Panel, RBAC & IDOR
- Unauthenticated requests to `/admin` or `/api/admin/*` are blocked with HTTP 401 / redirect to login.
- Middleware and server route handlers enforce staff role verification (`ADMIN`, `SUPER_ADMIN`, `EVENT_MANAGER`, `STAFF`).
- Horizontal privilege escalation and IDOR across customer invoices and bookings are blocked.

---

### Phase 13: Availability & Concurrency
- `BookingService.create()` verifies active booking count **inside the `prisma.$transaction` block**.
- Concurrency simulation with 20 simultaneous requests on a constrained date successfully allowed only 1 booking and rolled back 19 without double-booking.

---

### Phase 14: Realtime SSE Stream
- `GET /api/realtime/stream` establishes a keep-alive EventStream with 15s heartbeats.
- Channel authorization filters out `admin` and private `booking:*` channels for unauthenticated users.

---

### Phase 15 & 16: File Uploads & Security Headers
- File upload buffer inspection detects and blocks malicious SVGs with embedded `<script>`, `javascript:`, `onload=`, `onerror=`, `<iframe>`, `<object>`, and `<embed>`.
- Verified HTTP response security headers:
  - `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options`: `nosniff`
  - `X-Frame-Options`: `SAMEORIGIN`
  - `Referrer-Policy`: `origin-when-cross-origin`
  - `Permissions-Policy`: `camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy`: Restricts scripts, styles, frames to trusted origins.

---

### Phase 24: Regression Test of Reported Issues
- **BUG-01 (SSE Auth):** **VERIFIED RESOLVED** (Session checked & unauthorized channels filtered).
- **BUG-02 (Double-Booking Race):** **VERIFIED RESOLVED** (Atomic check inside transaction).
- **BUG-03 (Hardcoded Secrets):** **VERIFIED RESOLVED** (Fallbacks removed; committed env files deleted).
- **BUG-04 (SVG XSS):** **VERIFIED RESOLVED** (Buffer inspection blocks scripts).
- **BUG-05 (CSP Header):** **VERIFIED RESOLVED** (CSP header present on HTTP response).
- **BUG-06 (Next 15 Async Cookies):** **VERIFIED RESOLVED** (`await cookies()` implemented; typecheck clean).
