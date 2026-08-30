import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Calendar, MapPin, ImageIcon } from "lucide-react";
import { prisma } from "@/lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Real Birthday Decoration Gallery Islamabad & Rawalpindi | AR Events Co.",
  description: "Browse authentic birthday celebration setups, 3D backdrops, marquee numbers, and balloon installations delivered across Islamabad and Rawalpindi.",
};

export default async function GalleryPage() {
  const dbAssets = await prisma.mediaAsset.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="py-12 sm:py-16 space-y-16 bg-brand-warm-50/40 min-h-screen">
      {/* 1. PAGE HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Real Event Portfolio</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950 font-bold">
          Celebration Gallery
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Explore real birthday setups, bespoke 3D backdrops, marquee letter installations, and organic balloon architecture styled across Islamabad & Rawalpindi.
        </p>
      </section>

      {/* 2. GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {dbAssets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-brand-warm-200 p-8 space-y-3">
            <ImageIcon className="w-10 h-10 text-brand-warm-400 mx-auto" />
            <p className="text-sm font-semibold text-brand-navy-950">No gallery photos published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbAssets.map((item) => (
              <div key={item.id} className="card-luxury group overflow-hidden flex flex-col justify-between">
                <div className="relative h-80 w-full overflow-hidden bg-brand-warm-100">
                  <Image
                    src={item.url}
                    alt={item.altText || item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/85 via-transparent to-transparent" />
                  
                  <div className="absolute top-3.5 left-3.5">
                    <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <h3 className="font-serif text-lg font-bold leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-warm-200 line-clamp-2">
                      {item.caption || item.tags || "Celebration styled by AR Events Co."}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-brand-warm-200 bg-white flex items-center justify-between">
                  <span className="text-xs text-brand-navy-600 font-medium">
                    Islamabad & Rawalpindi
                  </span>
                  <Link
                    href="/book"
                    className="text-xs font-bold text-brand-gold-700 hover:text-brand-gold-800 flex items-center space-x-1"
                  >
                    <span>Book Setup</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
