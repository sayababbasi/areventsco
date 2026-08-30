# Development Workflow

## Branches
```text
main       -> production
staging    -> pre-production/integration
feature/*  -> individual changes
fix/*      -> bug fixes
```

## Commits
Use clear, scoped messages:
```text
feat(bookings): add availability check
fix(payments): make webhook idempotent
refactor(cms): separate page service
```

## Pull Requests
Every PR should include:
- Purpose
- Screenshots for UI changes
- Tests
- Migration notes
- Environment/config changes
- Documentation updates

## Rule
No feature is considered complete until its documentation, validation, and tests are updated.
