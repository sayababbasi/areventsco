const { Safepay } = require("@sfpy/node-sdk");

async function testTrackerFetch() {
  const safepay = new Safepay({
    environment: "sandbox",
    apiKey: "sec_8f267889-2ac1-401b-99b1-e5f002f695af",
    v1Secret: "26f25765f46eaa6e4cee363b8966988637cbdf05958766feef038507eabecb17",
    webhookSecret: "26f25765f46eaa6e4cee363b8966988637cbdf05958766feef038507eabecb17",
  });

  const payment = await safepay.payments.create({
    amount: 1500000,
    currency: "PKR",
  });

  console.log("Created token:", payment.token);

  // Test tracker endpoint GET
  const response = await fetch(`https://sandbox.api.getsafepay.com/order/v1/${payment.token}`, {
    headers: {
      "X-SFPY-MERCHANT-SECRET": "26f25765f46eaa6e4cee363b8966988637cbdf05958766feef038507eabecb17",
    },
  });

  const data = await response.json();
  console.log("Tracker API response:", data);
}

testTrackerFetch();
