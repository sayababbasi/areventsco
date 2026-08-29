# Architecture

## 1. Architectural Principles
- Prefer simple, maintainable architecture over premature microservices.
- Keep business rules in one application/service layer, not duplicated across UI components.
- Treat admin-managed content as data, not hard-coded presentation.
- Make payment, notification, and media providers replaceable behind interfaces.
- Enforce authorization on the server for every protected mutation/query.
- Preserve auditability for operationally important changes.

## 2. Logical Layers
```text
Browser / Mobile Web
        |
        v
Next.js Presentation Layer
        |
        +--> Server Actions / Route Handlers
        |
        v
Application Services
        |
        +--> Booking Service
        +--> Pricing Service
        +--> Availability Service
        +--> Customer Service
        +--> CMS Service
        +--> Payment Service
        +--> Notification Service
        +--> Media Service
        +--> Reporting Service
        |
        v
PostgreSQL / Prisma
        |
        +--> Object Storage
        +--> Email Provider
        +--> Payment Provider
        +--> WhatsApp/SMS Provider (optional)
```

## 3. Deployment Boundaries
### Web application
Hosts public pages, customer portal, and admin UI.

### Database
Single PostgreSQL database for MVP.

### Object storage
Stores photos, logos, package/theme media, invoices, and other uploads.

### External providers
Payment, transactional email, optional WhatsApp/SMS, analytics.

## 4. Recommended App Structure
```text
src/
  app/
    (public)/
    (customer)/
    admin/
    api/
  components/
  features/
    bookings/
    packages/
    themes/
    services/
    customers/
    payments/
    cms/
    media/
  lib/
    auth/
    db/
    permissions/
    validation/
    pricing/
  server/
    services/
    repositories/
  types/
```

## 5. Data Ownership
- `features/*` owns domain UI and feature-specific behavior.
- `server/services/*` owns business logic.
- `lib/db/*` owns database client/configuration.
- Prisma schema is the source of truth for persistence structure.

## 6. Request Flow
```text
UI action
  -> validation
  -> authentication
  -> authorization
  -> application service
  -> transaction (when needed)
  -> persistence
  -> audit event
  -> notification/event dispatch
  -> response
```

## 7. Scaling Path
Start as a modular monolith. Extract services only when there is a demonstrated operational or scaling need.
