# Architecture Decision Records

Use this file for decisions that meaningfully affect architecture or operations.

## ADR-001 — Modular Monolith for MVP
**Status:** Accepted

**Decision:** Start with one deployable application organized into domain modules rather than microservices.

**Why:** The business is a single local operation and the main complexity is workflow/business rules, not distributed scale.

## ADR-002 — PostgreSQL as Primary Database
**Status:** Accepted

**Decision:** Use PostgreSQL as the system of record.

**Why:** Strong transactional guarantees and a good fit for relational booking, payment, customer, and catalog data.

## ADR-003 — Admin-Managed Content
**Status:** Accepted

**Decision:** Catalog, marketing content, pricing, media, and operational settings must be admin-manageable.

**Why:** Business should not depend on developers for routine website updates.

## ADR-004 — Provider Abstraction
**Status:** Accepted

**Decision:** Payment, notifications, and media providers are integrated through interfaces/adapters.

**Why:** Local provider availability and business requirements may change.

## ADR-005 — Luxury Clean Light Theme
**Status:** Accepted

**Decision:** The public website adopts a human-crafted, clean light theme (warm white backgrounds, deep navy typography, metallic gold accents) using official brand assets from `/logos` instead of full-dark mode.

**Why:** Maximizes readability, elegance, and conversion for Pakistani event-planning clients while honoring the brand identity.

## ADR-006 — Server-Authoritative Deterministic Pricing & Minor Units
**Status:** Accepted

**Decision:** All financial calculations use integer minor units (Paisa in PKR) recalculated on the server during booking creation. Line-item snapshots preserve historical billing integrity.

**Why:** Prevents client-side price tampering and guarantees that past invoices never shift when catalog prices are updated.

