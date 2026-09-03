"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Phone,
  MessageCircle,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Plus,
  AlertCircle,
  LogOut,
  Sliders,
  Award,
  Truck,
  Building,
} from "lucide-react";
import { formatPKR, formatDate, formatTime12H } from "@/lib/utils";

interface DashboardClientProps {
  initialData: {
    user: {
      name: string;
      email: string;
      phone?: string | null;
    };
    city: string;
    address: string;
    bookings: any[];
  };
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"bookings" | "invoices" | "logistics" | "profile">("bookings");
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const bookings = initialData.bookings || [];
  const primaryBooking = bookings[0];

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  // Calculate totals
  const totalBookingsCount = bookings.length;
  const totalSpentMinor = bookings.reduce((acc, b) => acc + (b.totalAmountMinor || 0), 0);
  const totalPaidMinor = bookings.reduce((acc, b) => acc + (b.amountPaidMinor || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-brand-navy-950 font-sans pb-16 selection:bg-brand-gold-500 selection:text-white">
      {/* ------------------------------------------------------------------ */}
      {/* TOP CLIENT NAVIGATION BAR                                          */}
      {/* ------------------------------------------------------------------ */}
      <nav className="bg-white border-b border-brand-warm-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Portal Label */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/brand/website logo no bg.png"
                  alt="AR Events Co."
                  width={150}
                  height={45}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <span className="hidden sm:inline-block h-5 w-px bg-brand-warm-200" />
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-900">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Client VIP Portal</span>
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center space-x-3">
              <a
                href="https://wa.me/923160513841?text=Hi%20AR%20Events%20Co,%20I%20need%20assistance%20with%20my%20event%20booking."
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>VIP Concierge</span>
              </a>

              <Link
                href="/book"
                className="btn-gold px-3.5 py-1.5 text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Book Celebration</span>
                <span className="sm:hidden">Book</span>
              </Link>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Sign Out"
                className="p-1.5 rounded-lg border border-brand-warm-200 text-brand-navy-500 hover:text-brand-navy-900 hover:bg-brand-warm-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN DASHBOARD CONTENT                                             */}
      {/* ------------------------------------------------------------------ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-6">
        {/* 1. TOP CLIENT HERO BANNER */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-warm-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden mt-2">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-50/60 to-transparent pointer-events-none" />

          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-navy-950 via-brand-navy-900 to-brand-navy-800 text-amber-400 font-serif font-bold text-2xl flex items-center justify-center border-2 border-amber-300 shadow-sm flex-shrink-0">
              {initialData.user.name ? initialData.user.name.charAt(0).toUpperCase() : "V"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-brand-navy-950">
                  Welcome back, {initialData.user.name || "Valued Client"}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  <Award className="w-3 h-3 mr-1 text-amber-700" />
                  Verified VIP Client
                </span>
              </div>
              <p className="text-xs text-brand-navy-600 flex items-center mt-1.5 flex-wrap gap-x-2">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-amber-600 flex-shrink-0" />
                  {initialData.city} (Islamabad &amp; Rawalpindi)
                </span>
                <span>•</span>
                <span>{initialData.user.email}</span>
                {initialData.user.phone && (
                  <>
                    <span>•</span>
                    <span>{initialData.user.phone}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 relative z-10 flex-shrink-0">
            <Link
              href="/book"
              className="btn-gold px-4 py-2.5 text-xs font-semibold flex items-center space-x-2 shadow-gold"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Another Event</span>
            </Link>
          </div>
        </div>

        {/* 2. KEY KPI STATS OVERVIEW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-brand-warm-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-brand-navy-500">
              <span className="text-xs font-semibold">Active Bookings</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-brand-navy-950">
                {totalBookingsCount} Event{totalBookingsCount !== 1 ? "s" : ""}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Date Reserved &amp; Active
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-brand-warm-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-brand-navy-500">
              <span className="text-xs font-semibold">Upcoming Date</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-brand-navy-950 truncate">
                {primaryBooking ? formatDate(primaryBooking.eventDate) : "No Date Set"}
              </div>
              <p className="text-[11px] text-brand-navy-600 font-medium mt-0.5">
                {primaryBooking ? `${formatTime12H(primaryBooking.startTime)} - ${formatTime12H(primaryBooking.endTime)}` : "Select a date to plan"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-brand-warm-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-brand-navy-500">
              <span className="text-xs font-semibold">Financial Summary</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-brand-navy-950">
                {formatPKR(totalSpentMinor)}
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                Paid: {formatPKR(totalPaidMinor)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-brand-warm-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-brand-navy-500">
              <span className="text-xs font-semibold">Lead Coordinator</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-brand-navy-950">
                Asad R.
              </div>
              <p className="text-[11px] text-brand-gold-700 font-medium mt-0.5">
                On-Site Lead • Arriving 3h Prior
              </p>
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE NAVIGATION TABS */}
        <div className="flex border-b border-brand-warm-200 gap-2 sm:gap-4 overflow-x-auto pb-0.5">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "bookings"
                ? "border-brand-gold-500 text-brand-navy-950"
                : "border-transparent text-brand-navy-500 hover:text-brand-navy-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Celebrations &amp; Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "invoices"
                ? "border-brand-gold-500 text-brand-navy-950"
                : "border-transparent text-brand-navy-500 hover:text-brand-navy-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices &amp; Receipts</span>
          </button>

          <button
            onClick={() => setActiveTab("logistics")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "logistics"
                ? "border-brand-gold-500 text-brand-navy-950"
                : "border-transparent text-brand-navy-500 hover:text-brand-navy-800"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Setup Logistics &amp; Guarantee</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "border-brand-gold-500 text-brand-navy-950"
                : "border-transparent text-brand-navy-500 hover:text-brand-navy-800"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Delivery Details</span>
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: MY CELEBRATIONS & BOOKINGS                                 */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-brand-warm-200">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-navy-950">
                  Ready to Plan Your Extraordinary Birthday Celebration?
                </h3>
                <p className="text-xs text-brand-navy-600 max-w-md mx-auto leading-relaxed">
                  Browse our curated themes, customized 3D backdrops, photography packages, and live entertainment. Reserve your date in just 2 minutes.
                </p>
                <Link
                  href="/book"
                  className="btn-gold px-6 py-2.5 text-xs inline-flex items-center space-x-2 shadow-gold"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Explore Themes &amp; Book Now</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {bookings.map((b: any) => {
                  const themeImage = b.theme?.heroImage || b.package?.featuredImage || "/images/themes/theme_royal_midnight_prince.jpg";
                  const status = b.status || "CONFIRMED";

                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-brand-warm-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
                    >
                      {/* Top Booking Header Bar */}
                      <div className="p-5 sm:px-6 bg-brand-warm-50/70 border-b border-brand-warm-200 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                          <div>
                            <span className="text-[10.5px] font-semibold text-brand-navy-500 uppercase tracking-wider block">
                              Booking Reference
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm sm:text-base font-mono font-bold text-brand-navy-950">
                                {b.reference}
                              </span>
                              <button
                                onClick={() => handleCopyRef(b.reference)}
                                title="Copy Reference"
                                className="text-brand-navy-400 hover:text-brand-navy-700 transition-colors p-1"
                              >
                                {copiedRef === b.reference ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {status === "CONFIRMED" && (
                            <span className="badge-success text-xs px-3 py-1 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              CONFIRMED &amp; SCHEDULED
                            </span>
                          )}
                          {status === "PREPARING" && (
                            <span className="badge-gold text-xs px-3 py-1 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              IN DECOR PRODUCTION
                            </span>
                          )}
                          {status === "INQUIRY" && (
                            <span className="badge-navy text-xs px-3 py-1">
                              COORDINATOR REVIEW
                            </span>
                          )}
                          {status === "PENDING" && (
                            <span className="badge-pending text-xs px-3 py-1">
                              PENDING DEPOSIT
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main Booking Details Grid */}
                      <div className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          {/* Left: Theme & Package Image Thumbnail */}
                          <div className="md:col-span-4 flex items-center space-x-4">
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-brand-warm-200 flex-shrink-0 shadow-xs bg-brand-warm-100">
                              <Image
                                src={themeImage}
                                alt={b.theme?.title || b.package?.title || "Event Decor"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                                {b.eventType || "Birthday"} Celebration
                              </span>
                              <h3 className="text-sm sm:text-base font-bold text-brand-navy-950 font-serif leading-tight truncate">
                                {b.package?.title || "Signature Package"}
                              </h3>
                              <p className="text-xs text-brand-navy-600 font-medium">
                                Theme: {b.theme?.title || "Custom Aesthetic"}
                              </p>
                              <div className="pt-1 flex items-center space-x-1.5 text-[11px] text-brand-navy-500">
                                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                                <span>{formatDate(b.eventDate)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Center: Event Logistics Details */}
                          <div className="md:col-span-5 grid grid-cols-2 gap-4 text-xs border-y md:border-y-0 md:border-x border-brand-warm-200 py-4 md:py-0 md:px-6">
                            <div>
                              <span className="text-brand-navy-500 block text-[11px]">Date &amp; Schedule</span>
                              <span className="font-bold text-brand-navy-900 mt-0.5 block">
                                {formatDate(b.eventDate)}
                              </span>
                              <span className="text-brand-navy-600 block mt-0.5 text-[11px]">
                                {formatTime12H(b.startTime)} - {formatTime12H(b.endTime)}
                              </span>
                            </div>

                            <div>
                              <span className="text-brand-navy-500 block text-[11px]">Venue &amp; City</span>
                              <span className="font-bold text-brand-navy-900 mt-0.5 block truncate">
                                {b.city}
                              </span>
                              <span className="text-brand-navy-600 block mt-0.5 text-[11px] truncate">
                                {b.venueLocation || "Private Residence"}
                              </span>
                            </div>

                            <div>
                              <span className="text-brand-navy-500 block text-[11px]">Guest Count</span>
                              <span className="font-bold text-brand-navy-900 mt-0.5 block">
                                {b.guestCount || 35} Expected Guests
                              </span>
                            </div>

                            <div>
                              <span className="text-brand-navy-500 block text-[11px]">Setup Protocol</span>
                              <span className="font-bold text-emerald-700 mt-0.5 block">
                                3 Hours Early Arrival
                              </span>
                            </div>
                          </div>

                          {/* Right: Financial Breakdown Card */}
                          <div className="md:col-span-3 bg-brand-warm-50/80 rounded-xl p-4 border border-brand-warm-200/80 space-y-1.5 text-xs">
                            <span className="text-[11px] text-brand-navy-500 block">Total Investment</span>
                            <div className="text-lg font-bold font-serif text-brand-navy-950">
                              {formatPKR(b.totalAmountMinor)}
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-brand-warm-200 text-[11px]">
                              <span className="text-brand-navy-600">Paid Amount:</span>
                              <span className="font-bold text-emerald-700">{formatPKR(b.amountPaidMinor)}</span>
                            </div>
                            {b.totalAmountMinor > b.amountPaidMinor && (
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-brand-navy-600">Balance Due:</span>
                                <span className="font-bold text-amber-700">
                                  {formatPKR(b.totalAmountMinor - b.amountPaidMinor)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Live 4-Step Setup Progress Timeline */}
                        <div className="pt-4 border-t border-brand-warm-200">
                          <span className="text-[11px] font-bold text-brand-navy-900 uppercase tracking-wider block mb-3">
                            Event Execution Pipeline
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center space-x-2.5">
                              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-[10px]">
                                ✓
                              </div>
                              <div>
                                <span className="font-bold text-emerald-950 block text-[11px]">1. Reserved</span>
                                <span className="text-[10px] text-emerald-700">Booking Confirmed</span>
                              </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center space-x-2.5">
                              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 text-[10px] animate-pulse">
                                2
                              </div>
                              <div>
                                <span className="font-bold text-amber-950 block text-[11px]">2. Crafting Decor</span>
                                <span className="text-[10px] text-amber-700">Theme in Production</span>
                              </div>
                            </div>

                            <div className="bg-brand-warm-50 border border-brand-warm-200 rounded-xl p-3 flex items-center space-x-2.5 opacity-75">
                              <div className="w-6 h-6 rounded-full bg-brand-warm-300 text-brand-navy-800 flex items-center justify-center flex-shrink-0 text-[10px]">
                                3
                              </div>
                              <div>
                                <span className="font-bold text-brand-navy-900 block text-[11px]">3. On-Site Setup</span>
                                <span className="text-[10px] text-brand-navy-600">3h Prior to Event</span>
                              </div>
                            </div>

                            <div className="bg-brand-warm-50 border border-brand-warm-200 rounded-xl p-3 flex items-center space-x-2.5 opacity-75">
                              <div className="w-6 h-6 rounded-full bg-brand-warm-300 text-brand-navy-800 flex items-center justify-center flex-shrink-0 text-[10px]">
                                4
                              </div>
                              <div>
                                <span className="font-bold text-brand-navy-900 block text-[11px]">4. Celebration</span>
                                <span className="text-[10px] text-brand-navy-600">Cake &amp; Party Time</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="pt-4 border-t border-brand-warm-200 flex flex-wrap items-center justify-between gap-3">
                          <Link
                            href={`/booking/${b.reference}`}
                            className="btn-gold px-4 py-2 text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Full Booking &amp; Invoice</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Link>

                          <div className="flex items-center space-x-2.5">
                            <a
                              href={`https://wa.me/923160513841?text=Hi%20AR%20Events%20Co,%20inquiring%20about%20booking%20${b.reference}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-colors flex items-center space-x-1.5"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Chat with Lead Coordinator</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: INVOICES & RECEIPTS                                         */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "invoices" && (
          <div className="bg-white rounded-2xl border border-brand-warm-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold font-serif text-brand-navy-950">
                Official Invoices &amp; Payment Receipts
              </h3>
              <p className="text-xs text-brand-navy-600">
                Download tax invoices and proof of payment receipts for all booked celebrations.
              </p>
            </div>

            {bookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-navy-500">
                No invoices generated yet. Invoices appear automatically upon booking.
              </div>
            ) : (
              <div className="divide-y divide-brand-warm-200 border border-brand-warm-200 rounded-xl overflow-hidden">
                {bookings.map((b: any) => (
                  <div
                    key={b.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-warm-50/50 transition-colors"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-brand-navy-950">
                            INV-{b.reference?.replace("AR-", "") || "2026-1042"}
                          </span>
                          <span className="badge-success text-[10px] px-2 py-0.5">
                            PAID IN FULL
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-navy-600 mt-0.5">
                          {b.package?.title || "Grand Royal Celebration"} • Event on {formatDate(b.eventDate)}
                        </p>
                        <span className="text-[10.5px] text-brand-navy-400 block mt-0.5">
                          Method: Safepay Card Gateway (Verified)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:self-center">
                      <div className="text-right">
                        <span className="text-[11px] text-brand-navy-500 block">Amount</span>
                        <span className="font-serif font-bold text-sm text-brand-navy-950">
                          {formatPKR(b.totalAmountMinor)}
                        </span>
                      </div>

                      <Link
                        href={`/booking/${b.reference}`}
                        className="px-3 py-1.5 rounded-lg border border-brand-warm-300 hover:border-brand-warm-400 text-xs font-semibold text-brand-navy-800 flex items-center space-x-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: SETUP LOGISTICS & GUARANTEE                                 */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "logistics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-brand-warm-200 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-brand-navy-950">
                100% On-Time Setup Guarantee
              </h3>
              <p className="text-xs text-brand-navy-600 leading-relaxed">
                At AR Events Co., we understand timing is everything for luxury birthday celebrations. Our crew strictly operates under the <strong>3 Hours Early Arrival Protocol</strong>.
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-start space-x-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>3:00 PM:</strong> Logistics van arrives with themed backdrops, balloon arches, and lighting.</span>
                </div>
                <div className="flex items-start space-x-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>5:30 PM:</strong> Decor styling finalized and client walk-through inspection conducted.</span>
                </div>
                <div className="flex items-start space-x-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>6:00 PM:</strong> Cake placed on pedestals, guest arrivals and party commencement.</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-brand-warm-200 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-brand-navy-950">
                Dedicated Event Concierge
              </h3>
              <p className="text-xs text-brand-navy-600 leading-relaxed">
                Need to update the birthday child&apos;s name script on the backdrop, add an entertainment show, or request custom flower colors?
              </p>
              <div className="p-4 rounded-xl bg-brand-warm-50 border border-brand-warm-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-navy-500">Event Lead:</span>
                  <span className="font-bold text-brand-navy-950">Asad R.</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-brand-navy-500">WhatsApp Hotline:</span>
                  <span className="font-bold text-emerald-700">+92 316 0513841</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-brand-navy-500">Service Coverage:</span>
                  <span className="font-bold text-brand-navy-950">Islamabad &amp; Rawalpindi</span>
                </div>
              </div>
              <a
                href="https://wa.me/923160513841"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open Direct WhatsApp Chat</span>
              </a>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: PROFILE & DELIVERY DETAILS                                  */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl border border-brand-warm-200 shadow-sm p-6 sm:p-8 space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold font-serif text-brand-navy-950">
                Client Profile &amp; Setup Address
              </h3>
              <p className="text-xs text-brand-navy-600">
                Your verified contact details and primary delivery sector in Islamabad / Rawalpindi.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-brand-warm-50 border border-brand-warm-200">
                  <span className="text-brand-navy-500 block text-[11px]">Full Name</span>
                  <span className="font-bold text-brand-navy-950 mt-1 block">
                    {initialData.user.name}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-warm-50 border border-brand-warm-200">
                  <span className="text-brand-navy-500 block text-[11px]">Email Address</span>
                  <span className="font-bold text-brand-navy-950 mt-1 block">
                    {initialData.user.email}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-brand-warm-50 border border-brand-warm-200">
                  <span className="text-brand-navy-500 block text-[11px]">Phone (WhatsApp)</span>
                  <span className="font-bold text-brand-navy-950 mt-1 block">
                    {initialData.user.phone || "+92 300 1234567"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-warm-50 border border-brand-warm-200">
                  <span className="text-brand-navy-500 block text-[11px]">City / Region</span>
                  <span className="font-bold text-brand-navy-950 mt-1 block">
                    {initialData.city || "Islamabad"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-warm-50 border border-brand-warm-200">
                <span className="text-brand-navy-500 block text-[11px]">Default Setup Location</span>
                <span className="font-bold text-brand-navy-950 mt-1 block">
                  {initialData.address || "Sector F-7/2, Islamabad"}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
