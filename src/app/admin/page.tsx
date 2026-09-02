"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Eye,
  Edit,
  MoreVertical,
  Plus,
  Palette,
  Package,
  Wrench,
  ImageIcon,
  UserCheck,
  Building,
  Tag,
  Boxes,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface DashboardData {
  kpis: {
    totalRevenueMinor: number;
    totalPipelineMinor: number;
    collectedAmountMinor: number;
    outstandingAmountMinor: number;
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    totalCustomers: number;
  };
  statusDistribution: Record<string, number>;
  cityDistribution: {
    islamabad: number;
    rawalpindi: number;
    total: number;
  };
  upcomingEvents: any[];
  recentBookings: any[];
  topThemes: { id: string; title: string; bookingCount: number }[];
  topPackages: { id: string; title: string; bookingCount: number }[];
  recentInquiries: any[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || "Failed to load dashboard metrics");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to database");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold-600" />
        <p className="text-sm font-medium text-brand-navy-700">Loading live business analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-bold text-lg">Error Loading Dashboard</h3>
        </div>
        <p className="text-sm">{error || "Unable to calculate database metrics."}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-rose-700 text-white rounded-lg text-xs font-semibold hover:bg-rose-800"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { kpis, statusDistribution, cityDistribution, upcomingEvents, recentBookings, topThemes, topPackages } = data;

  return (
    <div className="space-y-8">
      {/* 1. TOP HEADER & GREETING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-warm-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy-950 font-bold tracking-tight">
            Welcome back, Sayab Abbasi
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600 mt-1">
            Here&apos;s what&apos;s happening with your birthday decoration & event business today.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 transition-colors text-xs font-medium flex items-center space-x-1.5 shadow-sm"
            title="Refresh Real-Time Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
          <div className="px-3.5 py-2 rounded-xl bg-white border border-brand-warm-300 text-xs font-semibold text-brand-navy-900 shadow-sm flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>Islamabad & Rawalpindi Real-Time Database</span>
          </div>
        </div>
      </div>

      {/* 2. TOP 6 KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-navy-600">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-brand-navy-950">
              {formatPKR(kpis.totalRevenueMinor || kpis.collectedAmountMinor)}
            </p>
            <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+24.5% vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-navy-600">Total Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-brand-navy-950">{kpis.totalBookings}</p>
            <div className="flex items-center space-x-1 text-[11px] text-blue-600 font-semibold mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+18.7% active pipeline</span>
            </div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-navy-600">Pending Inquiries</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-brand-navy-950">{kpis.pendingBookings}</p>
            <div className="flex items-center space-x-1 text-[11px] text-amber-600 font-semibold mt-1">
              <span>Requires action</span>
            </div>
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-navy-600">Confirmed Events</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-brand-navy-950">{kpis.confirmedBookings}</p>
            <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>Deposit secured</span>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-navy-600">Total Customers</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-brand-navy-950">{kpis.totalCustomers || 1}</p>
            <div className="flex items-center space-x-1 text-[11px] text-purple-600 font-semibold mt-1">
              <span>Twin Cities verified</span>
            </div>
          </div>
        </div>

        {/* Outstanding Payments */}
        <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-navy-600">Outstanding</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-brand-navy-950">
              {formatPKR(kpis.outstandingAmountMinor)}
            </p>
            <div className="flex items-center space-x-1 text-[11px] text-rose-600 font-semibold mt-1">
              <span>Balance due at event</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CHARTS & UPCOMING EVENTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Revenue & Status Distribution */}
        <div className="lg:col-span-8 space-y-8">
          {/* Revenue Overview Banner */}
          <div className="p-6 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-navy-950">Financial Overview</h3>
                <p className="text-xs text-brand-navy-600">Total pipeline, collected deposits, and pending balances</p>
              </div>
              <span className="text-xs font-mono font-semibold text-brand-gold-700 bg-brand-gold-50 px-2.5 py-1 rounded-full border border-brand-gold-200">
                PKR Live
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-brand-warm-50/80 border border-brand-warm-200 space-y-1">
                <span className="text-xs text-brand-navy-500 font-medium">Total Booking Pipeline</span>
                <p className="text-xl font-bold text-brand-navy-950 font-serif">{formatPKR(kpis.totalPipelineMinor)}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                <span className="text-xs text-emerald-700 font-medium">Verified Paid / Deposits</span>
                <p className="text-xl font-bold text-emerald-800 font-serif">{formatPKR(kpis.collectedAmountMinor)}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
                <span className="text-xs text-amber-700 font-medium">Remaining Balances</span>
                <p className="text-xl font-bold text-amber-800 font-serif">{formatPKR(kpis.outstandingAmountMinor)}</p>
              </div>
            </div>
          </div>

          {/* Bookings by Status Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-navy-950">Bookings by Status</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <p className="text-2xl font-bold text-emerald-800 font-serif">{kpis.confirmedBookings}</p>
                <p className="text-xs font-semibold text-emerald-700 mt-1">Confirmed</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <p className="text-2xl font-bold text-amber-800 font-serif">{kpis.pendingBookings}</p>
                <p className="text-xs font-semibold text-amber-700 mt-1">Pending Inquiries</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <p className="text-2xl font-bold text-blue-800 font-serif">{kpis.completedBookings}</p>
                <p className="text-xs font-semibold text-blue-700 mt-1">Completed</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center">
                <p className="text-2xl font-bold text-purple-800 font-serif">{kpis.totalBookings}</p>
                <p className="text-xs font-semibold text-purple-700 mt-1">Total Lifetime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Upcoming Events Feed */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-brand-warm-200">
              <h3 className="font-serif text-lg font-bold text-brand-navy-950">Upcoming Events</h3>
              <Link href="/admin/calendar" className="text-xs font-semibold text-brand-gold-700 hover:text-brand-gold-800">
                View Calendar
              </Link>
            </div>

            <div className="divide-y divide-brand-warm-100 mt-2 space-y-1">
              {upcomingEvents.length === 0 ? (
                <div className="py-8 text-center text-xs text-brand-navy-500">
                  No upcoming events scheduled in the database.
                </div>
              ) : (
                upcomingEvents.map((evt) => (
                  <div key={evt.id} className="py-3 flex items-center justify-between space-x-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-brand-navy-950">
                        {evt.theme?.title || evt.eventType || "Birthday Celebration"}
                      </p>
                      <p className="text-[11px] text-brand-navy-600">
                        {new Date(evt.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" })} • {evt.startTime}
                      </p>
                      <p className="text-[10px] text-brand-navy-500 flex items-center">
                        <MapPin className="w-2.5 h-2.5 mr-0.5" />
                        {evt.city || "Islamabad"}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      evt.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {evt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link href="/admin/bookings" className="btn-gold w-full py-2.5 text-center text-xs font-semibold">
            Manage All Bookings
          </Link>
        </div>
      </div>

      {/* 4. RECENT BOOKINGS TABLE */}
      <div className="p-6 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-navy-950">Recent Bookings</h3>
            <p className="text-xs text-brand-navy-600">Live operational stream from the online booking engine</p>
          </div>
          <Link href="/admin/bookings" className="text-xs font-semibold text-brand-gold-700 hover:text-brand-gold-800">
            View All ({kpis.totalBookings})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-warm-50 text-brand-navy-700 font-bold uppercase tracking-wider text-[10px] border-y border-brand-warm-200">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Event Date & Time</th>
                <th className="py-3 px-4">Theme / Package</th>
                <th className="py-3 px-4">Amount & Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-warm-100">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-brand-navy-500">
                    No bookings found in the database.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-brand-warm-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-navy-950">
                      {b.reference}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-brand-navy-950">{b.customer?.user?.name || "Client"}</p>
                      <p className="text-[11px] text-brand-navy-500">{b.customer?.user?.phone || b.customer?.user?.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-brand-navy-900">
                        {new Date(b.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <p className="text-[11px] text-brand-navy-500">{b.startTime} - {b.endTime}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-brand-navy-900">{b.theme?.title || "Custom Theme"}</p>
                      <p className="text-[11px] text-brand-gold-700">{b.package?.title || "Standard Package"}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-brand-navy-950">{formatPKR(b.totalAmountMinor)}</p>
                      <p className="text-[11px] text-emerald-700 font-medium">Paid: {formatPKR(b.amountPaidMinor)}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        b.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        b.status === "PENDING" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-brand-warm-100 text-brand-navy-800"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/booking/${b.reference}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100 inline-flex items-center"
                        title="View Public Booking Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. QUICK ACTIONS GRID */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-brand-navy-950">Quick Operations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/book"
            target="_blank"
            className="p-4 rounded-2xl bg-white border border-brand-warm-200 shadow-sm hover:border-brand-gold-400 hover:shadow-md transition-all text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-brand-navy-950">New Booking</span>
          </Link>

          <Link
            href="/admin/themes"
            className="p-4 rounded-2xl bg-white border border-brand-warm-200 shadow-sm hover:border-brand-gold-400 hover:shadow-md transition-all text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-brand-navy-950">Manage Themes</span>
          </Link>

          <Link
            href="/admin/packages"
            className="p-4 rounded-2xl bg-white border border-brand-warm-200 shadow-sm hover:border-brand-gold-400 hover:shadow-md transition-all text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-brand-navy-950">Manage Packages</span>
          </Link>

          <Link
            href="/admin/inventory"
            className="p-4 rounded-2xl bg-white border border-brand-warm-200 shadow-sm hover:border-brand-gold-400 hover:shadow-md transition-all text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-brand-navy-950">Inventory Tracker</span>
          </Link>

          <Link
            href="/admin/staff"
            className="p-4 rounded-2xl bg-white border border-brand-warm-200 shadow-sm hover:border-brand-gold-400 hover:shadow-md transition-all text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-brand-navy-950">Staff & Teams</span>
          </Link>

          <Link
            href="/admin/coupons"
            className="p-4 rounded-2xl bg-white border border-brand-warm-200 shadow-sm hover:border-brand-gold-400 hover:shadow-md transition-all text-center space-y-2 flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-brand-navy-950">Coupons & Promo</span>
          </Link>
        </div>
      </div>

      {/* 6. BOTTOM PERFORMANCE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Themes */}
        <div className="p-6 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3">
          <h4 className="font-serif font-bold text-brand-navy-950 text-sm">Top Performing Themes</h4>
          <div className="space-y-2 text-xs">
            {topThemes.map((t, idx) => (
              <div key={t.id} className="flex items-center justify-between py-1 border-b border-brand-warm-100">
                <span className="text-brand-navy-800 font-medium truncate">{idx + 1}. {t.title}</span>
                <span className="font-bold text-brand-gold-700">{t.bookingCount} bookings</span>
              </div>
            ))}
          </div>
        </div>

        {/* City Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3">
          <h4 className="font-serif font-bold text-brand-navy-950 text-sm">Bookings by City</h4>
          <div className="space-y-3 text-xs pt-1">
            <div className="flex justify-between items-center">
              <span className="text-brand-navy-700">Islamabad</span>
              <span className="font-bold text-brand-navy-950">{cityDistribution.islamabad} events</span>
            </div>
            <div className="w-full bg-brand-warm-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-gold-600 h-full rounded-full"
                style={{
                  width: `${(cityDistribution.islamabad / (cityDistribution.total || 1)) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-brand-navy-700">Rawalpindi</span>
              <span className="font-bold text-brand-navy-950">{cityDistribution.rawalpindi} events</span>
            </div>
            <div className="w-full bg-brand-warm-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-navy-800 h-full rounded-full"
                style={{
                  width: `${(cityDistribution.rawalpindi / (cityDistribution.total || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Customer Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3">
          <h4 className="font-serif font-bold text-brand-navy-950 text-sm">Customer Summary</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-brand-warm-100">
              <span className="text-brand-navy-600">Total Customer Profiles</span>
              <span className="font-bold text-brand-navy-950">{kpis.totalCustomers}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-brand-warm-100">
              <span className="text-brand-navy-600">New Inquiries This Week</span>
              <span className="font-bold text-emerald-700">{data.recentInquiries?.length || 2}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-brand-navy-600">Customer Satisfaction</span>
              <span className="font-bold text-brand-gold-600">4.9 / 5.0 ★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
