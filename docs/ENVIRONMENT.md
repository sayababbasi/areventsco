# Environment & Configuration

## Environments
- Local
- Preview/Staging
- Production

## Typical Variables
```text
DATABASE_URL=
AUTH_SECRET=
APP_URL=
STORAGE_ENDPOINT=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_BUCKET=
EMAIL_PROVIDER_KEY=
PAYMENT_PROVIDER_KEY=
PAYMENT_WEBHOOK_SECRET=
WHATSAPP_PROVIDER_KEY=
ANALYTICS_ID=
```

Use the exact variable names selected during implementation and document them here. Never commit real values.

## Configuration Rules
- Separate public browser-safe configuration from server-only secrets.
- Production and preview should use separate credentials where possible.
- Rotate credentials when exposure is suspected.
