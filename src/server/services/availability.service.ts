import { prisma } from "@/lib/db";

export class AvailabilityService {
  /**
   * Checks whether a given date and time window is available for a new booking.
   */
  static async checkAvailability(
    date: Date | string,
    startTime: string,
    city = "Islamabad"
  ): Promise<{
    isAvailable: boolean;
    reason?: string;
    bookedCount: number;
    maxAllowed: number;
  }> {
    const targetDate = typeof date === "string" ? new Date(date) : date;
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Check if the slot/day is explicitly blocked by Admin
    const blockedSlot = await prisma.availabilitySlot.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        isBlocked: true,
      },
    });

    if (blockedSlot) {
      return {
        isAvailable: false,
        reason: blockedSlot.blockReason || "This date has been marked unavailable by our operations team.",
        bookedCount: blockedSlot.bookedEventsCount,
        maxAllowed: blockedSlot.maxConcurrentEvents,
      };
    }

    // 2. Count existing confirmed/preparing/inquiry events on this date
    const activeBookingsCount = await prisma.booking.count({
      where: {
        eventDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["PENDING", "QUOTED", "CONFIRMED", "PREPARING", "INQUIRY", "AWAITING_PAYMENT"],
        },
      },
    });

    // Default max concurrent events per day across twin cities
    const MAX_CONCURRENT_DAILY_EVENTS = 4;

    if (activeBookingsCount >= MAX_CONCURRENT_DAILY_EVENTS) {
      return {
        isAvailable: false,
        reason: "We have reached our maximum event capacity for this date. Please select an alternate date.",
        bookedCount: activeBookingsCount,
        maxAllowed: MAX_CONCURRENT_DAILY_EVENTS,
      };
    }

    return {
      isAvailable: true,
      bookedCount: activeBookingsCount,
      maxAllowed: MAX_CONCURRENT_DAILY_EVENTS,
    };
  }
}
