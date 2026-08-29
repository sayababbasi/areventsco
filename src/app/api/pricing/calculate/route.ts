import { NextResponse } from "next/server";
import { priceCalculationSchema } from "@/lib/validation/booking.schema";
import { PricingService } from "@/server/services/pricing.service";

export async function POST(req: Request) {
  try {
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
