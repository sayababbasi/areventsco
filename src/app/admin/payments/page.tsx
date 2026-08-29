"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  Search,
  Loader2,
  RefreshCw,
  X,
  DollarSign,
  CheckCircle2,
  Clock,
  Receipt,
  Eye,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface PaymentRecord {
  id: string;
  amountMinor: number;
  currency: string;
  paymentType: string;
  paymentMethod: string;
  status: string;
  providerRef?: string;
  notes?: string;
  paidAt?: string;
  createdAt: string;
  booking: {
    id: string;
    reference: string;
    totalAmountMinor: number;
    amountPaidMinor: number;
    balanceDueMinor: number;
    customer: {
      user: {
        name: string;
        phone?: string;
        email: string;
      };
    };
    theme?: { title: string };
    package?: { title: string };
  };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Record Payment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form Fields
  const [bookingId, setBookingId] = useState("");
  const [amountPKR, setAmountPKR] = useState(25000);
  const [paymentType, setPaymentType] = useState("DEPOSIT");
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [providerRef, setProviderRef] = useState("");
  const [notes, setNotes] = useState("");

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/payments");
      const json = await res.json();
      if (json.success) {
        setPayments(json.data.payments);
        setTotalCollected(json.data.totalCollectedMinor);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setIsSaving(true);

    try {
      const payload = {
        bookingId,
        amountMinor: amountPKR * 100,
        paymentType,
        paymentMethod,
        providerRef: providerRef || `TRX-${Date.now().toString().slice(-6)}`,
        notes,
      };

      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        setModalError(json.error || "Failed to record payment.");
        setIsSaving(false);
        return;
      }

      setIsModalOpen(false);
      fetchPayments();
    } catch (err: any) {
      setModalError(err.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.booking?.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.booking?.customer?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.providerRef?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-warm-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider font-semibold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Finance & Billing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy-950 font-bold mt-1">
            Payments & Transactions
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600 mt-1">
            Real bank transfer receipts, cash deposits, and digital payments ledger.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPayments}
            className="p-2.5 rounded-xl border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 transition-colors text-xs font-medium flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              if (payments.length > 0) setBookingId(payments[0].booking.id);
              setIsModalOpen(true);
            }}
            className="btn-gold flex items-center space-x-2 text-xs py-2.5 px-4 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-1">
          <span className="text-xs text-brand-navy-500 font-medium">Total Verified Revenue</span>
          <p className="text-2xl font-bold text-emerald-700 font-serif">{formatPKR(totalCollected)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-1">
          <span className="text-xs text-brand-navy-500 font-medium">Recorded Transactions</span>
          <p className="text-2xl font-bold text-brand-navy-950 font-serif">{payments.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-1">
          <span className="text-xs text-brand-navy-500 font-medium">Payment Gateways Active</span>
          <p className="text-xs font-bold text-brand-navy-800 pt-2">Bank Transfer (Meezan / HBL), JazzCash, Cash</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-brand-warm-200 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by booking reference, client name, or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-warm-50/50 border border-brand-warm-200 rounded-xl text-xs text-brand-navy-950 placeholder:text-brand-navy-400 focus:outline-none focus:border-brand-gold-500"
          />
        </div>
      </div>

      {/* PAYMENTS TABLE */}
      <div className="bg-white rounded-2xl border border-brand-warm-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-gold-600" />
            <p className="text-xs text-brand-navy-600">Loading payment ledger...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-brand-warm-400 mx-auto" />
            <p className="text-xs text-brand-navy-600">No payment records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-warm-50 text-brand-navy-700 font-bold uppercase tracking-wider text-[10px] border-b border-brand-warm-200">
                <tr>
                  <th className="py-3.5 px-4">Transaction / Date</th>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Type & Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-warm-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-warm-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-brand-navy-950">{p.providerRef || p.id.slice(-8)}</p>
                      <p className="text-[11px] text-brand-navy-500">
                        {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-brand-gold-700">
                      {p.booking?.reference}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-brand-navy-950">{p.booking?.customer?.user?.name || "Customer"}</p>
                      <p className="text-[11px] text-brand-navy-500">{p.booking?.customer?.user?.phone}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-800 text-sm font-serif">
                      {formatPKR(p.amountMinor)}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-brand-navy-900">{p.paymentType}</p>
                      <p className="text-[10px] text-brand-navy-500">{p.paymentMethod.replace(/_/g, " ")}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/booking/${p.booking?.reference}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 inline-flex items-center"
                        title="View Client Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RECORD PAYMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-brand-warm-200">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-4">
              <h2 className="font-serif font-bold text-lg text-brand-navy-950">Record Client Payment</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-brand-warm-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {modalError}
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Select Booking *</label>
                <select
                  required
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl font-mono text-[11px]"
                >
                  {payments.map((p) => (
                    <option key={p.booking.id} value={p.booking.id}>
                      {p.booking.reference} — {p.booking.customer.user.name} (Total: {formatPKR(p.booking.totalAmountMinor)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Payment Amount (PKR) *</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={amountPKR}
                  onChange={(e) => setAmountPKR(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl font-bold text-brand-navy-950 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Payment Type</label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                  >
                    <option value="DEPOSIT">Deposit Advance</option>
                    <option value="FULL">Full Payment</option>
                    <option value="PARTIAL">Partial Balance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brand-navy-900 mb-1">Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CASH">Cash on Site</option>
                    <option value="JAZZCASH">JazzCash</option>
                    <option value="EASYPAISA">EasyPaisa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Bank Reference / Slip ID</label>
                <input
                  type="text"
                  placeholder="e.g. MBL-FT-984210"
                  value={providerRef}
                  onChange={(e) => setProviderRef(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-warm-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-gold px-5 py-2 text-xs font-semibold flex items-center space-x-1.5"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save & Update Balance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
