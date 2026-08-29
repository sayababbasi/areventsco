import { prisma } from "@/lib/db";
import { generateBookingReference, generateInvoiceNumber } from "@/lib/utils";
import { BookingCreateInputSchema } from "@/lib/validation/booking.schema";
import { AvailabilityService } from "./availability.service";
import { PricingService } from "./pricing.service";
import { BookingStatus } from "@/types";
import { hashPassword } from "@/lib/auth";

export class BookingService {
  /**
   * Creates a new booking with transactional safety, price snapshotting, and initial invoice generation.
   */
  static async create(input: BookingCreateInputSchema) {
    const eventDate = new Date(input.eventDate);

    // 1. Availability validation
    const availability = await AvailabilityService.checkAvailability(
      eventDate,
      input.startTime,
      input.city
    );

    if (!availability.isAvailable) {
      throw new Error(availability.reason || "The selected date is currently unavailable.");
    }

    // 2. Authoritative Price calculation
    const pricing = await PricingService.calculate({
      packageId: input.packageId,
      themeId: input.themeId,
      addonIds: input.addonIds,
      venueId: input.venueId,
      city: input.city,
      guestCount: input.guestCount,
      couponCode: input.couponCode,
    });

    // 3. Find or Create User & Customer Profile
    let user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
      include: { customerProfile: true },
    });

    if (!user) {
      const temporaryPassword = await hashPassword("Welcome@" + Math.floor(1000 + Math.random() * 9000));
      user = await prisma.user.create({
        data: {
          email: input.email.toLowerCase().trim(),
          name: input.name.trim(),
          phone: input.phone.trim(),
          passwordHash: temporaryPassword,
          role: "CUSTOMER",
          customerProfile: {
            create: {
              city: input.city,
              address: input.address.trim(),
            },
          },
        },
        include: { customerProfile: true },
      });
    } else if (!user.customerProfile) {
      const profile = await prisma.customerProfile.create({
        data: {
          userId: user.id,
          city: input.city,
          address: input.address.trim(),
        },
      });
      user.customerProfile = profile;
    }

    const reference = generateBookingReference();

    // 4. Execute Transaction: Booking + Snapshot Items + Initial Invoice + Notification
    const invoiceCount = await prisma.invoice.count();
    const invoiceNumber = generateInvoiceNumber(invoiceCount + 1);

    const booking = await prisma.$transaction(async (tx) => {
      // Create Booking record
      const createdBooking = await tx.booking.create({
        data: {
          reference,
          customerId: user.customerProfile!.id,
          eventType: input.eventType || "Birthday",
          eventDate,
          startTime: input.startTime,
          endTime: input.endTime || "22:00",
          guestCount: input.guestCount,
          city: input.city,
          venueLocation: input.address,
          packageId: input.packageId,
          themeId: input.themeId,
          venueId: input.venueId,
          status: "INQUIRY",
          currency: pricing.currency,
          basePriceMinor: pricing.basePriceMinor,
          addonsTotalMinor: pricing.addonsTotalMinor,
          venueFeeMinor: pricing.venueFeeMinor,
          travelFeeMinor: pricing.travelFeeMinor,
          discountMinor: pricing.discountMinor,
          taxMinor: pricing.taxMinor,
          totalAmountMinor: pricing.totalAmountMinor,
          depositRequiredMinor: pricing.depositRequiredMinor,
          amountPaidMinor: 0,
          balanceDueMinor: pricing.totalAmountMinor,
          specialRequests: input.specialRequests,
        },
      });

      // Insert Snapshot Line Items
      if (pricing.items.length > 0) {
        await tx.bookingItem.createMany({
          data: pricing.items.map((item) => ({
            bookingId: createdBooking.id,
            itemType: item.itemType,
            itemId: item.itemId,
            name: item.name,
            description: item.description,
            unitPriceMinor: item.unitPriceMinor,
            quantity: item.quantity,
            totalPriceMinor: item.totalPriceMinor,
            currency: item.currency,
          })),
        });
      }

      // Create Initial Invoice
      await tx.invoice.create({
        data: {
          invoiceNumber,
          bookingId: createdBooking.id,
          customerName: input.name,
          customerEmail: input.email,
          customerPhone: input.phone,
          customerAddress: input.address,
          subtotalMinor: pricing.subtotalMinor,
          discountMinor: pricing.discountMinor,
          taxMinor: pricing.taxMinor,
          totalAmountMinor: pricing.totalAmountMinor,
          amountPaidMinor: 0,
          balanceDueMinor: pricing.totalAmountMinor,
          status: "UNPAID",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Due in 3 days
          items: {
            create: pricing.items.map((item) => ({
              description: item.name,
              unitPriceMinor: item.unitPriceMinor,
              quantity: item.quantity,
              totalPriceMinor: item.totalPriceMinor,
              currency: item.currency,
            })),
          },
        },
      });

      // Increment Coupon count if applied
      if (pricing.appliedCoupon) {
        await tx.coupon.updateMany({
          where: { code: pricing.appliedCoupon.code },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Notification
      await tx.notification.create({
        data: {
          userId: user.id,
          bookingId: createdBooking.id,
          title: "Birthday Inquiry Received",
          message: `Your booking request ${reference} has been received. Our event coordinator will review and confirm shortly.`,
          channel: "IN_APP",
        },
      });

      return createdBooking;
    });

    return this.getByReference(booking.reference);
  }

  /**
   * Fetches a full booking by its unique reference code with customer and item details.
   */
  static async getByReference(reference: string) {
    return prisma.booking.findUnique({
      where: { reference },
      include: {
        customer: {
          include: { user: true },
        },
        package: true,
        theme: true,
        venue: true,
        items: true,
        invoices: {
          include: { items: true },
        },
        payments: true,
      },
    });
  }

  /**
   * Updates booking status with audit trail logging
   */
  static async updateStatus(
    bookingId: string,
    newStatus: BookingStatus,
    performedByUserId?: string,
    notes?: string
  ) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: newStatus,
          internalNotes: notes ? `${booking.internalNotes || ""}\n${notes}` : booking.internalNotes,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: performedByUserId,
          action: `STATUS_CHANGED_TO_${newStatus}`,
          entityType: "Booking",
          entityId: bookingId,
          details: JSON.stringify({
            previousStatus: booking.status,
            newStatus,
            notes,
          }),
        },
      });

      return res;
    });

    return updated;
  }
}
