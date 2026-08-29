# Phase 07 — Booking Engine

## Objective

Build the operational core of the platform: turning customer event requirements into structured booking records.

## Booking Flow

```text
Event Type
  → Date & Time
  → Guest Count
  → Location / Venue
  → Package
  → Add-ons
  → Customer Details
  → Price Review
  → Booking Submission
  → Admin Review
  → Confirmation
```

## Rules

- Availability must be checked before confirming a booking.
- Price calculation must happen on the server.
- Customer-submitted totals are never trusted.
- Booking status transitions are controlled.
- Double-booking protections must exist around date/time/resource conflicts.
- Admin overrides require an audit trail.

## Initial Status Model

`INQUIRY → PENDING → CONFIRMED → PREPARING → COMPLETED`

Cancellation and declined states are handled separately according to `BOOKING_ENGINE.md`.

## Exit Criteria

A customer can create a booking request, an admin can review and act on it, and the system preserves the complete event history needed for operations.
