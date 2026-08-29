import { prisma } from "@/lib/db";
import { BookingItemDto, PriceCalculationInput, PriceCalculationResult } from "@/types";

export class PricingService {
  /**
   * Authoritatively calculates grand totals, line items, and deposit requirements from the database.
   * Client-provided totals are NEVER trusted.
   */
  static async calculate(input: PriceCalculationInput): Promise<PriceCalculationResult> {
    const items: BookingItemDto[] = [];
    let basePriceMinor = 0;
    let addonsTotalMinor = 0;
    let venueFeeMinor = 0;
    const travelFeeMinor = 0; // Configurable per zone/sector if needed
    let discountMinor = 0;
    let appliedCoupon: { code: string; discountMinor: number } | null = null;

    // 1. Base Package
    if (input.packageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: input.packageId, isActive: true },
      });

      if (pkg) {
        basePriceMinor = pkg.basePriceMinor;
        items.push({
          itemType: "PACKAGE",
          itemId: pkg.id,
          name: pkg.title,
          description: `Base Package (${pkg.guestCapacityMin}-${pkg.guestCapacityMax} guests, ${pkg.estimatedDurationHours} hours)`,
          unitPriceMinor: pkg.basePriceMinor,
          quantity: 1,
          totalPriceMinor: pkg.basePriceMinor,
          currency: pkg.currency,
        });
      }
    }

    // 2. Add-ons
    if (input.addonIds && input.addonIds.length > 0) {
      const addons = await prisma.addon.findMany({
        where: {
          id: { in: input.addonIds },
          isActive: true,
        },
      });

      for (const addon of addons) {
        addonsTotalMinor += addon.priceMinor;
        items.push({
          itemType: "ADDON",
          itemId: addon.id,
          name: addon.title,
          description: addon.description ?? undefined,
          unitPriceMinor: addon.priceMinor,
          quantity: 1,
          totalPriceMinor: addon.priceMinor,
          currency: addon.currency,
        });
      }
    }

    // 3. Venue
    if (input.venueId) {
      const venue = await prisma.venue.findUnique({
        where: { id: input.venueId, isActive: true },
      });

      if (venue && venue.feeMinor > 0) {
        venueFeeMinor = venue.feeMinor;
        items.push({
          itemType: "VENUE_FEE",
          itemId: venue.id,
          name: `Venue Reservation: ${venue.name}`,
          description: `${venue.city} - ${venue.address}`,
          unitPriceMinor: venue.feeMinor,
          quantity: 1,
          totalPriceMinor: venue.feeMinor,
          currency: venue.currency,
        });
      }
    }

    const subtotalMinor = basePriceMinor + addonsTotalMinor + venueFeeMinor + travelFeeMinor;

    // 4. Coupon Evaluation
    if (input.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: input.couponCode.toUpperCase().trim(), isActive: true },
      });

      if (coupon) {
        const isNotExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > new Date();
        const meetsMinimum = subtotalMinor >= coupon.minOrderMinor;
        const withinMaxUses = coupon.usedCount < coupon.maxUses;

        if (isNotExpired && meetsMinimum && withinMaxUses) {
          if (coupon.discountType === "PERCENTAGE") {
            discountMinor = Math.round((subtotalMinor * coupon.discountValue) / 100);
          } else {
            discountMinor = Math.min(coupon.discountValue, subtotalMinor);
          }

          appliedCoupon = {
            code: coupon.code,
            discountMinor,
          };
        }
      }
    }

    const totalAmountMinor = Math.max(0, subtotalMinor - discountMinor);

    // Deposit Rule: 30% of total or minimum PKR 20,000 (2,000,000 Paisa), capped at total
    const calculatedDeposit = Math.round(totalAmountMinor * 0.3);
    const depositRequiredMinor = Math.min(totalAmountMinor, Math.max(2000000, calculatedDeposit));

    return {
      basePriceMinor,
      addonsTotalMinor,
      venueFeeMinor,
      travelFeeMinor,
      discountMinor,
      subtotalMinor,
      taxMinor: 0,
      totalAmountMinor,
      depositRequiredMinor,
      currency: "PKR",
      items,
      appliedCoupon,
    };
  }
}
