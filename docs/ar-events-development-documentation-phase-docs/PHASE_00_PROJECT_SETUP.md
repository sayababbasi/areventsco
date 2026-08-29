# Phase 00 — Project Setup

## Objective

Create a clean, reproducible development environment before product work starts.

## Work

- Create the repository and baseline branch strategy.
- Configure the application runtime, package manager, formatting, linting, type checking, and commit conventions.
- Establish `.env.example` and environment naming conventions.
- Add local database connectivity and migration workflow.
- Add the `/docs` structure and document ownership.
- Configure the base application shell and error boundaries.
- Add a minimal health-check endpoint.
- Configure CI to run install, lint, type check, test, and build checks.

## Repository Standard

```text
src/
  app/
  components/
  features/
  lib/
  hooks/
  services/
  types/
prisma/
docs/
public/
tests/
```

The exact folder structure remains subject to the architecture decision in Phase 02.

## Exit Criteria

- A new developer can clone the repository and run the application from the setup guide.
- Database migrations run successfully from a clean database.
- CI passes on the default branch.
- No secrets are committed to source control.
