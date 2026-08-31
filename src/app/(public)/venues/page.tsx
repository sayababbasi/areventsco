import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Building, ArrowRight, Calendar } from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { getSafeVenues } from "@/lib/data-fallback";

export const revalidate = 60; // 60s ISR Cache

export const metadata = {
  title: "Partner Birthday Venues Islamabad & Rawalpindi | AR Events Co.",
  description: "Discover top event venues in Islamabad and Rawalpindi: Banquet halls, terrace lawns, private farmhouses, or at-home setups.",
};

export default async function VenuesPage() {
  const dbVenues = await getSafeVenues();

  return (
    <div className="py-12 sm:py-16 space-y-16 bg-brand-warm-50/40 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Locations & Spaces</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950 font-bold">
          Birthday & Event Venues
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          Whether you prefer a scenic Margalla Hills terrace, a luxury indoor banquet hall, or an intimate setup in your own home, we handle full coordination across Islamabad & Rawalpindi.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {dbVenues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-brand-warm-200 p-8 space-y-3">
            <Building className="w-10 h-10 text-brand-warm-400 mx-auto" />
            <p className="text-sm font-semibold text-brand-navy-950">No venues published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dbVenues.map((v) => {
              const imageSrc = "/images/hero/hero_birthday_lawn.jpg";

              return (
                <div key={v.id} className="card-luxury flex flex-col justify-between group overflow-hidden">
                  <div>
                    <div className="relative h-64 w-full overflow-hidden bg-brand-warm-100">
                      <Image
                        src={imageSrc}
                        alt={v.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/85 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs">
                          {v.city}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold font-serif">{v.name}</h3>
                        <p className="text-xs text-brand-navy-200 flex items-center mt-1">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-brand-gold-400 shrink-0" />
                          <span>{v.address}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-xs font-semibold pb-3 border-b border-brand-warm-200 text-brand-navy-800">
                        <span className="flex items-center space-x-1.5">
                          <Building className="w-4 h-4 text-brand-gold-600" />
                          <span>{v.venueType}</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                          <Users className="w-4 h-4 text-brand-gold-600" />
                          <span>Up to {v.capacity} Guests</span>
                        </span>
                      </div>

                      <p className="text-xs text-brand-navy-700 leading-relaxed">
                        {v.description || "Turnkey decor setup and event management in Islamabad & Rawalpindi."}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-brand-warm-200/80 mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-brand-navy-500 font-medium block">Venue Reservation Fee</span>
                      <span className="text-base font-bold font-serif text-brand-navy-950">
                        {v.feeMinor > 0 ? formatPKR(v.feeMinor) : "Free / Home Setup"}
                      </span>
                    </div>

                    <Link
                      href={`/book?venue=${v.slug}`}
                      className="btn-gold py-2 px-4 text-xs font-semibold flex items-center space-x-1 shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Select Venue</span>
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
