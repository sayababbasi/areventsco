"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Lock,
  ExternalLink,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { toSafepayAmount } from "@/lib/payments/currency";
import { useRealtime } from "@/client/hooks/useRealtime";

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
  totalAmountMinor: initialTotal,
  depositRequiredMinor: initialDeposit,
  amountPaidMinor: initialPaid,
  balanceDueMinor: initialBalance,
  isFullyPaid: initialIsFullyPaid,
  isAdvancePaid: initialIsAdvancePaid,
}: SafepayPaymentCardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Local live state synced with database
  const [totalAmountMinor, setTotalAmountMinor] = useState(initialTotal);
  const [depositRequiredMinor, setDepositRequiredMinor] = useState(initialDeposit);
  const [amountPaidMinor, setAmountPaidMinor] = useState(initialPaid);
  const [balanceDueMinor, setBalanceDueMinor] = useState(initialBalance);
  const [isFullyPaid, setIsFullyPaid] = useState(initialIsFullyPaid);
  const [isAdvancePaid, setIsAdvancePaid] = useState(initialIsAdvancePaid);

  // Status & loading states
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [recentPaymentSuccess, setRecentPaymentSuccess] = useState(false);
  const [verificationPendingNotice, setVerificationPendingNotice] = useState<string | null>(null);

  const pollCountRef = useRef(0);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch live payment status from backend
  const refreshPaymentStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingReference}/payment-status`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setTotalAmountMinor(data.totalAmountMinor);
        setDepositRequiredMinor(data.depositRequiredMinor);
        setAmountPaidMinor(data.amountPaidMinor);
        setBalanceDueMinor(data.balanceDueMinor);
        setIsFullyPaid(data.isFullyPaid);
        setIsAdvancePaid(data.isAdvancePaid);
        return data;
      }
    } catch (err) {
      console.error("[PAYMENT-CARD] Failed to refresh payment status:", err);
    }
    return null;
  }, [bookingReference]);

  // 2. Real-time Event Subscription for instant status synchronization
  useRealtime({
    channels: `booking:${bookingReference}`,
    onEvent: (evt) => {
      if (evt.type === "PAYMENT_COMPLETED" || evt.type === "BOOKING_STATUS_UPDATED") {
        setVerifying(false);
        setVerificationPendingNotice(null);
        setRecentPaymentSuccess(true);
        if (typeof evt.data.amountPaidMinor === "number") {
          setAmountPaidMinor(evt.data.amountPaidMinor);
        }
        if (typeof evt.data.balanceDueMinor === "number") {
          setBalanceDueMinor(evt.data.balanceDueMinor);
          setIsFullyPaid(evt.data.balanceDueMinor === 0);
        }
        refreshPaymentStatus();
      }
    },
  });

  // 3. Active Verification with Safepay Gateway
  const verifyTracker = useCallback(
    async (token: string) => {
      setVerifying(true);
      setErrorMessage(null);
      setVerificationPendingNotice(null);

      try {
        const res = await fetch(`/api/payments/safepay/verify?token=${encodeURIComponent(token)}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success && (data.status === "PAID" || data.status === "TRACKER_ENDED")) {
          setRecentPaymentSuccess(true);
          await refreshPaymentStatus();
        } else if (data.status === "FAILED") {
          setErrorMessage(data.error || "Payment was declined or cancelled. Please try again.");
        } else {
          setVerificationPendingNotice(
            "Your transaction is currently being processed by your bank and Safepay. Your payment will update automatically."
          );
        }
      } catch (err: any) {
        console.error("[PAYMENT-CARD] Tracker verification error:", err);
      } finally {
        setVerifying(false);
      }
    },
    [refreshPaymentStatus]
  );

  // 3. Handle URL parameters on return/redirect from Safepay
  useEffect(() => {
    const tokenParam = searchParams?.get("tracker") || searchParams?.get("token");

    if (tokenParam) {
      verifyTracker(tokenParam);
    }
  }, [searchParams, verifyTracker]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  // 4. Initiate Payment Session (Direct Top-Level Secure Checkout)
  const handleInitiatePayment = async (type: "ADVANCE" | "BALANCE" | "FULL") => {
    if (loadingType || verifying) return; // Prevent double clicks

    setLoadingType(type);
    setErrorMessage(null);
    setVerificationPendingNotice(null);

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
        throw new Error(data.error || "Unable to initialize secure payment session. Please try again.");
      }

      // Direct top-level redirection to Safepay's official checkout portal
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      console.error("[PAYMENT-CARD] Initiation error:", err);
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
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-gold-500/10 text-brand-gold-600 flex items-center justify-center">
            <Lock className="w-4 h-4 text-brand-gold-600" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-brand-navy-950">
              Secure Online Payment
            </h3>
            <p className="text-[11px] text-brand-navy-500">
              Safepay 3D-Secure 2.0 (Debit / Credit Cards & Digital Banking)
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-navy-950 text-brand-gold-300">
          <ShieldCheck className="w-3 h-3 text-brand-gold-400" />
          256-Bit SSL
        </span>
      </div>

      {/* Payment Success Banner */}
      {(recentPaymentSuccess || isFullyPaid) && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-900 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              {isFullyPaid ? "Booking Paid in Full!" : "Advance Deposit Successfully Received!"}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            Your payment has been verified by the gateway. Your booking is confirmed and your official digital invoice has been automatically reconciled.
          </p>
        </div>
      )}

      {/* Verifying Status */}
      {verifying && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2.5">
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold">Verifying payment with Safepay...</span>
            <p className="text-[11px] text-blue-700">Please do not refresh or close this window.</p>
          </div>
        </div>
      )}

      {/* Pending Notice */}
      {verificationPendingNotice && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
          <RefreshCw className="w-4 h-4 text-amber-600 animate-spin flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Payment Confirmation in Progress</span>
            <p className="text-[11px] text-amber-800 leading-relaxed">{verificationPendingNotice}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span className="leading-tight">{errorMessage}</span>
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
        <div className="text-center py-3 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>✓ PAID IN FULL — No Further Balance Due</span>
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          {/* 1. Pay Advance Deposit Button */}
          {advanceRemainingMinor > 0 && (
            <button
              onClick={() => handleInitiatePayment("ADVANCE")}
              disabled={!!loadingType || verifying}
              className="w-full btn-gold py-3 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loadingType === "ADVANCE" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Redirecting to Secure Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-white" />
                  <span>Pay Advance Deposit — {formatPKR(advanceRemainingMinor)}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          )}

          {/* Advance Completed Badge */}
          {isAdvancePaid && advanceRemainingMinor === 0 && !isFullyPaid && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>✓ Advance Deposit Received ({formatPKR(amountPaidMinor)})</span>
            </div>
          )}

          {/* 2. Pay Remaining Balance or Full Amount */}
          {balanceDueMinor > 0 && (
            <button
              onClick={() => handleInitiatePayment(isAdvancePaid ? "BALANCE" : "FULL")}
              disabled={!!loadingType || verifying}
              className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-2 disabled:opacity-50 ${
                advanceRemainingMinor > 0
                  ? "bg-white hover:bg-brand-warm-50 text-brand-navy-900 border-brand-warm-300"
                  : "btn-gold shadow-md hover:shadow-lg"
              }`}
            >
              {loadingType === "BALANCE" || loadingType === "FULL" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Redirecting to Secure Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isAdvancePaid
                      ? `Pay Remaining Balance — ${formatPKR(balanceDueMinor)}`
                      : `Pay Full Amount Online — ${formatPKR(totalAmountMinor)}`}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Footer Security Badges */}
      <div className="pt-2 border-t border-brand-warm-200 flex flex-wrap items-center justify-between gap-2 text-[10px] text-brand-navy-400">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-brand-navy-600">Accepted:</span>
          <span>Visa, MasterCard, UnionPay, PayPak</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>PCI-DSS Level 1 256-Bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
}
