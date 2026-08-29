import { prisma } from "@/lib/db";
import { formatPKR } from "@/lib/utils";
import { Sparkles, Layers, MapPin, Plus } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Catalog Management | AR Events Co.",
};

export default async function AdminCatalogPage() {
  const packages = await prisma.package.findMany({ orderBy: { sortOrder: "asc" } });
  const themes = await prisma.theme.findMany({ orderBy: { sortOrder: "asc" } });
  const addons = await prisma.addon.findMany({ orderBy: { sortOrder: "asc" } });
  const venues = await prisma.venue.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold font-serif text-brand-navy-950">
          Catalog & Inventory Management
        </h1>
        <p className="text-xs text-brand-navy-600">
          Live inventory of Packages, Themes, Add-ons, and Partner Venues
        </p>
      </div>

      {/* Packages Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-brand-navy-950 flex items-center">
            <Layers className="w-4 h-4 text-brand-gold-600 mr-2" />
            Active Birthday Packages ({packages.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((p) => (
            <div key={p.id} className="card-luxury p-5 flex items-start space-x-4">
              {p.featuredImage && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={p.featuredImage} alt={p.title} fill className="object-cover" />
                </div>
              )}
              <div className="space-y-1 flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-brand-navy-950 font-serif">{p.title}</h3>
                  <span className="text-xs font-bold text-brand-gold-700">
                    {formatPKR(p.basePriceMinor)}
                  </span>
                </div>
                <p className="text-[11px] text-brand-navy-600 line-clamp-2">{p.subtitle}</p>
                <p className="text-[10px] text-brand-navy-500">
                  Capacity: {p.guestCapacityMin} - {p.guestCapacityMax} Guests • {p.estimatedDurationHours} Hours
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Themes Section */}
      <div className="space-y-4 pt-4 border-t border-brand-warm-200">
        <h2 className="text-lg font-bold font-serif text-brand-navy-950 flex items-center">
          <Sparkles className="w-4 h-4 text-brand-gold-600 mr-2" />
          Active Thematic Backdrops ({themes.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((t) => (
            <div key={t.id} className="card-luxury p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-brand-navy-950">{t.title}</h3>
                <span className="badge-gold text-[10px]">{t.category}</span>
              </div>
              <p className="text-[11px] text-brand-navy-600 line-clamp-2">{t.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons & Venues Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-brand-warm-200">
        {/* Addons */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-serif text-brand-navy-950">Add-ons & Entertainment</h2>
          <div className="space-y-2">
            {addons.map((a) => (
              <div key={a.id} className="card-luxury p-3.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-brand-navy-950">{a.title}</p>
                  <p className="text-[11px] text-brand-navy-500">{a.category}</p>
                </div>
                <span className="font-bold text-brand-gold-700">{formatPKR(a.priceMinor)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Venues */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-serif text-brand-navy-950">Twin Cities Partner Venues</h2>
          <div className="space-y-2">
            {venues.map((v) => (
              <div key={v.id} className="card-luxury p-3.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-brand-navy-950">{v.name}</p>
                  <p className="text-[11px] text-brand-navy-500">{v.city} • {v.venueType}</p>
                </div>
                <span className="font-bold text-brand-navy-900">
                  {v.feeMinor === 0 ? "Zero Fee" : formatPKR(v.feeMinor)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
