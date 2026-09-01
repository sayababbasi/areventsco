"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  CreditCard,
  Printer,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  Clock,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Download,
  Share2,
  ArrowUpDown,
  Filter,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { format } from "date-fns";
import { useRealtime } from "@/client/hooks/useRealtime";

interface InvoiceItem {
  id: string;
  description: string;
  unitPriceMinor: number;
  quantity: number;
  totalPriceMinor: number;
}

interface PaymentRecord {
  id: string;
  amountMinor: number;
  status: string;
  paymentMethod: string;
  providerRef?: string | null;
  paidAt: string | null;
  createdAt: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerAddress: string | null;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  additionalChargesMinor: number;
  totalAmountMinor: number;
  amountPaidMinor: number;
  balanceDueMinor: number;
  depositRequiredMinor: number;
  currency: string;
  status: string;
  dueDate: string;
  issuedAt?: string | null;
  paidAt: string | null;
  createdAt: string;
  items: InvoiceItem[];
  payments: PaymentRecord[];
  booking?: {
    id: string;
    reference: string;
    eventType: string;
    eventDate: string;
    guestCount: number;
    city: string;
    venueLocation: string;
    package?: { title: string };
    theme?: { title: string };
    venue?: { name: string };
  };
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    draftCount: 0,
    issuedCount: 0,
    unpaidCount: 0,
    partiallyPaidCount: 0,
    paidCount: 0,
    overdueCount: 0,
    cancelledCount: 0,
    voidCount: 0,
    totalInvoicedMinor: 0,
    totalPaidMinor: 0,
    totalOutstandingMinor: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Modals & Actions
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [paymentAmountPKR, setPaymentAmountPKR] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const fetchInvoices = async (page: number = pagination.page) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== "ALL") queryParams.set("status", statusFilter);
      if (cityFilter !== "ALL") queryParams.set("city", cityFilter);
      if (search.trim()) queryParams.set("search", search.trim());
      if (sortBy) queryParams.set("sortBy", sortBy);
      if (dateFrom) queryParams.set("dateFrom", dateFrom);
      if (dateTo) queryParams.set("dateTo", dateTo);
      queryParams.set("page", page.toString());
      queryParams.set("limit", "15");

      const res = await fetch(`/api/admin/invoices?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();

      setInvoices(data.invoices || []);
      if (data.stats) setStats(data.stats);
      if (data.pagination) setPagination(data.pagination);
    } catch (err: any) {
      console.error(err);
      showToast("Error loading invoices: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Real-time Event Subscription for instant invoice synchronization
  useRealtime({
    channels: "admin",
    onEvent: (evt) => {
      if (
        evt.type === "INVOICE_UPDATED" ||
        evt.type === "PAYMENT_COMPLETED" ||
        evt.type === "BOOKING_CREATED" ||
        evt.type === "BOOKING_STATUS_UPDATED"
      ) {
        // Silently update invoice list without full page loading spinner
        const queryParams = new URLSearchParams();
        if (statusFilter !== "ALL") queryParams.set("status", statusFilter);
        if (cityFilter !== "ALL") queryParams.set("city", cityFilter);
        if (search.trim()) queryParams.set("search", search.trim());
        if (sortBy) queryParams.set("sortBy", sortBy);
        if (dateFrom) queryParams.set("dateFrom", dateFrom);
        if (dateTo) queryParams.set("dateTo", dateTo);
        queryParams.set("page", pagination.page.toString());
        queryParams.set("limit", "15");

        fetch(`/api/admin/invoices?${queryParams.toString()}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.invoices) setInvoices(data.invoices);
            if (data.stats) setStats(data.stats);
            if (data.pagination) setPagination(data.pagination);
          })
          .catch((err) => console.error("[REALTIME-INVOICES] Silent refresh error:", err));
      }
    },
  });

  useEffect(() => {
    fetchInvoices(1);
  }, [statusFilter, cityFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices(1);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;
    if (paymentAmountPKR <= 0) {
      alert("Please enter a valid payment amount in PKR");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/invoices/${paymentModalInvoice.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountMinor: Math.round(paymentAmountPKR * 100),
          paymentMethod,
          providerRef: paymentRef,
          notes: paymentNotes,
          paidAt: new Date().toISOString(),
          markVerified: true,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to record payment");
      }

      showToast(`Payment of PKR ${paymentAmountPKR.toLocaleString()} recorded successfully!`);
      setPaymentModalInvoice(null);
      setPaymentAmountPKR(0);
      setPaymentRef("");
      setPaymentNotes("");
      fetchInvoices(pagination.page);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPdf = (invoiceId: string, invoiceNumber: string) => {
    window.open(`/api/invoices/${invoiceId}/pdf`, "_blank");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-navy-950 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-brand-gold-500/40 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-brand-gold-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 p-6 sm:p-8 rounded-2xl border border-brand-gold-500/20 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 text-brand-gold-400 text-sm font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            Financial Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Enterprise Invoices Management
          </h1>
          <p className="text-brand-warm-200 text-sm mt-1">
            Real-time billing lifecycle, automated line-item snapshots, payments tracking, and official PDF generation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchInvoices(pagination.page)}
            disabled={loading}
            className="px-4 py-2.5 bg-brand-navy-800 hover:bg-brand-navy-700 text-brand-warm-100 rounded-xl border border-brand-navy-700 text-sm font-medium transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Real-time Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-brand-warm-200 shadow-sm">
          <div className="flex items-center justify-between text-brand-navy-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-navy-500">
              Total Invoiced
            </span>
            <DollarSign className="w-4 h-4 text-brand-gold-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-brand-navy-950">
            {formatPKR(stats.totalInvoicedMinor)}
          </div>
          <div className="text-xs text-brand-navy-500 mt-1">
            Across {stats.totalInvoices} total generated invoices
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-warm-200 shadow-sm">
          <div className="flex items-center justify-between text-brand-navy-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Collected / Paid
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-emerald-700">
            {formatPKR(stats.totalPaidMinor)}
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            {stats.paidCount} Fully Paid • {stats.partiallyPaidCount} Partial
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-warm-200 shadow-sm">
          <div className="flex items-center justify-between text-brand-navy-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
              Outstanding Balance
            </span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-rose-600">
            {formatPKR(stats.totalOutstandingMinor)}
          </div>
          <div className="text-xs text-rose-500 mt-1">
            {stats.unpaidCount} Unpaid • {stats.overdueCount} Overdue
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-warm-200 shadow-sm">
          <div className="flex items-center justify-between text-brand-navy-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-navy-500">
              Payment Health
            </span>
            <CreditCard className="w-4 h-4 text-brand-gold-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-brand-navy-950">
            {stats.totalInvoicedMinor > 0
              ? Math.round((stats.totalPaidMinor / stats.totalInvoicedMinor) * 100)
              : 0}
            %
          </div>
          <div className="text-xs text-brand-navy-500 mt-1">
            Collection realization rate
          </div>
        </div>
      </div>

      {/* Filters, Search & Sorting Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-brand-warm-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy-400" />
            <input
              type="text"
              placeholder="Search by Invoice # (e.g. INV-2026), Booking Ref (AR-2026), Customer, Phone, or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-brand-warm-50/50 border border-brand-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold-400/50 focus:border-brand-gold-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-navy-900 hover:bg-brand-navy-800 text-white rounded-xl text-sm font-semibold transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-warm-100">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: "All Statuses", val: "ALL" },
              { label: "Unpaid", val: "UNPAID" },
              { label: "Partially Paid", val: "PARTIALLY_PAID" },
              { label: "Paid", val: "PAID" },
              { label: "Cancelled / Void", val: "CANCELLED" },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setStatusFilter(tab.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === tab.val
                    ? "bg-brand-gold-500 text-brand-navy-950 font-bold shadow-sm"
                    : "bg-brand-warm-100 text-brand-navy-700 hover:bg-brand-warm-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* City & Sort Dropdowns */}
          <div className="flex items-center gap-3">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-1.5 bg-brand-warm-50 border border-brand-warm-200 rounded-lg text-xs font-medium text-brand-navy-800 focus:outline-none"
            >
              <option value="ALL">All Territories</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-brand-warm-50 border border-brand-warm-200 rounded-lg text-xs font-medium text-brand-navy-800 focus:outline-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest_amount">Sort: Highest Amount</option>
              <option value="balance_due">Sort: Highest Outstanding</option>
              <option value="event_date">Sort: Event Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl border border-brand-warm-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-warm-100/60 border-b border-brand-warm-200 text-[11px] font-bold uppercase tracking-wider text-brand-navy-600">
                <th className="py-4 px-4">Invoice / Booking</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Event Date & City</th>
                <th className="py-4 px-4 text-right">Total</th>
                <th className="py-4 px-4 text-right">Paid</th>
                <th className="py-4 px-4 text-right">Balance Due</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-warm-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-brand-navy-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-gold-600" />
                    Loading database invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-brand-navy-500">
                    No invoices matching current filter criteria.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const statusUpper = inv.status.toUpperCase();
                  const isPaid = statusUpper === "PAID";
                  const isPartial = statusUpper === "PARTIALLY_PAID";
                  const isOverdue =
                    inv.balanceDueMinor > 0 &&
                    new Date(inv.dueDate) < new Date() &&
                    statusUpper !== "CANCELLED" &&
                    statusUpper !== "VOID";

                  return (
                    <tr key={inv.id} className="hover:bg-brand-warm-50/50 transition">
                      {/* Invoice / Booking Ref */}
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/admin/invoices/${inv.id}`}
                          className="font-bold text-brand-navy-950 hover:text-brand-gold-600 transition flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-brand-gold-600" />
                          {inv.invoiceNumber}
                        </Link>
                        <div className="text-xs text-brand-navy-500 mt-0.5">
                          Ref:{" "}
                          <span className="font-mono text-brand-navy-700">
                            {inv.booking?.reference || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-brand-navy-950">{inv.customerName}</div>
                        <div className="text-xs text-brand-navy-500 flex items-center gap-2 mt-0.5">
                          {inv.customerPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-brand-navy-400" />
                              {inv.customerPhone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Event Date & City */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-brand-navy-800">
                          {inv.booking?.eventDate
                            ? format(new Date(inv.booking.eventDate), "dd MMM yyyy")
                            : "N/A"}
                        </div>
                        <div className="text-xs text-brand-navy-500 mt-0.5">
                          {inv.booking?.city || "Islamabad / Rawalpindi"}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-bold text-brand-navy-950">
                        {formatPKR(inv.totalAmountMinor)}
                      </td>

                      {/* Paid */}
                      <td className="py-3.5 px-4 text-right text-emerald-700 font-semibold">
                        {formatPKR(inv.amountPaidMinor)}
                      </td>

                      {/* Balance Due */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`font-bold ${
                            inv.balanceDueMinor > 0 ? "text-rose-600" : "text-brand-navy-500"
                          }`}
                        >
                          {formatPKR(inv.balanceDueMinor)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-800"
                              : isPartial
                              ? "bg-amber-100 text-amber-800"
                              : isOverdue
                              ? "bg-rose-100 text-rose-800"
                              : "bg-brand-warm-100 text-brand-navy-800"
                          }`}
                        >
                          {isOverdue ? "OVERDUE" : statusUpper.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Workspace Details */}
                          <Link
                            href={`/admin/invoices/${inv.id}`}
                            title="Open Invoice Workspace"
                            className="p-1.5 bg-brand-warm-100 hover:bg-brand-warm-200 text-brand-navy-800 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Quick Preview Modal */}
                          <button
                            onClick={() => setPreviewInvoice(inv)}
                            title="Quick Preview"
                            className="p-1.5 bg-brand-warm-100 hover:bg-brand-warm-200 text-brand-navy-800 rounded-lg transition"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Record Payment */}
                          {inv.balanceDueMinor > 0 && (
                            <button
                              onClick={() => {
                                setPaymentModalInvoice(inv);
                                setPaymentAmountPKR(Math.round(inv.balanceDueMinor / 100));
                              }}
                              title="Record Payment"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          )}

                          {/* Download PDF */}
                          <button
                            onClick={() => handleDownloadPdf(inv.id, inv.invoiceNumber)}
                            title="Download Vector PDF"
                            className="p-1.5 bg-brand-navy-900 hover:bg-brand-navy-800 text-brand-gold-400 rounded-lg transition"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="py-3 px-6 bg-brand-warm-50 border-t border-brand-warm-200 flex items-center justify-between text-xs text-brand-navy-600">
            <div>
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total invoices)
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchInvoices(pagination.page - 1)}
                className="px-3 py-1.5 bg-white border border-brand-warm-200 rounded-lg disabled:opacity-50 hover:bg-brand-warm-100"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchInvoices(pagination.page + 1)}
                className="px-3 py-1.5 bg-white border border-brand-warm-200 rounded-lg disabled:opacity-50 hover:bg-brand-warm-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QUICK PREVIEW MODAL */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 bg-brand-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-brand-warm-200 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-warm-100">
              <div>
                <div className="text-xs font-bold text-brand-gold-600 uppercase tracking-wider">
                  Digital Invoice Preview
                </div>
                <h3 className="text-xl font-bold font-serif text-brand-navy-950">
                  {previewInvoice.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setPreviewInvoice(null)}
                className="p-1.5 hover:bg-brand-warm-100 rounded-lg text-brand-navy-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview Details */}
            <div className="grid grid-cols-2 gap-4 bg-brand-warm-50/60 p-4 rounded-xl text-xs">
              <div>
                <span className="text-brand-navy-500 font-medium">Customer:</span>
                <div className="font-bold text-brand-navy-950 mt-0.5">{previewInvoice.customerName}</div>
                <div className="text-brand-navy-600">{previewInvoice.customerPhone}</div>
                <div className="text-brand-navy-600">{previewInvoice.customerEmail}</div>
              </div>
              <div>
                <span className="text-brand-navy-500 font-medium">Event & Venue:</span>
                <div className="font-bold text-brand-navy-950 mt-0.5">
                  {previewInvoice.booking?.eventType} ({previewInvoice.booking?.city})
                </div>
                <div className="text-brand-navy-600">
                  Date:{" "}
                  {previewInvoice.booking?.eventDate
                    ? format(new Date(previewInvoice.booking.eventDate), "EEE, dd MMM yyyy")
                    : "N/A"}
                </div>
                <div className="text-brand-navy-600">{previewInvoice.booking?.venueLocation}</div>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div className="text-xs font-bold text-brand-navy-700 uppercase tracking-wider mb-2">
                Line Items Breakdown
              </div>
              <div className="border border-brand-warm-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-brand-warm-100 font-bold text-brand-navy-800">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-warm-100">
                    {previewInvoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-medium text-brand-navy-900">{item.description}</td>
                        <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right">{formatPKR(item.unitPriceMinor)}</td>
                        <td className="py-2.5 px-3 text-right font-bold">{formatPKR(item.totalPriceMinor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-brand-warm-50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-brand-navy-600">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatPKR(previewInvoice.subtotalMinor)}</span>
              </div>
              {previewInvoice.discountMinor > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount:</span>
                  <span>- {formatPKR(previewInvoice.discountMinor)}</span>
                </div>
              )}
              {previewInvoice.additionalChargesMinor > 0 && (
                <div className="flex justify-between text-brand-navy-600">
                  <span>Additional Charges:</span>
                  <span>+ {formatPKR(previewInvoice.additionalChargesMinor)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-brand-navy-950 pt-2 border-t border-brand-warm-200">
                <span>Total Amount:</span>
                <span>{formatPKR(previewInvoice.totalAmountMinor)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-emerald-700">
                <span>Amount Paid:</span>
                <span>{formatPKR(previewInvoice.amountPaidMinor)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-rose-600">
                <span>Outstanding Balance:</span>
                <span>{formatPKR(previewInvoice.balanceDueMinor)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-warm-100">
              <Link
                href={`/admin/invoices/${previewInvoice.id}`}
                className="px-4 py-2 bg-brand-warm-100 hover:bg-brand-warm-200 text-brand-navy-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Full Workspace
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPdf(previewInvoice.id, previewInvoice.invoiceNumber)}
                  className="px-4 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-brand-gold-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Official PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 bg-brand-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-brand-warm-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-brand-warm-100">
              <div>
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Payment Verification
                </div>
                <h3 className="text-lg font-bold font-serif text-brand-navy-950">
                  Record Payment for {paymentModalInvoice.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="p-1.5 hover:bg-brand-warm-100 rounded-lg text-brand-navy-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy-700 uppercase tracking-wider mb-1.5">
                  Payment Amount (PKR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-navy-400">
                    PKR
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={paymentAmountPKR}
                    onChange={(e) => setPaymentAmountPKR(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-2.5 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-sm font-bold text-brand-navy-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="text-[11px] text-brand-navy-500 mt-1">
                  Remaining Balance: {formatPKR(paymentModalInvoice.balanceDueMinor)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy-700 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-sm font-medium text-brand-navy-900 focus:outline-none"
                >
                  <option value="BANK_TRANSFER">Bank Transfer (Meezan / Direct)</option>
                  <option value="CASH">Cash Deposit</option>
                  <option value="JAZZCASH">JazzCash</option>
                  <option value="EASYPAISA">Easypaisa</option>
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="ONLINE">Online Portal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy-700 uppercase tracking-wider mb-1.5">
                  Transaction / Slip Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN-892014 or Meezan Bank Slip #902"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-3.5 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-sm text-brand-navy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy-700 uppercase tracking-wider mb-1.5">
                  Payment Notes (Internal)
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional verification remarks..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-xs text-brand-navy-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-warm-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-2 bg-brand-warm-100 hover:bg-brand-warm-200 text-brand-navy-800 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
