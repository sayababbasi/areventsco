import Link from "next/link";
import Image from "next/image";
import { Users, Clock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { formatPKR } from "@/lib/utils";

export const metadata = {
  title: "Birthday & Event Packages Islamabad & Rawalpindi | AR Events Co.",
  description: "Browse all-inclusive birthday planning and luxury decor packages in Islamabad and Rawalpindi. Transparent pricing, organic balloon decor, 3D backdrops, and photography.",
};

const allPackages = [
  {
    slug: "grand-royal-celebration",
    title: "Grand Royal Celebration",
    subtitle: "Our signature luxury all-inclusive birthday planning experience",
    description: "Designed for grand milestones and high-profile parties. Includes a custom 16ft 3D stage backdrop, luxury balloon architecture, ambient stage lighting, 3-tier custom cake, professional photography, sound system, and a dedicated on-site event coordinator.",
    priceMinor: 12500000,
    guestCapacity: "30 - 150 Guests",
    duration: "5 Hours Coverage",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80",
    badge: "Most Popular",
    features: [
      "16ft x 10ft bespoke 3D stage backdrop with acrylic name cutout",
      "20ft organic chrome gold & navy balloon garland installation",
      "Stage lighting, warm ambient uplighting & cold spark effects",
      "3-Tier customized fondant cake (matching chosen theme)",
      "3 Hours professional photography with edited digital gallery",
      "Dedicated on-site setup supervisor & 4-member decor crew",
      "Thematic entrance welcome board with floral/balloon detailing",
      "Sound system with wireless mics for speeches and playlist management",
    ],
  },
  {
    slug: "kids-wonderland-birthday",
    title: "Kids Wonderland Experience",
    subtitle: "Magical birthday wonderland designed to spark pure joy",
    description: "The ultimate birthday package for boys and girls from 1st birthdays up to 12 years. Features vibrant thematic backdrops, life-sized character cutouts, balloon arches, kids entertainment coordination, and photo-ready cake tables.",
    priceMinor: 7500000,
    guestCapacity: "20 - 80 Guests",
    duration: "4 Hours Coverage",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80",
    badge: "Kids Favorite",
    features: [
      "10ft custom circular or arch backdrop with theme-matched graphics",
      "12ft organic balloon garland with thematic foil accents",
      "Cylindrical cake plinths (set of 3) with customized decals",
      "Themed cutouts (Jungle/Safari, Princess, Superhero, Space)",
      "Kids party favor display corner & custom welcome easel",
      "2 Hours event coverage with 40+ edited high-resolution photos",
      "Complete setup 3 hours prior to event start time",
    ],
  },
  {
    slug: "elegant-chic-milestone",
    title: "Elegant Chic Milestone",
    subtitle: "Sophisticated minimalism with warm gold accents for teens & adults",
    description: "Designed for 18th, 21st, 30th, 40th, and 50th milestone celebrations. Combines chic shimmer walls or sleek arched backdrops with neon lighting, giant marquee numbers, and sophisticated florals.",
    priceMinor: 9500000,
    guestCapacity: "25 - 100 Guests",
    duration: "4 Hours Coverage",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80",
    badge: "Milestone Choice",
    features: [
      "8ft x 8ft metallic gold shimmer wall or ribbed wooden panel",
      "Neon LED sign ('Happy Birthday' / Custom name)",
      "Giant 4ft illuminated marquee light-up age numbers",
      "Lush organic balloon garland with faux floral accents",
      "Luxury cake stand & champagne dessert cart styling",
      "Warm uplighting kit for ambient evening elegance",
      "2 Hours candid event photography",
    ],
  },
  {
    slug: "pastel-dream-intimate",
    title: "Pastel Dream Intimate",
    subtitle: "Chic and modern setup perfect for home or cafe celebrations",
    description: "An intimate, aesthetic celebration setup crafted for home lounges, private dining rooms, or terrace parties in Islamabad & Rawalpindi. Delivers maximum visual impact in a compact footprint.",
    priceMinor: 4500000,
    guestCapacity: "10 - 40 Guests",
    duration: "3 Hours Coverage",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80",
    badge: "Intimate Setup",
    features: [
      "Double arched wooden/acrylic backdrop in custom pastel palette",
      "8ft pastel balloon cluster with double-stuffed matte finish",
      "Acrylic cylindrical cake pedestal with vinyl personalized lettering",
      "Personalized tabletop welcome sign & floral accents",
      "Professional on-time delivery, assembly, and post-event packdown",
    ],
  },
];

export default function PackagesPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Complete Party Solutions</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950">
          Birthday Event Packages
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          Select from our curated all-inclusive packages in Islamabad & Rawalpindi or customize any package with bespoke backdrops, cakes, and entertainment.
        </p>
      </section>

      {/* Package List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {allPackages.map((pkg) => (
            <div
              key={pkg.slug}
              className="card-luxury overflow-hidden flex flex-col justify-between border-2 hover:border-brand-gold-400 transition-all duration-300"
            >
              <div>
                <div className="relative h-64 sm:h-72 w-full">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-brand-navy-950/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400">
                      {pkg.badge}
                    </span>
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                    <h2 className="text-2xl font-bold font-serif">{pkg.title}</h2>
                    <p className="text-xs text-brand-navy-200">{pkg.subtitle}</p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Specs & Pricing */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-warm-200">
                    <div>
                      <span className="text-3xl font-bold text-brand-navy-950">
                        {formatPKR(pkg.priceMinor)}
                      </span>
                      <span className="text-xs text-brand-navy-500 block">Total all-inclusive price</span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs font-medium text-brand-navy-700">
                      <span className="flex items-center bg-brand-warm-100 px-3 py-1.5 rounded-lg">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-brand-gold-600" />
                        {pkg.guestCapacity}
                      </span>
                      <span className="flex items-center bg-brand-warm-100 px-3 py-1.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-brand-gold-600" />
                        {pkg.duration}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-brand-navy-700 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-brand-navy-900 uppercase tracking-wider flex items-center">
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold-500 mr-1.5" />
                      What&apos;s Included:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-brand-navy-800">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-brand-gold-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 sm:p-8 pt-0 border-t border-brand-warm-100">
                <Link
                  href={`/book?package=${pkg.slug}`}
                  className="btn-gold w-full py-3.5 text-base flex items-center justify-center space-x-2 font-semibold"
                >
                  <span>Book {pkg.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
