import { NextResponse } from "next/server";
import { priceCalculationSchema } from "@/lib/validation/booking.schema";
import { PricingService } from "@/server/services/pricing.service";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Rate limiting: max 30 price calculations per minute per IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = await rateLimit(`pricing_${ip}`, 30, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMIT_EXCEEDED", message: "Rate limit exceeded. Please slow down." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = priceCalculationSchema.parse(body);

    const calculation = await PricingService.calculate({
      packageId: validated.packageId,
      themeId: validated.themeId,
      addonIds: validated.addonIds,
      serviceIds: validated.serviceIds,
      venueId: validated.venueId,
      city: validated.city,
      guestCount: validated.guestCount,
      couponCode: validated.couponCode,
    });

    return NextResponse.json({
      success: true,
      data: calculation,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CALCULATION_ERROR",
          message: (error as Error).message || "Failed to calculate pricing",
        },
      },
      { status: 400 }
    );
  }
}
