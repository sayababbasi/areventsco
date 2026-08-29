import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPKR, formatDate, formatTime12H } from "@/lib/utils";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Layers,
  Users,
  CreditCard,
  ArrowRight,
  Sparkles,
  MapPin,
} from "lucide-react";

export default async function AdminDashboardPage() {
  // Aggregate real operational metrics
  const totalBookings = await prisma.booking.count();
  const confirmedBookings = await prisma.booking.count({ where: { status: "CONFIRMED" } });
  const pendingInquiries = await prisma.booking.count({ where: { status: { in: ["INQUIRY", "PENDING"] } } });
  const totalRevenue = await prisma.booking.aggregate({
    _sum: { totalAmountMinor: true, amountPaidMinor: true },
  });

  const recentBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      customer: { include: { user: true } },
      package: true,
      theme: true,
    },
  });

  const totalRevPaisa = totalRevenue._sum.totalAmountMinor || 0;
  const totalPaidPaisa = totalRevenue._sum.amountPaidMinor || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-brand-navy-950">
            Operations & Revenue Overview
          </h1>
          <p className="text-xs text-brand-navy-600">
            Live dashboard for Islamabad & Rawalpindi birthday operations
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/admin/bookings" className="btn-navy px-4 py-2 text-xs font-semibold">
            <span>Manage All Bookings</span>
          </Link>
          <Link href="/book" className="btn-gold px-4 py-2 text-xs font-semibold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create New Booking</span>
          </Link>
        </div>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-luxury p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-navy-500 font-semibold">Total Pipeline Value</span>
            <div className="p-2 bg-brand-gold-100 rounded-lg text-brand-gold-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-brand-navy-950 font-serif">
            {formatPKR(totalRevPaisa)}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">
            Collected: {formatPKR(totalPaidPaisa)}
          </p>
        </div>

        <div className="card-luxury p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-navy-500 font-semibold">Confirmed Events</span>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-brand-navy-950 font-serif">
            {confirmedBookings}
          </p>
          <p className="text-[11px] text-brand-navy-600 font-medium">
            Out of {totalBookings} Total Requests
          </p>
        </div>

        <div className="card-luxury p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-navy-500 font-semibold">Pending Inquiries</span>
            <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-brand-navy-950 font-serif">
            {pendingInquiries}
          </p>
          <p className="text-[11px] text-amber-700 font-medium">
            Requires coordinator review
          </p>
        </div>

        <div className="card-luxury p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-navy-500 font-semibold">Operational Coverage</span>
            <div className="p-2 bg-brand-navy-100 rounded-lg text-brand-navy-800">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-brand-navy-950 font-serif">
            Islamabad + Rawalpindi
          </p>
          <p className="text-[11px] text-brand-navy-600 font-medium">
            100% On-Site Active
          </p>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="card-luxury overflow-hidden">
        <div className="p-6 border-b border-brand-warm-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-serif text-brand-navy-950">Recent Event Bookings</h2>
            <p className="text-xs text-brand-navy-600">Latest reservations and customer inquiries</p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-brand-gold-700 hover:text-brand-gold-800 flex items-center"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-warm-100/70 text-brand-navy-800 font-semibold uppercase tracking-wider border-b border-brand-warm-200">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Client</th>
                <th className="p-4">Event Date & Time</th>
                <th className="p-4">Package & City</th>
                <th className="p-4">Grand Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-warm-200">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-brand-warm-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-navy-950">{b.reference}</td>
                  <td className="p-4">
                    <p className="font-bold text-brand-navy-900">{b.customer.user.name}</p>
                    <p className="text-[11px] text-brand-navy-500">{b.customer.user.phone || b.customer.user.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-brand-navy-900">{formatDate(b.eventDate)}</p>
                    <p className="text-[11px] text-brand-navy-500">{formatTime12H(b.startTime)}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-brand-navy-900">{b.package?.title || "Custom Package"}</p>
                    <p className="text-[11px] text-brand-navy-500">{b.city}</p>
                  </td>
                  <td className="p-4 font-bold text-brand-navy-900">
                    {formatPKR(b.totalAmountMinor)}
                  </td>
                  <td className="p-4">
                    {b.status === "CONFIRMED" && <span className="badge-success text-[10px]">CONFIRMED</span>}
                    {b.status === "PREPARING" && <span className="badge-gold text-[10px]">PREPARING</span>}
                    {b.status === "INQUIRY" && <span className="badge-navy text-[10px]">INQUIRY</span>}
                    {b.status === "PENDING" && <span className="badge-pending text-[10px]">PENDING</span>}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/booking/${b.reference}`}
                      className="text-xs font-semibold text-brand-gold-700 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
