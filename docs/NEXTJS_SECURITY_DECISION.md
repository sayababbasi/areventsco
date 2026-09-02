# Next.js Security Decision Record

## Current Version
**14.2.13** (confirmed from `package.json` line 26: `"next": "14.2.13"`)

## Supported Status
**UNSUPPORTED / END-OF-LIFE**

Next.js 14 reached official EOL on **October 26, 2025**. The final patched 14.x release is **14.2.35** (December 11, 2025). No further security patches are provided for 14.x.

## Known Vulnerabilities Affecting 14.2.13

| CVE / Advisory | Severity | Description | Patched In |
|---|---|---|---|
| CVE-2025-29927 | **CRITICAL** | Middleware authorization bypass via `x-middleware-subrequest` header injection. Attacker can bypass ALL middleware-based auth checks. | 14.2.25+ |
| SSRF / Open Redirect | HIGH | Request-controlled input in `rewrites()` / `redirects()` can redirect to malicious hostnames. | 14.2.24+ |
| Pages Router Race Condition | HIGH | Data leakage via race condition serving `pageProps` instead of HTML. | 14.2.24+ |
| CVE-2026-44575 / CVE-2026-44573 | HIGH | Additional middleware/proxy bypass vulnerabilities. | 15.x / 16.x only |

### CVE-2025-29927 Impact Assessment for THIS Application

**This vulnerability is directly exploitable against this application.**

The application relies ENTIRELY on middleware (`src/middleware.ts`) for admin route protection (lines 70-92) and dashboard route protection (lines 96-112). An attacker injecting `x-middleware-subrequest: middleware` header can bypass ALL authentication checks and access:
- `/api/admin/*` — full admin API access
- `/admin/*` — admin dashboard pages
- `/api/dashboard/*` — customer dashboard APIs

**This is a CRITICAL, exploitable vulnerability in the current deployment.**

## Latest Patched 14.x
**14.2.35** (Dec 11, 2025) — EOL, no further patches.

## Recommended Upgrade Path

### Option A: Upgrade to 14.2.35 (Minimum Safe Upgrade)
- **Risk:** LOW — minor version bump within same major.
- **Benefit:** Patches CVE-2025-29927 and other known 14.x vulnerabilities.
- **Limitation:** Still EOL. No protection against post-December 2025 CVEs.
- **Migration Work:** Minimal — should be drop-in compatible.
- **Recommended as:** IMMEDIATE emergency patch.

### Option B: Upgrade to Next.js 15.x (Maintenance LTS)
- **Risk:** MEDIUM — React 19 required, async params/searchParams API, default caching changed to dynamic.
- **Benefit:** Supported with security patches.
- **Migration Work:** Significant — all `params` and `searchParams` usage must become async; caching behavior review needed.

### Option C: Upgrade to Next.js 16.x (Active LTS)
- **Risk:** HIGH — newest major, largest migration surface.
- **Benefit:** Active security support.
- **Migration Work:** Same as 15.x plus any 16.x-specific changes.

## Compatibility Risks (14.2.13 → 14.2.35)
- App Router: ✅ Compatible
- React Server Components: ✅ Compatible (React 18.3.1 unchanged)
- Server Actions: ✅ Compatible
- Prisma 5.22: ✅ Compatible
- Safepay SDK: ✅ Compatible
- SSE/Realtime: ✅ Compatible
- Middleware: ✅ Compatible (same API, patched implementation)
- Supabase SSR: ✅ Compatible

## Tests Required After Upgrade
1. Full production build (`npm run build`)
2. TypeScript check (`npm run typecheck`)
3. Manual auth flow test
4. Admin route protection verification (test with/without `x-middleware-subrequest` header)
5. Payment session creation test
6. SSE connection test

## Final Recommendation

> **IMMEDIATELY upgrade to Next.js 14.2.35** to patch CVE-2025-29927 (critical middleware bypass).
> Then plan a migration to Next.js 15.x LTS within the next quarter.
>
> Additionally, as an **immediate server-side mitigation**, strip the `x-middleware-subrequest` header from all incoming requests at the reverse proxy / CDN / Vercel level before it reaches Next.js middleware.
