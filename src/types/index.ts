// Complete Domain Types for AR Events Co. Platform

export type BookingStatus =
  | "INQUIRY"
  | "PENDING"
  | "QUOTED"
  | "CONFIRMED"
  | "PREPARING"
  | "COMPLETED"
  | "CLOSED"
  | "CANCELLED"
  | "REJECTED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED"
  | "CANCELLED";

export type PaymentType = "DEPOSIT" | "FULL" | "PARTIAL" | "REFUND" | "ADJUSTMENT";

export type PaymentMethod = "BANK_TRANSFER" | "CASH" | "JAZZCASH" | "EASYPAISA" | "CARD";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "EVENT_MANAGER" | "STAFF" | "CUSTOMER";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown> | Array<unknown>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp?: string;
  };
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerProfileDto {
  id: string;
  userId: string;
  user: UserDto;
  address?: string | null;
  city?: string | null;
  emergencyContact?: string | null;
  notes?: string | null;
}

export interface PackageDto {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  basePriceMinor: number;
  currency: string;
  guestCapacityMin: number;
  guestCapacityMax: number;
  estimatedDurationHours: number;
  featuredImage?: string | null;
  galleryImages?: string[] | null;
  features: string[];
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface ThemeDto {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  colorPalette?: string[] | null;
  heroImage?: string | null;
  galleryImages?: string[] | null;
  includedDecor?: string[] | null;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface ServiceDto {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  priceType: "FIXED" | "PER_GUEST" | "HOURLY" | "CUSTOM";
  basePriceMinor: number;
  currency: string;
  image?: string | null;
  isActive: boolean;
}

export interface AddonDto {
  id: string;
  slug: string;
  title: string;
  category: string;
  description?: string | null;
  priceMinor: number;
  currency: string;
  image?: string | null;
  isActive: boolean;
}

export interface VenueDto {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  venueType: string;
  feeMinor: number;
  currency: string;
  images?: string[] | null;
  description?: string | null;
  isActive: boolean;
}

export interface BookingItemDto {
  id?: string;
  itemType: "PACKAGE" | "THEME" | "SERVICE" | "ADDON" | "VENUE_FEE" | "TRAVEL_FEE" | "CUSTOM";
  itemId?: string | null;
  name: string;
  description?: string | null;
  unitPriceMinor: number;
  quantity: number;
  totalPriceMinor: number;
  currency: string;
}

export interface BookingDto {
  id: string;
  reference: string;
  customerId: string;
  customer?: CustomerProfileDto;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  city: string;
  venueLocation: string;
  packageId?: string | null;
  package?: PackageDto | null;
  themeId?: string | null;
  theme?: ThemeDto | null;
  venueId?: string | null;
  venue?: VenueDto | null;
  status: BookingStatus;
  currency: string;
  basePriceMinor: number;
  addonsTotalMinor: number;
  venueFeeMinor: number;
  travelFeeMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalAmountMinor: number;
  depositRequiredMinor: number;
  amountPaidMinor: number;
  balanceDueMinor: number;
  specialRequests?: string | null;
  internalNotes?: string | null;
  items?: BookingItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceCalculationInput {
  packageId?: string;
  themeId?: string;
  addonIds?: string[];
  serviceIds?: string[];
  venueId?: string;
  city?: string;
  guestCount?: number;
  couponCode?: string;
}

export interface PriceCalculationResult {
  basePriceMinor: number;
  addonsTotalMinor: number;
  venueFeeMinor: number;
  travelFeeMinor: number;
  discountMinor: number;
  subtotalMinor: number;
  taxMinor: number;
  totalAmountMinor: number;
  depositRequiredMinor: number;
  currency: string;
  items: BookingItemDto[];
  appliedCoupon?: {
    code: string;
    discountMinor: number;
  } | null;
}

export interface ReviewDto {
  id: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  eventTitle: string;
  comment: string;
  authorAvatar?: string | null;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface FaqDto {
  id: string;
  question: string;
  answer: string;
  category: string;
  isFeatured: boolean;
}
