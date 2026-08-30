# AR Events Co. — Project Documentation

This directory contains the source-of-truth documentation for the AR Events Co. website and event-management platform.

## Product
**AR Events Co.** — birthday-focused event planning and decoration platform for Islamabad & Rawalpindi, Pakistan, designed to scale into broader event services.

**Tagline:** _Your Celebration, Our Passion_

## Documentation Map
- `PROJECT_OVERVIEW.md` — Product goals, scope, users, MVP, and roadmap.
- `ARCHITECTURE.md` — High-level technical architecture and system boundaries.
- `FRONTEND.md` — Frontend structure, routes, components, UX rules, and state management.
- `BACKEND.md` — Backend modules, services, API conventions, and business rules.
- `DATABASE.md` — PostgreSQL/Prisma data model and relationships.
- `AUTHORIZATION.md` — Authentication, roles, permissions, and access-control rules.
- `BOOKING_ENGINE.md` — Booking lifecycle, availability, pricing, and confirmation logic.
- `ADMIN_PANEL.md` — Admin modules and operational workflows.
- `CMS.md` — Content-management strategy so website content is editable from admin.
- `DESIGN_SYSTEM.md` — Brand, colors, typography, spacing, components, responsive rules.
- `SEO.md` — Local SEO, structured data, technical SEO, metadata, and content plan.
- `SECURITY.md` — Security baseline, secrets, validation, rate limits, audit logs, and privacy.
- `PAYMENTS.md` — Payment abstraction, deposits, invoices, refunds, and reconciliation.
- `NOTIFICATIONS.md` — Email, WhatsApp/SMS-ready notification architecture.
- `MEDIA.md` — Image/video upload, storage, transformations, and media rules.
- `ANALYTICS.md` — Business metrics, dashboards, events, and reporting.
- `API_SPEC.md` — API naming, request/response conventions, and endpoint catalog.
- `ENVIRONMENT.md` — Environment variables and local/staging/production setup.
- `DEVELOPMENT_WORKFLOW.md` — Branching, commits, PRs, testing, and release workflow.
- `TESTING.md` — Unit, integration, end-to-end, security, and acceptance testing.
- `SEED_DATA.md` — Development/demo seed data strategy.
- `DECISIONS.md` — Architecture Decision Records (ADRs).
- `TODO.md` — Open decisions and implementation backlog.

## Source-of-Truth Rule
When implementation conflicts with these documents, update the documents first, then update the code. Avoid undocumented architecture changes.

## Initial Technical Direction
Recommended baseline:
- Next.js (App Router) + TypeScript
- Tailwind CSS + reusable component system
- Node.js server-side application layer through Next.js route handlers/server actions, or a separate API service if scale requires it
- PostgreSQL + Prisma ORM
- Object storage for media
- Transactional email provider
- Payment provider abstraction
- Role-based access control (RBAC)

The exact provider choices can be finalized in `DECISIONS.md` before implementation.
