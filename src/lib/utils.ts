import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind class names safely with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats monetary integer minor units (paisa) into formatted PKR string
 * e.g. 5000000 -> "PKR 50,000"
 */
export function formatPKR(paisaAmount: number, includeCurrency = true): string {
  const rupees = Math.round(paisaAmount / 100);
  const formatted = new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(rupees);

  return includeCurrency ? `PKR ${formatted}` : formatted;
}

/**
 * Converts Rupees to Paisa (integer minor unit)
 */
export function rupeesToPaisa(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Converts Paisa to Rupees
 */
export function paisaToRupees(paisa: number): number {
  return Math.round(paisa / 100);
}

/**
 * Formats a Date object or ISO string into readable Pakistani standard format
 * e.g. "Saturday, 12 Oct 2026"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-PK", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

/**
 * Generates unique booking reference e.g. "AR-2026-8492"
 */
export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `AR-${year}-${randomDigits}`;
}

/**
 * Generates unique invoice number e.g. "INV-2026-0042"
 */
export function generateInvoiceNumber(sequence: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(4, "0");
  return `INV-${year}-${padded}`;
}

/**
 * Formats slot time "18:00" to "6:00 PM"
 */
export function formatTime12H(time24: string): string {
  if (!time24 || !time24.includes(":")) return time24;
  const [hoursStr, minutesStr] = time24.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || "00";
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}
