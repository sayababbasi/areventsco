# AR Events Co. — Master Production Deployment Guide

## Architecture Overview

AR Events Co. (`areventsco.com`) is deployed using modern cloud infrastructure designed for high availability, zero layout shift, low latency in Pakistan, and automated horizontal scaling:

```
                          CLOUDFLARE (DNS + SSL + CDN)
                                       │
                                       ▼
                       VERCEL SERVERLESS HOSTING
              (Next.js 14 App Router + Server Components + APIs)
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        │                                                             │
        ▼                                                             ▼
SUPABASE POSTGRESQL                                           SUPABASE STORAGE
(Pooled via Supavisor port 6543)                              (Bucket: arevents-media)
```

---

## 1. Prerequisites

1. **GitHub Account & Repository**: Repository synced with `main` branch.
2. **Supabase Account**: Organization and Project created.
3. **Vercel Account**: Linked with GitHub.
4. **Cloudflare Account**: Domain `areventsco.com` active on Cloudflare nameservers.

---

## 2. Step-by-Step Deployment Workflow

### Step 1: Set Up Supabase Database & Storage
Follow [`docs/SUPABASE_SETUP.md`](file:///d:/Business/Revotic%20AI%20Pvt%20Ltd/Development/Under%20Developing/Revotic%20AI%20Development/AR%20Event%20Co/docs/SUPABASE_SETUP.md):
- Obtain `DATABASE_URL` (Transaction Connection Pooling, Port 6543)
- Obtain `DIRECT_URL` (Direct Session connection, Port 5432)
- Create Storage Bucket `arevents-media` with Public Access enabled.
- Obtain `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

### Step 2: Push Database Schema & Seed Master Catalog
From your deployment terminal:
```bash
# Push Prisma schema to Supabase PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed master catalog (Themes, Packages, Services, Venues, FAQs, Local Hubs)
npx tsx prisma/seed.ts
```

### Step 3: Deploy to Vercel
Follow [`docs/VERCEL_DEPLOYMENT.md`](file:///d:/Business/Revotic%20AI%20Pvt%20Ltd/Development/Under%20Developing/Revotic%20AI%20Development/AR%20Event%20Co/docs/VERCEL_DEPLOYMENT.md):
- Import GitHub repository into Vercel.
- Framework Preset: **Next.js**.
- Build Command: `prisma generate && next build`.
- Add all environment variables listed in `.env.example`.
- Trigger Production Deployment.

### Step 4: Configure Cloudflare DNS & SSL
Follow [`docs/CLOUDFLARE_SETUP.md`](file:///d:/Business/Revotic%20AI%20Pvt%20Ltd/Development/Under%20Developing/Revotic%20AI%20Development/AR%20Event%20Co/docs/CLOUDFLARE_SETUP.md):
- Add CNAME record for root domain pointing to `cname.vercel-dns.com`.
- Add CNAME record for `www` pointing to `cname.vercel-dns.com`.
- Set SSL/TLS encryption mode to **Full (Strict)**.
- Enable **Always Use HTTPS** and **Brotli** compression.

---

## 3. Environment Variables Reference

| Variable | Environment | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | All | `production` |
| `NEXT_PUBLIC_APP_URL` | All | `https://areventsco.com` |
| `DATABASE_URL` | Server Only | Supabase pooled connection string (Port 6543) |
| `DIRECT_URL` | Server Only | Supabase direct connection string (Port 5432) |
| `AUTH_SECRET` | Server Only | 64-char random secret for HMAC-SHA256 tokens |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL (`https://[ref].supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Public | Supabase anonymous API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Supabase service role secret for storage uploads |
| `SUPABASE_STORAGE_BUCKET` | Server Only | `arevents-media` |

---

## 4. Post-Deployment Verification

Verify all items in [`docs/PRODUCTION_CHECKLIST.md`](file:///d:/Business/Revotic%20AI%20Pvt%20Ltd/Development/Under%20Developing/Revotic%20AI%20Development/AR%20Event%20Co/docs/PRODUCTION_CHECKLIST.md) before announcing the live website.
