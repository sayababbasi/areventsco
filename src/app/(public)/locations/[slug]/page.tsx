import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { constructMetadata, APP_BASE_URL } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { LocalBusinessJsonLd, FaqPageJsonLd } from "@/components/seo/JsonLd";
import {
  MapPin,
  Sparkles,
  Calendar,
  Phone,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react";

import { getSafePackages, getSafeThemes, getSafeVenues, getSafeFaqs } from "@/lib/data-fallback";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // 60s ISR Cache

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let location: any = null;
  try {
    location = await prisma.locationPage.findUnique({
      where: { slug },
    });
  } catch {
    // Offline fallback
  }

  if (!location) {
    return {
      title: `${slug.replace(/-/g, " ")} Birthday Decoration | AR Events Co.`,
    };
  }

  const secondary = location.secondaryKeywords
    ? JSON.parse(location.secondaryKeywords)
    : [];

  return constructMetadata({
    title: location.seoTitle || `${location.name} Birthday Decoration & Event Planning | AR Events Co.`,
    description:
      location.seoDescription ||
      `Luxury birthday decoration and party styling in ${location.name}. Custom 3D backdrops, balloon arches, cakes, and turnkey event coordination.`,
    canonicalPath: location.canonicalUrl || `/locations/${location.slug}`,
    ogImage: location.ogImage || location.featuredImage || "/images/hero/hero_birthday_lawn.jpg",
    noIndex: location.noIndex,
    noFollow: location.noFollow,
    keywords: [
      location.focusKeyword || `birthday decoration ${location.name}`,
      ...secondary,
    ],
  });
}

