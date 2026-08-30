# Backend Architecture

## Core Modules
- Authentication
- Authorization
- Customers
- Events
- Bookings
- Availability
- Packages
- Themes
- Services
- Add-ons
- Venues
- Staff
- Vendors
- Payments
- Invoices
- Coupons
- Notifications
- CMS
- Media
- Reviews
- Reports
- Audit logs
- Settings

## Service Rule
Routes/controllers should orchestrate. Business rules belong in application services.

Example:
```text
POST /api/bookings
  -> BookingController
  -> BookingService.create()
  -> AvailabilityService.check()
  -> PricingService.calculate()
  -> BookingRepository.create()
  -> PaymentService.createDepositIntent()
```

## Validation
Use a shared schema validation layer for all external inputs. Never trust browser-supplied prices, permissions, IDs, or statuses.

## Transactions
Use DB transactions for multi-record operations such as:
- Booking confirmation with inventory/availability reservation.
- Payment allocation + invoice update.
- Booking cancellation + slot release.
- Package update with related service changes.

## Background/Deferred Work
Suitable for asynchronous processing:
- Notification delivery
- Image transformations
- Report generation
- Reminder jobs
- Cleanup jobs
