"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  Search,
  RefreshCw,
  X,
  CheckCircle2,
  Clock,
  Receipt,
  Eye,
  ShieldCheck,
  Building,
  TrendingUp,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { format } from "date-fns";

interface PaymentRecord {
  id: string;
  amountMinor: number;
  currency: string;
  paymentType: string;
  paymentMethod: string;
  status: string;
  provider: string;
  providerRef?: string;
  providerToken?: string;
  notes?: string;
  paidAt?: string;
  createdAt: string;
  booking?: {
    id: string;
    reference: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    totalAmountMinor: number;
    amountPaidMinor: number;
    balanceDueMinor: number;
    invoice?: { id: string; invoiceNumber: string; status: string };
  };
  invoice?: {
    id: string;
    invoiceNumber: string;
    status: string;
  };
}

interface PaymentStats {
  totalCollectedMinor: number;
  successfulCount: number;
  pendingCount: number;
  failedCount: number;
  safepayCollectedMinor: number;
  todayRevenueMinor: number;
  thisMonthRevenueMinor: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [gatewayFilter, setGatewayFilter] = useState("ALL");

  // Modal State for Manual Record Payment
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
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (gatewayFilter !== "ALL") params.append("provider", gatewayFilter);

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setPayments(json.data.payments || []);
        setStats(json.data.stats || null);
      }
    } catch (err) {
      console.error("Failed to load payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, gatewayFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleRecordManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setIsSaving(true);

    try {
      const payload = {
        bookingId,
        amountMinor: amountPKR * 100,
        paymentType,
        paymentMethod,
        providerRef: providerRef || `MBL-TRX-${Date.now().toString().slice(-6)}`,
        notes,
      };

      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to record payment");
      }

      setIsModalOpen(false);
      // Reset form
      setBookingId("");
      setAmountPKR(25000);
      setProviderRef("");
      setNotes("");
      fetchPayments();
    } catch (err: any) {
      setModalError(err.message || "Failed to record payment");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-warm-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
            Payment & Gateway Operations
          </h1>
          <p className="text-xs text-brand-navy-600 mt-1">
            Real-time reconciliation for Safepay Sandbox card payments and verified bank transfers across Islamabad & Rawalpindi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPayments}
            className="btn-outline-navy py-2 px-3 text-xs flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-gold py-2 px-3.5 text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Manual Payment</span>
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-luxury p-5 space-y-1">
            <span className="text-[11px] font-semibold text-brand-navy-500 uppercase tracking-wider block">
              Total Revenue Collected
            </span>
            <p className="text-xl sm:text-2xl font-serif font-bold text-brand-navy-950">
              {formatPKR(stats.totalCollectedMinor)}
            </p>
            <span className="text-[10px] text-emerald-700 font-medium">
              {stats.successfulCount} Verified Transactions
            </span>
          </div>

          <div className="card-luxury p-5 space-y-1 bg-brand-gold-50/40 border-brand-gold-200">
            <span className="text-[11px] font-semibold text-brand-gold-800 uppercase tracking-wider block">
              Safepay Gateway Volume
            </span>
            <p className="text-xl sm:text-2xl font-serif font-bold text-brand-gold-700">
              {formatPKR(stats.safepayCollectedMinor)}
            </p>
            <span className="text-[10px] text-brand-gold-600 font-medium">
              Automated 256-Bit SSL
            </span>
          </div>

          <div className="card-luxury p-5 space-y-1">
            <span className="text-[11px] font-semibold text-brand-navy-500 uppercase tracking-wider block">
              Today&apos;s Revenue
            </span>
            <p className="text-xl sm:text-2xl font-serif font-bold text-brand-navy-950">
              {formatPKR(stats.todayRevenueMinor)}
            </p>
            <span className="text-[10px] text-brand-navy-600 font-medium">
              This Month: {formatPKR(stats.thisMonthRevenueMinor)}
            </span>
          </div>

          <div className="card-luxury p-5 space-y-1">
            <span className="text-[11px] font-semibold text-brand-navy-500 uppercase tracking-wider block">
              Gateway States
            </span>
            <div className="flex items-center gap-3 pt-1 text-xs font-bold">
              <span className="text-emerald-700">{stats.successfulCount} Paid</span>
              <span className="text-amber-700">{stats.pendingCount} Pending</span>
              <span className="text-rose-600">{stats.failedCount} Failed</span>
            </div>
            <span className="text-[10px] text-brand-navy-500 block">Total reconciliation logs</span>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Booking ID, Customer, Reference, or Token..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-warm-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-gold-500/20 bg-white"
          />
        </form>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Status Tabs */}
          <div className="inline-flex rounded-xl bg-brand-warm-100 p-1 text-xs">
            {["ALL", "PAID", "PENDING", "FAILED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  statusFilter === st
                    ? "bg-white text-brand-navy-950 shadow-sm"
                    : "text-brand-navy-600 hover:text-brand-navy-950"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Gateway Filter */}
          <select
            value={gatewayFilter}
            onChange={(e) => setGatewayFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-brand-warm-300 bg-white font-medium text-brand-navy-900"
          >
            <option value="ALL">All Gateways</option>
            <option value="safepay">Safepay Gateway</option>
            <option value="manual">Manual Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card-luxury overflow-hidden border border-brand-warm-200 shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-brand-gold-600 mx-auto" />
            <p className="text-xs font-semibold text-brand-navy-600">Loading transactions...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Receipt className="w-8 h-8 text-brand-warm-400 mx-auto" />
            <p className="text-sm font-semibold text-brand-navy-950">No payment transactions found</p>
            <p className="text-xs text-brand-navy-500">
              Try adjusting your search criteria or record a payment above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-warm-100 text-brand-navy-800 font-bold uppercase tracking-wider border-b border-brand-warm-200">
                <tr>
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Booking / Customer</th>
                  <th className="py-3 px-4">Gateway / Method</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-warm-100">
                {payments.map((p) => {
                  const isPaid = p.status === "PAID" || p.status === "VERIFIED";
                  const isPending = p.status === "PENDING" || p.status === "PROCESSING";

                  return (
                    <tr key={p.id} className="hover:bg-brand-warm-50/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-navy-950">
                        <Link
                          href={`/admin/payments/${p.id}`}
                          className="text-brand-navy-900 hover:text-brand-gold-600 hover:underline"
                        >
                          {p.id.slice(0, 10)}...
                        </Link>
                        {p.providerRef && (
                          <span className="block text-[10px] text-brand-navy-400 font-normal">
                            Ref: {p.providerRef.slice(0, 16)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 space-y-0.5">
                        <span className="font-bold text-brand-navy-900 block">
                          {p.booking?.reference || "N/A"}
                        </span>
                        <span className="text-[11px] text-brand-navy-600 block">
                          {p.booking?.customerName || "Customer"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {p.provider === "safepay" ? (
                            <span className="px-2 py-0.5 rounded bg-brand-gold-50 text-brand-gold-800 border border-brand-gold-300 text-[10px] font-bold">
                              SAFEPAY
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-brand-navy-50 text-brand-navy-800 border border-brand-navy-200 text-[10px] font-bold">
                              BANK TRANSFER
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 uppercase text-brand-navy-700 font-medium">
                        {p.paymentType}
                      </td>

                      <td className="py-3.5 px-4 text-right font-serif font-bold text-sm text-brand-navy-950">
                        {formatPKR(p.amountMinor)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : isPending
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-rose-100 text-rose-800 border border-rose-300"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-brand-navy-600 text-[11px]">
                        {format(new Date(p.paidAt || p.createdAt), "dd MMM yyyy")}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/payments/${p.id}`}
                          className="btn-outline-navy py-1.5 px-2.5 text-[11px] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Workspace</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-warm-200">
            <div className="flex items-center justify-between border-b border-brand-warm-100 pb-3">
              <h3 className="font-serif font-bold text-base text-brand-navy-950 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-gold-600" />
                Record Manual Payment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-brand-navy-400 hover:text-brand-navy-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleRecordManualPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-brand-navy-700 font-semibold mb-1">
                  Booking ID / Reference *
                </label>
                <input
                  type="text"
                  required
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="e.g. cmt... or AR-2026-4637"
                  className="w-full p-2.5 rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-500/20"
                />
              </div>

              <div>
                <label className="block text-brand-navy-700 font-semibold mb-1">
                  Amount (PKR) *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={amountPKR}
                  onChange={(e) => setAmountPKR(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-brand-warm-300 font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-navy-700 font-semibold mb-1">
                    Payment Type
                  </label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-brand-warm-300 bg-white"
                  >
                    <option value="DEPOSIT">Deposit (Advance)</option>
                    <option value="PARTIAL">Partial Balance</option>
                    <option value="FULL">Full Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-navy-700 font-semibold mb-1">
                    Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-brand-warm-300 bg-white"
                  >
                    <option value="BANK_TRANSFER">Meezan Bank</option>
                    <option value="JAZZCASH">JazzCash</option>
                    <option value="EASYPAISA">EasyPaisa</option>
                    <option value="CASH">Cash on Site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-brand-navy-700 font-semibold mb-1">
                  Bank Reference / Slip ID
                </label>
                <input
                  type="text"
                  value={providerRef}
                  onChange={(e) => setProviderRef(e.target.value)}
                  placeholder="e.g. MBL-FT-991203"
                  className="w-full p-2.5 rounded-lg border border-brand-warm-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-brand-navy-700 font-semibold mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Verified transfer slip on WhatsApp..."
                  className="w-full p-2.5 rounded-lg border border-brand-warm-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-brand-warm-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-brand-navy-600 hover:bg-brand-warm-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-gold px-5 py-2 text-xs font-bold shadow-md"
                >
                  {isSaving ? "Saving..." : "Confirm & Apply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
