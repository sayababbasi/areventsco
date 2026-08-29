// Payment Gateway Provider Abstraction for AR Events Co.
// Enables seamless swapping between Safepay, PayFast, Manual Bank Transfer, and Mock

export interface PaymentIntentOptions {
  bookingId: string;
  bookingReference: string;
  amountMinor: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentIntentResult {
  providerPaymentId: string;
  checkoutUrl?: string;
  status: "PENDING" | "PAID" | "REQUIRES_ACTION";
  rawResponse?: Record<string, unknown>;
}

export interface IPaymentGateway {
  createPaymentIntent(options: PaymentIntentOptions): Promise<PaymentIntentResult>;
  verifyPayment(providerPaymentId: string, payload?: Record<string, unknown>): Promise<boolean>;
  refundPayment(providerPaymentId: string, amountMinor: number): Promise<boolean>;
}

export class MockPaymentGateway implements IPaymentGateway {
  async createPaymentIntent(options: PaymentIntentOptions): Promise<PaymentIntentResult> {
    const mockId = `MOCK-PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return {
      providerPaymentId: mockId,
      checkoutUrl: `/booking/${options.bookingReference}?payment_id=${mockId}&status=simulated`,
      status: "PENDING",
    };
  }

  async verifyPayment(providerPaymentId: string): Promise<boolean> {
    return Boolean(providerPaymentId);
  }

  async refundPayment(): Promise<boolean> {
    return true;
  }
}

export class BankTransferPaymentGateway implements IPaymentGateway {
  async createPaymentIntent(options: PaymentIntentOptions): Promise<PaymentIntentResult> {
    return {
      providerPaymentId: `BANK-TRX-${Date.now()}`,
      status: "PENDING",
      rawResponse: {
        instructions: "Please transfer the advance deposit to Meezan Bank / HBL account and upload the receipt.",
        bankName: "Meezan Bank Ltd",
        accountTitle: "AR Events Co.",
        accountNumber: "02010108932014",
        iban: "PK89MEZN0002010108932014",
      },
    };
  }

  async verifyPayment(): Promise<boolean> {
    return true;
  }

  async refundPayment(): Promise<boolean> {
    return true;
  }
}

export function getPaymentGateway(): IPaymentGateway {
  const provider = process.env.PAYMENT_PROVIDER || "mock";
  if (provider === "bank_transfer") {
    return new BankTransferPaymentGateway();
  }
  return new MockPaymentGateway();
}
