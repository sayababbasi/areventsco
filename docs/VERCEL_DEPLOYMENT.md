# Vercel Deployment Guide — AR Events Co.

This guide outlines configuring and deploying the full-stack Next.js application on **Vercel**.

---

## 1. Import Repository

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New... → Project**.
3. Select the GitHub repository `sayababbasi/areventsco` (or your repository name).
4. Click **Import**.

---

## 2. Project Configuration

Configure the build settings:
- **Framework Preset**: `Next.js`
- **Root Directory**: `./`
- **Build Command**: `prisma generate && next build`
- **Install Command**: `npm install`
- **Output Directory**: `.next` (default)

---

## 3. Configure Environment Variables

Under **Settings → Environment Variables**, add the following production variables:

```env
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://areventsco.com"
APP_NAME="AR Events Co."
APP_TAGLINE="Your Celebration, Our Passion"
SUPPORT_PHONE="+92 300 8555123"
SUPPORT_EMAIL="info@areventsco.com"
SERVICE_CITIES="Islamabad, Rawalpindi"

DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

AUTH_SECRET="[STRONG_64_CHAR_RANDOM_SECRET]"
AUTH_EXPIRES_IN="7d"

NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_STORAGE_BUCKET="arevents-media"

EMAIL_PROVIDER="mock"
PAYMENT_PROVIDER="mock"
WHATSAPP_PROVIDER="mock"
```

> **Tip**: Check the boxes for **Production**, **Preview**, and **Development** environments where appropriate.

---

## 4. Custom Domain Assignment

1. In Vercel, navigate to **Settings → Domains**.
2. Add `areventsco.com`.
3. Add `www.areventsco.com` (Select redirect `www.areventsco.com` → `areventsco.com`).
4. Note the provided DNS records for Cloudflare configuration.

---

## 5. Deployment Verification

1. Click **Deploy**.
2. Monitor build logs: verify that Prisma generates the client and all 50+ routes compile cleanly.
3. Test public routes, booking engine, admin panel, image upload API, and 301 redirects.
