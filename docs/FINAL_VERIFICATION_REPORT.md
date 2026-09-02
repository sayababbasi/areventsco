# FINAL INDEPENDENT VERIFICATION REPORT

**Date:** 2026-09-02
**Auditor:** Independent verification pass (not trusting previous audit)
**Application:** AR Events Co. (areventsco@0.1.0)

---

## FINAL VERDICT: NOT PRODUCTION READY — 5 CRITICAL/HIGH ISSUES REMAIN

---

## 1. Next.js Version

| Item | Value |
|---|---|
| **Current Version** | 14.2.13 |
| **Support Status** | **UNSUPPORTED / END-OF-LIFE** (EOL: Oct 26, 2025) |
| **Known Vulnerabilities** | CVE-2025-29927 (CRITICAL), SSRF, Race Conditions, Middleware Bypasses |
| **Latest Patched 14.x** | 14.2.35 |
| **Recommended Upgrade** | 14.2.35 immediately, then 15.x LTS |
| **RESULT** | **FAIL** |

**Evidence:** `package.json:26` reads `"next": "14.2.13"`. CVE-2025-29927 allows complete middleware bypass via `x-middleware-subrequest` header. This application relies ENTIRELY on middleware for auth (`src/middleware.ts:70-92`). An attacker can access all admin APIs without authentication.

See: `/docs/NEXTJS_SECURITY_DECISION.md`

---

## 2. Rate Limiting Architecture

| Item | Value |
|---|---|
| **Implementation** | In-memory `Map` in `src/lib/rate-limit.ts` |
| **Deployment Target** | Vercel Serverless (per `vercel.env` and `.vercel` in `.gitignore`) |
| **Global Reliability** | **NOT RELIABLE** |
| **RESULT** | **FAIL** |

**Evidence:** Vercel deploys each API route as an independent serverless function instance. Multiple concurrent instances do NOT share memory. An attacker sending requests to different instances completely bypasses the in-memory rate limiter.

**Additional Gaps Found:**
- `/api/auth/register` — NO rate limiting (file: `src/app/api/auth/register/route.ts`)
- `/api/inquiries` — NO rate limiting (file: `src/app/api/inquiries/route.ts`, public contact form, spam target)
- `/api/payments/safepay/create-session` — NO rate limiting (payment session flooding)
- `/api/payments/safepay/verify` — NO rate limiting (verification abuse)
- `/api/pricing/calculate` — NO rate limiting (computational abuse)

**Recommendation:** Implement Redis-based (Upstash) distributed rate limiting, or add Vercel Edge Middleware rate limiting. Keep in-memory as a first-layer defense.

---

## 3. Double-Booking Concurrency

| Item | Value |
|---|---|
| **Protection Mechanism** | `AvailabilityService.checkAvailability()` at checkout time |
| **Database Constraint** | **NONE** — no unique index prevents same-date overbooking |
| **Transaction Isolation** | Default (READ COMMITTED on PgBouncer) |
| **RESULT** | **FAIL — RACE CONDITION EXISTS** |

**Evidence:**

File: `src/server/services/availability.service.ts:45-55`
```
const activeBookingsCount = await prisma.booking.count({
  where: { eventDate: { gte: startOfDay, lte: endOfDay },
           status: { in: ["PENDING","QUOTED","CONFIRMED","PREPARING"] } }
});
if (activeBookingsCount >= MAX_CONCURRENT_DAILY_EVENTS) { ... }
```

This is a classic **check-then-act** race condition. Two concurrent requests can both read `count=3` (under limit of 4), then both proceed to create a booking, resulting in 5 bookings for a 4-capacity day. There is:
- No `SELECT ... FOR UPDATE`
- No serializable transaction isolation
- No unique composite index on `(eventDate, status)` with a count constraint
- No database-level advisory lock

The availability check in `createPaymentSession` (line 124) has the same problem — it's a non-atomic read.

