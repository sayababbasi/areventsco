import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, Eye, Calendar } from "lucide-react";
import { formatPKR } from "@/lib/utils";

export const metadata = {
  title: "Birthday Decoration Themes & 3D Backdrops Islamabad & Rawalpindi | AR Events Co.",
  description: "Browse 8 authentic birthday decoration themes in Islamabad & Rawalpindi: Lavender Dream, Golden Sunflower, Dusty Rose Bunny, Vintage Racer, Jungle Safari, and Royal Prince.",
};

const allThemes = [
  {
    slug: "lavender-dream-princess",
    title: "Lavender Dream & Purple Princess",
    category: "Girls",
    startingPriceMinor: 4500000,
    ageSuitability: "1st to 10th Birthdays",
    description: "Circular lilac backdrop board with personalized 3D cursive lettering, organic lavender, deep violet & pearl white balloon garland, and fluted cake pedestals.",
    colorPalette: ["#9370DB", "#E6E6FA", "#4B0082", "#FFFFFF"],
    image: "/images/themes/theme_lavender_dream.jpg",
    highlights: ["8ft Round lilac backdrop", "14ft Organic balloon garland", "2 White fluted pedestals", "Floral floor runner"],
  },
  {
    slug: "sunflower-golden-sunshine",
    title: "Golden Sunflower Sunshine",
    category: "Floral",
    startingPriceMinor: 4800000,
    ageSuitability: "1st to 12th Birthdays",
    description: "Warm rustic-chic wooden panel backdrop with illuminated neon 'Happy Birthday' lighting, cascading sunny yellow balloon arch, and blooming fresh sunflowers.",
    colorPalette: ["#FFD700", "#FFF8DC", "#8B4513", "#228B22"],
    image: "/images/themes/theme_sunflower_sunshine.jpg",
    highlights: ["Natural wooden slat backdrop", "Neon 'Happy Birthday' sign", "Giant 3D wooden ONE letters", "Rustic crates & sunflower pots"],
  },
  {
    slug: "enchanted-dusty-rose-bunny",
    title: "Enchanted Dusty Rose Bunny",
    category: "First Birthday",
    startingPriceMinor: 5500000,
    ageSuitability: "1st to 3rd Birthdays",
    description: "Botanical garden meadow setup with arched dusty rose velvet backdrop, fresh pastel floral garden bed, and a storybook illustrated Peter Rabbit cutout.",
    colorPalette: ["#C08081", "#FFE4E1", "#DDA0DD", "#FFFFFF"],
    image: "/images/themes/theme_dusty_rose_bunny.jpg",
    highlights: ["Dusty rose velvet arch panel", "Fresh rose & hydrangea meadow bed", "Peter Rabbit cutout", "Pastel entryway balloon arch"],
  },
  {
    slug: "vintage-little-racer",
    title: "Vintage Little Racer (Beep Beep)",
    category: "Boys",
    startingPriceMinor: 5000000,
    ageSuitability: "1st & 2nd Birthdays",
    description: "Retro roadster theme with 'Beep Beep! I'm ONE!' backdrop, bold balloon clusters in cherry red, olive, and mustard, black & white checkered runner, and 3D ONE car block letters.",
    colorPalette: ["#DC2626", "#4B5320", "#EAB308", "#38BDF8"],
    image: "/images/themes/theme_vintage_racer.jpg",
    highlights: ["Beep Beep custom backdrop", "Multicolor balloon cluster garland", "Checkered tabletop runner", "3D ONE car block letters"],
  },
  {
    slug: "jungle-safari-kingdom",
    title: "Jungle Safari Kingdom",
    category: "Kids",
    startingPriceMinor: 5200000,
    ageSuitability: "1st to 7th Birthdays",
    description: "Grand circular balloon hoop of forest sage green, metallic gold, and tan balloons, lush tropical monstera foliage, 3 white plinths, and plush lifelike safari animals.",
    colorPalette: ["#2D5A27", "#D4AF37", "#D2B48C", "#0F172A"],
    image: "/images/themes/theme_jungle_safari.jpg",
    highlights: ["8ft Circular balloon hoop", "Tropical palm & monstera foliage", "Set of 3 white cylinder plinths", "Plush safari animals (Lion, Giraffe, Monkey)"],
  },
  {
    slug: "pastel-butterfly-wonderland",
    title: "Pastel Butterfly Wonderland",
    category: "Girls",
    startingPriceMinor: 4800000,
    ageSuitability: "1st to 8th Birthdays",
    description: "Dreamy arched lavender backdrop with fluttering 3D glitter butterflies, soft pink & lilac balloon cascade, fluted metallic pedestal, and fresh garden flower baskets.",
    colorPalette: ["#D8B4E2", "#FCE7F3", "#B89037", "#FFFFFF"],
    image: "/images/themes/theme_butterfly_wonderland.jpg",
    highlights: ["Arched lilac backdrop board", "3D Flutter butterflies cascade", "Fluted metallic cake plinth", "Illuminated marquee LED number '1'"],
  },
  {
    slug: "speed-champion-racing-two",
    title: "Speed Champion (Racing to Two)",
    category: "Boys",
    startingPriceMinor: 5200000,
    ageSuitability: "2nd to 8th Birthdays",
    description: "High-octane Formula 1 setup with racing red and black balloon arches, checkered foil balloons, race track backdrop, F1 tire stacks, trophy display, and giant illuminated number 2.",
    colorPalette: ["#EF4444", "#000000", "#FFFFFF", "#F59E0B"],
    image: "/images/themes/theme_speed_champion.jpg",
    highlights: ["Racetrack graphic backdrop", "Red & black checkered balloon arch", "Illuminated marquee number '2'", "Checkered trophy pedestal"],
  },
  {
    slug: "royal-midnight-prince",
    title: "Royal Midnight Prince & Gold",
    category: "Luxury",
    startingPriceMinor: 6500000,
    ageSuitability: "1st Birthdays & Milestone Adult Celebrations",
    description: "Regal midnight navy and mirror gold setup with gold illuminated royal crown backdrop, massive chrome balloon installation, 3 gold mirror plinths, and royal floor decal.",
    colorPalette: ["#0A192F", "#D4AF37", "#1E3A8A", "#FFFFFF"],
    image: "/images/themes/theme_royal_midnight_prince.jpg",
    highlights: ["Navy royal crest backdrop", "Illuminated neon crown motif", "Midnight navy & chrome gold balloon arch", "3 Gold mirror cylindrical plinths"],
  },
];

