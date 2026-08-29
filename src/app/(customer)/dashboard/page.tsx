import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPKR, formatDate, formatTime12H } from "@/lib/utils";
import {
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  User,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Client Portal Dashboard | AR Events Co.",
  description: "View and manage your birthday bookings, status, and invoices.",
};

export default async function CustomerDashboardPage() {
  // Fetch sample customer bookings
  const customer = await prisma.customerProfile.findFirst({
    include: {
      user: true,
      bookings: {
        orderBy: { eventDate: "asc" },
        include: {
          package: true,
          theme: true,
          invoices: true,
          payments: true,
        },
      },
    },
  });

  const bookings = customer?.bookings || [];

  return (
    <div className="min-h-screen bg-brand-warm-50/50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Profile Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-warm-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-brand-navy-950 text-brand-gold-400 font-serif font-bold text-xl flex items-center justify-center border-2 border-brand-gold-400">
              {customer?.user.name ? customer.user.name.charAt(0) : "C"}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold font-serif text-brand-navy-950">
                  Welcome back, {customer?.user.name || "Valued Client"}
                </h1>
                <span className="badge-gold text-xs">Verified Client</span>
              </div>
              <p className="text-xs text-brand-navy-600 flex items-center mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-brand-gold-600" />
                {customer?.city || "Islamabad & Rawalpindi"} • {customer?.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/book" className="btn-gold px-5 py-2.5 text-xs font-semibold flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Another Event</span>
            </Link>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-brand-navy-950">
              My Celebrations & Bookings
            </h2>
            <span className="text-xs text-brand-navy-500 font-medium">
              {bookings.length} Registered Event(s)
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="card-luxury p-12 text-center space-y-4">
              <Calendar className="w-12 h-12 text-brand-gold-500 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-brand-navy-950">No Active Bookings Yet</h3>
              <p className="text-xs text-brand-navy-600 max-w-md mx-auto">
                Ready to plan an extraordinary celebration in Islamabad or Rawalpindi? Start by browsing our signature birthday packages.
              </p>
              <Link href="/book" className="btn-gold px-6 py-2.5 text-xs inline-flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Book Your First Event</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((b) => (
                <div key={b.id} className="card-luxury p-6 sm:p-8 space-y-6">
                  {/* Top Reference & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-warm-200">
                    <div>
                      <span className="text-xs text-brand-navy-500 block">Reference Number</span>
                      <span className="text-base font-mono font-bold text-brand-navy-950">
                        {b.reference}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {b.status === "CONFIRMED" && (
                        <span className="badge-success text-xs px-3 py-1">CONFIRMED</span>
                      )}
                      {b.status === "PREPARING" && (
                        <span className="badge-gold text-xs px-3 py-1">IN DECOR PRODUCTION</span>
                      )}
                      {b.status === "INQUIRY" && (
                        <span className="badge-navy text-xs px-3 py-1">COORDINATOR REVIEW</span>
                      )}
                      {b.status === "PENDING" && (
                        <span className="badge-pending text-xs px-3 py-1">PENDING DEPOSIT</span>
                      )}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-brand-navy-500 block">Event & Date</span>
                      <span className="font-bold text-brand-navy-900 mt-0.5 block">
                        {b.eventType} • {formatDate(b.eventDate)}
                      </span>
                      <span className="text-brand-navy-600 block mt-0.5">
                        {formatTime12H(b.startTime)} - {formatTime12H(b.endTime)}
                      </span>
                    </div>

                    <div>
                      <span className="text-brand-navy-500 block">Package & Theme</span>
                      <span className="font-bold text-brand-navy-900 mt-0.5 block">
                        {b.package?.title || "Custom Package"}
                      </span>
                      <span className="text-brand-gold-700 block mt-0.5">
                        {b.theme?.title || "Signature Theme"}
                      </span>
                    </div>

                    <div>
                      <span className="text-brand-navy-500 block">Venue & City</span>
                      <span className="font-bold text-brand-navy-900 mt-0.5 block">
                        {b.city}
                      </span>
                      <span className="text-brand-navy-600 block mt-0.5 truncate max-w-[180px]">
                        {b.venueLocation}
                      </span>
                    </div>

                    <div>
                      <span className="text-brand-navy-500 block">Financial Summary</span>
                      <span className="font-bold text-brand-navy-900 mt-0.5 block text-sm">
                        {formatPKR(b.totalAmountMinor)}
                      </span>
                      <span className="text-emerald-700 font-semibold block mt-0.5">
                        Paid: {formatPKR(b.amountPaidMinor)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-brand-warm-100 flex flex-wrap items-center justify-between gap-4">
                    <Link
                      href={`/booking/${b.reference}`}
                      className="text-xs font-semibold text-brand-gold-700 hover:text-brand-gold-800 flex items-center"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1" />
                      <span>View Full Booking & Invoice</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>

                    <a
                      href={`https://wa.me/923008555123?text=Hi%20AR%20Events%20Co,%20inquiring%20about%20booking%20${b.reference}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline-navy px-4 py-2 text-xs font-semibold"
                    >
                      Chat with Event Lead
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