File: `src/server/services/booking.service.ts:95` — the `$transaction` wrapping booking creation does NOT include the availability check inside the same serializable transaction.

**To fix this properly:** Use a database advisory lock or add `AvailabilitySlot.bookedEventsCount` with an atomic `UPDATE ... SET bookedEventsCount = bookedEventsCount + 1 WHERE bookedEventsCount < maxConcurrentEvents` inside the booking creation transaction.

---

## 4. Payment Amount Integrity

| Item | Value |
|---|---|
| **Server-Side Calculation** | YES — `PricingService.calculate()` derives from DB |
| **Client Amount Trusted** | NO — `createPaymentSession` ignores client amounts |
| **Webhook Amount Verification** | YES — `processWebhook` line 383-405 checks amount mismatch |
| **RESULT** | **PASS** |

**Evidence:**

File: `src/lib/payments/payment-service.ts:82-118`
- `totalMinor` is read from `booking.totalAmountMinor` (database)
- `depositRequiredMinor` is derived from `booking.depositRequiredMinor` or 30% calculation
- `payableMinor` is computed entirely server-side
- Client request body (`create-session/route.ts:7`) only provides `bookingReference` and `paymentType` — no amount field accepted

File: `src/lib/payments/payment-service.ts:383-404`
- Webhook amount reconciliation: `Math.abs(receivedPkr - expectedPkr) > 0.01` triggers FAIL

---

## 5. Safepay Amount Unit Conversion

| Item | Value |
|---|---|
| **DB Storage** | Minor units (Paisa). PKR 31,800 = 3,180,000 |
| **Safepay API Expectation** | Standard PKR (Rupees). PKR 31,800 = 31800 |
| **Conversion Function** | `toSafepayAmount()`: `amountMinor / 100` |
| **RESULT** | **PASS** |

**Evidence:**

File: `src/lib/payments/currency.ts:20-25`
```js
export function toSafepayAmount(amountMinor: number): number {
  return Math.round(amountMinor) / 100;
}
```
- 3,180,000 / 100 = 31,800 ✅
- 10,600,000 / 100 = 106,000 ✅

File: `src/lib/payments/safepay.ts:40-44`
```js
const amountInPkr = toSafepayAmount(amountMinor);
const payment = await client.payments.create({ amount: amountInPkr, currency });
```
The conversion is correctly applied before calling Safepay API.

---

## 6. Payment Provider Reference Type

| Item | Value |
|---|---|
| **Schema Type** | `String?` (`providerRef String?`, `providerToken String? @unique`) |
| **Normalization** | `normalizeSafepayRef()` handles number, string, object, bigint |
| **RESULT** | **PASS** |

**Evidence:**

File: `src/lib/payments/payment-service.ts:16-31` — `normalizeSafepayRef()` converts any type to `string | null`.

File: `prisma/schema.prisma:327-328`
```
providerRef     String?
providerToken   String?          @unique
```

---

## 7. Webhook Idempotency

| Item | Value |
|---|---|
| **Database Constraint** | `@unique` on `providerToken` (schema.prisma:328) |
| **Application Check** | Status check before processing (payment-service.ts:363) |
| **Concurrent Duplicate Protection** | **PARTIAL** — application-level only, no `SELECT FOR UPDATE` |
| **RESULT** | **CONDITIONAL PASS** |

**Evidence:**

The `@unique` constraint prevents creating two Payment records with the same `providerToken`. However, the `processWebhook` method does NOT use a serializable transaction or row-level lock when checking `payment.status === "PAID"`. Two concurrent identical webhooks hitting different serverless instances could both read `status = "PENDING"` and both proceed to `applySuccessfulPayment`. While the `$transaction` inside `applySuccessfulPayment` re-sums all PAID payments to calculate totals (avoiding double-counting of amounts), the `payment.update` to set `status = "PAID"` could execute twice without error.

**Impact:** The financial ledger totals remain correct due to the re-summation approach. But two identical `InvoiceAuditLog` entries and two identical realtime broadcasts would be created.

