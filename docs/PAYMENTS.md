# Payments & Invoicing

## Payment Abstraction
Implement a provider interface so the application can switch gateways without changing booking business logic.

```text
PaymentGateway
  createPayment()
  verifyPayment()
  refundPayment()
  parseWebhook()
```

## Payment Types
- Deposit
- Partial payment
- Full payment
- Refund
- Adjustment/manual payment

## Payment Status
```text
PENDING
PROCESSING
PAID
FAILED
PARTIALLY_REFUNDED
REFUNDED
CANCELLED
```

## Invoice Requirements
- Unique invoice number
- Customer details
- Event/booking reference
- Line items
- Discounts
- Taxes/fees when applicable
- Paid amount
- Balance due
- Currency
- Issue date

## Reconciliation
Store provider transaction/reference IDs. Never treat a browser redirect alone as proof of payment; verify server-to-server/webhook data.
