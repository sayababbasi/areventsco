# BUG FIX REPORT
**Date:** 2026-09-02

## 1. Missing API Rate Limiting

**Vulnerability Type:** Abuse / Denial of Service / Brute Force
**Severity:** LOW

**Description:**
The `/api/auth/login` and `/api/bookings` endpoints lacked explicit rate-limiting middleware, allowing potential brute-forcing of credentials and spamming of the booking system.

**Remediation:**
- Created `src/lib/rate-limit.ts` providing an in-memory sliding window rate limiter (`Map`-based with cleanup interval).
- Applied a limit of **5 requests per 15 minutes** per IP to `/api/auth/login`.
- Applied a limit of **3 requests per 10 minutes** per IP to `/api/bookings`.

**Verification:**
The endpoints successfully return `HTTP 429 Too Many Requests` when limits are exceeded.

## 2. Regression Fixes Verified

The following vulnerabilities from previous audits were regression-tested and verified as effectively resolved:

1. **Safepay Webhook Idempotency:** The database natively rejects duplicate webhook IDs via the `@unique` constraint on `providerToken`, resolving duplicate payment tracking.
2. **Double Booking Race Condition:** An explicit availability check locks the requested date during the gateway initialization (`createPaymentSession`), preventing checkout completion if max capacity is exceeded.
3. **Admin API Unauthorized Access:** Middleware strictly validates the `ar_session` JWT role payload against `ADMIN`, `SUPER_ADMIN`, `EVENT_MANAGER`, and `STAFF`.
4. **Public Booking PII Exposure:** Unprivileged users hitting `/api/bookings` are strictly constrained via Prisma queries to only see records matching their own email address.
5. **Invoice PDF IDOR:** PDF streaming in `/api/invoices/[id]/pdf/route.ts` verifies that the requester owns the invoice email or holds an admin role.
