import { prisma } from "@/lib/db";
import { formatDate, formatTime12H } from "@/lib/utils";
import { Calendar as CalendarIcon, MapPin, Users, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Operations Schedule & Calendar | AR Events Co.",
};

export default async function AdminCalendarPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { eventDate: "asc" },
    include: {
      customer: { include: { user: true } },
      package: true,
      theme: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-brand-navy-950">
          Operational Event Calendar
        </h1>
        <p className="text-xs text-brand-navy-600">
          Chronological schedule of upcoming setup dates in Islamabad & Rawalpindi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b: any) => (
          <div key={b.id} className="card-luxury p-6 space-y-4 border-l-4 border-l-brand-gold-500">
            <div className="flex items-center justify-between pb-2 border-b border-brand-warm-200">
              <span className="font-mono font-bold text-xs text-brand-navy-900">
                {b.reference}
              </span>
              <span className="badge-gold text-[10px]">{b.status}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-brand-navy-900 font-bold">
                <CalendarIcon className="w-4 h-4 text-brand-gold-600" />
                <span>{formatDate(b.eventDate)}</span>
              </div>

              <p className="text-brand-navy-600 pl-6">
                {formatTime12H(b.startTime)} – {formatTime12H(b.endTime)}
              </p>

              <div className="flex items-start space-x-2 text-brand-navy-800 pt-1">
                <MapPin className="w-4 h-4 text-brand-gold-600 flex-shrink-0 mt-0.5" />
                <span>{b.city}: {b.venueLocation}</span>
              </div>

              <div className="pt-2 border-t border-brand-warm-100">
                <p className="font-semibold text-brand-navy-900">{b.package?.title || "Custom Package"}</p>
                <p className="text-[11px] text-brand-gold-700">{b.theme?.title || "Custom Theme"}</p>
                <p className="text-[11px] text-brand-navy-500 mt-1">
                  Client: {b.customer.user.name} ({b.customer.user.phone})
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-brand-warm-100">
              <Link
                href={`/booking/${b.reference}`}
                className="text-xs font-semibold text-brand-gold-700 hover:underline block text-center"
              >
                View Full Event Order
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
