"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Lock,
  X,
  ExternalLink,
  Receipt,
  FileText,
} from "lucide-react";
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

  // Embedded Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [activeTrackerToken, setActiveTrackerToken] = useState<string | null>(null);
  const [activePaymentType, setActivePaymentType] = useState<string | null>(null);
  const [activePayableAmountMinor, setActivePayableAmountMinor] = useState<number>(0);

  // Status & loading states
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [recentPaymentSuccess, setRecentPaymentSuccess] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // 1. Fetch live payment status from backend
  const refreshPaymentStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingReference}/payment-status`);
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

  // 2. Active Verification with Safepay Gateway
  const verifyTracker = useCallback(
    async (token: string) => {
      setVerifying(true);
      try {
        const res = await fetch(`/api/payments/safepay/verify?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (data.success && (data.status === "PAID" || data.status === "TRACKER_ENDED")) {
          setRecentPaymentSuccess(true);
          setModalOpen(false);
          await refreshPaymentStatus();
          router.refresh();
        } else if (data.status === "FAILED") {
          setErrorMessage(data.error || "Payment was declined or failed. Please try again.");
          setModalOpen(false);
        }
      } catch (err: any) {
        console.error("[PAYMENT-CARD] Tracker verification error:", err);
      } finally {
        setVerifying(false);
      }
    },
    [refreshPaymentStatus, router]
  );

  // 3. Handle URL parameters on return/redirect
  useEffect(() => {
    const tokenParam = searchParams?.get("tracker") || searchParams?.get("token");

    if (tokenParam) {
      verifyTracker(tokenParam);
    }
  }, [searchParams, verifyTracker]);

  // 4. Listen for postMessage from Safepay iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check if message is from Safepay
      if (typeof event.data === "string" || typeof event.data === "object") {
        try {
          const payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
          if (
            payload.event === "safepay.checkout.complete" ||
            payload.status === "success" ||
            payload.state === "TRACKER_ENDED"
          ) {
            if (activeTrackerToken) {
              verifyTracker(activeTrackerToken);
            }
          }
        } catch {
          // Ignore non-JSON messages
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeTrackerToken, verifyTracker]);

  // 5. Start Polling when Modal is Open
  useEffect(() => {
    if (modalOpen && activeTrackerToken) {
      const interval = setInterval(async () => {
        const liveStatus = await refreshPaymentStatus();
        if (liveStatus?.isFullyPaid || (activePaymentType === "ADVANCE" && liveStatus?.isAdvancePaid)) {
          setRecentPaymentSuccess(true);
          setModalOpen(false);
          clearInterval(interval);
        }
      }, 3000);
      setPollingInterval(interval);

      return () => clearInterval(interval);
    } else if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  }, [modalOpen, activeTrackerToken, activePaymentType, refreshPaymentStatus]);

  // 6. Initiate Payment Session (Direct Top-Level Secure Checkout)
  const handleInitiatePayment = async (type: "ADVANCE" | "BALANCE" | "FULL") => {
    if (loadingType || verifying) return; // Prevent double click

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

      // Direct top-level redirection to Safepay's official checkout page
      // This eliminates browser 3rd-party cookie & nested iframe PCI blocks on card inputs
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
    <>
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
                Safepay 3D-Secure 2.0 Checkout (Debit / Credit Cards)
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
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
            <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                {isFullyPaid ? "Booking Paid in Full!" : "Advance Deposit Successfully Verified!"}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Your payment has been securely confirmed via Safepay. Your booking status is confirmed
              and your official digital invoice has been automatically reconciled.
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
            <span>Reconciling transaction with Safepay server...</span>
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
            <span>PAID IN FULL — No Further Payments Required</span>
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
                    <span>Preparing Secure Checkout...</span>
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
                <span>Advance Deposit Paid ({formatPKR(amountPaidMinor)})</span>
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
                    <span>Preparing Secure Checkout...</span>
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

        {/* Sandbox Test Card Notice */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <CreditCard className="w-3.5 h-3.5 text-amber-700" />
            <span>Safepay Sandbox Test Card Credentials:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] font-mono text-amber-950 bg-white/70 p-2 rounded-lg border border-amber-200">
            <div><span className="text-amber-700 font-sans font-semibold">Card:</span> 4242 4242 4242 4242</div>
            <div><span className="text-amber-700 font-sans font-semibold">Expiry:</span> 12/28</div>
            <div><span className="text-amber-700 font-sans font-semibold">CVV:</span> 123</div>
          </div>
        </div>

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
    </>
  );
}
