import React from "react";
import Image from "next/image";

interface CardLogoProps {
  className?: string;
}

export function VisaLogo({ className = "h-5 sm:h-6 w-auto" }: CardLogoProps) {
  return (
    <div className="inline-flex items-center justify-center bg-white rounded-md border border-brand-warm-200 px-2 py-1 shadow-2xs hover:border-brand-gold-400 transition-colors h-8">
      <img
        src="/images/payments/visa.png"
        alt="Visa"
        className={`${className} object-contain max-h-5 sm:max-h-6 max-w-[48px]`}
        loading="eager"
      />
    </div>
  );
}

export function MastercardLogo({ className = "h-5 sm:h-6 w-auto" }: CardLogoProps) {
  return (
    <div className="inline-flex items-center justify-center bg-white rounded-md border border-brand-warm-200 px-2 py-1 shadow-2xs hover:border-brand-gold-400 transition-colors h-8">
      <img
        src="/images/payments/mastercard.png"
        alt="MasterCard"
        className={`${className} object-contain max-h-5 sm:max-h-6 max-w-[48px]`}
        loading="eager"
      />
    </div>
  );
}

export function PayPakLogo({ className = "h-5 sm:h-6 w-auto" }: CardLogoProps) {
  return (
    <div className="inline-flex items-center justify-center bg-white rounded-md border border-brand-warm-200 px-2 py-1 shadow-2xs hover:border-brand-gold-400 transition-colors h-8">
      <img
        src="/images/payments/paypak.png"
        alt="PayPak"
        className={`${className} object-contain max-h-5 sm:max-h-6 max-w-[48px]`}
        loading="eager"
      />
    </div>
  );
}

export function UnionPayLogo({ className = "h-5 sm:h-6 w-auto" }: CardLogoProps) {
  return (
    <div className="inline-flex items-center justify-center bg-white rounded-md border border-brand-warm-200 px-2 py-1 shadow-2xs hover:border-brand-gold-400 transition-colors h-8">
      <img
        src="/images/payments/unionpay.png"
        alt="UnionPay"
        className={`${className} object-contain max-h-5 sm:max-h-6 max-w-[48px]`}
        loading="eager"
      />
    </div>
  );
}

export function AcceptedPaymentBadges() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-brand-navy-700 mr-0.5">Accepted:</span>
      <VisaLogo className="h-5 sm:h-6 w-auto" />
      <MastercardLogo className="h-5 sm:h-6 w-auto" />
      <PayPakLogo className="h-5 sm:h-6 w-auto" />
      <UnionPayLogo className="h-5 sm:h-6 w-auto" />
    </div>
  );
}
