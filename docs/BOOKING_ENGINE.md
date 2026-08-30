# Booking Engine

## Booking Lifecycle
```text
INQUIRY
  -> PENDING
  -> QUOTED
  -> CONFIRMED
  -> PREPARING
  -> COMPLETED
  -> CLOSED

Alternative terminal states:
CANCELLED
REJECTED
```

## Booking Flow
1. Select event type.
2. Select package or start custom event.
3. Select date.
4. Select time slot.
5. Enter location.
6. Enter guest count.
7. Choose theme/services/add-ons.
8. Calculate price.
9. Customer details.
10. Review terms.
11. Pay deposit/full amount when enabled.
12. Create booking.
13. Confirm availability reservation.
14. Send confirmation.

## Availability Rules
- Admin controls working days/hours.
- Admin can block dates/times.
- Event duration must include setup/teardown buffer when configured.
- A confirmed booking consumes a time window.
- Overlapping bookings are not allowed unless capacity/resources explicitly permit them.

## Pricing
```text
Base Package
+ Add-ons
+ Services
+ Venue fee
+ Travel/location fee
- Coupon
- Manual discount
+ Tax/fees where applicable
= Grand Total
```

The server recalculates the final price from authoritative catalog data.

## Deposit
Support configurable deposit rules:
- Fixed amount
- Percentage
- Full payment required

## Cancellation
Admin-configurable cancellation rules should determine whether deposits are refundable, partially refundable, or non-refundable.