export default function ThemesPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* 1. PAGE HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-gold-50 border border-brand-gold-300 text-brand-gold-800 text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold-600" />
          <span>Bespoke Event Styling Catalog</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950 font-bold">
          Birthday Decoration Themes
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Browse our original birthday themes designed and styled for private residences, farmhouses, garden lawns, and banquets across Islamabad & Rawalpindi.
        </p>
      </section>

      {/* 2. THEMES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allThemes.map((theme) => (
            <div key={theme.slug} className="card-luxury flex flex-col justify-between group overflow-hidden">
              <div>
                {/* Theme Image with Category Badge */}
                <div className="relative h-64 w-full overflow-hidden bg-brand-warm-100">
                  <Image
                    src={theme.image}
                    alt={`${theme.title} birthday decoration in Islamabad`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-3.5 left-3.5 flex space-x-2">
                    <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs font-semibold shadow-sm">
                      {theme.category}
                    </span>
                    <span className="bg-white/95 text-brand-navy-900 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                      {theme.ageSuitability}
                    </span>
                  </div>

                  {/* Color Palette Indicators in bottom right */}
                  <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                    {theme.colorPalette.map((c, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-white/60 inline-block"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-brand-navy-950 group-hover:text-brand-gold-700 transition-colors">
                      {theme.title}
                    </h3>
                    <p className="text-xs text-brand-navy-600 line-clamp-2 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  {/* Setup Highlights */}
                  <div className="space-y-1.5 pt-2 border-t border-brand-warm-100">
                    {theme.highlights.slice(0, 3).map((hl, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-brand-navy-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold-600 shrink-0" />
                        <span className="truncate">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer with Pricing & Dual CTAs */}
              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-baseline justify-between pt-3 border-t border-brand-warm-200">
                  <span className="text-xs text-brand-navy-500 font-medium">Starting from</span>
                  <span className="text-lg font-bold font-serif text-brand-navy-950">
                    {formatPKR(theme.startingPriceMinor)}
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

      {/* 3. CUSTOM THEME INQUIRY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-brand-navy-950 text-white relative overflow-hidden border border-brand-gold-300/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold-400">
                Have a Specific Theme or Character in Mind?
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Bespoke Theme Customization for Your Event
              </h2>
              <p className="text-sm text-brand-navy-200 max-w-2xl leading-relaxed">
                If you have a customized concept, specific cartoon characters, unique color palettes, or Pinterest inspiration, our design studio crafts custom acrylic backdrops and balloon sculptures for your celebration.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link href="/book" className="btn-gold py-3.5 text-center text-sm font-semibold">
                Request Custom Design
              </Link>
              <Link href="/contact" className="py-3 px-4 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 text-center transition-colors">
                Talk to Decor Lead
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
