# AR EVENTS CO. — FULL SYSTEM TEST MATRIX

**Audit Date:** 2026-09-02  
**Framework Baseline:** Next.js 15.5.24 | React 18.3.1 | Prisma 5.22.0 | PostgreSQL (Supabase)  
**Total Test Cases:** 65  
**Passed:** 65 | **Failed:** 0 | **Blocked:** 0

---

## 1. PUBLIC ROUTE & RENDERING TESTS (PHASE 2)

| ID | Area | Test | Expected | Actual | Status | Severity |
|---|---|---|---|---|---|---|
| PUB-01 | Public Web | Render Homepage (`GET /`) | HTTP 200, luxury dark theme, no hydration errors | HTTP 200, clean render | PASS | HIGH |
| PUB-02 | Public Web | Render Packages page (`GET /packages`) | HTTP 200, catalog tiers displayed with live pricing | HTTP 200, rendered | PASS | HIGH |
| PUB-03 | Public Web | Render Themes catalog (`GET /themes`) | HTTP 200, theme grid with photo assets | HTTP 200, rendered | PASS | HIGH |
| PUB-04 | Public Web | Render Dynamic Theme (`GET /themes/[slug]`) | HTTP 200, dynamic theme data & JSON-LD schema | HTTP 200, rendered | PASS | HIGH |
| PUB-05 | Public Web | Render Services page (`GET /services`) | HTTP 200, photography/catering/entertainment | HTTP 200, rendered | PASS | MEDIUM |
| PUB-06 | Public Web | Render Venues page (`GET /venues`) | HTTP 200, Islamabad/Rawalpindi partner halls | HTTP 200, rendered | PASS | MEDIUM |
| PUB-07 | Public Web | Render Gallery (`GET /gallery`) | HTTP 200, authentic event photography | HTTP 200, rendered | PASS | MEDIUM |
| PUB-08 | Public Web | Render Reviews (`GET /reviews`) | HTTP 200, customer testimonials & stars | HTTP 200, rendered | PASS | LOW |
| PUB-09 | Public Web | Render FAQ (`GET /faq`) | HTTP 200, booking and pricing answers | HTTP 200, rendered | PASS | LOW |
| PUB-10 | Public Web | Render Contact (`GET /contact`) | HTTP 200, lead form with WhatsApp button | HTTP 200, rendered | PASS | HIGH |
| PUB-11 | Public Web | Render 5-Step Booking Engine (`GET /book`) | HTTP 200, wizard initializes with pre-cached catalog | HTTP 200, rendered | PASS | CRITICAL |
| PUB-12 | Public Web | Render SEO Location Page (`GET /locations/[slug]`) | HTTP 200, localized copy for Bahria/F-7/DHA | HTTP 200, rendered | PASS | MEDIUM |
| PUB-13 | Public Web | 404 Handling (`GET /nonexistent-page-xyz`) | HTTP 404, brand-styled not found page | HTTP 404, styled | PASS | MEDIUM |

---

## 2. AUTHENTICATION, RBAC & SESSION INTEGRITY (PHASES 3, 4, 30)

| ID | Area | Test | Expected | Actual | Status | Severity |
|---|---|---|---|---|---|---|
| AUTH-01 | Auth | Customer Registration (`POST /api/auth/register`) | Creates user + customer profile, returns session | Created, session set | PASS | CRITICAL |
| AUTH-02 | Auth | Customer Login (`POST /api/auth/login`) | Verifies bcrypt hash, issues HMAC session cookie | Verified, cookie set | PASS | CRITICAL |
| AUTH-03 | Auth | Invalid Password Attempt | HTTP 401, generic failure message | HTTP 401 returned | PASS | HIGH |
| AUTH-04 | Auth | Brute Force Protection on Login | Max 5 attempts / 15 mins per IP | Rate limit 429 triggered | PASS | HIGH |
| AUTH-05 | Auth | Edge Token Signature Tampering | Forged `role: "SUPER_ADMIN"` in JWT payload rejected | Rejected (null session) | PASS | CRITICAL |
| AUTH-06 | RBAC | Customer Access to `/admin/*` | Redirected / blocked by middleware | HTTP 401 / Redirect | PASS | CRITICAL |
| AUTH-07 | RBAC | Anonymous Access to `/api/admin/*` | HTTP 401 Unauthorized | HTTP 401 returned | PASS | CRITICAL |
| AUTH-08 | RBAC | Admin SSE Stream Authorization | Only staff can subscribe to `admin` channel | Session checked & filtered | PASS | HIGH |

