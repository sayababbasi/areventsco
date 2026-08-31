import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Sparkles,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Palette,
  Camera,
  Layers,
  Heart,
  ChevronRight,
  Eye,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { getSafeThemes, getSafePackages, getSafeReviews, getSafeFaqs } from "@/lib/data-fallback";

export const revalidate = 60; // 60s ISR caching for ultra-fast response times

export default async function HomePage() {
  const dbThemes = await getSafeThemes(6);

  const featuredThemes = dbThemes.map((t: any) => {
    let colors: string[] = [];
    try {
      colors = JSON.parse(t.colorPalette || "[]");
    } catch {
      colors = ["#9333EA", "#EC4899", "#F3E8FF"];
    }
    return {
      slug: t.slug,
      title: t.title,
      category: t.category,
      priceMinor: 4500000,
      image: t.heroImage || "/images/themes/theme_lavender_dream.jpg",
      description: t.description,
      colors,
    };
  });

  const dbPackages = await getSafePackages(3);

  const packages = dbPackages.map((p: any) => {
    let feats: string[] = [];
    try {
      feats = JSON.parse(p.features || "[]");
    } catch {
      feats = ["Full Stage Backdrop", "Organic Balloon Arch", "Cake Pedestals", "On-Site Supervisor"];
    }
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle || "Complete birthday celebration package",
      priceMinor: p.basePriceMinor,
      capacity: `${p.guestCapacityMin} - ${p.guestCapacityMax} Guests`,
      duration: `${p.estimatedDurationHours} Hours Coverage`,
      image: p.featuredImage || "/images/themes/theme_royal_midnight_prince.jpg",
      featured: p.isFeatured,
      features: feats,
    };
  });

  const dbReviews = await getSafeReviews(3);

  const testimonials = dbReviews.map((r: any) => ({
    name: r.authorName,
    location: r.authorLocation,
    event: r.eventTitle,
    quote: r.comment,
    rating: r.rating,
  }));

  const dbFaqs = await getSafeFaqs(4, true);

  const faqs = dbFaqs.map((f: any) => ({
    q: f.question,
    a: f.answer,
  }));

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-28 bg-gradient-to-b from-brand-warm-50 via-white to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-gold-50 border border-brand-gold-300 text-brand-gold-800 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold-600" />
                <span>Islamabad & Rawalpindi&apos;s Birthday Styling Studio</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-navy-950 tracking-tight leading-[1.12] font-bold">
                Beautiful Birthday Decorations,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-600 via-brand-gold-500 to-brand-gold-700">
                  Perfectally Planned.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-brand-navy-700 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Choose your favorite birthday theme, customize your setup, and book your decoration online. From outdoor lawn celebrations overlooking the Margalla hills to intimate home lounges across Islamabad & Rawalpindi.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Link
                  href="/themes"
                  className="btn-gold w-full sm:w-auto text-base px-8 py-4 flex items-center justify-center space-x-2.5 group shadow-md"
                >
                  <Palette className="w-5 h-5" />
                  <span>Explore Birthday Themes</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/book"
                  className="btn-outline-navy w-full sm:w-auto text-base px-8 py-4 flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Your Decoration</span>
                </Link>
              </div>

              {/* Trust Stats */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-brand-warm-200 text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-brand-navy-900 font-serif">500+</p>
                  <p className="text-xs sm:text-sm text-brand-navy-600">Events Styled</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-brand-navy-900 font-serif flex items-center">
                    4.9 <Star className="w-4 h-4 text-brand-gold-500 fill-brand-gold-500 ml-1" />
                  </p>
                  <p className="text-xs sm:text-sm text-brand-navy-600">Client Rating</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-brand-navy-900 font-serif">100%</p>
                  <p className="text-xs sm:text-sm text-brand-navy-600">On-Time Setup</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-elevated border-2 border-brand-gold-200 group bg-brand-warm-100">
                  <div className="relative h-[420px] sm:h-[480px] w-full">
                    <Image
                      src="/images/hero/hero_birthday_lawn.jpg"
                      alt="AR Events Co. Luxury Outdoor Birthday Decoration Setup in Islamabad"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/85 via-transparent to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                      <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs">
                        Real Islamabad Setup
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white leading-snug">
                        Ayra&apos;s 1st Birthday Garden Party
                      </h3>
                      <p className="text-xs text-brand-warm-200">
                        Featuring 3D ONE marquee letters, lavender balloon architecture, and custom cake plinths on a private Islamabad lawn.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED BIRTHDAY THEMES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="badge-gold uppercase text-xs">Thematic Catalogs</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-navy-950 font-bold">
              Popular Birthday Themes
            </h2>
            <p className="text-sm sm:text-base text-brand-navy-700 max-w-xl">
              Choose a signature style. We customize each theme with your child&apos;s name, age, and colors.
            </p>
          </div>

          <Link
            href="/themes"
            className="text-sm font-semibold text-brand-gold-700 hover:text-brand-gold-800 flex items-center space-x-1.5 group"
          >
            <span>Explore All Themes</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredThemes.map((theme) => (
            <div key={theme.slug} className="card-luxury flex flex-col justify-between group overflow-hidden">
              <div>
                <div className="relative h-60 w-full overflow-hidden bg-brand-warm-100">
                  <Image
                    src={theme.image}
                    alt={`${theme.title} setup in Islamabad`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/70 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs">
                      {theme.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20">
                    {theme.colors.map((c, i) => (
                      <span key={i} className="w-3 h-3 rounded-full border border-white/60 inline-block" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-serif text-xl font-bold text-brand-navy-950 group-hover:text-brand-gold-700 transition-colors">
                    {theme.title}
                  </h3>
                  <p className="text-xs text-brand-navy-600 line-clamp-2 leading-relaxed">
                    {theme.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-baseline justify-between pt-3 border-t border-brand-warm-200">
                  <span className="text-xs text-brand-navy-500 font-medium">Starting from</span>
                  <span className="text-lg font-bold font-serif text-brand-navy-950">
                    {formatPKR(theme.priceMinor)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href={`/themes/${theme.slug}`}
                    className="py-2.5 px-3 rounded-xl border border-brand-warm-300 text-brand-navy-900 text-xs font-semibold hover:bg-brand-warm-100 text-center flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Setup</span>
                  </Link>

                  <Link
                    href={`/book?theme=${theme.slug}`}
                    className="btn-gold py-2.5 px-3 text-xs font-semibold text-center flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Theme</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS (5-STEP JOURNEY) */}
      <section className="bg-brand-warm-50 py-16 border-y border-brand-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="badge-gold uppercase text-xs">Effortless Planning</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-navy-950 font-bold">
              How It Works
            </h2>
            <div className="gold-divider mx-auto" />
            <p className="text-sm sm:text-base text-brand-navy-700 max-w-xl mx-auto">
              From choosing your favorite theme to seamless on-site delivery in Islamabad & Rawalpindi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                step: "01",
                title: "Discover",
                desc: "Browse authentic setup photography and decoration concepts.",
                icon: "✨",
              },
              {
                step: "02",
                title: "Choose Theme",
                desc: "Select the aesthetic that matches your celebration vision.",
                icon: "🎨",
              },
              {
                step: "03",
                title: "Customize",
                desc: "Add cake, photography, marquee numbers, and bespoke colors.",
                icon: "⚙️",
              },
              {
                step: "04",
                title: "Book Online",
                desc: "Pick your date, time, and twin-cities venue with instant pricing.",
                icon: "📅",
              },
              {
                step: "05",
                title: "Celebrate",
                desc: "Our decor team sets up 3 hours early. You arrive and enjoy.",
                icon: "🎉",
              },
            ].map((s, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3 relative group hover:border-brand-gold-400 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-bold text-brand-gold-600 font-mono">STEP {s.step}</span>
                </div>
                <h4 className="text-lg font-serif font-bold text-brand-navy-950">{s.title}</h4>
                <p className="text-xs text-brand-navy-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PACKAGES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="badge-gold uppercase text-xs">Service Packages</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-brand-navy-950 font-bold">
            Curated Birthday Packages
          </h2>
          <div className="gold-divider mx-auto" />
          <p className="text-sm sm:text-base text-brand-navy-700 max-w-xl mx-auto">
            Transparent, all-inclusive packages with zero hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.slug}
              className={`card-luxury flex flex-col justify-between relative ${
                pkg.featured ? "border-2 border-brand-gold-400 shadow-elevated" : ""
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="badge-gold bg-brand-gold-600 text-white border-transparent text-xs font-bold px-4 py-1">
                    Most Popular Choice
                  </span>
                </div>
              )}

              <div>
                <div className="relative h-52 w-full overflow-hidden rounded-t-2xl bg-brand-warm-100">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xl font-serif font-bold">{pkg.title}</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-baseline justify-between border-b border-brand-warm-200 pb-4">
                    <div>
                      <span className="text-xs text-brand-navy-500 font-medium">Starting from</span>
                      <p className="text-2xl font-serif font-bold text-brand-navy-950">
                        {formatPKR(pkg.priceMinor)}
                      </p>
                    </div>
                    <div className="text-right text-xs text-brand-navy-600">
                      <p className="font-semibold">{pkg.capacity}</p>
                      <p>{pkg.duration}</p>
                    </div>
                  </div>

                  <p className="text-xs text-brand-navy-700 leading-relaxed">
                    {pkg.subtitle}
                  </p>

                  <ul className="space-y-2 text-xs text-brand-navy-800 pt-2">
                    {pkg.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold-600 flex-shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/book?package=${pkg.id}`}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                    pkg.featured ? "btn-gold shadow-md" : "btn-outline-navy"
                  }`}
                >
                  <span>Select {pkg.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="badge-gold uppercase text-xs">Real Feedback</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-navy-950 font-bold">
              Stories from Twin Cities Hosts
            </h2>
            <div className="gold-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="card-luxury p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex space-x-1 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-serif font-bold text-brand-navy-950 text-base">{t.event}</h4>
                  <p className="text-xs sm:text-sm text-brand-navy-700 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-brand-warm-200">
                  <strong className="block text-brand-navy-950 text-sm font-semibold">{t.name}</strong>
                  <span className="text-xs text-brand-navy-500">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. FAQ SECTION */}
      {faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="badge-gold uppercase text-xs">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-navy-950 font-bold">
              Frequently Asked Questions
            </h2>
            <div className="gold-divider mx-auto" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card-luxury p-6 space-y-2">
                <h3 className="text-base font-serif font-bold text-brand-navy-950">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-brand-navy-700 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
