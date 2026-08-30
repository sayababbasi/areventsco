# AR Events Co. — Development Plan

## Purpose

This document defines how the AR Events Co. website will be planned, designed, developed, tested, and released. It is the working delivery plan for the project, not a marketing document.

The product is a local event planning and booking platform for Islamabad and Rawalpindi. The first commercial focus is birthday events and decoration, with an architecture that can support weddings, engagements, corporate events, private parties, and other event types later.

## Product Principle

The public website should make it easy for a customer to understand the service, build an event request, and submit a booking. The administration system should give the business team control over inventory, pricing, availability, customers, bookings, payments, content, media, staff, and reporting without requiring code changes for normal operations.

## Delivery Rules

- Complete and review the current phase before starting the next phase.
- Do not build features only for the visual demo if the underlying data model has not been agreed.
- Keep business rules out of individual UI components where they can be shared and tested centrally.
- Prefer configuration in the admin panel over hard-coded business content.
- Protect existing functionality when adding or refactoring modules.
- Every completed phase must leave the repository in a runnable state.
- Changes that affect data, permissions, pricing, or booking behavior require a documented decision.

## Phase Overview

| Phase | Area | Primary Outcome |
|---|---|---|
| 00 | Project setup | Stable repository and development baseline |
| 01 | Product definition | Approved scope, user journeys, and requirements |
| 02 | Architecture | Application structure and technical contracts |
| 03 | Design system | Approved visual language and reusable UI foundation |
| 04 | Database & backend foundation | Reliable domain model, services, and persistence |
| 05 | Authentication & roles | Secure customer and staff access |
| 06 | Public website | Production-quality marketing and discovery experience |
| 07 | Booking engine | End-to-end event inquiry and booking workflow |
| 08 | Customer portal | Self-service booking and account management |
| 09 | Admin operations | Full business management workspace |
| 10 | Payments, notifications & documents | Operational completion of the booking lifecycle |
| 11 | SEO, analytics & performance | Search visibility and measurable growth |
| 12 | QA, security & launch | Production readiness and release |
| 13 | Post-launch | Stabilization and controlled iteration |

## Definition of Done

A phase is considered complete when its agreed functionality exists in code, the relevant documentation is updated, critical paths have been tested, and there are no known release-blocking issues for that phase.

---

# Phase Documents

- [Phase 00 — Project Setup](./PHASE_00_PROJECT_SETUP.md)
- [Phase 01 — Product Definition](./PHASE_01_PRODUCT_DEFINITION.md)
- [Phase 02 — Architecture](./PHASE_02_ARCHITECTURE.md)
- [Phase 03 — Design System](./PHASE_03_DESIGN_SYSTEM.md)
- [Phase 04 — Database & Backend Foundation](./PHASE_04_DATABASE_BACKEND.md)
- [Phase 05 — Authentication & Authorization](./PHASE_05_AUTHENTICATION.md)
- [Phase 06 — Public Website](./PHASE_06_PUBLIC_WEBSITE.md)
- [Phase 07 — Booking Engine](./PHASE_07_BOOKING_ENGINE.md)
- [Phase 08 — Customer Portal](./PHASE_08_CUSTOMER_PORTAL.md)
- [Phase 09 — Admin Operations](./PHASE_09_ADMIN_OPERATIONS.md)
- [Phase 10 — Payments, Notifications & Documents](./PHASE_10_OPERATIONS.md)
- [Phase 11 — SEO, Analytics & Performance](./PHASE_11_GROWTH.md)
- [Phase 12 — QA, Security & Launch](./PHASE_12_LAUNCH.md)
- [Phase 13 — Post-Launch](./PHASE_13_POST_LAUNCH.md)

## Working Documentation

The phase plan should be used together with the existing technical documents in `/docs`, especially:

- `ARCHITECTURE.md`
- `DATABASE.md`
- `API_SPEC.md`
- `BOOKING_ENGINE.md`
- `ADMIN_PANEL.md`
- `DESIGN_SYSTEM.md`
- `SECURITY.md`
- `SEO.md`
- `TESTING.md`
- `DECISIONS.md`

## Change Control

Scope changes are recorded in `DECISIONS.md` or `TODO.md` before implementation when they materially affect architecture, database structure, access control, booking rules, payment handling, or public URL structure.