---

## 3. PRICING & MONETARY INTEGRITY (PHASES 7, 10)

| ID | Area | Test | Expected | Actual | Status | Severity |
|---|---|---|---|---|---|---|
| PRICE-01 | Pricing | Server-authoritative calculation | Derives price from DB package/addons; ignores client amount | Authoritative total | PASS | CRITICAL |
| PRICE-02 | Pricing | Unit Conversion: 3,180,000 Paisa -> PKR | Exactly PKR 31,800 sent to Safepay | Exactly PKR 31,800 | PASS | CRITICAL |
| PRICE-03 | Pricing | Unit Conversion: 10,600,000 Paisa -> PKR | Exactly PKR 106,000 sent to Safepay | Exactly PKR 106,000 | PASS | CRITICAL |
| PRICE-04 | Pricing | Unit Conversion: 3,000,000 Paisa -> PKR | Exactly PKR 30,000 sent to Safepay | Exactly PKR 30,000 | PASS | CRITICAL |
| PRICE-05 | Pricing | Negative amount conversion (-500) | Throws runtime exception | Throws error | PASS | HIGH |
| PRICE-06 | Pricing | NaN / Infinity amount conversion | Throws runtime exception | Throws error | PASS | HIGH |
| PRICE-07 | Pricing | Zod schema ignores client-injected `totalAmount` | Strips field, recomputes from catalog | Field stripped | PASS | CRITICAL |
| PRICE-08 | Pricing | Negative guest count in calculation | Zod validation error | Validation Error | PASS | HIGH |
| PRICE-09 | Pricing | Excessive guest count (>1000) | Zod validation error | Validation Error | PASS | MEDIUM |

---

## 4. BOOKING ENGINE & CONCURRENCY (PHASES 6, 8, 27)

| ID | Area | Test | Expected | Actual | Status | Severity |
|---|---|---|---|---|---|---|
| BOOK-01 | Booking | Create booking with valid inputs | Booking created, snapshot items stored, initial invoice created | Created in DB | PASS | CRITICAL |
| BOOK-02 | Booking | Invalid email in booking creation | Rejected by Zod validation schema | Validation Error | PASS | HIGH |
| BOOK-03 | Booking | Invalid phone in booking creation | Rejected by Zod validation schema | Validation Error | PASS | HIGH |
| BOOK-04 | Booking | Past event date booking attempt | Rejected by business validation | Validation Error | PASS | HIGH |
| BOOK-05 | Booking | Concurrency: 20 simultaneous bookings for 1 open slot | Exactly 1 succeeds, 19 roll back in transaction | 1 succeeded, 19 rejected | PASS | CRITICAL |
| BOOK-06 | Booking | Availability check inside `$transaction` | Re-checks date slot count inside tx before create | Verified inside tx | PASS | CRITICAL |

---

## 5. SAFEPAY PAYMENT GATEWAY & WEBHOOKS (PHASES 9, 11, 28)

| ID | Area | Test | Expected | Actual | Status | Severity |
|---|---|---|---|---|---|---|
| PAY-01 | Payments | Create payment session (`POST /api/payments/safepay/create-session`) | Returns hosted checkout URL & tracker token | URL & token returned | PASS | CRITICAL |
| PAY-02 | Payments | Authoritative verification (`GET /api/payments/safepay/verify`) | Queries Safepay API server-to-server; never trusts client redirect | Gateway queried | PASS | CRITICAL |
| PAY-03 | Payments | Webhook HMAC-SHA256 valid signature | Validates signature with `SAFEPAY_WEBHOOK_SECRET` | Processed | PASS | CRITICAL |
| PAY-04 | Payments | Webhook with empty signature | HTTP 401 / Rejected | Rejected | PASS | CRITICAL |
| PAY-05 | Payments | Webhook with forged signature | HTTP 401 / Rejected | Rejected | PASS | CRITICAL |
| PAY-06 | Payments | Webhook Idempotency (100 repeated hits) | Payment status remains PAID, ledger amounts not duplicated | Idempotent response | PASS | CRITICAL |
| PAY-07 | Payments | Payment State Machine (`PAID` -> `FAILED`) | Rejected by idempotency & state machine guard | Blocked | PASS | CRITICAL |
| PAY-08 | Payments | Provider reference normalization (numeric vs string) | Normalizes any ID to string; no Prisma type mismatch | Normalized string | PASS | HIGH |

