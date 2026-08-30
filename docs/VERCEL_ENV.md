# Vercel Production Environment Variables

Copy and paste the entire block below directly into the Vercel **Key / Value** input, or save as a `.env` file to upload via the **"Import .env"** button in the Vercel dashboard:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://areventsco.com
APP_NAME=AR Events Co.
APP_TAGLINE=Your Celebration, Our Passion
SUPPORT_PHONE=+92 300 8555123
SUPPORT_EMAIL=info@areventsco.com
SERVICE_CITIES=Islamabad, Rawalpindi

DATABASE_URL=postgresql://postgres.nuiqcwonplyynvtrfuwd:%40reventsCO123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.nuiqcwonplyynvtrfuwd:%40reventsCO123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

AUTH_SECRET=f8a7e2b19c4d3e5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a
AUTH_EXPIRES_IN=7d

NEXT_PUBLIC_SUPABASE_URL=https://nuiqcwonplyynvtrfuwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aXFjd29ucGx5eW52dHJmdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNTM4NDQsImV4cCI6MjEwMzYyOTg0NH0.vpB4OgtlvAdZ9i8Tede74DHYMp_4OiU5EqOLPB_wqqk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aXFjd29ucGx5eW52dHJmdXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODA1Mzg0NCwiZXhwIjoyMTAzNjI5ODQ0fQ.nHrATCwgyKH0g_U7vZSTWiQwEqErgA0UvKph1NPAf6Q
SUPABASE_STORAGE_BUCKET=arevents-media
STORAGE_PROVIDER=supabase

EMAIL_PROVIDER=mock
EMAIL_FROM=AR Events Co. <no-reply@areventsco.com>
PAYMENT_PROVIDER=mock
WHATSAPP_PROVIDER=mock
```