---

## 8. Payment State Machine

| Item | Value |
|---|---|
| **Formal State Machine** | **NO** — transitions are ad-hoc conditional checks |
| **Invalid Transitions Blocked** | **PARTIALLY** |
| **RESULT** | **FAIL** |

**Evidence:**

There is no explicit state machine that rejects invalid transitions. In `processWebhook` (line 363), `PAID → PAID` is handled (idempotent). But there is no guard preventing:
- A webhook setting a `CANCELLED` payment back to `PAID` if `trackerState === "TRACKER_ENDED"`
- The `verifyAndSyncTracker` method can transition `FAILED → PAID` if the Safepay tracker returns `TRACKER_ENDED` (line 586)

File: `src/lib/payments/payment-service.ts:580-596` — no check against `payment.status === "FAILED"` before applying success.

---

## 9. Payment + Invoice Atomicity

| Item | Value |
|---|---|
| **Prisma Transaction** | YES — `$transaction` in `applySuccessfulPayment` (line 649) |
| **Rollback on Failure** | YES — Prisma `$transaction` auto-rolls back on any throw |
| **RESULT** | **PASS** |

**Evidence:** File: `src/lib/payments/payment-service.ts:649-753` wraps Payment update, Booking update, and all Invoice updates in a single `prisma.$transaction`. If any step fails, all changes roll back.

---

## 10. Partial Payment

| Item | Value |
|---|---|
| **Logic** | Correct — server calculates `payableMinor` from DB state |
| **Over-payment Prevention** | YES — `payableMinor <= 0` returns error (line 113) |
| **RESULT** | **PASS** |

---

## 11. Double Payment Attack

| Item | Value |
|---|---|
| **Multiple Session Creation** | **ALLOWED** — no guard against creating 20 concurrent PENDING payments |
| **Financial Impact** | Limited — each session creates a separate Safepay tracker; only webhooks for completed payments update ledger |
| **RESULT** | **CONDITIONAL PASS** (stale PENDING records accumulate but no financial loss) |

---

## 12. Customer IDOR

| Item | Value |
|---|---|
| **Bookings API** | Protected — email-based filtering (`bookings/route.ts:72-78`) |
| **Invoice PDF** | Protected — email match or admin role (`invoices/[id]/pdf/route.ts:25-33`) |
| **Payment Verify** | **NOT PROTECTED** — `/api/payments/safepay/verify?token=XXX` has NO auth check |
| **Booking Reference Page** | **NOT PROTECTED** — `/booking/[reference]` has no auth check; reference is guessable |
| **RESULT** | **FAIL** |

**Evidence:**

File: `src/app/api/payments/safepay/verify/route.ts:6-24` — the GET handler accepts any `token` parameter with zero authentication. Anyone who guesses or intercepts a tracker token can query payment status, which returns payment details including booking reference.

File: `src/app/api/bookings/[reference]/payment-status/route.ts` — likely no auth (booking reference is in the URL).

---

## 13. Admin RBAC

| Item | Value |
|---|---|
| **Middleware Protection** | YES — `src/middleware.ts:66-92` |
| **CVE-2025-29927 Bypass** | **YES — ALL admin routes bypassable** |
| **RESULT** | **FAIL** (due to Next.js CVE) |

---

## 14. PDF Security

| Item | Value |
|---|---|
| **Authorization** | YES — email match + admin role check (`invoices/[id]/pdf/route.ts:25-33`) |
| **Booking Token Bypass** | **YES** — `?token=BOOKING_REFERENCE` grants access (line 31) |
| **RESULT** | **CONDITIONAL PASS** |

**Evidence:** The `isBookingTokenValid` check (line 31) uses the booking reference as a bearer token. If an attacker knows the booking reference format (`AR-2026-XXXX`), they could brute-force this.

---

## 15. Cache / Cross-Customer Data Leak

