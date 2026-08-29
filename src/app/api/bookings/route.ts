import { NextResponse } from "next/server";
import { bookingCreateSchema } from "@/lib/validation/booking.schema";
import { BookingService } from "@/server/services/booking.service";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = bookingCreateSchema.parse(body);

    const booking = await BookingService.create(validated);

    return NextResponse.json(
      {
        success: true,
        data: booking,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BOOKING_CREATION_FAILED",
          message: (error as Error).message || "Unable to create booking request",
        },
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        customer: {
          include: { user: true },
        },
        package: true,
        theme: true,
        venue: true,
        invoices: true,
        payments: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_BOOKINGS_ERROR",
          message: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}