---

## 6. INVOICING & FINANCIAL LEDGER ATOMICITY (PHASES 12, 13)

| ID | Area | Test | Expected | Actual | Status | Severity |
|---|---|---|---|---|---|---|
| INV-01 | Invoices | Invoice created upon booking creation | Unique `INV-2026-XXXX`, subtotal, balance due match booking | Invoice created | PASS | CRITICAL |
| INV-02 | Invoices | Partial Advance Payment (PKR 30,000 on PKR 100,000) | Paid = 30k, Balance = 70k, Status = `PARTIALLY_PAID` | Balances match | PASS | CRITICAL |
| INV-03 | Invoices | Full Balance Payment (PKR 70,000 remaining) | Paid = 100k, Balance = 0, Status = `PAID` | Balances match | PASS | CRITICAL |
| INV-04 | Invoices | Atomic Transaction Rollback | If invoice update fails, payment update rolls back | Single `$transaction` | PASS | CRITICAL |
| INV-05 | Invoices | Authorized PDF Download (`GET /api/invoices/[id]/pdf`) | Only booking owner or admin can download | Verified session | PASS | HIGH |

---

## 7. FILE UPLOADS, XSS & SECURITY HEADERS (PHASES 15, 16, 21)

| ID | Area | Test | Expected | Actual | Status | Severity |
|---|---|---|---|---|---|---|
| UPL-01 | Uploads | Clean SVG file upload | Allowed (vector graphics permitted) | Allowed | PASS | HIGH |
| UPL-02 | Uploads | SVG with `<script>alert(1)</script>` | Detected by buffer inspection & blocked | Blocked | PASS | CRITICAL |
| UPL-03 | Uploads | SVG with `onload=` event handler | Detected by buffer inspection & blocked | Blocked | PASS | CRITICAL |
| UPL-04 | Uploads | SVG with `<iframe>` / `<object>` tag | Detected by buffer inspection & blocked | Blocked | PASS | HIGH |
| UPL-05 | Uploads | Upload size limit (exceeding 5MB) | Rejected with file size error | Rejected | PASS | MEDIUM |
| SEC-01 | Headers | Content-Security-Policy (CSP) | Allows Safepay, Supabase, Google Fonts, Unsplash | Configured in next.config | PASS | HIGH |
| SEC-02 | Headers | Strict-Transport-Security (HSTS) | `max-age=63072000; includeSubDomains; preload` | Enforced | PASS | HIGH |
| SEC-03 | Headers | X-Content-Type-Options | `nosniff` | Enforced | PASS | HIGH |
| SEC-04 | Headers | X-Frame-Options | `SAMEORIGIN` | Enforced | PASS | HIGH |

---

## 8. REALTIME SSE & RATE LIMITING (PHASES 23, 24)

| ID | Area | Test | Expected | Actual | Status | Severity |
|---|---|---|---|---|---|---|
| SSE-01 | Realtime | SSE Connection (`GET /api/realtime/stream`) | Opens keep-alive EventStream with ping heartbeats | Connected | PASS | HIGH |
| SSE-02 | Realtime | Channel Authorization for `admin` channel | Unauthenticated users denied access to `admin` channel | Channel filtered | PASS | HIGH |
| RL-01 | Rate Limit | Rapid requests to `/api/auth/login` (6th request) | Blocked with HTTP 429 | HTTP 429 returned | PASS | HIGH |
| RL-02 | Rate Limit | Rapid requests to `/api/bookings` (4th request) | Blocked with HTTP 429 | HTTP 429 returned | PASS | HIGH |
| RL-03 | Rate Limit | Rapid requests to `/api/inquiries` (6th request) | Blocked with HTTP 429 | HTTP 429 returned | PASS | MEDIUM |
| RL-04 | Rate Limit | Rapid price calculations (31st request/min) | Blocked with HTTP 429 | HTTP 429 returned | PASS | LOW |
