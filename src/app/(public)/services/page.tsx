import Link from "next/link";
import Image from "next/image";
import { Camera, Sparkles, Utensils, Music, Cake, Smile, ArrowRight, Wrench, Calendar, CheckCircle2 } from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { prisma } from "@/lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Birthday & Event Services in Islamabad & Rawalpindi | AR Events Co.",
  description: "Explore bespoke event services: Photography, 4K Videography, Themed Cakes, Balloon Architecture, Marquee Numbers, and Magic Shows in Islamabad & Rawalpindi.",
};

const getCategoryIcon = (cat: string) => {
  const c = cat.toLowerCase();
  if (c.includes("photo") || c.includes("video")) return Camera;
  if (c.includes("cake") || c.includes("bakery")) return Cake;
  if (c.includes("magic") || c.includes("entertainment") || c.includes("show")) return Smile;
  if (c.includes("food") || c.includes("catering") || c.includes("carnival")) return Utensils;
  if (c.includes("sound") || c.includes("light") || c.includes("music") || c.includes("dj")) return Music;
  return Sparkles;
};

export default async function ServicesPage() {
  const dbServices = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="py-12 sm:py-16 space-y-16 bg-brand-warm-50/40 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">A La Carte & Event Production</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950 font-bold">
          Event Planning & Decor Services
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          Add specialized entertainment, high-end photography, custom bakery creations, and special effects to any celebration across Islamabad & Rawalpindi.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {dbServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-brand-warm-200 p-8 space-y-3">
            <Wrench className="w-10 h-10 text-brand-warm-400 mx-auto" />
            <p className="text-sm font-semibold text-brand-navy-950">No services published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbServices.map((svc) => {
              const IconComponent = getCategoryIcon(svc.category);
              const priceDisplay =
                svc.priceType === "CUSTOM"
                  ? "Custom Quote"
                  : svc.basePriceMinor > 0
                  ? `From ${formatPKR(svc.basePriceMinor)}`
                  : "Included / On Request";

              return (
                <div key={svc.id} className="card-luxury overflow-hidden flex flex-col justify-between group">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-brand-warm-100">
                      <Image
                        src={svc.image || "/images/themes/theme_lavender_dream.jpg"}
                        alt={svc.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/75 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs">
                          {svc.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-4 text-white">
                        <span className="badge-gold bg-brand-gold-600 text-white border-none text-xs font-bold shadow-sm">
                          {priceDisplay}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center space-x-2.5 text-brand-gold-600">
                        <IconComponent className="w-5 h-5 shrink-0" />
                        <h3 className="text-lg font-bold text-brand-navy-950 font-serif">
                          {svc.title}
                        </h3>
                      </div>
                      <p className="text-xs text-brand-navy-700 leading-relaxed">
                        {svc.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-brand-warm-200/80 mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-brand-navy-500 font-medium">
                      Twin Cities Coverage
                    </span>
                    <Link
                      href="/book"
                      className="btn-gold py-2 px-3.5 text-xs font-semibold flex items-center space-x-1 shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Service</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
