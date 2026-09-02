import { NextResponse } from "next/server";
import { BookingService } from "@/server/services/booking.service";
import { BookingStatus } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, notes } = await req.json();

    if (!status) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_STATUS", message: "New status is required" } },
        { status: 400 }
      );
    }

    const updated = await BookingService.updateStatus(
      id,
      status as BookingStatus,
      undefined,
      notes
    );

    // Realtime event broadcast
    try {
      const { eventBus } = await import("@/lib/realtime/event-bus");
      eventBus.broadcast(
        "BOOKING_STATUS_UPDATED",
        `booking:${updated.reference}`,
        {
          bookingId: updated.id,
          reference: updated.reference,
          status: updated.status,
          amountPaidMinor: updated.amountPaidMinor,
          balanceDueMinor: updated.balanceDueMinor,
        },
        true // Also notify admin channel
      );
    } catch (e) {
      console.error("[REALTIME] Error broadcasting status update:", e);
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "STATUS_UPDATE_FAILED", message: (error as Error).message } },
      { status: 400 }
    );
  }
}
