import { z } from "zod";

export const priceCalculationSchema = z.object({
  packageId: z.string().optional(),
  themeId: z.string().optional(),
  addonIds: z.array(z.string()).default([]),
  serviceIds: z.array(z.string()).default([]),
  venueId: z.string().optional(),
  city: z.enum(["Islamabad", "Rawalpindi"]).default("Islamabad"),
  guestCount: z.number().min(5).max(1000).default(30),
  couponCode: z.string().optional(),
});

export const bookingCreateSchema = z.object({
  // Customer details
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(10, "Valid Pakistani phone number required (e.g. 0300 1234567)"),
  address: z.string().min(5, "Address or venue location is required"),
  
  // Event details
  eventType: z.string().default("Birthday"),
  eventDate: z.string().min(1, "Event date is required"), // YYYY-MM-DD
  startTime: z.string().min(1, "Start time is required"), // e.g. "18:00"
  endTime: z.string().default("22:00"),
  city: z.enum(["Islamabad", "Rawalpindi"]).default("Islamabad"),
  guestCount: z.number().min(5).max(1000).default(30),
  
  // Selection
  packageId: z.string().optional(),
  themeId: z.string().optional(),
  venueId: z.string().optional(),
  addonIds: z.array(z.string()).default([]),
  couponCode: z.string().optional(),
  
  specialRequests: z.string().optional(),
});

export type PriceCalculationInputSchema = z.infer<typeof priceCalculationSchema>;
export type BookingCreateInputSchema = z.infer<typeof bookingCreateSchema>;