export default async function LocationLandingPage({ params }: Props) {
  const { slug } = await params;
  let location: any = null;
  try {
    location = await prisma.locationPage.findUnique({
      where: { slug, isActive: true },
    });
  } catch {
    // Offline fallback
  }

  if (!location) {
    // Generate fallback location object from slug
    const formattedName = slug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
    const isRwp = slug.toLowerCase().includes("rawalpindi") || slug.toLowerCase().includes("bahria");

    location = {
      name: formattedName,
      slug,
      city: isRwp ? "Rawalpindi" : "Islamabad",
      headline: `Luxury Birthday Decoration & Event Planning in ${formattedName}`,
      description: `AR Events Co. brings bespoke birthday decorations, themed 3D backdrops, organic balloon arches, and complete party planning directly to your home, lawn, or banquet in ${formattedName}.`,
      deliveryTimeHours: 3,
      startingPriceMinor: 3500000,
      heroImage: "/images/hero/hero_birthday_lawn.jpg",
      popularVenues: JSON.stringify(["Home Lounge / Private Lawn", "Islamabad Club", "Margalla Terrace"]),
      faqs: JSON.stringify([
        {
          question: `Do you deliver birthday setups to ${formattedName}?`,
          answer: `Yes! Our styling team and decor logistics crew provide full on-site delivery, setup, and teardown across ${formattedName}.`,
        },
        {
          question: "How long does setup take?",
          answer: "Most setups take between 2.5 to 3.5 hours on-site prior to your event start time.",
        },
      ]),
    };
  }

  // Fetch local packages, themes, venues, and FAQs safely
  const [packages, themes, venues, faqs] = await Promise.all([
    getSafePackages(3),
    getSafeThemes(4),
    getSafeVenues(3),
    getSafeFaqs(5),
  ]);

  let coverageList: string[] = [];
  try {
    coverageList = location.coverageAreas ? JSON.parse(location.coverageAreas) : [];
  } catch (e) {
    coverageList = [];
  }

  const faqItems = faqs.map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <div className="min-h-screen bg-white">
      {/* Schema.org JSON-LD */}
      <LocalBusinessJsonLd city={location.city} />
      <FaqPageJsonLd faqs={faqItems} />

      {/* Hero Section */}
      <div className="relative bg-brand-navy-950 text-white pt-32 pb-20 px-4 overflow-hidden border-b border-brand-gold-500/20">
        <div className="absolute inset-0 opacity-15">
          <Image
            src={location.featuredImage || "/images/hero/hero_birthday_lawn.jpg"}
            alt={location.seoTitle || `Birthday Decoration in ${location.name}`}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto space-y-6">
          <Breadcrumbs
            items={[
              { name: "Locations", url: "/locations/islamabad" },
              { name: location.name, url: `/locations/${location.slug}` },
            ]}
          />

          <div className="inline-flex items-center space-x-2 bg-brand-gold-500/20 text-brand-gold-300 border border-brand-gold-500/30 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase">
            <MapPin className="w-3.5 h-3.5 text-brand-gold-400" />
            <span>Dedicated Service Hub • {location.name}, Pakistan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white max-w-4xl leading-tight">
            {location.headline}
          </h1>

          <p className="text-brand-warm-200 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
            {location.subheadline || location.introContent}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/book"
              className="btn-gold px-6 py-3.5 text-sm font-bold shadow-xl flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Setup in {location.name}</span>
            </Link>
            <a
              href="https://wa.me/923160513841"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold px-6 py-3.5 text-sm font-semibold flex items-center space-x-2 bg-brand-navy-900/60"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Instant WhatsApp Quote</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Coverage Sectors / Neighborhoods */}
        {coverageList.length > 0 && (
          <section className="card-luxury p-8 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-warm-200 pb-4">
              <div>
                <span className="text-xs font-mono text-brand-gold-600 uppercase tracking-widest">
                  Direct On-Site Delivery & Setup
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-navy-950 mt-1">
                  Service Areas & Neighborhoods in {location.name}
                </h2>
              </div>
              <span className="text-xs text-brand-navy-600 font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full self-start">
                ✓ 3-Hour Rapid Deployment
              </span>
            </div>

            <p className="text-xs sm:text-sm text-brand-navy-700 leading-relaxed max-w-3xl">
              Our mobile party setup crews operate daily across all major sectors, phases, and residential communities in {location.name}. We handle delivery, stage assembly, and post-party removal so you can enjoy your celebration stress-free.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {coverageList.map((area, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 bg-brand-warm-50 p-3 rounded-xl border border-brand-warm-200 text-xs font-medium text-brand-navy-900"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-gold-600 shrink-0" />
                  <span className="truncate">{area}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Curated Packages */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="badge-gold">Transparent All-Inclusive Pricing</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy-950">
              Popular Birthday Packages in {location.name}
            </h2>
            <p className="text-xs sm:text-sm text-brand-navy-600">
              Complete turnkey decoration packages with stage backdrops, balloon styling, lighting, and photography.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="card-luxury overflow-hidden flex flex-col group hover:shadow-xl transition-all"
              >
                <div className="relative h-48 w-full bg-brand-navy-900 overflow-hidden">
                  <Image
                    src={pkg.featuredImage || "/images/hero/hero_birthday_lawn.jpg"}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-brand-navy-950/90 text-brand-gold-300 px-3 py-1 rounded-full text-xs font-mono font-bold border border-brand-gold-500/30">
                    PKR {(pkg.basePriceMinor / 100).toLocaleString()}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-serif font-bold text-brand-navy-950">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-brand-navy-600 line-clamp-2">
                      {pkg.description}
                    </p>
                  </div>

                  <Link
                    href={`/book?package=${pkg.slug}`}
                    className="btn-gold w-full text-xs py-2.5 text-center font-bold flex items-center justify-center space-x-1.5"
                  >
                    <span>Book Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Themes */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-warm-200 pb-4">
            <div>
              <span className="text-xs font-mono text-brand-gold-600 uppercase tracking-wider">
                Trending Birthday Themes
              </span>
              <h2 className="text-2xl font-serif font-bold text-brand-navy-950 mt-1">
                Custom Styling Options in {location.name}
              </h2>
            </div>
            <Link
              href="/themes"
              className="text-xs font-bold text-brand-gold-700 hover:text-brand-gold-800 flex items-center space-x-1"
            >
              <span>View All Themes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {themes.map((t) => (
              <Link
                key={t.id}
                href={`/themes/${t.slug}`}
                className="card-luxury group overflow-hidden block hover:shadow-lg transition-all"
              >
                <div className="relative h-44 w-full bg-brand-navy-900 overflow-hidden">
                  <Image
                    src={t.heroImage || "/images/themes/theme_lavender_dream.jpg"}
                    alt={t.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-brand-navy-950/80 text-white text-[10px] px-2 py-0.5 rounded-md">
                    {t.category}
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-serif font-bold text-sm text-brand-navy-950 group-hover:text-brand-gold-700 transition-colors truncate">
                    {t.title}
                  </h3>
                  <p className="text-[11px] text-brand-navy-600 line-clamp-2">
                    {t.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Local Venues */}
        {venues.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-3">
              <div>
                <span className="text-xs font-mono text-brand-gold-600 uppercase tracking-wider">
                  Partner Locations & Private Home Setups
                </span>
                <h2 className="text-2xl font-serif font-bold text-brand-navy-950 mt-1">
                  Partner Venues in {location.name}
                </h2>
              </div>
              <Link
                href="/venues"
                className="text-xs font-bold text-brand-gold-700 hover:text-brand-gold-800 flex items-center space-x-1"
              >
                <span>All Venues</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {venues.map((v) => (
                <div key={v.id} className="card-luxury p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-brand-navy-950 text-brand-gold-300 px-2 py-0.5 rounded-full">
                      {v.venueType}
                    </span>
                    <span className="text-xs text-brand-navy-600">Capacity: {v.capacity} Guests</span>
                  </div>
                  <h3 className="font-serif font-bold text-brand-navy-950 text-base">{v.name}</h3>
                  <p className="text-xs text-brand-navy-600 flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold-600 shrink-0 mt-0.5" />
                    <span>{v.address}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="card-luxury p-8 sm:p-10 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="badge-gold">Help & Guidance</span>
              <h2 className="text-2xl font-serif font-bold text-brand-navy-950">
                Frequently Asked Questions about {location.name} Setups
              </h2>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto pt-4">
              {faqs.map((f) => (
                <div key={f.id} className="p-4 bg-brand-warm-50 rounded-xl border border-brand-warm-200 space-y-2">
                  <h3 className="font-serif font-bold text-sm text-brand-navy-950">{f.question}</h3>
                  <p className="text-xs text-brand-navy-700 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Booking Banner */}
        <section className="card-luxury bg-brand-navy-950 text-white p-8 sm:p-12 text-center space-y-6 border border-brand-gold-500/30">
          <div className="w-12 h-12 rounded-full bg-brand-gold-500/20 text-brand-gold-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Ready to Plan an Unforgettable Birthday in {location.name}?
            </h2>
            <p className="text-xs sm:text-sm text-brand-warm-200">
              Browse our catalog of themes, select your preferred date, and secure your booking online in minutes.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book" className="btn-gold px-8 py-3.5 text-sm font-bold shadow-xl">
              Start Online Booking
            </Link>
            <a
              href="https://wa.me/923160513841"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold px-6 py-3.5 text-sm font-semibold flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp +92 316 0513841</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
