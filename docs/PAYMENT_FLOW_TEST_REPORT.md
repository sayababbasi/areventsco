# SAFEPAY END-TO-END FLOW REPORT

This report maps the entire Safepay sandbox payment lifecycle as validated against the application's implementation.

## A. Initialization Phase
1. **Customer Action:** User selects Package, Theme, Addons, and Venue on frontend.
2. **Backend Validation:** `PricingService.calculate()` dynamically fetches prices from DB.
3. **Database Ledger:** Booking record is created (`status: INQUIRY`). Total (`totalAmountMinor`) and Deposit (`depositRequiredMinor`) are saved securely.
4. **Invoice Generation:** An `Invoice` is created for the full amount (`status: UNPAID`).

## B. Checkout Phase
1. **Payment Initiation:** Customer clicks "Pay Deposit".
2. **Double-Booking Check:** `AvailabilityService` verifies date/time is still within capacity limits.
3. **Safepay Tracker Creation:** The backend hits Safepay API to generate a tracker token using the server-calculated deposit amount.
4. **Database Logging:** `Payment` record created (`status: PENDING`, `providerToken: track_XXXX`).
5. **Redirect:** User redirected to Safepay Hosted Checkout.

## C. Webhook & Resolution Phase
1. **Safepay Action:** Customer successfully pays in sandbox. Safepay redirects user to success URL and fires asynchronous webhook to `/api/payments/safepay/webhook`.
2. **Webhook Reception:**
   - **Signature Verification:** HMAC validation ensures payload originated from Safepay.
   - **Idempotency Check:** Backend queries `Payment` by `providerToken`. If already `PAID`, ignores webhook gracefully.
   - **Amount Reconciliation:** Compares payload `amount` against database `payment.amountMinor`. Fails if manipulated.
3. **Atomic Ledger Update (Prisma Transaction):**
   - `Payment.status` -> `PAID`
   - `Booking.amountPaidMinor` is incremented.
   - `Booking.balanceDueMinor` is decremented.
   - `Booking.status` -> `CONFIRMED`.
   - `Invoice.status` -> `PARTIALLY_PAID` or `PAID`.
   - `InvoiceAuditLog` appended for tracing.
4. **Realtime Sync:**
   - `eventBus` broadcasts `PAYMENT_COMPLETED` and `BOOKING_STATUS_UPDATED`.
   - Admin and Customer Dashboards update instantly via SSE without page refresh.

## D. Failure Scenarios Evaluated
- **Expired/Cancelled Checkout:** Safepay webhook `state: FAILED`. Payment transitions to `FAILED`. Booking remains `INQUIRY`.
- **Duplicate Webhook:** First webhook processes normally. Second webhook hits idempotency clause and returns HTTP 200 without altering state.
- **Client Closure:** If user closes browser before redirect but Safepay webhook fires, the system correctly processes the backend webhook and syncs database. Client views updated state upon next login.
