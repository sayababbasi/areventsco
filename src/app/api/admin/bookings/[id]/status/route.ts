import { NextResponse } from "next/server";
import { BookingService } from "@/server/services/booking.service";
import { BookingStatus } from "@/types";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, notes } = await req.json();

    if (!status) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_STATUS", message: "New status is required" } },
        { status: 400 }
      );
    }

    const updated = await BookingService.updateStatus(
      params.id,
      status as BookingStatus,
      undefined,
      notes
    );

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
