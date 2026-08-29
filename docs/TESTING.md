# Testing Strategy

## Unit Tests
Test pure business logic:
- Price calculation
- Coupon rules
- Availability overlap
- Booking status transitions
- Permission checks

## Integration Tests
Test:
- DB repositories
- Booking transactions
- Payment reconciliation
- Notification persistence

## End-to-End Tests
Critical journeys:
1. Visitor -> package -> booking -> confirmation.
2. Customer -> dashboard -> invoice.
3. Admin -> create package -> public listing.
4. Admin -> block date -> booking rejection.
5. Admin -> confirm booking -> notifications.

## Security Tests
- Unauthorized API access
- Cross-customer booking access
- Role escalation
- File upload abuse
- Rate limiting
- Webhook signature verification

## Release Gate
No production release without passing critical tests and migrations in staging.
