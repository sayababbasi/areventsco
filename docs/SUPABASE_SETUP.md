# Supabase Setup Guide — PostgreSQL Database & Cloud Storage

This document provides step-by-step instructions for provisioning and connecting **Supabase PostgreSQL** and **Supabase Storage** to AR Events Co.

---

## 1. Create a Supabase Project

1. Navigate to [supabase.com](https://supabase.com) and log in.
2. Click **New Project**.
3. Fill in:
   - **Name**: `areventsco-production`
   - **Database Password**: Generate a strong 24+ character password (store securely).
   - **Region**: Choose `Southeast Asia (Singapore)` or `Central EU (Frankfurt)` for low latency to Pakistan.
4. Click **Create new project**.

---

## 2. Obtain PostgreSQL Connection Strings

Navigate to **Project Settings → Database → Connection string**:

### A. Connection Pooling (for `DATABASE_URL`)
Select the **Transaction** tab (Mode: `Transaction`, Port `6543` with Supavisor):
```text
postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### B. Direct Connection (for `DIRECT_URL`)
Select the **Session** or **Direct** tab (Port `5432`):
```text
postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

---

## 3. Create Storage Buckets

Navigate to **Storage** in the Supabase Dashboard:

1. Click **New Bucket**.
2. **Bucket Name**: `arevents-media`
3. Toggle **Public Bucket** to **ON** (allows browser viewing of optimized party setup images).
4. Allowed MIME Types: Leave empty or set to `image/jpeg, image/png, image/webp, image/avif, image/svg+xml, application/pdf`.
5. Max file size: `5 MB`.
6. Click **Create bucket**.

### Bucket Policy Configuration:
Under **Storage → Policies → arevents-media**:
- **SELECT Policy (Public Read)**:
  - Policy Name: `Allow Public Image Viewing`
  - Allowed operations: `SELECT`
  - Target roles: `public`, `anon`, `authenticated`
  - Expression: `true`

---

## 4. Obtain Supabase API Keys

Navigate to **Project Settings → API**:

- **Project URL**: Copy and set as `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key**: Copy and set as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role secret**: Copy and set as `SUPABASE_SERVICE_ROLE_KEY` *(Never expose this key to browser clients)*.

---

## 5. Running Database Migrations

From your local machine or CI/CD terminal with the Supabase connection strings set in your `.env`:
```bash
# Push schema tables and foreign keys
npx prisma db push

# Verify tables in Supabase Table Editor
# Run master seed script to populate catalog
npx tsx prisma/seed.ts
```
