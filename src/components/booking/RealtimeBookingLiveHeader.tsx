"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Zap, Wifi } from "lucide-react";
import { useRealtime } from "@/client/hooks/useRealtime";

interface RealtimeBookingLiveHeaderProps {
  reference: string;
  initialStatus: string;
  initialAmountPaidMinor: number;
  initialBalanceDueMinor: number;
  totalAmountMinor: number;
}

export function RealtimeBookingLiveHeader({
  reference,
  initialStatus,
  initialAmountPaidMinor,
  initialBalanceDueMinor,
  totalAmountMinor,
}: RealtimeBookingLiveHeaderProps) {
  const [status, setStatus] = useState(initialStatus);
  const [amountPaidMinor, setAmountPaidMinor] = useState(initialAmountPaidMinor);
  const [balanceDueMinor, setBalanceDueMinor] = useState(initialBalanceDueMinor);
  const [justUpdated, setJustUpdated] = useState(false);

  const { isConnected } = useRealtime({
    channels: `booking:${reference}`,
    onEvent: (evt) => {
      if (evt.type === "BOOKING_STATUS_UPDATED" || evt.type === "PAYMENT_COMPLETED") {
        if (evt.data.status) {
          setStatus(evt.data.status);
        }
        if (typeof evt.data.amountPaidMinor === "number") {
          setAmountPaidMinor(evt.data.amountPaidMinor);
        }
        if (typeof evt.data.balanceDueMinor === "number") {
          setBalanceDueMinor(evt.data.balanceDueMinor);
        }

        setJustUpdated(true);
        setTimeout(() => setJustUpdated(false), 3000);
      }
    },
  });

  const getStatusBadge = (currentStatus: string) => {
    switch (currentStatus) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs px-3.5 py-1.5 rounded-full font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            CONFIRMED & RESERVED
          </span>
        );
      case "PREPARING":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs px-3.5 py-1.5 rounded-full font-bold shadow-sm">
            <Clock className="w-4 h-4 text-amber-600" />
            IN DECOR PRODUCTION
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs px-3.5 py-1.5 rounded-full font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            EVENT COMPLETED
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs px-3.5 py-1.5 rounded-full font-bold shadow-sm">
            <Clock className="w-4 h-4 text-amber-600" />
            PENDING DEPOSIT
          </span>
        );
      case "INQUIRY":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-brand-navy-100 text-brand-navy-900 text-xs px-3.5 py-1.5 rounded-full font-bold shadow-sm">
            <Clock className="w-4 h-4 text-brand-navy-700" />
            UNDER COORDINATOR REVIEW
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
      <div className="flex items-center gap-2">
        <div className={`transition-all duration-300 ${justUpdated ? "scale-105 ring-2 ring-brand-gold-400 rounded-full" : ""}`}>
          {getStatusBadge(status)}
        </div>
        {justUpdated && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-gold-700 bg-brand-gold-50 border border-brand-gold-300 px-2 py-0.5 rounded-md animate-pulse">
            <Zap className="w-3 h-3 text-brand-gold-600" /> Updated Just Now
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2.5 py-1 rounded-full border ${
            isConnected
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
          {isConnected ? "Live Connected" : "Connecting..."}
        </span>
      </div>
    </div>
  );
}
