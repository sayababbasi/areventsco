const { Safepay } = require("@sfpy/node-sdk");

const safepay = new Safepay({
  environment: "sandbox",
  apiKey: "sec_8f267889-2ac1-401b-99b1-e5f002f695af",
  v1Secret: "26f25765f46eaa6e4cee363b8966988637cbdf05958766feef038507eabecb17",
  webhookSecret: "26f25765f46eaa6e4cee363b8966988637cbdf05958766feef038507eabecb17",
});

console.log("Safepay prototype:", Object.getOwnPropertyNames(Safepay.prototype));
console.log("payments prototype:", Object.getOwnPropertyNames(Object.getPrototypeOf(safepay.payments)));
console.log("checkout prototype:", Object.getOwnPropertyNames(Object.getPrototypeOf(safepay.checkout)));
console.log("verify prototype:", Object.getOwnPropertyNames(Object.getPrototypeOf(safepay.verify)));
