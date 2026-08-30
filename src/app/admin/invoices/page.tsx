"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  ShieldCheck,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface InvoiceItem {
  id: string;
  description: string;
  unitPriceMinor: number;
  quantity: number;
  totalPriceMinor: number;
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
  totalAmountMinor: number;
  amountPaidMinor: number;
  balanceDueMinor: number;
  currency: string;
  status: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  items: InvoiceItem[];
  booking?: {
    reference: string;
    eventType: string;
    eventDate: string;
    guestCount: number;
    city: string;
    venueLocation: string;
    package?: { title: string };
    theme?: { title: string };
    venue?: { name: string };
    payments?: any[];
  };
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState({
    totalInvoices: 0,
    totalInvoicedMinor: 0,
    totalCollectedMinor: 0,
    totalOutstandingMinor: 0,
    overdueCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal states
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [paymentAmountPKR, setPaymentAmountPKR] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/invoices?status=${statusFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setInvoices(json.data || []);
        if (json.summary) setSummary(json.summary);
      }
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const openPaymentModal = (inv: Invoice) => {
    setPaymentModalInvoice(inv);
    setPaymentAmountPKR(Math.round(inv.balanceDueMinor / 100));
    setPaymentMethod("BANK_TRANSFER");
    setPaymentRef("");
    setPaymentNotes("");
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;
    setActionLoading(true);

    try {
      if (paymentAmountPKR <= 0) {
        throw new Error("Payment amount must be greater than zero.");
      }

      const res = await fetch("/api/admin/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: paymentModalInvoice.id,
          recordPaymentAmountMinor: Math.round(paymentAmountPKR * 100),
          paymentMethod,
          providerRef: paymentRef || null,
          notes: paymentNotes || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to record payment.");

      showToast(`Payment of PKR ${paymentAmountPKR.toLocaleString()} recorded.`);
      setPaymentModalInvoice(null);
      fetchInvoices();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (inv.booking?.reference || "").toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-navy-950 text-white px-5 py-3 rounded-xl shadow-2xl border border-brand-gold-500/40 flex items-center space-x-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-warm-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Finance & Billing Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
            Invoice Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600">
            Official billing statements, payment reconciliation, deposit tracking, and printable customer receipts.
          </p>
        </div>

        <button
          onClick={fetchInvoices}
          className="btn-outline-navy text-xs px-4 py-2 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-brand-navy-900">
          <span className="text-xs text-brand-navy-600 font-medium">Total Invoiced</span>
          <p className="text-2xl font-serif font-bold text-brand-navy-950">
            {formatPKR(summary.totalInvoicedMinor)}
          </p>
          <p className="text-[11px] text-brand-navy-500">{summary.totalInvoices} billing records</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-emerald-600">
          <span className="text-xs text-brand-navy-600 font-medium">Total Collected</span>
          <p className="text-2xl font-serif font-bold text-emerald-700">
            {formatPKR(summary.totalCollectedMinor)}
          </p>
          <p className="text-[11px] text-brand-navy-500">Verified receipts</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-amber-500">
          <span className="text-xs text-brand-navy-600 font-medium">Outstanding Balance</span>
          <p className="text-2xl font-serif font-bold text-amber-700">
            {formatPKR(summary.totalOutstandingMinor)}
          </p>
          <p className="text-[11px] text-brand-navy-500">Pending settlement</p>
        </div>

        <div className="card-luxury p-5 space-y-2 border-l-4 border-l-rose-500">
          <span className="text-xs text-brand-navy-600 font-medium">Overdue Invoices</span>
          <p className="text-2xl font-serif font-bold text-rose-700">{summary.overdueCount}</p>
          <p className="text-[11px] text-brand-navy-500">Past due payment date</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card-luxury p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-brand-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice #, client, reference..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          {["ALL", "UNPAID", "PARTIALLY_PAID", "PAID", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? "bg-brand-navy-950 text-white"
                  : "bg-brand-warm-100 text-brand-navy-700 hover:bg-brand-warm-200"
              }`}
            >
              {st === "ALL" ? "All Invoices" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card-luxury overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
            <p className="text-xs text-brand-navy-600">Loading billing records from database...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileText className="w-10 h-10 text-brand-warm-400 mx-auto" />
            <p className="text-sm font-semibold text-brand-navy-950">No invoices found</p>
            <p className="text-xs text-brand-navy-500">
              Invoices are automatically generated when bookings are created.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-warm-100/70 text-brand-navy-800 font-serif border-b border-brand-warm-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Invoice #</th>
                  <th className="py-3.5 px-4 font-bold">Client & Booking</th>
                  <th className="py-3.5 px-4 font-bold">Due Date</th>
                  <th className="py-3.5 px-4 font-bold text-right">Total Amount</th>
                  <th className="py-3.5 px-4 font-bold text-right">Paid</th>
                  <th className="py-3.5 px-4 font-bold text-right">Balance Due</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-warm-200/60 text-brand-navy-900 font-sans">
                {filteredInvoices.map((inv) => {
                  const isOverdue =
                    (inv.status === "UNPAID" || inv.status === "PARTIALLY_PAID") &&
                    new Date(inv.dueDate) < new Date();

                  return (
                    <tr key={inv.id} className="hover:bg-brand-warm-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-brand-gold-700 text-xs">
                          {inv.invoiceNumber}
                        </span>
                        <p className="text-[10px] text-brand-navy-500">
                          {new Date(inv.createdAt).toLocaleDateString("en-PK", { dateStyle: "medium" })}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <strong className="block text-brand-navy-950 font-semibold">{inv.customerName}</strong>
                        {inv.booking && (
                          <Link
                            href="/admin/bookings"
                            className="text-[11px] text-brand-navy-600 hover:text-brand-gold-700 flex items-center space-x-1"
                          >
                            <span>Ref: {inv.booking.reference}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={isOverdue ? "text-rose-600 font-bold" : "text-brand-navy-700"}>
                          {new Date(inv.dueDate).toLocaleDateString("en-PK", { dateStyle: "medium" })}
                        </span>
                        {isOverdue && (
                          <span className="block text-[10px] text-rose-600 font-semibold">Overdue</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-brand-navy-950">
                        {formatPKR(inv.totalAmountMinor)}
                      </td>

                      <td className="py-3.5 px-4 text-right text-emerald-700 font-semibold">
                        {formatPKR(inv.amountPaidMinor)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {inv.balanceDueMinor > 0 ? (
                          <span className="font-bold text-amber-700">{formatPKR(inv.balanceDueMinor)}</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-[11px]">Settled</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === "PAID"
                              ? "bg-emerald-100 text-emerald-800"
                              : inv.status === "PARTIALLY_PAID"
                              ? "bg-blue-100 text-blue-800"
                              : inv.status === "CANCELLED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {inv.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setPreviewInvoice(inv)}
                            className="px-2.5 py-1 rounded-lg border border-brand-warm-300 text-brand-navy-800 hover:bg-brand-warm-100 font-semibold flex items-center space-x-1"
                            title="View & Print Invoice"
                          >
                            <Printer className="w-3 h-3" />
                            <span>View / Print</span>
                          </button>

                          {inv.status !== "PAID" && inv.status !== "CANCELLED" && (
                            <button
                              onClick={() => openPaymentModal(inv)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1 shadow-sm"
                              title="Record Payment"
                            >
                              <DollarSign className="w-3 h-3" />
                              <span>Pay</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRINTABLE INVOICE MODAL */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 space-y-6 shadow-2xl border border-brand-warm-200 animate-scale-in my-8">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-4 print:hidden">
              <div className="flex items-center space-x-2">
                <span className="badge-gold text-xs">{previewInvoice.invoiceNumber}</span>
                <span className="text-xs font-semibold text-brand-navy-600">Official Billing Statement</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="btn-gold text-xs px-4 py-2 flex items-center space-x-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setPreviewInvoice(null)}
                  className="p-2 text-brand-navy-400 hover:text-brand-navy-900 rounded-lg hover:bg-brand-warm-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Area */}
            <div className="space-y-6 text-brand-navy-950 font-sans print:p-0">
              {/* Invoice Header */}
              <div className="flex items-start justify-between border-b-2 border-brand-gold-500 pb-6">
                <div>
                  <Image
                    src="/brand/bg remove logo.png"
                    alt="AR Events Co."
                    width={180}
                    height={55}
                    className="h-12 w-auto object-contain"
                  />
                  <p className="text-xs text-brand-navy-600 mt-2">
                    AR Events Co. • Luxury Birthday & Event Styling
                  </p>
                  <p className="text-[11px] text-brand-navy-500">
                    Sector F-8 / Bahria Town, Islamabad & Rawalpindi
                  </p>
                  <p className="text-[11px] text-brand-navy-500">
                    Phone / WhatsApp: +92 300 8555123 • info@areventsco.com
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <h2 className="text-2xl font-serif font-bold text-brand-navy-950 uppercase tracking-wide">
                    INVOICE
                  </h2>
                  <p className="font-mono text-sm font-bold text-brand-gold-700">{previewInvoice.invoiceNumber}</p>
                  <div className="text-xs text-brand-navy-600 pt-1 space-y-0.5">
                    <p>
                      <strong>Issue Date:</strong>{" "}
                      {new Date(previewInvoice.createdAt).toLocaleDateString("en-PK", { dateStyle: "long" })}
                    </p>
                    <p>
                      <strong>Due Date:</strong>{" "}
                      {new Date(previewInvoice.dueDate).toLocaleDateString("en-PK", { dateStyle: "long" })}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="font-bold text-emerald-700">{previewInvoice.status.replace("_", " ")}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Billed To & Event Details */}
              <div className="grid grid-cols-2 gap-6 bg-brand-warm-50/80 p-4 rounded-xl border border-brand-warm-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-navy-500 block mb-1">
                    Billed To (Customer):
                  </span>
                  <p className="font-bold text-sm text-brand-navy-950">{previewInvoice.customerName}</p>
                  <p className="text-brand-navy-700">{previewInvoice.customerEmail}</p>
                  {previewInvoice.customerPhone && <p className="text-brand-navy-700">{previewInvoice.customerPhone}</p>}
                  {previewInvoice.customerAddress && <p className="text-brand-navy-700">{previewInvoice.customerAddress}</p>}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-navy-500 block mb-1">
                    Event Booking Reference:
                  </span>
                  <p className="font-mono font-bold text-sm text-brand-gold-700">
                    {previewInvoice.booking?.reference || "N/A"}
                  </p>
                  {previewInvoice.booking && (
                    <div className="text-brand-navy-700 space-y-0.5 mt-1">
                      <p>
                        <strong>Event Date:</strong>{" "}
                        {new Date(previewInvoice.booking.eventDate).toLocaleDateString("en-PK", { dateStyle: "medium" })}
                      </p>
                      <p>
                        <strong>City:</strong> {previewInvoice.booking.city}
                      </p>
                      <p>
                        <strong>Venue:</strong> {previewInvoice.booking.venueLocation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-brand-navy-950 text-white font-serif">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-lg font-bold">Item Description</th>
                      <th className="py-2.5 px-3 text-center font-bold">Qty</th>
                      <th className="py-2.5 px-3 text-right font-bold">Unit Price</th>
                      <th className="py-2.5 px-3 text-right rounded-r-lg font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-warm-200 text-brand-navy-900">
                    {previewInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-3 font-medium">{item.description}</td>
                        <td className="py-3 px-3 text-center">{item.quantity}</td>
                        <td className="py-3 px-3 text-right">{formatPKR(item.unitPriceMinor)}</td>
                        <td className="py-3 px-3 text-right font-semibold">{formatPKR(item.totalPriceMinor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals */}
              <div className="flex justify-end pt-2 border-t border-brand-warm-200">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-brand-navy-700">
                    <span>Subtotal:</span>
                    <span>{formatPKR(previewInvoice.subtotalMinor)}</span>
                  </div>
                  {previewInvoice.discountMinor > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Promotional Discount:</span>
                      <span>-{formatPKR(previewInvoice.discountMinor)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-serif font-bold text-sm text-brand-navy-950 pt-2 border-t border-brand-warm-300">
                    <span>Total Amount:</span>
                    <span>{formatPKR(previewInvoice.totalAmountMinor)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Amount Paid:</span>
                    <span>{formatPKR(previewInvoice.amountPaidMinor)}</span>
                  </div>
                  <div className="flex justify-between font-serif font-bold text-sm text-amber-700 pt-1 border-t border-brand-warm-200">
                    <span>Balance Due:</span>
                    <span>{formatPKR(previewInvoice.balanceDueMinor)}</span>
                  </div>
                </div>
              </div>

              {/* Bank Transfer Instructions */}
              <div className="p-4 rounded-xl bg-brand-warm-100/70 border border-brand-warm-200 text-xs space-y-1 text-brand-navy-800">
                <span className="font-bold font-serif text-brand-navy-950 block">Payment Methods & Raast:</span>
                <p>• Meezan Bank Ltd — Account Title: <strong>AR Events Co.</strong> • A/C: <strong>0102-0105849201</strong></p>
                <p>• Raast Instant ID: <strong>03008555123</strong> • JazzCash: <strong>03008555123</strong></p>
                <p className="text-[11px] text-brand-navy-500 pt-1">
                  Please share bank deposit slip via WhatsApp at +92 300 8555123 for immediate ledger reconciliation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-brand-warm-200 animate-scale-in">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                Record Payment
              </h3>
              <button onClick={() => setPaymentModalInvoice(null)} className="text-brand-navy-400 hover:text-brand-navy-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-brand-warm-50 p-3.5 rounded-xl border border-brand-warm-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-brand-navy-600">Invoice:</span>
                <span className="font-mono font-bold text-brand-gold-700">{paymentModalInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-navy-600">Customer:</span>
                <span className="font-bold text-brand-navy-950">{paymentModalInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-navy-600">Balance Due:</span>
                <span className="font-bold text-amber-700">{formatPKR(paymentModalInvoice.balanceDueMinor)}</span>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Amount to Record (PKR) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={paymentAmountPKR}
                  onChange={(e) => setPaymentAmountPKR(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white text-sm font-bold text-brand-navy-950"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                >
                  <option value="BANK_TRANSFER">Bank Transfer (Meezan / HBL / Alfalah)</option>
                  <option value="RAAST">Raast Instant Payment</option>
                  <option value="JAZZCASH">JazzCash / EasyPaisa</option>
                  <option value="CASH">Cash on Event Day</option>
                  <option value="CARD">Credit / Debit Card</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Bank Transaction Reference</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. MEZN-TX-892401"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-navy-900 mb-1">Notes / Receipt details</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Advance deposit verified by finance"
                  className="w-full p-2.5 rounded-xl border border-brand-warm-300 focus:outline-none focus:border-brand-gold-500 bg-white"
                />
              </div>

              <div className="pt-4 border-t border-brand-warm-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="btn-outline-navy px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn-gold px-5 py-2 font-bold flex items-center space-x-1.5"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
