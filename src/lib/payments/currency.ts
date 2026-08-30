/**
 * AR Events Co. — Centralized Monetary & Safepay Currency Converter
 *
 * CANONICAL DATABASE FORMAT:
 * - Stored in integer Minor Units (Paisa): 1 PKR = 100 Paisa.
 * - e.g. PKR 31,800 is stored as 3,180,000 minor units.
 * - e.g. PKR 106,000 is stored as 10,600,000 minor units.
 *
 * SAFEPAY API FORMAT:
 * - Safepay SDK payments.create({ amount, currency }) expects standard PKR (Rupees).
 * - e.g. PKR 31,800 must be sent to Safepay as 31800 (NOT 3180000).
 * - e.g. PKR 106,000 must be sent to Safepay as 106000 (NOT 10600000).
 */

/**
 * Converts integer database minor units (Paisa) to standard PKR (Rupees) for Safepay API payload
 * @param amountMinor Amount in integer Paisa (e.g. 3180000)
 * @returns Amount in standard PKR (e.g. 31800)
 */
export function toSafepayAmount(amountMinor: number): number {
  if (typeof amountMinor !== "number" || isNaN(amountMinor) || amountMinor < 0) {
    throw new Error(`Invalid minor amount provided: ${amountMinor}`);
  }
  return Math.round(amountMinor) / 100;
}

/**
 * Converts Safepay response / webhook amount in standard PKR to integer database minor units (Paisa)
 * @param safepayAmount Amount in standard PKR (e.g. 31800)
 * @returns Amount in integer Paisa (e.g. 3180000)
 */
export function fromSafepayAmount(safepayAmount: number): number {
  if (typeof safepayAmount !== "number" || isNaN(safepayAmount) || safepayAmount < 0) {
    throw new Error(`Invalid Safepay amount provided: ${safepayAmount}`);
  }
  return Math.round(safepayAmount * 100);
}

/**
 * Formats minor units as a readable PKR string
 */
export function formatMinorToPkr(amountMinor: number): string {
  const pkr = amountMinor / 100;
  return `PKR ${pkr.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}
