"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  FileText,
  Calendar,
  User,
  ShieldCheck,
  Building,
  ExternalLink,
  Code,
  Download,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminPaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const fetchPaymentDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/payments/${paymentId}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || "Failed to load payment details");
      }
    } catch (err: any) {
      setError(err.message || "Network error loading payment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetail();
    }
  }, [paymentId]);

  const handleVerifyGateway = async () => {
    try {
      setIsVerifying(true);
      setVerifyMessage(null);
      const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setVerifyMessage(`Gateway Status: ${json.status}. Records updated successfully!`);
        fetchPaymentDetail();
      } else {
        setVerifyMessage(`Verification response: ${json.error || json.status}`);
      }
    } catch (err: any) {
      setVerifyMessage(`Verification failed: ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-gold-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-brand-navy-900">Loading payment workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !data.payment) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <Link
          href="/admin/payments"
          className="inline-flex items-center text-xs font-semibold text-brand-navy-600 hover:text-brand-gold-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Payments
        </Link>
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 space-y-2">
          <h2 className="text-base font-bold">Error Loading Payment</h2>
          <p className="text-xs">{error || "Payment record could not be found."}</p>
        </div>
      </div>
    );
  }

  const { payment, liveGatewayTracker } = data;
  const booking = payment.booking;
  const invoice = payment.invoice;

  const isPaid = payment.status === "PAID" || payment.status === "VERIFIED";

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-warm-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/payments"
              className="text-xs font-semibold text-brand-navy-500 hover:text-brand-gold-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Payments
            </Link>
            <span className="text-brand-navy-300">/</span>
            <span className="text-xs font-mono font-bold text-brand-navy-900">{payment.id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-brand-navy-950 flex items-center gap-2">
            <span>Payment: {formatPKR(payment.amountMinor)}</span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                isPaid
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : payment.status === "PENDING" || payment.status === "PROCESSING"
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-rose-100 text-rose-800 border border-rose-300"
              }`}
            >
              {payment.status}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {payment.providerToken && (
            <button
              onClick={handleVerifyGateway}
              disabled={isVerifying}
              className="btn-outline-navy py-2 px-3.5 text-xs flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
              <span>Verify with Gateway</span>
            </button>
          )}

          {invoice && (
            <a
              href={`/api/invoices/${invoice.id}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="btn-gold py-2 px-3.5 text-xs flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Invoice PDF</span>
            </a>
          )}
        </div>
      </div>

      {verifyMessage && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>{verifyMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Payment Details & Linked Entities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Card */}
          <div className="card-luxury p-6 space-y-4">
            <h2 className="text-sm font-bold font-serif text-brand-navy-950 flex items-center gap-2 border-b border-brand-warm-100 pb-2">
              <CreditCard className="w-4 h-4 text-brand-gold-600" />
              Transaction Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-brand-navy-500 block">Payment Method & Gateway</span>
                <p className="font-bold text-brand-navy-900 mt-0.5 uppercase">
                  {payment.paymentMethod} ({payment.provider.toUpperCase()})
                </p>
              </div>

              <div>
                <span className="text-brand-navy-500 block">Payment Type</span>
                <p className="font-bold text-brand-navy-900 mt-0.5 uppercase">{payment.paymentType}</p>
              </div>

              <div>
                <span className="text-brand-navy-500 block">Gateway Tracker Token</span>
                <p className="font-mono text-brand-navy-900 mt-0.5 break-all">
                  {payment.providerToken || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-brand-navy-500 block">Transaction Reference</span>
                <p className="font-mono text-brand-navy-900 mt-0.5 break-all">
                  {payment.providerRef || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-brand-navy-500 block">Created At</span>
                <p className="font-medium text-brand-navy-800 mt-0.5">
                  {format(new Date(payment.createdAt), "dd MMM yyyy, hh:mm a")}
                </p>
              </div>

              <div>
                <span className="text-brand-navy-500 block">Paid / Confirmed At</span>
                <p className="font-medium text-brand-navy-800 mt-0.5">
                  {payment.paidAt ? format(new Date(payment.paidAt), "dd MMM yyyy, hh:mm a") : "Unconfirmed"}
                </p>
              </div>
            </div>

            {payment.notes && (
              <div className="pt-3 border-t border-brand-warm-100 text-xs">
                <span className="text-brand-navy-500 block">Internal Notes</span>
                <p className="text-brand-navy-800 mt-0.5 bg-brand-warm-50 p-2.5 rounded-lg border border-brand-warm-200">
                  {payment.notes}
                </p>
              </div>
            )}
          </div>

          {/* Linked Booking & Invoice Overview */}
          {booking && (
            <div className="card-luxury p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-warm-100 pb-2">
                <h2 className="text-sm font-bold font-serif text-brand-navy-950 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-gold-600" />
                  Linked Booking: {booking.reference}
                </h2>
                <Link
                  href={`/admin/bookings?search=${booking.reference}`}
                  className="text-xs text-brand-gold-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>View Booking</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-brand-warm-50 rounded-xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-brand-navy-500 uppercase block font-semibold">Total Price</span>
                  <span className="font-bold text-brand-navy-950 font-serif">{formatPKR(booking.totalAmountMinor)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-navy-500 uppercase block font-semibold">Required Advance</span>
                  <span className="font-bold text-brand-gold-700 font-serif">{formatPKR(booking.depositRequiredMinor)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-navy-500 uppercase block font-semibold">Total Paid</span>
                  <span className="font-bold text-emerald-700 font-serif">{formatPKR(booking.amountPaidMinor)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-navy-500 uppercase block font-semibold">Balance Due</span>
                  <span className="font-bold text-rose-600 font-serif">{formatPKR(booking.balanceDueMinor)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Developer / Gateway Audit Log Payload */}
          <div className="card-luxury p-6 space-y-3 bg-brand-navy-950 text-brand-warm-100">
            <div className="flex items-center justify-between border-b border-brand-navy-850 pb-2">
              <h2 className="text-xs font-bold font-mono text-brand-gold-300 flex items-center gap-2">
                <Code className="w-4 h-4 text-brand-gold-400" />
                Safepay Gateway Live Tracker Payload (Sandbox)
              </h2>
              <span className="text-[10px] font-mono text-brand-navy-400">Read-Only Audit</span>
            </div>

            <pre className="p-3 bg-brand-navy-900 rounded-lg text-[11px] font-mono text-brand-gold-200 overflow-x-auto max-h-64 border border-brand-navy-800">
              {JSON.stringify(liveGatewayTracker || JSON.parse(payment.metadata || "{}"), null, 2)}
            </pre>
          </div>
        </div>

        {/* Column 3: Customer Information & Quick Links */}
        <div className="space-y-6">
          {/* Customer Profile Card */}
          <div className="card-luxury p-6 space-y-4">
            <h2 className="text-sm font-bold font-serif text-brand-navy-950 flex items-center gap-2 border-b border-brand-warm-100 pb-2">
              <User className="w-4 h-4 text-brand-gold-600" />
              Customer Information
            </h2>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-brand-navy-500 block">Name</span>
                <p className="font-bold text-brand-navy-900 mt-0.5">
                  {booking?.customerName || booking?.customer?.user?.name || "Client"}
                </p>
              </div>

              <div>
                <span className="text-brand-navy-500 block">Email Address</span>
                <p className="font-mono text-brand-navy-900 mt-0.5">
                  {booking?.customerEmail || booking?.customer?.user?.email || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-brand-navy-500 block">Phone Number</span>
                <p className="font-mono text-brand-navy-900 mt-0.5">
                  {booking?.customerPhone || booking?.customer?.user?.phone || "+92 300 8555123"}
                </p>
              </div>

              <div>
                <span className="text-brand-navy-500 block">Event Date & City</span>
                <p className="font-medium text-brand-navy-900 mt-0.5">
                  {booking?.eventDate ? format(new Date(booking.eventDate), "dd MMMM yyyy") : "N/A"} ({booking?.city || "Islamabad"})
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Card */}
          {invoice && (
            <div className="card-luxury p-6 space-y-4">
              <h2 className="text-sm font-bold font-serif text-brand-navy-950 flex items-center gap-2 border-b border-brand-warm-100 pb-2">
                <FileText className="w-4 h-4 text-brand-gold-600" />
                Linked Invoice: {invoice.invoiceNumber}
              </h2>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-brand-navy-500">Invoice Status:</span>
                  <span className="font-bold text-brand-navy-900 uppercase">{invoice.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-navy-500">Invoice Total:</span>
                  <span className="font-bold text-brand-navy-900">{formatPKR(invoice.totalAmountMinor)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-navy-500">Invoice Balance Due:</span>
                  <span className="font-bold text-rose-600">{formatPKR(invoice.balanceDueMinor)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-brand-warm-100">
                <Link
                  href={`/admin/invoices/${invoice.id}`}
                  className="btn-outline-navy w-full py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Invoice Workspace</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
