"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Building,
  Loader2,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";
import {
  FALLBACK_PACKAGES,
  FALLBACK_THEMES,
  FALLBACK_VENUES,
} from "@/lib/data-fallback";

interface PriceResult {
  basePriceMinor: number;
  addonsTotalMinor: number;
  venueFeeMinor: number;
  discountMinor: number;
  subtotalMinor: number;
  totalAmountMinor: number;
  depositRequiredMinor: number;
  appliedCoupon?: { code: string; discountMinor: number } | null;
}

const INITIAL_PACKAGES = FALLBACK_PACKAGES.map((p: any) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  subtitle: p.subtitle,
  priceMinor: p.basePriceMinor,
  image: p.featuredImage || "/images/themes/theme_royal_midnight_prince.jpg",
}));

const INITIAL_THEMES = FALLBACK_THEMES.map((t: any) => ({
  id: t.id,
  slug: t.slug,
  title: t.title,
  category: t.category,
  image: t.heroImage || "/images/themes/theme_lavender_dream.jpg",
  colors: JSON.parse(t.colorPalette || "[]"),
}));

const INITIAL_VENUES = FALLBACK_VENUES.map((v: any) => ({
  id: v.id,
  slug: v.slug,
  name: v.name,
  city: v.city,
  feeMinor: v.feeMinor,
}));

