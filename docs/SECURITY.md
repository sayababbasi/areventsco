# Security Baseline

## Secrets
- Never commit API keys, passwords, private credentials, or payment secrets.
- Keep secrets in environment variables/secret management.
- Never send server secrets to the browser.

## Input Security
- Validate every request server-side.
- Sanitize rich text.
- Enforce max lengths and upload limits.
- Validate MIME type and file signature where practical.

## Authentication
- Secure password hashing if password auth is used.
- Secure session cookies.
- CSRF protections where applicable.
- Login and reset rate limiting.

## Authorization
Server-side RBAC and resource-level ownership checks are mandatory.

## Financial Security
- Never trust client-provided totals.
- Verify payment webhooks using provider signatures.
- Make webhook handling idempotent.

## File Uploads
- Restrict file types and size.
- Store uploads outside the application source tree.
- Generate safe filenames.
- Do not execute uploaded files.

## Audit Logging
Log high-impact operations:
- Permission/role changes
- Refunds
- Booking cancellation/confirmation
- Price overrides
- Content publishing
- User deletion/deactivation

## Privacy
Collect only needed customer information and define retention/deletion rules before launch.
