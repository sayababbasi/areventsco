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

export default function HomePage() {
  const featuredThemes = [
    {
      slug: "lavender-dream-princess",
      title: "Lavender Dream & Purple Princess",
      category: "Girls",
      priceMinor: 4500000,
      image: "/images/themes/theme_lavender_dream.jpg",
      description: "Lilac circular arch backdrop with 3D cursive script, lavender & violet balloon garland, and fluted pedestals on garden lawn.",
      colors: ["#9370DB", "#E6E6FA", "#4B0082"],
    },
    {
      slug: "sunflower-golden-sunshine",
      title: "Golden Sunflower Sunshine",
      category: "Floral",
      priceMinor: 4800000,
      image: "/images/themes/theme_sunflower_sunshine.jpg",
      description: "Natural wood slat backdrop with glowing neon 'Happy Birthday' lighting, sunny yellow balloon arch, and giant wooden ONE letters.",
      colors: ["#FFD700", "#FFF8DC", "#8B4513"],
    },
    {
      slug: "enchanted-dusty-rose-bunny",
      title: "Enchanted Dusty Rose Bunny",
      category: "First Birthday",
      priceMinor: 5500000,
      image: "/images/themes/theme_dusty_rose_bunny.jpg",
      description: "Dusty rose velvet arch panel, blooming botanical floral meadow bed, storybook Peter Rabbit cutout, and pastel entryway balloon arch.",
      colors: ["#C08081", "#FFE4E1", "#FFFFFF"],
    },
    {
      slug: "vintage-little-racer",
      title: "Vintage Little Racer (Beep Beep)",
      category: "Boys",
      priceMinor: 5000000,
      image: "/images/themes/theme_vintage_racer.jpg",
      description: "Beep Beep! I'm ONE! backdrop with colorful balloon clusters, black & white checkered runner, toy speedsters, and 3D ONE car blocks.",
      colors: ["#DC2626", "#4B5320", "#38BDF8"],
    },
    {
      slug: "jungle-safari-kingdom",
      title: "Jungle Safari Kingdom",
      category: "Kids",
      priceMinor: 5200000,
      image: "/images/themes/theme_jungle_safari.jpg",
      description: "Circular balloon hoop of sage green and gold balloons, tropical monstera leaves, white cake plinths, and lifelike plush safari animals.",
      colors: ["#2D5A27", "#D4AF37", "#D2B48C"],
    },
    {
      slug: "royal-midnight-prince",
      title: "Royal Midnight Prince & Gold",
      category: "Luxury",
      priceMinor: 6500000,
      image: "/images/themes/theme_royal_midnight_prince.jpg",
      description: "Navy royal crest backdrop with illuminated neon crown, chrome gold balloon arch, 3 gold mirror plinths, and monogram floor decal.",
      colors: ["#0A192F", "#D4AF37", "#FFFFFF"],
    },
  ];

  const packages = [
    {
      slug: "grand-royal-celebration",
      title: "Grand Royal Celebration",
      subtitle: "Our signature luxury all-inclusive birthday planning experience",
      priceMinor: 12500000,
      capacity: "30 - 150 Guests",
      duration: "5 Hours Coverage",
      image: "/images/themes/theme_royal_midnight_prince.jpg",
      featured: true,
      features: [
        "16ft x 10ft bespoke 3D stage backdrop with acrylic name cutout",
        "20ft organic chrome gold & navy balloon garland installation",
        "Stage lighting, warm ambient uplighting & cold spark effects",
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
      image: "/images/themes/theme_dusty_rose_bunny.jpg",
      featured: false,
      features: [
        "10ft custom circular or arched themed backdrop",
        "12ft organic balloon garland with thematic foil accents",
        "Set of 3 custom themed cake plinths with vinyl decals",
        "Life-sized themed character cutouts & props",
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
      image: "/images/themes/theme_sunflower_sunshine.jpg",
      featured: false,
      features: [
        "8ft x 8ft natural wooden slatted or gold shimmer backdrop",
        "Neon LED sign ('Happy Birthday' / Custom Name)",
        "Giant 4-foot illuminated marquee age numbers",
        "Lush organic balloon garland with fresh floral accents",
        "Luxury dessert cart & cake pedestal styling",
        "Warm uplighting kit for evening ambiance",
      ],
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

      {/* 2. FEATURED BIRTHDAY THEMES (THE PRIMARY PRODUCT) */}
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
            <span>Explore All 8 Themes</span>
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

      {/* 3. HOW IT WORKS (THE SIMPLE 5-STEP JOURNEY) */}
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
                <div className="relative h-52 w-full overflow-hidden bg-brand-warm-100">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-xs font-semibold text-brand-gold-300">{pkg.capacity}</span>
                    <h3 className="text-xl font-serif font-bold text-white">{pkg.title}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-brand-navy-600 leading-relaxed">{pkg.subtitle}</p>

                  <div className="space-y-2 pt-2 border-t border-brand-warm-100">
                    {pkg.features.map((f, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-brand-navy-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-baseline justify-between pt-3 border-t border-brand-warm-200">
                  <span className="text-xs text-brand-navy-500 font-medium">All-Inclusive</span>
                  <span className="text-2xl font-bold font-serif text-brand-navy-950">
                    {formatPKR(pkg.priceMinor)}
                  </span>
                </div>

                <Link
                  href={`/book?package=${pkg.slug}`}
                  className={`w-full py-3.5 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
                    pkg.featured
                      ? "btn-gold shadow-md"
                      : "border border-brand-navy-900 text-brand-navy-900 hover:bg-brand-navy-900 hover:text-white"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book This Package</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TWIN CITIES SERVICE AREAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-brand-warm-50 border border-brand-warm-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="badge-gold uppercase text-xs">Local Twin Cities Coverage</span>
            <h2 className="text-3xl font-serif text-brand-navy-950 font-bold">
              We Set Up Across Islamabad & Rawalpindi
            </h2>
            <p className="text-sm text-brand-navy-700 leading-relaxed">
              Whether you are hosting at your private residence, lawn, farmhouse, rented hall, or premier twin-cities venue, our logistics and decor team handles 100% on-time delivery, setup, and cleanup.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-white rounded-xl border border-brand-warm-200 space-y-1">
                <p className="font-bold text-brand-navy-950 text-sm">Islamabad</p>
                <p className="text-xs text-brand-navy-600">Sectors F, G, E, H, I, Bani Gala, Chak Shahzad, Park View, Bahria Enclave</p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-brand-warm-200 space-y-1">
                <p className="font-bold text-brand-navy-950 text-sm">Rawalpindi</p>
                <p className="text-xs text-brand-navy-600">Bahria Town (1-8), DHA (1-5), Cantt, Satellite Town, Chaklala, Saddar</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-brand-warm-200">
            <Image
              src="/images/hero/hero_birthday_lawn.jpg"
              alt="AR Events Co. Islamabad Twin Cities Coverage"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-brand-navy-950/30" />
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-sm rounded-xl border border-white/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-brand-navy-950">On-Time Arrival Guarantee</p>
                <p className="text-[11px] text-brand-navy-600">Team arrives 3 hours prior to guest arrival</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="badge-gold uppercase text-xs">Client Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-brand-navy-950 font-bold">
            Trusted by Twin-Cities Families
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-brand-gold-500 space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-gold-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-brand-navy-700 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-brand-warm-100">
                <p className="text-sm font-bold text-brand-navy-950">{t.name}</p>
                <p className="text-xs text-brand-navy-500">{t.location} • {t.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-brand-navy-950 text-white text-center space-y-6 relative overflow-hidden border border-brand-gold-300/30">
          <div className="space-y-3 max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold-400">
              Let&apos;s Create Your Celebration
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Ready to Book Your Birthday Setup?
            </h2>
            <p className="text-sm sm:text-base text-brand-navy-200 leading-relaxed">
              Explore our birthday themes, customize your decor package, and secure your date online in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
            <Link
              href="/themes"
              className="btn-gold w-full sm:w-auto px-8 py-4 text-base font-semibold shadow-lg"
            >
              Explore Birthday Themes
            </Link>
            <Link
              href="/book"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/30 text-white text-base font-semibold hover:bg-white/10 transition-colors"
            >
              Book Decoration Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
