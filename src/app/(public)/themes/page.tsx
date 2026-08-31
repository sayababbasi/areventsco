import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, Eye, Calendar } from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { getSafeThemes } from "@/lib/data-fallback";

export const revalidate = 60; // 60s ISR Cache for maximum speed

export const metadata = {
  title: "Birthday Decoration Themes & 3D Backdrops Islamabad & Rawalpindi | AR Events Co.",
  description: "Browse authentic birthday decoration themes in Islamabad & Rawalpindi: Lavender Dream, Golden Sunflower, Dusty Rose Bunny, Vintage Racer, Jungle Safari, and Royal Prince.",
};

export default async function ThemesPage() {
  const dbThemes = await getSafeThemes();

  const themes = dbThemes.map((t: any) => {
    let colors: string[] = [];
    try {
      colors = JSON.parse(t.colorPalette || "[]");
    } catch {
      colors = ["#9333EA", "#EC4899", "#F3E8FF", "#FCD34D"];
    }

    let inclusions: string[] = [];
    try {
      inclusions = JSON.parse(t.includedDecor || "[]");
    } catch {
      inclusions = ["Custom Arch Backdrop", "Organic Balloon Garland", "Cake Pedestals", "Thematic Props"];
    }

    return {
      id: t.id,
      slug: t.slug,
      title: t.title,
      category: t.category,
      description: t.description,
      image: t.heroImage || "/images/themes/theme_lavender_dream.jpg",
      colorPalette: colors,
      highlights: inclusions,
      startingPriceMinor: 4500000,
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
            <span>Twin Cities Authentic Decor Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Curated Birthday Decoration Themes
          </h1>
          <p className="text-brand-warm-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Every theme is designed and executed by our dedicated in-house styling team. Pick your preferred setup below to inspect the full inclusions, photography, and book online.
          </p>
        </div>
      </section>

      {/* 2. THEMES GRID */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          {themes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-brand-warm-200 p-8 space-y-3">
              <p className="text-base font-serif font-bold text-brand-navy-950">No themes have been published yet.</p>
              <p className="text-xs text-brand-navy-600">Please check back shortly or create one in the Admin Operations Center.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className="bg-white rounded-3xl overflow-hidden border border-brand-warm-200/80 shadow-md hover:shadow-2xl hover:border-brand-gold-400/80 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Showcase */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-warm-100">
                      <Image
                        src={theme.image}
                        alt={theme.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-navy-950/85 text-brand-gold-300 backdrop-blur-md border border-brand-gold-400/30">
                          {theme.category}
                        </span>
                      </div>

                      {/* Bottom Image Overlay Title */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h2 className="text-lg font-serif font-bold drop-shadow-md leading-tight">
                          {theme.title}
                        </h2>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs sm:text-sm text-brand-navy-700 leading-relaxed line-clamp-3">
                        {theme.description}
                      </p>

                      {/* Color Palette Chips */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-brand-navy-500 font-bold">
                          Color Palette:
                        </span>
                        <div className="flex items-center space-x-1.5">
                          {theme.colorPalette.map((hex, i) => (
                            <span
                              key={i}
                              className="w-4 h-4 rounded-full border border-brand-warm-300 shadow-inner"
                              style={{ backgroundColor: hex }}
                              title={hex}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Highlights Checklist */}
                      <div className="space-y-2 pt-2 border-t border-brand-warm-100">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-brand-navy-500 font-bold">
                          Setup Highlights:
                        </span>
                        <ul className="space-y-1 text-xs text-brand-navy-800">
                          {theme.highlights.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold-600 flex-shrink-0" />
                              <span className="truncate">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Dual CTA Footer */}
                  <div className="p-5 border-t border-brand-warm-100 bg-brand-warm-50/50 flex items-center justify-between gap-3">
                    <Link
                      href={`/themes/${theme.slug}`}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-brand-navy-900/20 text-brand-navy-950 hover:bg-brand-navy-950 hover:text-white font-semibold text-xs transition-all text-center flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Setup</span>
                    </Link>

                    <Link
                      href={`/book?theme=${theme.slug}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-950 font-bold text-xs shadow-sm hover:shadow-md transition-all text-center flex items-center justify-center space-x-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Theme</span>
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
