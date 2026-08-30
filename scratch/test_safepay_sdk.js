const { Safepay } = require("@sfpy/node-sdk");

const safepay = new Safepay({
  environment: "sandbox",
  apiKey: "sec_8f267889-2ac1-401b-99b1-e5f002f695af",
  v1Secret: "26f25765f46eaa6e4cee363b8966988637cbdf05958766feef038507eabecb17",
  webhookSecret: "26f25765f46eaa6e4cee363b8966988637cbdf05958766feef038507eabecb17",
});

async function testSafepaySDK() {
  console.log("Testing Safepay SDK initialization & payment token creation...");

  try {
    const payment = await safepay.payments.create({
      amount: 3420000, // In Paisa (34,200 PKR * 100) or amount in PKR. Let's test amount in PKR / minor.
      currency: "PKR",
    });

    console.log("✓ Safepay Payment Created:", payment);

    const checkoutUrl = safepay.checkout.create({
      token: payment.token,
      orderId: "AR-2026-TEST-001",
      cancelUrl: "http://localhost:3000/booking/AR-2026-TEST-001?payment=cancelled",
      redirectUrl: "http://localhost:3000/booking/AR-2026-TEST-001?payment=success",
      source: "custom",
      webhooks: true,
    });

    console.log("✓ Safepay Checkout URL:", checkoutUrl);
  } catch (error) {
    console.error("Safepay SDK error:", error);
  }
}

testSafepaySDK();
