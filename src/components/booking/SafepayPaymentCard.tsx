"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, Lock, ExternalLink } from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface SafepayPaymentCardProps {
  bookingReference: string;
  totalAmountMinor: number;
  depositRequiredMinor: number;
  amountPaidMinor: number;
  balanceDueMinor: number;
  isFullyPaid: boolean;
  isAdvancePaid: boolean;
}

export function SafepayPaymentCard({
  bookingReference,
  totalAmountMinor,
  depositRequiredMinor,
  amountPaidMinor,
  balanceDueMinor,
  isFullyPaid,
  isAdvancePaid,
}: SafepayPaymentCardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const paymentStatus = searchParams.get("payment");
  const trackerToken = searchParams.get("token");

  // On return from Safepay checkout with success token, verify & sync with server
  useEffect(() => {
    if (paymentStatus === "success" && trackerToken) {
      setVerifying(true);
      fetch(`/api/payments/safepay/verify?token=${encodeURIComponent(trackerToken)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success || data.status === "PAID" || data.status === "TRACKER_ENDED") {
            setVerificationSuccess(true);
            router.refresh();
          } else {
            setErrorMessage(data.error || "Payment verification in progress or pending.");
          }
        })
        .catch((err) => {
          console.error("Verification check failed:", err);
        })
        .finally(() => {
          setVerifying(false);
        });
    }
  }, [paymentStatus, trackerToken, router]);

  const handleInitiatePayment = async (type: "ADVANCE" | "BALANCE" | "FULL") => {
    setLoadingType(type);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/payments/safepay/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingReference,
          paymentType: type,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.checkoutUrl) {
        throw new Error(data.error || "Unable to initialize Safepay checkout session");
      }

      // Redirect client to Safepay hosted checkout
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      setLoadingType(null);
    }
  };

  const requiredAdvance =
    depositRequiredMinor > 0 ? depositRequiredMinor : Math.round(totalAmountMinor * 0.3);

  const advanceRemainingMinor = Math.max(0, requiredAdvance - amountPaidMinor);

  return (
    <div className="card-luxury p-6 space-y-5 border-2 border-brand-gold-500/20 bg-gradient-to-br from-white via-white to-brand-warm-50/60 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-gold-500/10 text-brand-gold-600 flex items-center justify-center">
            <Lock className="w-4 h-4 text-brand-gold-600" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-brand-navy-950">
              Secure Online Payment
            </h3>
            <p className="text-[11px] text-brand-navy-500">
              Powered by Safepay Sandbox (Debit / Credit Cards)
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-navy-950 text-brand-gold-300">
          <ShieldCheck className="w-3 h-3 text-brand-gold-400" />
          256-Bit SSL
        </span>
      </div>

      {/* Payment Success Banner */}
      {(paymentStatus === "success" || verificationSuccess) && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
          <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Payment Successfully Verified!</span>
          </div>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            Thank you! Your payment has been processed and confirmed via Safepay. Your booking status has been updated and an official receipt has been issued below.
          </p>
        </div>
      )}

      {/* Payment Cancelled Banner */}
      {paymentStatus === "cancelled" && !isFullyPaid && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-900 text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Payment Cancelled</span>
          </div>
          <p className="text-[11px] text-amber-700">
            You exited the checkout session. No charges were made. You can retry paying your advance or balance at any time below.
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span className="leading-tight">{errorMessage}</span>
        </div>
      )}

      {/* Verifying Spinner */}
      {verifying && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
          <span>Verifying transaction status with Safepay gateway...</span>
        </div>
      )}

      {/* Financial Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-brand-warm-100/70 rounded-xl text-center border border-brand-warm-200">
        <div>
          <span className="text-[10px] text-brand-navy-500 uppercase font-semibold block">Total Booking</span>
          <span className="text-xs sm:text-sm font-bold text-brand-navy-950 font-serif">
            {formatPKR(totalAmountMinor)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-brand-navy-500 uppercase font-semibold block">Advance Required</span>
          <span className="text-xs sm:text-sm font-bold text-brand-gold-700 font-serif">
            {formatPKR(requiredAdvance)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-brand-navy-500 uppercase font-semibold block">Amount Paid</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-700 font-serif">
            {formatPKR(amountPaidMinor)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-brand-navy-500 uppercase font-semibold block">Remaining Balance</span>
          <span className="text-xs sm:text-sm font-bold text-rose-600 font-serif">
            {formatPKR(balanceDueMinor)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {isFullyPaid ? (
        <div className="text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>This booking is 100% fully paid. Thank you!</span>
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          {/* 1. Pay Advance Button (if advance is not yet satisfied) */}
          {advanceRemainingMinor > 0 && (
            <button
              onClick={() => handleInitiatePayment("ADVANCE")}
              disabled={!!loadingType || verifying}
              className="w-full btn-gold py-3 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              {loadingType === "ADVANCE" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Connecting to Safepay Checkout...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-white" />
                  <span>Pay Advance Deposit ({formatPKR(advanceRemainingMinor)})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          )}

          {/* 2. Pay Remaining Balance or Full Amount */}
          {balanceDueMinor > 0 && (
            <button
              onClick={() => handleInitiatePayment(isAdvancePaid ? "BALANCE" : "FULL")}
              disabled={!!loadingType || verifying}
              className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-2 ${
                advanceRemainingMinor > 0
                  ? "bg-white hover:bg-brand-warm-50 text-brand-navy-900 border-brand-warm-300"
                  : "btn-gold shadow-md hover:shadow-lg"
              }`}
            >
              {loadingType === "BALANCE" || loadingType === "FULL" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting to Safepay Checkout...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isAdvancePaid
                      ? `Pay Remaining Balance (${formatPKR(balanceDueMinor)})`
                      : `Pay Full Amount Online (${formatPKR(totalAmountMinor)})`}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Footer Security Badges */}
      <div className="pt-2 border-t border-brand-warm-200/80 flex items-center justify-between text-[11px] text-brand-navy-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold-600" />
          PCI-DSS Compliant Gateway
        </span>
        <span className="font-mono text-[10px] text-brand-navy-400">
          Visa • MasterCard • UnionPay • PayPak
        </span>
      </div>
    </div>
  );
}