| Item | Value |
|---|---|
| **Dynamic Routes** | Most API routes use `dynamic = "force-dynamic"` |
| **Static Customer Data** | No customer/financial data is statically rendered |
| **CDN Caching** | Invoice PDF has `Cache-Control: private, no-cache` |
| **RESULT** | **PASS** |

---

## 16. Realtime Security

| Item | Value |
|---|---|
| **SSE Authentication** | **NONE** — `/api/realtime/stream` has NO auth check |
| **Channel Authorization** | **NONE** — any user can subscribe to any channel via `?channel=admin` |
| **RESULT** | **FAIL** |

**Evidence:**

File: `src/app/api/realtime/stream/route.ts:7-10`
```js
export async function GET(req: NextRequest) {
  const channelsParam = searchParams.get("channel") || "general";
  const channels = channelsParam.split(",").map(c => c.trim());
```

No session/token validation. Any anonymous user can:
1. Connect to `?channel=admin` and receive ALL admin events
2. Connect to `?channel=booking:AR-2026-XXXX` and receive another customer's payment events
3. See booking references, payment amounts, status changes of any customer

---

## 17. Secret Scan

| Item | Value |
|---|---|
| **Secrets in Git History** | **YES — CRITICAL** |
| **RESULT** | **FAIL** |

**Exposed secrets in commit `88d4628` (files: `docs/VERCEL_ENV.env`, `docs/vercel.env`):**

| Secret Type | Status |
|---|---|
| DATABASE_URL (PostgreSQL credentials) | **EXPOSED IN GIT HISTORY** |
| DIRECT_URL (PostgreSQL credentials) | **EXPOSED IN GIT HISTORY** |
| AUTH_SECRET (JWT signing key) | **EXPOSED IN GIT HISTORY** |
| SUPABASE_SERVICE_ROLE_KEY (admin access) | **EXPOSED IN GIT HISTORY** |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | EXPOSED (low risk — public key) |

**Additionally, hardcoded in source code:**

File: `src/lib/payments/safepay.ts:8-9`
```js
const SAFEPAY_API_KEY = process.env.SAFEPAY_API_KEY || "sec_8f267889-...";
const SAFEPAY_SECRET_KEY = process.env.SAFEPAY_SECRET_KEY || "fb0f4a6c5517e05c...";
```
These are sandbox keys hardcoded as fallbacks. While less critical (sandbox), they are still exposed in the public repository.

File: `src/middleware.ts:4` and `src/lib/auth.ts:5`
```js
const AUTH_SECRET = process.env.AUTH_SECRET || "dev-super-secret-key-areventsco-secure-12345";
```
Hardcoded fallback JWT secret in source code.

**All production secrets must be rotated immediately.**

---

## 18. Input Validation

| Item | Value |
|---|---|
| **Booking Creation** | Zod validation via `bookingCreateSchema` |
| **Pricing Calculation** | Zod validation via `priceCalculationSchema` |
| **Login** | Basic null checks only |
| **Registration** | Basic null checks only |
| **Inquiry** | Basic null checks only — no email validation, no sanitization |
| **RESULT** | **CONDITIONAL PASS** |

---

## 19. File Upload Security

| Item | Value |
|---|---|
| **MIME Validation** | YES — allowlist in `storage.ts:15-22` |
| **Size Limit** | YES — 5MB |
| **Path Sanitization** | YES — regex strip (`storage.ts:62`) |
| **SVG with Script** | **ALLOWED** — `image/svg+xml` is in the allowlist |
| **RESULT** | **CONDITIONAL PASS** (SVG XSS risk) |

---

## 20. Security Headers

| Item | Value |
|---|---|
| **HSTS** | YES (`next.config.mjs:36-38`) |
| **X-Content-Type-Options** | YES (`nosniff`) |
| **X-Frame-Options** | YES (`SAMEORIGIN`) |
| **Referrer-Policy** | YES (`origin-when-cross-origin`) |
| **Permissions-Policy** | YES |
| **CSP** | **MISSING** |
| **RESULT** | **CONDITIONAL PASS** (no CSP) |

