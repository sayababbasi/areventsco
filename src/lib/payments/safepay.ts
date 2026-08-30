import crypto from "crypto";
// @ts-ignore
import { Safepay } from "@sfpy/node-sdk";
import { SafepayTrackerData } from "./types";
import { toSafepayAmount } from "./currency";

const SAFEPAY_ENVIRONMENT = (process.env.SAFEPAY_ENVIRONMENT || "sandbox").toLowerCase() as any;
const SAFEPAY_API_KEY = process.env.SAFEPAY_API_KEY || "sec_8f267889-2ac1-401b-99b1-e5f002f695af";
const SAFEPAY_SECRET_KEY = process.env.SAFEPAY_SECRET_KEY || "fb0f4a6c5517e05c37b1901ff05b95982051efdd2a197e411516baf40c47acff";
const SAFEPAY_WEBHOOK_SECRET = process.env.SAFEPAY_WEBHOOK_SECRET || SAFEPAY_SECRET_KEY;

const BASE_API_URL =
  SAFEPAY_ENVIRONMENT === "production"
    ? "https://api.getsafepay.com"
    : "https://sandbox.api.getsafepay.com";

let safepayInstance: any = null;

function getSafepayClient() {
  if (!safepayInstance) {
    safepayInstance = new Safepay({
      environment: SAFEPAY_ENVIRONMENT,
      apiKey: SAFEPAY_API_KEY,
      v1Secret: SAFEPAY_SECRET_KEY,
      webhookSecret: SAFEPAY_WEBHOOK_SECRET,
    });
  }
  return safepayInstance;
}

export class SafepayGateway {
  /**
   * Create a Safepay payment tracker token
   * @param amountMinor Amount in database minor currency units (Paisa). e.g. PKR 31,800 = 3,180,000 minor units
   * @param currency Currency code, defaults to PKR
   */
  static async createTracker(amountMinor: number, currency: string = "PKR"): Promise<{ token: string; raw: any }> {
    try {
      const client = getSafepayClient();
      const amountInPkr = toSafepayAmount(amountMinor);
      console.log(`[SAFEPAY] Creating tracker for amountMinor=${amountMinor} -> amountInPkr=${amountInPkr} ${currency} in env=${SAFEPAY_ENVIRONMENT}`);
      
      const payment = await client.payments.create({
        amount: amountInPkr,
        currency: currency.toUpperCase(),
      });

      if (!payment || !payment.token) {
        throw new Error("Failed to obtain tracker token from Safepay API");
      }

      console.log(`[SAFEPAY] Tracker created successfully. Token: ${payment.token} (Amount: PKR ${payment.amount})`);
      return { token: payment.token, raw: payment };
    } catch (error: any) {
      console.error("[SAFEPAY] Tracker creation failed:", error?.message || error);
      throw new Error(`Safepay tracker initialization error: ${error?.message || "Unknown error"}`);
    }
  }

  /**
   * Generate hosted checkout URL using tracker token
   */
  static generateCheckoutUrl(params: {
    token: string;
    orderId: string;
    redirectUrl: string;
    cancelUrl: string;
  }): string {
    const client = getSafepayClient();
    const url = client.checkout.create({
      token: params.token,
      orderId: params.orderId,
      cancelUrl: params.cancelUrl,
      redirectUrl: params.redirectUrl,
      source: "custom",
      webhooks: true,
    });

    console.log(`[SAFEPAY] Generated checkout URL for Order ${params.orderId}`);
    return url;
  }

  /**
   * Fetch live tracker details from Safepay API
   */
  static async getTrackerStatus(token: string): Promise<SafepayTrackerData | null> {
    try {
      const endpoint = `${BASE_API_URL}/order/v1/${token}`;
      console.log(`[SAFEPAY] Fetching tracker status from ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-SFPY-MERCHANT-SECRET": SAFEPAY_SECRET_KEY,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[SAFEPAY] Failed to fetch tracker ${token}: HTTP ${response.status} - ${errorText}`);
        return null;
      }

      const body = await response.json();
      if (body && body.data) {
        return body.data as SafepayTrackerData;
      }
      return null;
    } catch (error: any) {
      console.error(`[SAFEPAY] Error querying tracker ${token}:`, error?.message || error);
      return null;
    }
  }

  /**
   * Verify HMAC-SHA256 signature on Safepay Webhook payload
   */
  static verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!signature || !rawBody) {
      return false;
    }

    try {
      const computedHash = crypto
        .createHmac("sha256", SAFEPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature.trim(), "utf-8"),
        Buffer.from(computedHash.trim(), "utf-8")
      );

      return isValid;
    } catch (err) {
      console.error("[SAFEPAY] Signature verification error:", err);
      // Fallback non-timing safe compare if buffers differ in length
      const computed = crypto.createHmac("sha256", SAFEPAY_WEBHOOK_SECRET).update(rawBody).digest("hex");
      return computed.toLowerCase() === signature.trim().toLowerCase();
    }
  }
}
