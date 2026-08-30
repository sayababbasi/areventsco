# Phase 04 — Database & Backend Foundation

## Objective

Implement the domain model and application services that support every later feature.

## Core Entities

- User
- Role
- Permission
- CustomerProfile
- Event
- Booking
- BookingItem
- Package
- Theme
- Service
- AddOn
- Venue
- AvailabilitySlot
- StaffAssignment
- Vendor
- Payment
- Invoice
- Coupon
- Review
- MediaAsset
- ContentPage
- Notification
- AuditLog

## Backend Services

Business logic should be organized around domains such as:

- Catalog
- Availability
- Booking
- Pricing
- Customers
- Payments
- Notifications
- Content
- Administration

## Data Rules

- Monetary values use a consistent numeric representation and currency field.
- Status fields use controlled values.
- Important records include created/updated timestamps.
- Soft deletion is used only where audit/history makes it necessary.
- Foreign-key relationships are explicit.
- Database constraints protect critical uniqueness and integrity rules.

## Exit Criteria

- Initial schema is migrated.
- CRUD/service foundations are available for core entities.
- Business rules are centralized.
- Seed data can create a usable local environment.
