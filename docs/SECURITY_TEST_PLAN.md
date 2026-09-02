# SECURITY TEST PLAN

Execute the following test plans routinely to ensure security compliance.

## Test 1: Safepay Webhook Idempotency (Duplicate Prevention)

**Objective:** Verify that duplicate webhooks do not result in double crediting.

**Execution:**
1. Create a booking and initiate payment.
2. Intercept or simulate the `payment.completed` Safepay webhook payload using `cURL`.
3. Send the exact payload to `/api/payments/safepay/webhook` twice concurrently.
4. Verify HTTP `200` response for both, but ensure `payment.status` is only transitioned to `PAID` once in the database. 
5. Verify `amountPaidMinor` in the `Booking` record matches the payload exactly once.

## Test 2: Double-Booking Exhaustion

**Objective:** Verify that the system correctly rejects concurrent checkouts for a fully-booked date.

**Execution:**
1. Configure `AvailabilitySlot` in the database to have `maxConcurrentEvents = 1`.
2. Open two distinct browser sessions and initiate the checkout flow for the same date/time simultaneously.
3. Observe that Session A proceeds to Safepay, while Session B receives `Checkout prevented to avoid double-booking.`

## Test 3: IDOR on Invoice PDFs

**Objective:** Ensure customers cannot view other customers' PDFs.

**Execution:**
1. Login as `Customer A` (e.g. `customer_a@example.com`).
2. Identify a valid `Invoice ID` belonging to `Customer B`.
3. Navigate to `/api/invoices/[Customer_B_ID]/pdf`.
4. Verify the system responds with `HTTP 401 Unauthorized` or `HTTP 403 Forbidden`.
5. Login as `ADMIN` and access the same URL.
6. Verify the system correctly serves the PDF `arraybuffer`.

## Test 4: Rate Limiting Verification

**Objective:** Ensure brute-force protection works on login.

**Execution:**
1. Write a script to hit `/api/auth/login` 10 times consecutively with invalid credentials.
2. The first 5 requests should return `HTTP 401 Invalid Credentials`.
3. The 6th request and onwards must return `HTTP 429 Too Many Requests`.
4. Wait 15 minutes, repeat the test, and ensure the limit has reset.
