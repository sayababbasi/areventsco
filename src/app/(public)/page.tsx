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
  Users,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";

export default function HomePage() {
  const packages = [
    {
      slug: "grand-royal-celebration",
      title: "Grand Royal Celebration",
      subtitle: "Our signature luxury all-inclusive birthday planning experience",
      priceMinor: 12500000,
      capacity: "30 - 150 Guests",
      duration: "5 Hours Coverage",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      featured: true,
      features: [
        "16ft x 10ft bespoke 3D stage backdrop with acrylic name cutout",
        "20ft organic chrome gold & navy balloon garland",
        "Warm stage uplighting & cold spark pyro effect",
        "3-Tier customized theme cake (Belgian Chocolate/Fudge)",
        "3 Hours professional photography with edited digital gallery",
        "Dedicated on-site setup supervisor & decor crew",
      ],
    },
    {
      slug: "kids-wonderland-birthday",
      title: "Kids Wonderland Experience",
      subtitle: "Magical birthday wonderland designed to spark pure joy",
      priceMinor: 7500000,
      capacity: "20 - 80 Guests",
      duration: "4 Hours Coverage",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
      featured: false,
      features: [
        "10ft custom circular or arched themed backdrop",
        "12ft organic balloon garland with foil accents",
        "Set of 3 custom themed cake plinths with vinyl decals",
        "Life-sized themed character cutouts",
        "Kids party favor display easel & welcome board",
        "2 Hours event coverage with 40+ edited photos",
      ],
    },
    {
      slug: "elegant-chic-milestone",
      title: "Elegant Chic Milestone",
      subtitle: "Sophisticated minimalism for 18th, 21st, 30th & 50th birthdays",
      priceMinor: 9500000,
      capacity: "25 - 100 Guests",
      duration: "4 Hours Coverage",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      featured: false,
      features: [
        "8ft x 8ft metallic gold shimmer wall or ribbed panels",
        "Neon LED sign ('Happy Birthday' / Custom Name)",
        "Giant 4-foot illuminated marquee age numbers",
        "Lush organic balloon garland with faux floral accents",
        "Luxury dessert cart & cake pedestal styling",
        "Warm uplighting kit for evening ambiance",
      ],
    },
  ];

  const themes = [
    {
      title: "Royal Navy & Metallic Gold",
      category: "Adult Luxury & Milestones",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
      colors: ["#0A192F", "#D4AF37", "#1B365D"],
    },
    {
      title: "Enchanted Princess Castle",
      category: "Kids Fairytale",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
      colors: ["#FCE7F3", "#D4AF37", "#F472B6"],
    },
    {
      title: "Wild One Safari Adventure",
      category: "Kids Jungle Theme",
      image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
      colors: ["#064E3B", "#D97706", "#78350F"],
    },
    {
      title: "Boho Chic & Rose Gold",
      category: "Teens & Chic Parties",
      image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80",
      colors: ["#FDE047", "#FBCFE8", "#D97706"],
    },
  ];

  const testimonials = [
    {
      name: "Ayesha Malik",
      location: "Sector F-7/2, Islamabad",
      event: "Zayd's 1st Birthday (Safari Theme)",
      quote:
        "AR Events Co. delivered beyond our wildest expectations! The balloon garland and life-sized safari cutouts looked like they came straight out of a luxury magazine. The entire setup in our Islamabad residence was completed 3 hours before guests arrived.",
      rating: 5,
    },
    {
      name: "Brig. (R) Tariq Mahmood",
      location: "DHA Phase 2, Islamabad",
      event: "50th Milestone Birthday",
      quote:
        "Superb execution, polite staff, and impeccable attention to detail. The midnight navy and gold theme with marquee numbers added such a refined elegance to our banquet. Truly the top event planners in the twin cities.",
      rating: 5,
    },
    {
      name: "Mahnoor & Bilal",
      location: "Bahria Town Phase 4, Rawalpindi",
      event: "Princess Castle 5th Birthday",
      quote:
        "Our daughter was completely mesmerized by the castle backdrop and balloon clouds. Booking online was effortless and the coordination was flawless. We couldn't be happier!",
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: "Which areas in Islamabad and Rawalpindi do you serve?",
      a: "We provide complete decor and event planning across all Islamabad sectors (F, G, E, H, I, Bani Gala, Chak Shahzad, Park View City, Bahria Enclave) and all Rawalpindi zones including Bahria Town (Phases 1-8), DHA (Phases 1-5), Cantt, and Satellite Town.",
    },
    {
      q: "Can I customize a package with specific colors or extra services?",
      a: "Yes! During online booking or consultation, you can customize your theme palette, add 4K videography, custom themed cakes, magic shows, cold spark pyro machines, and live food counters.",
    },
    {
      q: "How does the booking and payment process work?",
      a: "Select your package, date, and venue. Our system verifies date availability and calculates your transparent price. An advance deposit secures your date, with the balance payable on event day.",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-brand-warm-50 via-white to-white overflow-hidden">
        {/* Subtle Decorative Gold Ring Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-gold-50 border border-brand-gold-300 text-brand-gold-800 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold-600" />
                <span>Islamabad & Rawalpindi&apos;s Premier Event Planners</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-navy-950 tracking-tight leading-[1.15]">
                Creating Extraordinary{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-600 via-brand-gold-500 to-brand-gold-700">
                  Birthday Celebrations
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-brand-navy-700 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Bespoke thematic backdrops, organic balloon architecture, custom cakes, and turnkey event coordination. We transform homes, banquet halls, and outdoor lawns across the twin cities into unforgettable celebration spaces.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3.5 sm:space-y-0 sm:space-x-4 pt-2">
                <Link
                  href="/book"
                  className="btn-gold w-full sm:w-auto text-base px-8 py-4 flex items-center justify-center space-x-2.5 group"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Your Event</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/packages"
                  className="btn-outline-navy w-full sm:w-auto text-base px-8 py-4 flex items-center justify-center"
                >
                  <span>Explore Packages</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-brand-warm-200 text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-brand-navy-900 font-serif">500+</p>
                  <p className="text-xs sm:text-sm text-brand-navy-600">Events Delivered</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-brand-navy-900 font-serif flex items-center">
                    4.9 <Star className="w-4 h-4 text-brand-gold-500 fill-brand-gold-500 ml-1" />
                  </p>
                  <p className="text-xs sm:text-sm text-brand-navy-600">Client Rating</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-brand-navy-900 font-serif">100%</p>
                  <p className="text-xs sm:text-sm text-brand-navy-600">On-Time Guarantee</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Feature */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card Frame */}
                <div className="relative rounded-2xl overflow-hidden shadow-elevated border-2 border-brand-gold-200 group">
                  <div className="relative h-[440px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80"
                      alt="AR Events Co. Luxury Birthday Setup in Islamabad"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent" />
                  </div>

                  {/* Overlay Badge Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-brand-gold-300 shadow-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-brand-gold-600 font-semibold uppercase tracking-wider">
                          Signature Setup
                        </p>
                        <h4 className="text-base font-bold text-brand-navy-900">
                          Royal Navy & Metallic Gold
                        </h4>
                      </div>
                      <Link
                        href="/book?package=grand-royal-celebration"
                        className="btn-gold py-1.5 px-3 text-xs"
                      >
                        Book Setup
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating Floating Trust Badge */}
                <div className="hidden sm:flex absolute -top-4 -left-4 bg-white rounded-xl shadow-elevated p-3.5 border border-brand-warm-200 items-center space-x-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-navy-900">Islamabad & Rawalpindi</p>
                    <p className="text-[10px] text-brand-navy-600">On-Site Direct Setup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LOCAL SERVICE AREA BANNER */}
      <section className="bg-brand-navy-900 text-white py-6 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-brand-gold-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">
                Serving All Areas Across Islamabad & Rawalpindi
              </p>
              <p className="text-xs text-brand-navy-200">
                F & E Sectors, Bani Gala, Bahria Town (Phases 1-8), DHA (1-5), Cantt, and Farmhouses.
              </p>
            </div>
          </div>
          <Link
            href="/venues"
            className="text-xs font-semibold text-brand-gold-300 hover:text-brand-gold-200 flex items-center underline underline-offset-4"
          >
            <span>Explore Partner Venues in Twin Cities</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </section>

      {/* 3. FEATURED BIRTHDAY PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="badge-gold uppercase tracking-wider text-xs">Curated Packages</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-brand-navy-950">
            Tailored Birthday Celebrations
          </h2>
          <div className="gold-divider mx-auto" />
          <p className="text-brand-navy-700 text-base">
            Transparent pricing, comprehensive decor deliverables, and turnkey coordination. Every package is fully customizable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.slug}
              className={`card-luxury flex flex-col relative ${
                pkg.featured ? "ring-2 ring-brand-gold-500" : ""
              }`}
            >
              {pkg.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="badge-gold bg-brand-gold-500 text-white border-none shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Package Thumbnail */}
              <div className="relative h-56 w-full">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/60 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-xs font-medium text-brand-gold-300 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1" />
                    {pkg.capacity}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-bold text-brand-navy-950 font-serif">
                      {pkg.title}
                    </h3>
                  </div>

                  <p className="text-xs text-brand-navy-600 line-clamp-2">
                    {pkg.subtitle}
                  </p>

                  <div className="pt-2 pb-1 border-y border-brand-warm-200">
                    <span className="text-2xl font-bold text-brand-navy-900">
                      {formatPKR(pkg.priceMinor)}
                    </span>
                    <span className="text-xs text-brand-navy-500 ml-1.5">All-inclusive package</span>
                  </div>

                  {/* Feature Bullets */}
                  <ul className="space-y-2.5 pt-2 text-xs text-brand-navy-700">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-brand-gold-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-brand-warm-100">
                  <Link
                    href={`/book?package=${pkg.slug}`}
                    className={`w-full py-3 flex items-center justify-center space-x-2 text-sm font-semibold rounded-lg transition-all ${
                      pkg.featured
                        ? "btn-gold"
                        : "btn-outline-navy hover:bg-brand-navy-900 hover:text-white"
                    }`}
                  >
                    <span>Book This Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/packages"
            className="inline-flex items-center text-sm font-semibold text-brand-gold-700 hover:text-brand-gold-800"
          >
            <span>View All Birthday Packages & Custom Options</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* 4. POPULAR THEMES SHOWCASE */}
      <section className="bg-brand-warm-50 py-20 border-y border-brand-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="badge-gold uppercase tracking-wider text-xs">Visual Concepts</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-brand-navy-950 mt-2">
                Popular Birthday Themes
              </h2>
              <p className="text-brand-navy-700 text-sm mt-2 max-w-xl">
                Every theme features curated color palettes, 3D backdrops, customized plinths, and bespoke lighting setups.
              </p>
            </div>
            <Link
              href="/themes"
              className="mt-4 md:mt-0 text-sm font-semibold text-brand-gold-700 hover:text-brand-gold-800 flex items-center"
            >
              <span>Explore All Themes</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {themes.map((th, idx) => (
              <div key={idx} className="card-luxury group">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={th.image}
                    alt={th.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-brand-gold-300">
                      {th.category}
                    </span>
                    <div className="flex space-x-1">
                      {th.colors.map((c, cIdx) => (
                        <span
                          key={cIdx}
                          className="w-3 h-3 rounded-full border border-white/50"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-base font-bold text-brand-navy-950">{th.title}</h4>
                  <Link
                    href={`/book?theme=${encodeURIComponent(th.title)}`}
                    className="mt-3 text-xs font-semibold text-brand-gold-600 hover:text-brand-gold-700 flex items-center"
                  >
                    <span>Select for Booking</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOUR-STEP TURNKEY PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="badge-gold uppercase tracking-wider text-xs">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-brand-navy-950">
            Flawless Planning in 4 Simple Steps
          </h2>
          <div className="gold-divider mx-auto" />
          <p className="text-brand-navy-700 text-sm">
            Experience effortless birthday planning with clear milestone tracking and zero day-of-event stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Choose Theme & Package",
              desc: "Browse our curated packages and themes or build a custom setup tailored to your guest count.",
              icon: Palette,
            },
            {
              step: "02",
              title: "Select Date & Venue",
              desc: "Pick your event date and tell us whether we are setting up at your home, garden, or banquet hall.",
              icon: Calendar,
            },
            {
              step: "03",
              title: "Bespoke Production",
              desc: "Our design artisans custom craft backdrops, personalized 3D cutouts, and custom cakes.",
              icon: Sparkles,
            },
            {
              step: "04",
              title: "On-Time Setup",
              desc: "Our on-site crew arrives 3-4 hours prior to guests, executing the entire decor flawlessly.",
              icon: Clock,
            },
          ].map((item, idx) => (
            <div key={idx} className="card-luxury p-6 relative flex flex-col justify-between">
              <div>
                <span className="text-3xl font-bold font-serif text-brand-gold-400/60">
                  {item.step}
                </span>
                <div className="p-3 bg-brand-gold-50 text-brand-gold-600 rounded-xl w-fit my-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-brand-navy-950 mb-2">{item.title}</h4>
                <p className="text-xs text-brand-navy-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. VERIFIED CUSTOMER REVIEWS */}
      <section className="bg-brand-navy-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="badge-gold uppercase tracking-wider text-xs">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white">
              Loved by Islamabad & Rawalpindi Families
            </h2>
            <div className="gold-divider mx-auto" />
            <p className="text-brand-navy-200 text-sm">
              Real reviews from verified birthday celebrations in the twin cities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-brand-navy-900 rounded-2xl p-6 border border-brand-navy-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex space-x-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-brand-gold-400 fill-brand-gold-400" />
                    ))}
                  </div>
                  <p className="text-xs text-brand-gold-300 font-semibold">{t.event}</p>
                  <p className="text-sm text-brand-navy-100 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-navy-800">
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-brand-navy-400">{t.location}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/reviews"
              className="inline-flex items-center text-sm font-semibold text-brand-gold-400 hover:text-brand-gold-300"
            >
              <span>Read More Client Stories</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="badge-gold uppercase tracking-wider text-xs">Got Questions?</span>
          <h2 className="text-3xl font-serif text-brand-navy-950">Frequently Asked Questions</h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="card-luxury p-6 space-y-2">
              <h4 className="text-base font-bold text-brand-navy-950 flex items-start">
                <span className="text-brand-gold-600 mr-2 font-serif">Q.</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-sm text-brand-navy-700 pl-6 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINAL HIGH-CONVERSION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 p-8 sm:p-14 text-center text-white shadow-elevated border-2 border-brand-gold-400/30">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="badge-gold bg-brand-gold-500/20 text-brand-gold-300 border-brand-gold-400/40 uppercase tracking-widest text-xs">
              Let&apos;s Plan Your Special Day
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
              Ready to Make Your Celebration Unforgettable?
            </h2>

            <p className="text-sm sm:text-base text-brand-navy-200 leading-relaxed">
              Dates in Islamabad and Rawalpindi fill quickly on weekends. Book your package online today or speak directly with our lead event coordinator.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Link
                href="/book"
                className="btn-gold w-full sm:w-auto text-base px-8 py-4 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Your Event Online</span>
              </Link>
              <a
                href="https://wa.me/923008555123"
                target="_blank"
                rel="noreferrer"
                className="btn-outline-gold w-full sm:w-auto text-base px-8 py-4 flex items-center justify-center border-white/40 text-white hover:bg-white/10"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
