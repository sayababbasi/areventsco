export type PaymentProviderType = "safepay" | "manual" | "mock";

export type PaymentTypeEnum = "DEPOSIT" | "ADVANCE" | "BALANCE" | "FULL" | "ADJUSTMENT" | "REFUND";

export type PaymentStatusEnum =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "VERIFIED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface CreatePaymentSessionParams {
  bookingReference: string;
  paymentType?: "ADVANCE" | "BALANCE" | "FULL";
  redirectUrl?: string;
  cancelUrl?: string;
}

export interface PaymentSessionResult {
  success: boolean;
  checkoutUrl?: string;
  token?: string;
  paymentId?: string;
  amountMinor?: number;
  currency?: string;
  error?: string;
}

export interface SafepayTrackerData {
  id?: number | string;
  token: string;
  client?: string;
  amount: number | string;
  currency: string;
  environment?: string;
  state: string; // TRACKER_STARTED, TRACKER_ENDED, PAID, COMPLETED, FAILED, CANCELLED
  state_reason?: string;
  order_id?: string;
  transaction?: {
    id?: string | number;
    token?: string;
    status?: string;
    amount?: number | string;
    currency?: string;
    reference?: string | number;
  } | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface WebhookProcessingResult {
  received: boolean;
  processed: boolean;
  event?: string;
  paymentId?: string;
  bookingReference?: string;
  status?: string;
  message?: string;
  error?: string;
}

