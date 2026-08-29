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
} from "lucide-react";

interface BookingDetailPageProps {
  params: {
    reference: string;
  };
}

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
        include: { items: true },
      },
      payments: true,
    },
  });

  if (!booking) {
    return notFound();
  }

  const invoice = booking.invoices[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="badge-success text-xs px-3 py-1">CONFIRMED & RESERVED</span>;
      case "PREPARING":
        return <span className="badge-gold text-xs px-3 py-1">IN DECOR PRODUCTION</span>;
      case "COMPLETED":
        return <span className="badge-success text-xs px-3 py-1">EVENT COMPLETED</span>;
      case "PENDING":
        return <span className="badge-pending text-xs px-3 py-1">PENDING DEPOSIT</span>;
      case "INQUIRY":
      default:
        return <span className="badge-navy text-xs px-3 py-1">UNDER COORDINATOR REVIEW</span>;
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-brand-warm-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Success Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-gold-300 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
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
          {/* Left Column: Event Specs */}
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
              <h2 className="text-base font-bold font-serif text-brand-navy-950 flex items-center">
                <CreditCard className="w-4 h-4 text-brand-gold-600 mr-2" />
                Advance Deposit & Payment
              </h2>

              <p className="text-xs text-brand-navy-700 leading-relaxed">
                To confirm this date on our official production calendar, please transfer the advance deposit of{" "}
                <strong className="text-brand-navy-950 font-bold">
                  {formatPKR(booking.depositRequiredMinor)}
                </strong>{" "}
                using the details below:
              </p>

              <div className="p-3.5 rounded-lg bg-white border border-brand-gold-300 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-brand-navy-500">Bank:</span>
                  <span className="font-bold text-brand-navy-900">Meezan Bank Ltd.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-navy-500">Account Title:</span>
                  <span className="font-bold text-brand-navy-900">AR Events Co.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-navy-500">Account No:</span>
                  <span className="font-bold text-brand-navy-900">02010108932014</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-navy-500">IBAN:</span>
                  <span className="font-bold text-brand-navy-900">PK89MEZN0002010108932014</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/923008555123?text=Hi%20AR%20Events%20Co,%20I%20have%20submitted%20booking%20${booking.reference}.%20Sharing%20my%20deposit%20slip.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold w-full py-2.5 text-xs flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Share Transfer Slip on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Invoice Line Items */}
          <div className="md:col-span-5 space-y-6">
            <div className="card-luxury p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-warm-200 pb-2">
                <h2 className="text-base font-bold font-serif text-brand-navy-950 flex items-center">
                  <FileText className="w-4 h-4 text-brand-gold-600 mr-2" />
                  Digital Invoice
                </h2>
                <span className="text-[11px] font-mono text-brand-navy-500">
                  {invoice?.invoiceNumber}
                </span>
              </div>

              {/* Line items snapshot */}
              <div className="space-y-2.5 text-xs">
                {booking.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-2 border-b border-brand-warm-100">
                    <div>
                      <p className="font-semibold text-brand-navy-900">{item.name}</p>
                      {item.description && (
                        <p className="text-[10px] text-brand-navy-500">{item.description}</p>
                      )}
                    </div>
                    <span className="font-mono font-medium text-brand-navy-900 ml-2">
                      {formatPKR(item.totalPriceMinor)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Math breakdown */}
              <div className="space-y-1.5 pt-2 text-xs border-t border-brand-warm-200">
                <div className="flex justify-between text-brand-navy-600">
                  <span>Subtotal:</span>
                  <span>{formatPKR(booking.basePriceMinor + booking.addonsTotalMinor + booking.venueFeeMinor)}</span>
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

                <div className="flex justify-between text-xs font-bold text-brand-gold-800 pt-1">
                  <span>Remaining Balance:</span>
                  <span>{formatPKR(booking.balanceDueMinor)}</span>
                </div>
              </div>
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