---

## 21. Error Leak

| Item | Value |
|---|---|
| **Prisma Errors** | Some routes return `(error as Error).message` which MAY leak Prisma details |
| **Registration** | Returns raw error message: `route.ts:77` |
| **Booking Creation** | Returns raw error message: `route.ts:52` |
| **RESULT** | **CONDITIONAL PASS** |

---

## 22. Dependency Audit

| Item | Value |
|---|---|
| **npm audit** | Multiple HIGH and MODERATE vulnerabilities |
| **axios (via @sfpy/node-sdk)** | 8+ vulnerabilities including CSRF, SSRF, Prototype Pollution (no fix available — SDK uses old axios) |
| **glob (via @next/eslint-plugin-next)** | HIGH (dev dependency) |
| **RESULT** | **FAIL** (runtime dependency `@sfpy/node-sdk` bundles vulnerable `axios`) |

---

## 23. Production Build

| Item | Value |
|---|---|
| **TypeScript Check** | PASS (exit code 0) |
| **Production Build** | PASS (52 static pages, all routes compiled) |
| **RESULT** | **PASS** (build only — does not prove security) |

---

## BLOCKING ISSUES SUMMARY

| # | Severity | Issue | File/Evidence |
|---|---|---|---|
| 1 | **CRITICAL** | CVE-2025-29927: Middleware auth bypass via `x-middleware-subrequest` header | `src/middleware.ts`, Next.js 14.2.13 |
| 2 | **CRITICAL** | Production secrets (DATABASE_URL, AUTH_SECRET, SUPABASE_SERVICE_ROLE_KEY) committed to public Git history | Commit `88d4628`, files `docs/VERCEL_ENV.env`, `docs/vercel.env` |
| 3 | **HIGH** | SSE realtime stream has NO authentication — anyone can subscribe to admin/customer channels | `src/app/api/realtime/stream/route.ts:7-10` |
| 4 | **HIGH** | Double-booking race condition — availability check is non-atomic check-then-act | `src/server/services/availability.service.ts:45-55` |
| 5 | **HIGH** | Safepay API/Secret keys hardcoded as fallbacks in source code | `src/lib/payments/safepay.ts:8-9`, `src/lib/auth.ts:5` |

---

## REMEDIATION PRIORITY

1. **IMMEDIATE (today):** Rotate ALL production secrets (DB password, AUTH_SECRET, Supabase service role key, Safepay keys). The Git history has permanently exposed them.
2. **IMMEDIATE:** Upgrade Next.js from 14.2.13 to 14.2.35 to patch CVE-2025-29927.
3. **IMMEDIATE:** Add authentication to `/api/realtime/stream` — verify session before allowing SSE subscription, enforce channel authorization.
4. **THIS WEEK:** Fix double-booking race condition with atomic database constraint.
5. **THIS WEEK:** Remove all hardcoded secret fallbacks from source code. If env var is missing, the application should fail to start, not fall back to a known value.

---

**SECURITY STATUS: NOT PRODUCTION READY**

| Category | Status |
|---|---|
| **CRITICAL** | **2 issues** |
| **HIGH** | **3 issues** |
| **MEDIUM** | 4 issues (rate limiting, state machine, SVG uploads, missing CSP) |
| **LOW** | 2 issues (error message leakage, stale PENDING payments) |
| **NEXT.JS** | 14.2.13 → must upgrade to 14.2.35 minimum |
| **PAYMENTS** | CONDITIONAL PASS |
| **BOOKINGS** | FAIL (race condition) |
| **INVOICES** | PASS |
| **AUTH/RBAC** | FAIL (CVE bypass) |
| **REALTIME** | FAIL (no auth) |
| **DATABASE** | CONDITIONAL PASS |
| **PRODUCTION BUILD** | PASS |
