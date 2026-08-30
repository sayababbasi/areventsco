import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPKR, formatDate, formatTime12H } from "@/lib/utils";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  MessageCircle,
  Building,
  CreditCard,
  AlertCircle,
  Download,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";

interface BookingDetailPageProps {
  params: {
    reference: string;
  };
}

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const booking = await prisma.booking.findUnique({
    where: { reference: params.reference },
    include: {
      customer: {
        include: { user: true },
      },
      package: true,
      theme: true,
      venue: true,
      items: true,
      invoices: {
        include: {
          items: true,
          payments: {
            where: { status: { in: ["VERIFIED", "PAID"] } },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      payments: {
        where: { status: { in: ["VERIFIED", "PAID"] } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!booking) {
    return notFound();
  }

  const invoice = booking.invoices[0] || null;

  // Settings
  const settings = await prisma.setting.findMany();
  const settingsMap = settings.reduce((acc: any, s: any) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  const bankName = settingsMap["bank_name"] || "Meezan Bank Ltd.";
  const accountTitle = settingsMap["bank_account_title"] || "AR Events Co.";
  const accountNumber = settingsMap["bank_account_number"] || "02010108932014";
  const iban = settingsMap["bank_iban"] || "PK89MEZN0002010108932014";
  const supportPhone = settingsMap["support_phone"] || "+92 300 8555123";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs px-3.5 py-1.5 rounded-full font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            CONFIRMED & RESERVED
          </span>
        );
      case "PREPARING":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs px-3.5 py-1.5 rounded-full font-bold">
            <Clock className="w-4 h-4 text-amber-600" />
            IN DECOR PRODUCTION
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs px-3.5 py-1.5 rounded-full font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            EVENT COMPLETED
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs px-3.5 py-1.5 rounded-full font-bold">
            <Clock className="w-4 h-4 text-amber-600" />
            PENDING DEPOSIT
          </span>
        );
      case "INQUIRY":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-brand-navy-100 text-brand-navy-900 text-xs px-3.5 py-1.5 rounded-full font-bold">
            <Clock className="w-4 h-4 text-brand-navy-700" />
            UNDER COORDINATOR REVIEW
          </span>
        );
    }
  };

  const isFullyPaid = booking.balanceDueMinor === 0 && booking.amountPaidMinor > 0;
  const isPartiallyPaid = booking.amountPaidMinor > 0 && booking.balanceDueMinor > 0;

  return (
    <div className="py-12 sm:py-16 bg-brand-warm-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Success Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-gold-300 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
              Booking Request Received!
            </h1>
            <p className="text-xs sm:text-sm text-brand-navy-700">
              Thank you for trusting AR Events Co. with your celebration.
            </p>
          </div>

          <div className="inline-flex items-center space-x-3 bg-brand-warm-100 px-4 py-2 rounded-xl border border-brand-warm-200">
            <span className="text-xs text-brand-navy-600">Booking Reference:</span>
            <span className="text-sm font-mono font-bold text-brand-navy-950 tracking-wider">
              {booking.reference}
            </span>
          </div>

          <div>{getStatusBadge(booking.status)}</div>
        </div>

        {/* Two-Column Grid: Details & Invoicing */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Event Specs & Bank Details */}
          <div className="md:col-span-7 space-y-6">
            <div className="card-luxury p-6 space-y-4">
              <h2 className="text-base font-bold font-serif text-brand-navy-950 border-b border-brand-warm-200 pb-2 flex items-center">
                <Calendar className="w-4 h-4 text-brand-gold-600 mr-2" />
                Event Specifications
              </h2>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-brand-navy-500 block">Event Date</span>
                  <span className="font-semibold text-brand-navy-900">{formatDate(booking.eventDate)}</span>
                </div>
                <div>
                  <span className="text-brand-navy-500 block">Timing Window</span>
                  <span className="font-semibold text-brand-navy-900">
                    {formatTime12H(booking.startTime)} - {formatTime12H(booking.endTime)}
                  </span>
                </div>
                <div>
                  <span className="text-brand-navy-500 block">City / Territory</span>
                  <span className="font-semibold text-brand-navy-900">{booking.city}</span>
                </div>
                <div>
                  <span className="text-brand-navy-500 block">Guest Count</span>
                  <span className="font-semibold text-brand-navy-900">{booking.guestCount} Guests</span>
                </div>
              </div>

              <div className="pt-2 border-t border-brand-warm-200 text-xs">
                <span className="text-brand-navy-500 block">Venue / Setup Location</span>
                <p className="font-semibold text-brand-navy-900 mt-0.5">{booking.venueLocation}</p>
              </div>

              {booking.specialRequests && (
                <div className="pt-2 border-t border-brand-warm-200 text-xs">
                  <span className="text-brand-navy-500 block">Special Requests</span>
                  <p className="text-brand-navy-800 italic mt-0.5">&ldquo;{booking.specialRequests}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Payment & Bank Transfer Instructions */}
            <div className="card-luxury p-6 space-y-4 bg-brand-gold-50/50 border-brand-gold-200">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold font-serif text-brand-navy-950 flex items-center">
                  <CreditCard className="w-4 h-4 text-brand-gold-600 mr-2" />
                  Advance Deposit & Payment
                </h2>
                {isFullyPaid && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Fully Paid
                  </span>
                )}
              </div>

              {!isFullyPaid && (
                <p className="text-xs text-brand-navy-700 leading-relaxed">
                  To confirm this date on our official production calendar, please transfer the advance deposit of{" "}
                  <strong className="text-brand-navy-950 font-bold">
                    {formatPKR(booking.depositRequiredMinor)}
                  </strong>{" "}
                  using the verified account details below:
                </p>
              )}

              <div className="p-3.5 rounded-lg bg-white border border-brand-gold-300 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-brand-navy-500">Bank:</span>
                  <span className="font-bold text-brand-navy-900">{bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-navy-500">Account Title:</span>
                  <span className="font-bold text-brand-navy-900">{accountTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-navy-500">Account No:</span>
                  <span className="font-bold text-brand-navy-900">{accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-navy-500">IBAN:</span>
                  <span className="font-bold text-brand-navy-900">{iban}</span>
                </div>
              </div>

              {!isFullyPaid && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${supportPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hi AR Events Co., I have submitted booking ${booking.reference}. Sharing my deposit transfer slip for confirmation.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gold w-full py-2.5 text-xs flex items-center justify-center space-x-2 shadow-md hover:scale-[1.01] transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Share Transfer Slip on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* Recorded Payments History (if any) */}
            {booking.payments && booking.payments.length > 0 && (
              <div className="card-luxury p-6 space-y-3">
                <h3 className="text-xs font-bold font-serif uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  Verified Payment Receipts ({booking.payments.length})
                </h3>
                <div className="border border-brand-warm-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-brand-warm-100 font-bold text-brand-navy-800">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Method</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-warm-100">
                      {booking.payments.map((p: any) => (
                        <tr key={p.id}>
                          <td className="py-2 px-3 text-brand-navy-700">
                            {p.paidAt ? format(new Date(p.paidAt), "dd MMM yyyy") : format(new Date(p.createdAt), "dd MMM yyyy")}
                          </td>
                          <td className="py-2 px-3 font-medium text-brand-navy-900">
                            {p.paymentMethod.replace(/_/g, " ")}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-700">
                            {formatPKR(p.amountMinor)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Digital Invoice & PDF Download */}
          <div className="md:col-span-5 space-y-6">
            <div className="card-luxury p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
                <div>
                  <h2 className="text-base font-bold font-serif text-brand-navy-950 flex items-center">
                    <FileText className="w-4 h-4 text-brand-gold-600 mr-2" />
                    Digital Invoice
                  </h2>
                  <div className="text-[11px] font-mono text-brand-navy-500 mt-0.5">
                    {invoice?.invoiceNumber || "INV-PENDING"}
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isFullyPaid
                      ? "bg-emerald-100 text-emerald-800"
                      : isPartiallyPaid
                      ? "bg-amber-100 text-amber-900"
                      : "bg-brand-warm-100 text-brand-navy-800"
                  }`}
                >
                  {invoice?.status.replace(/_/g, " ") || "UNPAID"}
                </span>
              </div>

              {/* Line items snapshot */}
              <div className="space-y-2.5 text-xs">
                {booking.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start pb-2 border-b border-brand-warm-100 last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-brand-navy-900">{item.name}</p>
                      {item.description && (
                        <p className="text-[10px] text-brand-navy-500 leading-tight mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-medium text-brand-navy-900 ml-2 whitespace-nowrap">
                      {formatPKR(item.totalPriceMinor)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-2 pt-3 text-xs border-t border-brand-warm-200">
                <div className="flex justify-between text-brand-navy-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    {formatPKR(booking.basePriceMinor + booking.addonsTotalMinor + booking.venueFeeMinor)}
                  </span>
                </div>

                {booking.discountMinor > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount Applied:</span>
                    <span>-{formatPKR(booking.discountMinor)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-sm text-brand-navy-950 pt-2 border-t border-brand-warm-300">
                  <span>Total Amount:</span>
                  <span className="font-serif text-base">{formatPKR(booking.totalAmountMinor)}</span>
                </div>

                <div className="flex justify-between text-xs font-semibold text-emerald-700 pt-1">
                  <span>Amount Paid:</span>
                  <span>{formatPKR(booking.amountPaidMinor)}</span>
                </div>

                <div className="flex justify-between text-xs font-bold text-rose-600 pt-1">
                  <span>Remaining Balance:</span>
                  <span>{formatPKR(booking.balanceDueMinor)}</span>
                </div>
              </div>

              {/* Official Download Invoice PDF Button */}
              {invoice && (
                <div className="pt-3 border-t border-brand-warm-200">
                  <a
                    href={`/api/invoices/${invoice.id}/pdf?token=${booking.reference}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 bg-brand-navy-950 hover:bg-brand-navy-900 text-brand-gold-400 border border-brand-gold-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official Invoice (PDF)</span>
                  </a>
                </div>
              )}
            </div>

            <div className="text-center">
              <Link href="/" className="text-xs font-semibold text-brand-gold-700 hover:underline">
                ← Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
