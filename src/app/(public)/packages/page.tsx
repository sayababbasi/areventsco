import Link from "next/link";
import Image from "next/image";
import { Users, Clock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { prisma } from "@/lib/db";

export const revalidate = 60; // 60s ISR Cache for maximum speed

export const metadata = {
  title: "Birthday & Event Packages Islamabad & Rawalpindi | AR Events Co.",
  description: "Browse all-inclusive birthday planning and luxury decor packages in Islamabad and Rawalpindi. Transparent pricing, organic balloon decor, 3D backdrops, and photography.",
};

export default async function PackagesPage() {
  const dbPackages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const packages = dbPackages.map((pkg) => {
    let features: string[] = [];
    try {
      features = JSON.parse(pkg.features || "[]");
    } catch {
      features = [
        "Full Backdrop Setup with Theme Decals",
        "Organic Balloon Arch Installation",
        "Cake Pedestals & Thematic Decor Props",
        "On-Site Setup Supervisor & Styling Crew",
      ];
    }

    return {
      id: pkg.id,
      slug: pkg.slug,
      title: pkg.title,
      subtitle: pkg.subtitle || "All-inclusive birthday planning experience",
      description: pkg.description,
      priceMinor: pkg.basePriceMinor,
      guestCapacity: `${pkg.guestCapacityMin} - ${pkg.guestCapacityMax} Guests`,
      duration: `${pkg.estimatedDurationHours} Hours Setup`,
      image: pkg.featuredImage || "/images/themes/theme_royal_midnight_prince.jpg",
      badge: pkg.isFeatured ? "Featured" : undefined,
      features,
    };
  });

  return (
    <div className="bg-brand-warm-50/40 min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="bg-gradient-to-b from-brand-navy-950 to-brand-navy-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-gold-500/15 border border-brand-gold-400/30 text-brand-gold-300 text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Event Experiences</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Transparent Birthday Packages
          </h1>
          <p className="text-brand-warm-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Every package is completely customizable with your choice of birthday theme, color palette, custom cake, entertainment, and on-site event styling in Islamabad & Rawalpindi.
          </p>
        </div>
      </section>

      {/* 2. PACKAGES GRID */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          {packages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-brand-warm-200 p-8 space-y-3">
              <p className="text-base font-serif font-bold text-brand-navy-950">No packages have been published yet.</p>
              <p className="text-xs text-brand-navy-600">Please check back shortly or create one in the Admin Operations Center.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl overflow-hidden border border-brand-warm-200 shadow-md hover:shadow-2xl hover:border-brand-gold-400/80 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Image Showcase */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-warm-100">
                      <Image
                        src={pkg.image}
                        alt={pkg.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent" />

                      {pkg.badge && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-gold-500 text-brand-navy-950 shadow-md">
                            {pkg.badge}
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h2 className="text-xl font-serif font-bold drop-shadow-md leading-tight">
                          {pkg.title}
                        </h2>
                        <p className="text-xs text-brand-gold-300 font-medium">{pkg.subtitle}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-brand-warm-100">
                        <div>
                          <span className="text-xs text-brand-navy-500 font-semibold uppercase tracking-wider">Starting From</span>
                          <p className="text-3xl font-serif font-bold text-brand-navy-950">
                            {formatPKR(pkg.priceMinor)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-brand-navy-700 font-medium">
                          <div className="flex items-center space-x-1.5">
                            <Users className="w-4 h-4 text-brand-gold-600" />
                            <span>{pkg.guestCapacity}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Clock className="w-4 h-4 text-brand-gold-600" />
                            <span>{pkg.duration}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-brand-navy-700 leading-relaxed">
                        {pkg.description}
                      </p>

                      <div className="space-y-3 pt-2">
                        <p className="text-xs font-mono font-bold uppercase tracking-wider text-brand-navy-400">
                          Package Inclusions & Features:
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-navy-800">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold-600 flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA Footer */}
                  <div className="p-6 border-t border-brand-warm-100 bg-brand-warm-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-brand-navy-600 text-center sm:text-left">
                      Need custom props or venue setup? Pick add-ons during online booking.
                    </p>
                    <Link
                      href={`/book?package=${pkg.id}`}
                      className="btn-gold w-full sm:w-auto px-6 py-3 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 flex-shrink-0"
                    >
                      <span>Book This Package</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
