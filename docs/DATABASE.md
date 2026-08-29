# Database Design

## Core Entities
```text
User
CustomerProfile
Role
Permission
Event
Booking
BookingItem
Package
PackageItem
Theme
Service
Addon
Venue
StaffProfile
Vendor
AvailabilitySlot
Payment
Invoice
InvoiceItem
Coupon
Review
MediaAsset
Page
Section
Faq
SeoMeta
Notification
AuditLog
Setting
```

## Main Relationships
```text
CustomerProfile 1---* Booking
Booking 1---1 Event
Booking 1---* BookingItem
Package 1---* PackageItem
Service 1---* PackageItem
Booking *---0..1 Package
Booking *---0..1 Theme
Booking *---0..1 Venue
Booking 1---* Payment
Booking 1---* Invoice
Booking 1---* Notification
User *---* Role
Role *---* Permission
```

## BookingItem Snapshot Rule
Booking line items must store a snapshot of the item name, description, unit price, quantity, discount, and tax context at the time of booking. Historical invoices must not change when current catalog prices change.

## Money Rule
Store monetary values as integer minor units (for example, paisa) plus a currency code. Never use floating-point numbers for financial calculations.

## Status Fields
Use explicit enums for lifecycle states. Do not overload one generic status field for unrelated workflows.

## Indexing Priorities
Index:
- booking reference
- customer email/phone
- booking date/time
- booking status
- payment status
- package/theme/service slugs
- created_at

## Soft Delete
Prefer archive/active flags for catalog/content records that may be referenced historically. Do not physically delete records required for financial or booking history.
