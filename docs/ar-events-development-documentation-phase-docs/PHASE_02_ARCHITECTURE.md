# Phase 02 — Architecture

## Objective

Define the technical boundaries before feature work creates dependencies that are difficult to change.

## Architecture Areas

- Frontend application and routing
- Server-side application services
- Database and migrations
- Authentication and session management
- File/media storage
- Notification provider
- Payment provider abstraction
- Background jobs where required
- Observability and audit logging

## Principles

- Use a modular feature structure instead of one large application layer.
- Keep domain services independent from UI concerns.
- Validate input at the API boundary and again in important business services where needed.
- Keep pricing calculation deterministic and testable.
- Treat booking status transitions as controlled state changes.
- Use explicit permission checks at protected server boundaries.
- Keep third-party integrations behind provider interfaces so they can be replaced.

## Contracts to Finalize

- Route map
- API conventions
- Database naming conventions
- Error response format
- Pagination and filtering rules
- Audit event structure
- File naming and storage rules
- Role/permission model

## Exit Criteria

Architecture decisions are documented, major modules have clear ownership, and implementation can proceed without unresolved structural questions.
