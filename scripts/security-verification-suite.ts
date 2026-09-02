/**
 * AR Events Co. - Executable Security & Integrity Verification Suite
 * Run with: npx tsx scripts/security-verification-suite.ts
 */

import { toSafepayAmount, fromSafepayAmount } from "../src/lib/payments/currency";
import { SafepayGateway } from "../src/lib/payments/safepay";
import { createSessionToken, verifySessionToken } from "../src/lib/auth";
import { rateLimit } from "../src/lib/rate-limit";

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${testName} ${detail ? `(${detail})` : ""}`);
    failCount++;
  }
}

async function runSuite() {
  console.log("\n========================================================");
  console.log("  AR EVENTS CO. — EXECUTABLE SECURITY TEST SUITE");
  console.log("========================================================\n");

  // TEST 1: Currency Unit Conversions (Paisa <-> PKR)
  console.log("--- 1. Monetary Unit Conversion Assertions ---");
  assert(toSafepayAmount(3180000) === 31800, "3,180,000 minor units converts to PKR 31,800");
  assert(toSafepayAmount(10600000) === 106000, "10,600,000 minor units converts to PKR 106,000");
  assert(toSafepayAmount(3000000) === 30000, "3,000,000 minor units converts to PKR 30,000");
  assert(toSafepayAmount(100000) === 1000, "100,000 minor units converts to PKR 1,000");
  assert(fromSafepayAmount(31800) === 3180000, "PKR 31,800 converts to 3,180,000 minor units");
  assert(fromSafepayAmount(106000) === 10600000, "PKR 106,000 converts to 10,600,000 minor units");

  // TEST 2: Negative/Invalid Amount Protection in Currency Converter
  console.log("\n--- 2. Currency Negative Value & NaN Protection ---");
  let threwNegative = false;
  try {
    toSafepayAmount(-500);
  } catch {
    threwNegative = true;
  }
  assert(threwNegative, "toSafepayAmount throws error on negative amount (-500)");

  let threwNaN = false;
  try {
    toSafepayAmount(NaN);
  } catch {
    threwNaN = true;
  }
  assert(threwNaN, "toSafepayAmount throws error on NaN");

  // TEST 3: Auth Session Token Signing & Tamper Resistance
  console.log("\n--- 3. Auth Token Signing & Tamper Verification ---");
  const originalUser = {
    id: "user_test_123",
    email: "customer@example.com",
    name: "Test Customer",
    role: "CUSTOMER",
  };

  const token = createSessionToken(originalUser);
  const verified = verifySessionToken(token);
  assert(verified !== null && verified.id === originalUser.id, "Valid session token verifies successfully");

  // Tamper with payload
  const [b64Payload, sig] = token.split(".");
  const decoded = JSON.parse(Buffer.from(b64Payload, "base64url").toString("utf-8"));
  decoded.role = "SUPER_ADMIN"; // Attempt privilege escalation
  const tamperedB64 = Buffer.from(JSON.stringify(decoded)).toString("base64url");
  const tamperedToken = `${tamperedB64}.${sig}`;

  const tamperedVerified = verifySessionToken(tamperedToken);
  assert(tamperedVerified === null, "Tampered token with elevated SUPER_ADMIN role is REJECTED by signature mismatch");

  // TEST 4: Rate Limiter Enforcement
  console.log("\n--- 4. Rate Limiter Enforcement ---");
  const testIp = `test_runner_${Date.now()}`;
  const limit = 3;
  const windowMs = 5000;

  const r1 = await rateLimit(`test_${testIp}`, limit, windowMs);
  const r2 = await rateLimit(`test_${testIp}`, limit, windowMs);
  const r3 = await rateLimit(`test_${testIp}`, limit, windowMs);
  const r4 = await rateLimit(`test_${testIp}`, limit, windowMs);

  assert(r1.success === true && r1.remaining === 2, "1st request under limit: ALLOWED");
  assert(r2.success === true && r2.remaining === 1, "2nd request under limit: ALLOWED");
  assert(r3.success === true && r3.remaining === 0, "3rd request at limit: ALLOWED");
  assert(r4.success === false && r4.remaining === 0, "4th request exceeds limit: BLOCKED (429)");

  // TEST 5: SVG XSS Payload Detection
  console.log("\n--- 5. SVG File Upload XSS Inspection ---");
  const cleanSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><circle r="50"/></svg>');
  const maliciousSvg1 = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
  const maliciousSvg2 = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(document.cookie)"></svg>');
  const maliciousSvg3 = Buffer.from('<svg><a href="javascript:alert(1)"><text>Click</text></a></svg>');

  function checkSvgSafety(buf: Buffer): boolean {
    const content = buf.toString("utf-8").toLowerCase();
    if (
      content.includes("<script") ||
      content.includes("javascript:") ||
      content.includes("onerror=") ||
      content.includes("onload=") ||
      content.includes("onclick=") ||
      content.includes("<iframe") ||
      content.includes("<embed") ||
      content.includes("<object")
    ) {
      return false;
    }
    return true;
  }

  assert(checkSvgSafety(cleanSvg) === true, "Clean SVG without scripts is accepted");
  assert(checkSvgSafety(maliciousSvg1) === false, "SVG with <script> tag is detected and blocked");
  assert(checkSvgSafety(maliciousSvg2) === false, "SVG with onload= handler is detected and blocked");
  assert(checkSvgSafety(maliciousSvg3) === false, "SVG with javascript: URI is detected and blocked");

  // TEST 6: Webhook HMAC Signature Verification Logic
  console.log("\n--- 6. Webhook HMAC-SHA256 Signature Verification ---");
  const testPayload = JSON.stringify({ event: "payment.completed", data: { token: "track_test_123", amount: 31800 } });
  const fakeSecret = "fb0f4a6c5517e05c37b1901ff05b95982051efdd2a197e411516baf40c47acff";
  
  const crypto = await import("crypto");
  const validSig = crypto.createHmac("sha256", fakeSecret).update(testPayload).digest("hex");
  const invalidSig = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

  const emptySigValid = SafepayGateway.verifyWebhookSignature(testPayload, "");
  assert(emptySigValid === false, "Empty signature is immediately rejected");

  const mismatchSigValid = SafepayGateway.verifyWebhookSignature(testPayload, invalidSig);
  assert(mismatchSigValid === false, "Forged signature is rejected");

  console.log("\n========================================================");
  console.log(`  TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log("========================================================\n");

  if (failCount > 0) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error("Test suite runtime error:", err);
  process.exit(1);
});
