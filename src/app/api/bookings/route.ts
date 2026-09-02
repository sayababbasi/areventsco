import { NextResponse } from "next/server";
import { bookingCreateSchema } from "@/lib/validation/booking.schema";
import { BookingService } from "@/server/services/booking.service";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = bookingCreateSchema.parse(body);

    const booking = await BookingService.create(validated);

    if (booking?.id) {
      try {
        const { eventBus } = await import("@/lib/realtime/event-bus");
        const fullBooking = await prisma.booking.findUnique({
          where: { id: booking.id },
          include: {
            customer: { include: { user: true } },
            package: true,
            theme: true,
            venue: true,
            invoices: true,
            payments: true,
          },
        });

        if (fullBooking) {
          eventBus.broadcast("BOOKING_CREATED", "admin", fullBooking, true);
        }
      } catch (e) {
        console.error("[REALTIME] Error broadcasting new booking:", e);
      }
    }

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

import { getAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAuthSession();
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = ["ADMIN", "SUPER_ADMIN", "STAFF", "EVENT_MANAGER"].includes(session.role);

    const where = isAdmin ? {} : {
      customer: {
        user: {
          email: session.email
        }
      }
    };

    const bookings = await prisma.booking.findMany({
      where,
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
