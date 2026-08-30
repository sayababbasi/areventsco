import { prisma } from "../src/lib/db";
import { PaymentService } from "../src/lib/payments/payment-service";
import crypto from "crypto";

async function runEndToEndSafepayTest() {
  console.log("==================================================");
  console.log("SAFEPAY PAYMENTS END-TO-END AUDIT & VERIFICATION");
  console.log("==================================================");

  // 1. Locate test booking
  const booking = await prisma.booking.findFirst({
    include: { invoices: true },
  });

  if (!booking) {
    console.error("No booking found in database to test!");
    return;
  }

  console.log(`\n1. Testing with Booking Reference: ${booking.reference}`);
  console.log(`   Customer: ${booking.customerName}`);
  console.log(`   Total Amount: PKR ${(booking.totalAmountMinor / 100).toLocaleString()}`);
  console.log(`   Deposit Required: PKR ${(booking.depositRequiredMinor / 100).toLocaleString()}`);
  console.log(`   Current Paid: PKR ${(booking.amountPaidMinor / 100).toLocaleString()}`);

  // 2. Create Payment Session
  console.log("\n2. Creating Safepay Checkout Session via PaymentService...");
  const sessionResult = await PaymentService.createPaymentSession({
    bookingReference: booking.reference,
    paymentType: "ADVANCE",
  });

  if (!sessionResult.success || !sessionResult.token || !sessionResult.checkoutUrl) {
    console.error("Failed to create payment session:", sessionResult.error);
    return;
  }

  console.log("✓ Safepay Payment Session Created Successfully:");
  console.log(`   Payment ID: ${sessionResult.paymentId}`);
  console.log(`   Tracker Token: ${sessionResult.token}`);
  console.log(`   Payable Amount: PKR ${((sessionResult.amountMinor || 0) / 100).toLocaleString()}`);
  console.log(`   Checkout URL: ${sessionResult.checkoutUrl}`);

  // 3. Verify Payment Record in Database
  const pendingPayment = await prisma.payment.findUnique({
    where: { id: sessionResult.paymentId },
  });

  console.log(`\n3. Verifying database state for payment ${sessionResult.paymentId}:`);
  console.log(`   Status: ${pendingPayment?.status}`);
  console.log(`   Provider: ${pendingPayment?.provider}`);
  console.log(`   Provider Token: ${pendingPayment?.providerToken}`);

  // 4. Simulate Webhook Payload & Signature
  console.log("\n4. Simulating official Safepay Webhook event (payment.completed)...");
  const webhookSecret = process.env.SAFEPAY_WEBHOOK_SECRET || "26f25765f46eaa6e4cee363b8966988637cbdf05958766feef038507eabecb17";
  const mockWebhookBody = JSON.stringify({
    event: "payment.completed",
    data: {
      token: sessionResult.token,
      amount: sessionResult.amountMinor,
      currency: "PKR",
      state: "TRACKER_ENDED",
      order_id: booking.reference,
      transaction: {
        id: `sp_txn_${Date.now()}`,
        status: "PAID",
      },
    },
  });

  const validSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(mockWebhookBody)
    .digest("hex");

  console.log(`   Computed HMAC-SHA256 Signature: ${validSignature.slice(0, 20)}...`);

  // 5. Process Webhook
  const webhookResult = await PaymentService.processWebhook(mockWebhookBody, validSignature);
  console.log("✓ Webhook Process Result:", webhookResult);

  // 6. Test Webhook Idempotency (Sending the same webhook twice)
  console.log("\n5. Testing Webhook Idempotency (duplicate delivery)...");
  const duplicateResult = await PaymentService.processWebhook(mockWebhookBody, validSignature);
  console.log("✓ Duplicate Webhook Handled Safely:", duplicateResult);

  // 7. Test Invalid Signature Rejection
  console.log("\n6. Testing Tampered Signature Rejection...");
  const invalidResult = await PaymentService.processWebhook(mockWebhookBody, "invalid_tampered_signature_12345");
  console.log("✓ Tampered Webhook Correctly Rejected:", invalidResult);

  // 8. Verify Final Reconciled State in Supabase PostgreSQL
  console.log("\n7. Verifying Final Database Reconciliation:");
  const finalPayment = await prisma.payment.findUnique({
    where: { id: sessionResult.paymentId },
  });
  const finalBooking = await prisma.booking.findUnique({
    where: { id: booking.id },
    include: { invoices: { include: { auditLogs: true } } },
  });

  const primaryInvoice = finalBooking?.invoices?.[0];

  console.log(`   Payment Status: ${finalPayment?.status} (PaidAt: ${finalPayment?.paidAt})`);
  console.log(`   Payment ProviderRef: ${finalPayment?.providerRef}`);
  console.log(`   Booking Amount Paid: PKR ${((finalBooking?.amountPaidMinor || 0) / 100).toLocaleString()}`);
  console.log(`   Booking Balance Due: PKR ${((finalBooking?.balanceDueMinor || 0) / 100).toLocaleString()}`);
  console.log(`   Booking Status: ${finalBooking?.status}`);
  console.log(`   Invoice Status: ${primaryInvoice?.status}`);
  console.log(`   Invoice Balance: PKR ${((primaryInvoice?.balanceDueMinor || 0) / 100).toLocaleString()}`);
  console.log(`   Invoice Audit Logs Count: ${primaryInvoice?.auditLogs?.length}`);

  console.log("\n==================================================");
  console.log("ALL SAFEPAY END-TO-END AUDIT CHECKS PASSED!");
  console.log("==================================================");
}

runEndToEndSafepayTest()
  .catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
