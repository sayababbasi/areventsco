"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  Download,
  Printer,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Share2,
  Edit3,
  X,
  Loader2,
  ShieldCheck,
  History,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminInvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmountPKR, setPaymentAmountPKR] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomerNotes, setEditCustomerNotes] = useState("");
  const [editInternalNotes, setEditInternalNotes] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editDiscountPKR, setEditDiscountPKR] = useState(0);
  const [editAdditionalChargesPKR, setEditAdditionalChargesPKR] = useState(0);
  const [editLoading, setEditLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/invoices/${id}`);
      if (!res.ok) throw new Error("Invoice not found or unauthorized");
      const data = await res.json();
      setInvoice(data.invoice);

      setPaymentAmountPKR(Math.round(data.invoice.balanceDueMinor / 100));
      setEditCustomerNotes(data.invoice.customerNotes || "");
      setEditInternalNotes(data.invoice.internalNotes || "");
      setEditDueDate(
        data.invoice.dueDate ? new Date(data.invoice.dueDate).toISOString().split("T")[0] : ""
      );
      setEditDiscountPKR(Math.round(data.invoice.discountMinor / 100));
      setEditAdditionalChargesPKR(Math.round((data.invoice.additionalChargesMinor || 0) / 100));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchInvoice();
  }, [id]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmountPKR <= 0) {
      showToast("Payment amount must be greater than 0");
      return;
    }

    setPaymentLoading(true);
    try {
      const res = await fetch(`/api/admin/invoices/${id}/payments`, {
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
        const err = await res.json();
        throw new Error(err.error || "Failed to record payment");
      }

      showToast(`Payment of PKR ${paymentAmountPKR.toLocaleString()} recorded successfully!`);
      setShowPaymentModal(false);
      setPaymentRef("");
      setPaymentNotes("");
      fetchInvoice();
    } catch (err: any) {
      showToast(err.message || "Failed to record payment.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleUpdateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerNotes: editCustomerNotes,
          internalNotes: editInternalNotes,
          dueDate: editDueDate ? new Date(editDueDate).toISOString() : undefined,
          discountMinor: Math.round(editDiscountPKR * 100),
          additionalChargesMinor: Math.round(editAdditionalChargesPKR * 100),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update invoice");
      }

      showToast("Invoice updated successfully!");
      setShowEditModal(false);
      fetchInvoice();
    } catch (err: any) {
      showToast(err.message || "Failed to update invoice.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    window.open(`/api/invoices/${id}/pdf`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!invoice) return;
    const clientUrl = `${window.location.origin}/booking/${invoice.booking.reference}`;
    const text = encodeURIComponent(
      `Hello ${invoice.customerName},\n\nHere is your official digital invoice ${invoice.invoiceNumber} for your ${invoice.booking.eventType} in ${invoice.booking.city}.\n\nTotal Amount: PKR ${(invoice.totalAmountMinor / 100).toLocaleString()}\nBalance Due: PKR ${(invoice.balanceDueMinor / 100).toLocaleString()}\n\nView & Download Invoice: ${clientUrl}\n\nThank you,\nAR Events Co.`
    );
    const phone = invoice.customerPhone ? invoice.customerPhone.replace(/[^0-9]/g, "") : "";
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold-600" />
        <div className="text-sm font-semibold text-brand-navy-800">
          Loading Invoice Workspace...
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center max-w-md mx-auto space-y-4 shadow-sm my-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold font-serif text-brand-navy-950">Invoice Error</h2>
        <p className="text-sm text-brand-navy-600">{error || "Invoice not found."}</p>
        <Link
          href="/admin/invoices"
          className="inline-block px-5 py-2.5 bg-brand-navy-900 text-white text-xs font-bold rounded-xl"
        >
          Return to Invoices List
        </Link>
      </div>
    );
  }

  const statusUpper = invoice.status.toUpperCase();
  const isPaid = statusUpper === "PAID";
  const isPartial = statusUpper === "PARTIALLY_PAID";
  const isOverdue =
    invoice.balanceDueMinor > 0 &&
    new Date(invoice.dueDate) < new Date() &&
    statusUpper !== "CANCELLED" &&
    statusUpper !== "VOID";

  return (
    <div className="space-y-8 pb-20">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-navy-950 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-brand-gold-500/40 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-brand-gold-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy-700 hover:text-brand-gold-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices List
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Edit Button */}
          <button
            onClick={() => setShowEditModal(true)}
            className="px-3.5 py-2 bg-white hover:bg-brand-warm-100 border border-brand-warm-200 text-brand-navy-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit / Adjust
          </button>

          {/* Record Payment Button */}
          {invoice.balanceDueMinor > 0 && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Record Payment
            </button>
          )}

          {/* WhatsApp Share */}
          <button
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            WhatsApp Client
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-brand-warm-100 border border-brand-warm-200 text-brand-navy-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          {/* Download Official PDF */}
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-brand-navy-950 hover:bg-brand-navy-900 text-brand-gold-400 border border-brand-gold-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Invoice Card (Print-Ready Luxury Layout) */}
      <div className="bg-white rounded-2xl border border-brand-warm-200 shadow-lg overflow-hidden">
        {/* Luxury Gold Top Accent */}
        <div className="h-1.5 bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600" />

        <div className="p-6 sm:p-10 space-y-8">
          {/* Header Branding & Invoice Title */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-brand-warm-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
                AR EVENTS CO.
              </h2>
              <p className="text-xs font-medium text-brand-navy-600 mt-1">
                Islamabad & Rawalpindi's Premier Birthday & Event Planners
              </p>
              <div className="text-xs text-brand-navy-500 mt-1">
                Phone: +92 300 8555123 • Email: info@areventsco.com • Web: areventsco.com
              </div>
            </div>

            <div className="text-left sm:text-right space-y-2">
              <div className="text-2xl font-serif font-bold text-brand-navy-950">
                INVOICE
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
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
              </div>
            </div>
          </div>

          {/* Metadata Cards Grid: Invoice Details, Bill To, Event Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Invoice Details */}
            <div className="bg-brand-warm-50/60 p-5 rounded-xl border border-brand-warm-200 space-y-2 text-xs">
              <div className="font-bold text-brand-navy-900 uppercase tracking-wider text-[11px]">
                Invoice Details
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">Invoice Number:</span>{" "}
                <strong className="font-mono text-brand-navy-950">{invoice.invoiceNumber}</strong>
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">Booking Reference:</span>{" "}
                <Link
                  href={`/admin/bookings?search=${invoice.booking.reference}`}
                  className="font-mono font-bold text-brand-gold-700 hover:underline"
                >
                  {invoice.booking.reference}
                </Link>
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">Issue Date:</span>{" "}
                {invoice.issuedAt ? format(new Date(invoice.issuedAt), "dd MMM yyyy") : format(new Date(invoice.createdAt), "dd MMM yyyy")}
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">Due Date:</span>{" "}
                <strong className={isOverdue ? "text-rose-600" : ""}>
                  {format(new Date(invoice.dueDate), "dd MMM yyyy")}
                </strong>
              </div>
              {invoice.paidAt && (
                <div className="text-emerald-700">
                  <span className="text-brand-navy-500">Paid Date:</span>{" "}
                  <strong>{format(new Date(invoice.paidAt), "dd MMM yyyy")}</strong>
                </div>
              )}
            </div>

            {/* Box 2: Bill To */}
            <div className="bg-brand-warm-50/60 p-5 rounded-xl border border-brand-warm-200 space-y-2 text-xs">
              <div className="font-bold text-brand-navy-900 uppercase tracking-wider text-[11px]">
                Bill To (Client)
              </div>
              <div className="text-sm font-bold text-brand-navy-950">{invoice.customerName}</div>
              <div className="text-brand-navy-700 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-brand-navy-400" />
                {invoice.customerPhone || "N/A"}
              </div>
              <div className="text-brand-navy-700 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-brand-navy-400" />
                {invoice.customerEmail}
              </div>
              <div className="text-brand-navy-700 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-brand-navy-400" />
                {invoice.customerAddress || `Territory: ${invoice.booking.city}`}
              </div>
            </div>

            {/* Box 3: Event Specifications */}
            <div className="bg-brand-warm-50/60 p-5 rounded-xl border border-brand-warm-200 space-y-2 text-xs">
              <div className="font-bold text-brand-navy-900 uppercase tracking-wider text-[11px]">
                Event Specifications
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">Event Date:</span>{" "}
                <strong>{format(new Date(invoice.booking.eventDate), "EEE, dd MMM yyyy")}</strong>
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">Timing:</span>{" "}
                {invoice.booking.startTime} - {invoice.booking.endTime}
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">City / Guests:</span>{" "}
                {invoice.booking.city} • {invoice.booking.guestCount} Guests
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">Venue Location:</span>{" "}
                {invoice.booking.venueLocation || "Private Residence / Venue"}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-brand-navy-900 uppercase tracking-wider">
              Itemized Decoration & Service Charges
            </div>

            <div className="border border-brand-warm-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-navy-950 text-white font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Description & Specification</th>
                    <th className="py-3 px-4 text-center w-20">Qty</th>
                    <th className="py-3 px-4 text-right w-36">Unit Price</th>
                    <th className="py-3 px-4 text-right w-36">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-warm-100">
                  {invoice.items.map((item: any, idx: number) => (
                    <tr key={item.id} className="hover:bg-brand-warm-50/50">
                      <td className="py-3 px-4 text-center text-brand-navy-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-brand-navy-950">
                        {item.description}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-brand-navy-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right text-brand-navy-700">
                        {formatPKR(item.unitPriceMinor)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-brand-navy-950">
                        {formatPKR(item.totalPriceMinor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Calculation & Bank Instructions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-4 border-t border-brand-warm-200">
            {/* Left: Bank Transfer Details */}
            <div className="bg-brand-warm-50/70 p-5 rounded-xl border border-brand-warm-200 space-y-2 text-xs">
              <div className="font-bold text-brand-navy-900 uppercase tracking-wider text-[11px]">
                Bank Transfer & Payment Verification
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">Bank:</span> <strong>Meezan Bank Ltd.</strong>
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">Account Title:</span> <strong>AR Events Co.</strong>
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">Account Number:</span>{" "}
                <span className="font-mono font-bold">02010108932014</span>
              </div>
              <div className="text-brand-navy-700">
                <span className="text-brand-navy-500">IBAN:</span>{" "}
                <span className="font-mono font-bold">PK89MEZN0002010108932014</span>
              </div>
              <div className="text-brand-navy-500 text-[11px] pt-1">
                Please transfer the deposit and share the payment receipt with our coordinators.
              </div>
            </div>

            {/* Right: Financial Totals Box */}
            <div className="bg-brand-warm-50 p-5 rounded-xl border border-brand-warm-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-brand-navy-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-brand-navy-900">{formatPKR(invoice.subtotalMinor)}</span>
              </div>

              {invoice.discountMinor > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount Applied:</span>
                  <span>- {formatPKR(invoice.discountMinor)}</span>
                </div>
              )}

              {invoice.additionalChargesMinor > 0 && (
                <div className="flex justify-between text-brand-navy-700 font-medium">
                  <span>Additional Setup / Delivery:</span>
                  <span>+ {formatPKR(invoice.additionalChargesMinor)}</span>
                </div>
              )}

              {invoice.taxMinor > 0 && (
                <div className="flex justify-between text-brand-navy-600">
                  <span>Tax / Surcharge:</span>
                  <span>{formatPKR(invoice.taxMinor)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-brand-navy-950 pt-2 border-t border-brand-warm-200">
                <span>Grand Total:</span>
                <span className="text-base">{formatPKR(invoice.totalAmountMinor)}</span>
              </div>

              <div className="flex justify-between text-xs font-semibold text-emerald-700">
                <span>Total Amount Paid:</span>
                <span>{formatPKR(invoice.amountPaidMinor)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-rose-600 pt-2 border-t border-brand-warm-200">
                <span>Remaining Balance Due:</span>
                <span className="text-base">{formatPKR(invoice.balanceDueMinor)}</span>
              </div>
            </div>
          </div>

          {/* Payment Records Section */}
          <div className="space-y-3 pt-6 border-t border-brand-warm-200">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-brand-navy-900 uppercase tracking-wider">
                Payment History & Transaction Logs ({invoice.payments?.length || 0})
              </div>
              {invoice.balanceDueMinor > 0 && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Add Payment
                </button>
              )}
            </div>

            {invoice.payments && invoice.payments.length > 0 ? (
              <div className="border border-brand-warm-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-warm-100 font-bold text-brand-navy-800">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Reference / Slip</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-warm-100">
                    {invoice.payments.map((p: any) => (
                      <tr key={p.id} className="hover:bg-brand-warm-50/50">
                        <td className="py-2.5 px-3 text-brand-navy-800">
                          {p.paidAt ? format(new Date(p.paidAt), "dd MMM yyyy, hh:mm a") : format(new Date(p.createdAt), "dd MMM yyyy")}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-brand-navy-900">
                          {p.paymentMethod.replace(/_/g, " ")}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-brand-navy-600">
                          {p.providerRef || "Direct Bank Slip"}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                          {formatPKR(p.amountMinor)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-brand-warm-50/50 p-4 rounded-xl text-center text-xs text-brand-navy-500 border border-brand-warm-200">
                No payments recorded yet for this invoice.
              </div>
            )}
          </div>

          {/* Notes & Audit Log Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-brand-warm-200">
            {/* Notes */}
            <div className="space-y-4">
              {invoice.customerNotes && (
                <div className="bg-brand-warm-50 p-4 rounded-xl border border-brand-warm-200 text-xs space-y-1">
                  <div className="font-bold text-brand-navy-800">Client / Customer Notes:</div>
                  <div className="text-brand-navy-600 whitespace-pre-line">{invoice.customerNotes}</div>
                </div>
              )}

              {invoice.internalNotes && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="font-bold text-amber-900">Internal Staff Notes (Private):</div>
                  <div className="text-amber-800 whitespace-pre-line">{invoice.internalNotes}</div>
                </div>
              )}
            </div>

            {/* Audit Logs */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-brand-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-brand-gold-600" />
                Audit Trail & History
              </div>
              <div className="bg-brand-warm-50/70 p-4 rounded-xl border border-brand-warm-200 max-h-48 overflow-y-auto space-y-2 text-xs">
                {invoice.auditLogs && invoice.auditLogs.length > 0 ? (
                  invoice.auditLogs.map((log: any) => (
                    <div key={log.id} className="border-b border-brand-warm-200/60 pb-1.5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between text-[10px] text-brand-navy-500">
                        <span>{log.performedBy} ({log.action})</span>
                        <span>{format(new Date(log.createdAt), "dd MMM, hh:mm a")}</span>
                      </div>
                      <div className="text-brand-navy-700 text-[11px] mt-0.5">{log.details}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-brand-navy-500 text-xs">No audit logs available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-brand-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-brand-warm-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-brand-warm-100">
              <div>
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Payment Verification
                </div>
                <h3 className="text-lg font-bold font-serif text-brand-navy-950">
                  Record Payment for {invoice.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
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
                  Remaining Balance: {formatPKR(invoice.balanceDueMinor)}
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
                  placeholder="Optional remarks..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-xs text-brand-navy-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-warm-100">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-brand-warm-100 hover:bg-brand-warm-200 text-brand-navy-800 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
                >
                  {paymentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT INVOICE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-brand-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-brand-warm-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-brand-warm-100">
              <div>
                <div className="text-xs font-bold text-brand-gold-600 uppercase tracking-wider">
                  Invoice Adjustments
                </div>
                <h3 className="text-lg font-bold font-serif text-brand-navy-950">
                  Edit Details for {invoice.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 hover:bg-brand-warm-100 rounded-lg text-brand-navy-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateInvoice} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-navy-700 uppercase tracking-wider mb-1.5">
                    Discount (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editDiscountPKR}
                    onChange={(e) => setEditDiscountPKR(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-navy-700 uppercase tracking-wider mb-1.5">
                    Extra Charges (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editAdditionalChargesPKR}
                    onChange={(e) => setEditAdditionalChargesPKR(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-xs font-bold text-brand-navy-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy-700 uppercase tracking-wider mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-xs text-brand-navy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy-700 uppercase tracking-wider mb-1.5">
                  Client / Customer Notes
                </label>
                <textarea
                  rows={2}
                  value={editCustomerNotes}
                  onChange={(e) => setEditCustomerNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-xs text-brand-navy-900 focus:outline-none"
                  placeholder="Notes visible on customer invoice..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy-700 uppercase tracking-wider mb-1.5">
                  Internal Staff Notes (Private)
                </label>
                <textarea
                  rows={2}
                  value={editInternalNotes}
                  onChange={(e) => setEditInternalNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl text-xs text-brand-navy-900 focus:outline-none"
                  placeholder="Private internal remarks..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-warm-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-brand-warm-100 hover:bg-brand-warm-200 text-brand-navy-800 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2.5 bg-brand-navy-900 hover:bg-brand-navy-800 text-brand-gold-400 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
                >
                  {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Save Adjustments
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