const INITIAL_ADDONS = [
  {
    id: "addon_photo_3hr",
    slug: "pro-photography-3hr",
    title: "3-Hour High-Res Event Photography",
    priceMinor: 1500000,
    desc: "Professional DSLR photographer capturing candid moments, portraits & cake cutting.",
  },
  {
    id: "addon_marquee_numbers",
    slug: "4ft-led-marquee-numbers",
    title: "4-Foot LED Light-Up Marquee Numbers",
    priceMinor: 600000,
    desc: "Glowing warm-white marquee numbers representing child's age or initials.",
  },
  {
    id: "addon_magic_show",
    slug: "interactive-magic-show",
    title: "Interactive Magic & Puppet Show",
    priceMinor: 1000000,
    desc: "45-minute interactive entertainment show for kids & family guests.",
  },
];

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [eventType] = useState("Birthday");
  const [city, setCity] = useState<"Islamabad" | "Rawalpindi">("Islamabad");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("22:00");
  const [guestCount, setGuestCount] = useState(35);

  const [selectedPackageId, setSelectedPackageId] = useState(INITIAL_PACKAGES[0]?.id || "kids-wonderland-birthday");
  const [selectedThemeTitle, setSelectedThemeTitle] = useState(INITIAL_THEMES[0]?.title || "Lavender Dream & Purple Princess");
  const [selectedVenueId, setSelectedVenueId] = useState(INITIAL_VENUES[0]?.id || "private-residence-venue");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([
    INITIAL_ADDONS[0]?.id || "addon_photo_3hr",
  ]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [couponCode, setCouponCode] = useState("");

  // Instant pre-populated catalog
  const [packages, setPackages] = useState<any[]>(INITIAL_PACKAGES);
  const [themes, setThemes] = useState<any[]>(INITIAL_THEMES);
  const [addons, setAddons] = useState<any[]>(INITIAL_ADDONS);
  const [venues, setVenues] = useState<any[]>(INITIAL_VENUES);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);

  // Background refresh for live DB updates
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/catalog");
        const json = await res.json();
        if (json.success && json.data) {
          const fetchedPackages = json.data.packages.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            subtitle: p.subtitle,
            priceMinor: p.basePriceMinor,
            image: p.featuredImage || "/images/themes/theme_royal_midnight_prince.jpg",
          }));
          const fetchedThemes = json.data.themes.map((t: any) => ({
            id: t.id,
            slug: t.slug,
            title: t.title,
            category: t.category,
            image: t.heroImage || "/images/themes/theme_lavender_dream.jpg",
            colors: t.colorPalette || ["#9370DB", "#E6E6FA"],
          }));
          const fetchedAddons = json.data.addons.map((a: any) => ({
            id: a.id,
            slug: a.slug,
            title: a.title,
            priceMinor: a.priceMinor,
            desc: a.description,
          }));
          const fetchedVenues = json.data.venues.map((v: any) => ({
            id: v.id,
            slug: v.slug,
            name: v.name,
            city: v.city,
            feeMinor: v.feeMinor,
          }));

          setPackages(fetchedPackages);
          setThemes(fetchedThemes);
          setAddons(fetchedAddons);
          setVenues(fetchedVenues);
        }
      } catch (err) {
        console.warn("Using offline catalog fallback");
      }
    }
    loadCatalog();
  }, []);

  // Instant Memoized Pricing Calculation
  const pricing = useMemo((): PriceResult => {
    const pkg = packages.find((p) => p.id === selectedPackageId || p.slug === selectedPackageId);
    const basePriceMinor = pkg ? pkg.priceMinor : (packages[0]?.priceMinor || 0);

    let addonsTotalMinor = 0;
    for (const addonId of selectedAddonIds) {
      const a = addons.find((item) => item.id === addonId || item.slug === addonId);
      if (a) addonsTotalMinor += a.priceMinor;
    }

    const venue = venues.find((v) => v.id === selectedVenueId || v.slug === selectedVenueId);
    const venueFeeMinor = venue ? venue.feeMinor : 0;

    const subtotalMinor = basePriceMinor + addonsTotalMinor + venueFeeMinor;

    let discountMinor = 0;
    let appliedCoupon = null;
    if (couponCode.toUpperCase().trim() === "ISLAMABAD10") {
      discountMinor = Math.round(subtotalMinor * 0.1);
      appliedCoupon = { code: "ISLAMABAD10", discountMinor };
    }

    const totalAmountMinor = Math.max(0, subtotalMinor - discountMinor);
    const calculatedDeposit = Math.round(totalAmountMinor * 0.3);
    const depositRequiredMinor = Math.min(totalAmountMinor, Math.max(2000000, calculatedDeposit));

    return {
      basePriceMinor,
      addonsTotalMinor,
      venueFeeMinor,
      discountMinor,
      subtotalMinor,
      totalAmountMinor,
      depositRequiredMinor,
      appliedCoupon,
    };
  }, [selectedPackageId, selectedAddonIds, selectedVenueId, couponCode, packages, addons, venues]);

  // Handle Add-on toggling
  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Read URL params to auto-select theme or package
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const themeParam = urlParams.get("theme");
      const packageParam = urlParams.get("package");

      if (packageParam && packages.some((p) => p.id === packageParam)) {
        setSelectedPackageId(packageParam);
      }

      if (themeParam) {
        const match = themes.find((t) => t.slug === themeParam);
        if (match) {
          setSelectedThemeTitle(match.title);
        }
      }
    }
  }, []);

  // Set default event date to 7 days ahead
  useEffect(() => {
    const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    setEventDate(defaultDate.toISOString().split("T")[0]);
  }, []);

  const handleSubmitBooking = async () => {
    setErrorMessage("");

    if (!name || !phone || !email || !address) {
      setErrorMessage("Please complete all required customer details.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        address,
        eventType,
        eventDate,
        startTime,
        endTime,
        city,
        guestCount: Number(guestCount),
        packageId: selectedPackageId,
        themeId: selectedThemeTitle,
        venueId: selectedVenueId,
        addonIds: selectedAddonIds,
        couponCode: couponCode || undefined,
        specialRequests,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to create booking.");
      }

      // Route to confirmation screen with reference
      router.push(`/booking/${json.data.reference}`);
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-14 space-y-10">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-3">
        <span className="badge-gold uppercase tracking-wider text-xs">Easy Online Reservation</span>
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy-950">
          Book Your Birthday Event
        </h1>
        <p className="text-xs sm:text-sm text-brand-navy-700">
          Islamabad & Rawalpindi • Transparent Pricing • Turnkey Coordination
        </p>

        {/* Stepper Bar */}
        <div className="pt-6">
          <div className="grid grid-cols-4 gap-2 max-w-2xl mx-auto text-xs font-semibold">
            {[
              { num: 1, label: "Date & Location" },
              { num: 2, label: "Package & Theme" },
              { num: 3, label: "Venue & Add-ons" },
              { num: 4, label: "Details & Confirm" },
            ].map((s) => (
              <div
                key={s.num}
                onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all ${
                  currentStep === s.num
                    ? "bg-brand-navy-950 text-white shadow-sm"
                    : currentStep > s.num
                    ? "bg-brand-gold-100 text-brand-gold-900"
                    : "bg-brand-warm-100 text-brand-navy-400 opacity-60"
                }`}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current mb-1">
                  {s.num}
                </span>
                <span className="hidden sm:inline text-[11px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form Body */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Interactive Panel (8 Cols) */}
          <div className="lg:col-span-8 card-luxury p-6 sm:p-8 space-y-8">
            {errorMessage && (
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* STEP 1: DATE, LOCATION & GUESTS */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-brand-warm-200 pb-3">
                  <h2 className="text-xl font-bold font-serif text-brand-navy-950">
                    Step 1: Event Date & Location
                  </h2>
                  <p className="text-xs text-brand-navy-600">
                    Tell us where and when the celebration will take place.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      City of Event *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value as "Islamabad" | "Rawalpindi")}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-brand-warm-300 bg-white focus:ring-2 focus:ring-brand-gold-400 font-medium"
                    >
                      <option value="Islamabad">Islamabad (All Sectors & Suburbs)</option>
                      <option value="Rawalpindi">Rawalpindi (Bahria, DHA, Cantt, Satellite Town)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      Expected Guest Count *
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={500}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      Start Time *
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-brand-warm-300 bg-white focus:ring-2 focus:ring-brand-gold-400 font-medium"
                    >
                      <option value="12:00">12:00 PM (Afternoon Lunch)</option>
                      <option value="15:00">03:00 PM (Afternoon Tea/Party)</option>
                      <option value="18:00">06:00 PM (Evening Sunset Party)</option>
                      <option value="19:30">07:30 PM (Grand Dinner Party)</option>
                      <option value="21:00">09:00 PM (Late Night Celebration)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      Estimated End Time
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-brand-warm-300 bg-white focus:ring-2 focus:ring-brand-gold-400 font-medium"
                    >
                      <option value="16:00">04:00 PM</option>
                      <option value="19:00">07:00 PM</option>
                      <option value="22:00">10:00 PM</option>
                      <option value="23:30">11:30 PM</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn-gold px-6 py-2.5 text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <span>Proceed to Package Selection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PACKAGE & THEME SELECTION */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-brand-warm-200 pb-3">
                  <h2 className="text-xl font-bold font-serif text-brand-navy-950">
                    Step 2: Choose Birthday Package & Theme
                  </h2>
                  <p className="text-xs text-brand-navy-600">
                    Select a core package and your visual aesthetic.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-brand-navy-900">
                    1. Select Birthday Package:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPackageId === pkg.id
                            ? "border-brand-gold-500 bg-brand-gold-50/40 shadow-sm"
                            : "border-brand-warm-200 hover:border-brand-warm-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-brand-navy-950">{pkg.title}</h4>
                            <p className="text-[11px] font-semibold text-brand-gold-700">
                              {formatPKR(pkg.priceMinor)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-brand-navy-900">
                    2. Select Theme Aesthetic:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {themes.map((th, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedThemeTitle(th.title)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                          selectedThemeTitle === th.title
                            ? "border-brand-gold-500 bg-brand-gold-50/40"
                            : "border-brand-warm-200 hover:border-brand-warm-300"
                        }`}
                      >
                        <span className="text-xs font-medium text-brand-navy-900">{th.title}</span>
                        <div className="flex space-x-1">
                          {th.colors.map((c: string, cIdx: number) => (
                            <span
                              key={cIdx}
                              className="w-3 h-3 rounded-full border border-black/10"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="btn-outline-navy px-4 py-2 text-xs flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="btn-gold px-6 py-2.5 text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <span>Proceed to Venue & Add-ons</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: VENUE & ADD-ONS */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-brand-warm-200 pb-3">
                  <h2 className="text-xl font-bold font-serif text-brand-navy-950">
                    Step 3: Venue & Optional Add-ons
                  </h2>
                  <p className="text-xs text-brand-navy-600">
                    Select your preferred venue and add photography, customized cakes, or live entertainment.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-brand-navy-900">
                    Venue Option:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {venues.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVenueId(v.id)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedVenueId === v.id
                            ? "border-brand-gold-500 bg-brand-gold-50/40"
                            : "border-brand-warm-200 hover:border-brand-warm-300"
                        }`}
                      >
                        <p className="text-xs font-bold text-brand-navy-950">{v.name}</p>
                        <p className="text-[11px] text-brand-navy-600">{v.city}</p>
                        <p className="text-[11px] font-semibold text-brand-gold-700 mt-1">
                          {v.feeMinor === 0 ? "Zero Venue Fee" : formatPKR(v.feeMinor)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-brand-navy-900">
                    Specialized Add-ons:
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {addons.map((a) => {
                      const isSelected = selectedAddonIds.includes(a.id);
                      return (
                        <div
                          key={a.id}
                          onClick={() => toggleAddon(a.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-brand-gold-500 bg-brand-gold-50/30"
                              : "border-brand-warm-200 hover:border-brand-warm-300"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="mt-0.5 rounded text-brand-gold-600 focus:ring-brand-gold-400"
                            />
                            <div>
                              <p className="text-xs font-bold text-brand-navy-950">{a.title}</p>
                              <p className="text-[11px] text-brand-navy-600">{a.desc}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-brand-gold-700 ml-4 flex-shrink-0">
                            +{formatPKR(a.priceMinor)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn-outline-navy px-4 py-2 text-xs flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="btn-gold px-6 py-2.5 text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <span>Proceed to Customer Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CUSTOMER DETAILS & REVIEW */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-brand-warm-200 pb-3">
                  <h2 className="text-xl font-bold font-serif text-brand-navy-950">
                    Step 4: Customer Details & Confirmation
                  </h2>
                  <p className="text-xs text-brand-navy-600">
                    Enter your contact details to receive your booking reference and invoice.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatima Zahra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0316 0513841"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="fatima@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      Setup Address / Exact Venue Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="House 42, St 19, F-8/2 Islamabad or Bahria Town..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                    Special Instructions / Personalized Name on Backdrop
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Birthday Boy's Name is 'Zayd' turning 1. Prefers pastel balloons and warm spotlight on cake plinth."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-brand-warm-300 focus:ring-2 focus:ring-brand-gold-400 font-medium"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="btn-outline-navy px-4 py-2 text-xs flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleSubmitBooking}
                    className="btn-gold px-8 py-3 text-sm font-semibold flex items-center space-x-2 shadow-gold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span>Submitting Booking...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Submit Booking Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Summary Sidebar (4 Cols) */}
          <div className="lg:col-span-4 card-luxury p-6 space-y-6 sticky top-28 bg-brand-warm-50/70 border-brand-gold-200">
            <div>
              <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                Booking Summary
              </h3>
              <p className="text-xs text-brand-navy-600">
                Authoritative real-time pricing estimate
              </p>
            </div>

            <div className="space-y-3 text-xs border-y border-brand-warm-200 py-4">
              <div className="flex justify-between">
                <span className="text-brand-navy-600">Event Date:</span>
                <span className="font-semibold text-brand-navy-900">{eventDate || "Selected in Step 1"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-navy-600">Location:</span>
                <span className="font-semibold text-brand-navy-900">{city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-navy-600">Package:</span>
                <span className="font-semibold text-brand-navy-900 text-right">
                  {packages.find((p) => p.id === selectedPackageId)?.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-navy-600">Theme:</span>
                <span className="font-semibold text-brand-navy-900 text-right">{selectedThemeTitle}</span>
              </div>
              {selectedAddonIds.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-brand-navy-600">Add-ons ({selectedAddonIds.length}):</span>
                  <span className="font-semibold text-brand-gold-700">
                    +{formatPKR(pricing.addonsTotalMinor)}
                  </span>
                </div>
              )}
            </div>

            {/* Coupon Box */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-brand-navy-900 uppercase">
                Promo Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. ISLAMABAD10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-brand-warm-300 uppercase font-mono"
                />
              </div>
              {pricing.appliedCoupon && (
                <p className="text-[11px] font-semibold text-emerald-700 flex items-center">
                  <Tag className="w-3 h-3 mr-1" />
                  Promo Applied (-10% Discount)
                </p>
              )}
            </div>

            {/* Total Math Breakdown */}
            <div className="space-y-2 pt-2 border-t border-brand-warm-200 text-xs">
              <div className="flex justify-between text-brand-navy-600">
                <span>Subtotal:</span>
                <span>{formatPKR(pricing.subtotalMinor)}</span>
              </div>

              {pricing.discountMinor > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount:</span>
                  <span>-{formatPKR(pricing.discountMinor)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-brand-navy-950 pt-2 border-t border-brand-warm-300">
                <span>Grand Total:</span>
                <span className="text-base text-brand-navy-950 font-serif">
                  {formatPKR(pricing.totalAmountMinor)}
                </span>
              </div>

              <div className="p-3 bg-brand-gold-100/60 rounded-lg border border-brand-gold-300/50 mt-3 space-y-1">
                <div className="flex justify-between text-xs font-bold text-brand-gold-900">
                  <span>Advance Deposit Required:</span>
                  <span>{formatPKR(pricing.depositRequiredMinor)}</span>
                </div>
                <p className="text-[10px] text-brand-navy-600">
                  Balance due on event day after setup inspection.
                </p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-brand-navy-500 space-y-1.5">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero hidden travel fees in Islamabad & Rawalpindi</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
