const { Safepay } = require("@sfpy/node-sdk");

const safepay = new Safepay({
  environment: "sandbox",
  apiKey: "sec_8f267889-2ac1-401b-99b1-e5f002f695af",
  v1Secret: "fb0f4a6c5517e05c37b1901ff05b95982051efdd2a197e411516baf40c47acff",
  webhookSecret: "fb0f4a6c5517e05c37b1901ff05b95982051efdd2a197e411516baf40c47acff",
});

async function verifyAmountFormat() {
  console.log("=== Testing Safepay Amount Format ===");

  // Test 1: Amount in PKR (31,800 PKR)
  const paymentPkr = await safepay.payments.create({
    amount: 31800, // PKR
    currency: "PKR",
  });

  console.log("Payment created with amount: 31800 ->", {
    token: paymentPkr.token,
    amount: paymentPkr.amount,
    currency: paymentPkr.currency,
  });

  // Query tracker from Safepay API
  const res = await fetch(`https://sandbox.api.getsafepay.com/order/v1/${paymentPkr.token}`, {
    headers: {
      "X-SFPY-MERCHANT-SECRET": "fb0f4a6c5517e05c37b1901ff05b95982051efdd2a197e411516baf40c47acff",
    },
  });
  const data = await res.json();
  console.log("Safepay Tracker State from API:", {
    token: data.data.token,
    amount: data.data.amount,
    currency: data.data.currency,
    state: data.data.state,
  });
}

verifyAmountFormat().catch(console.error);
