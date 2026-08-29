import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Birthday Themes & 3D Backdrops Islamabad & Rawalpindi | AR Events Co.",
  description: "Explore curated birthday themes in Islamabad and Rawalpindi: Royal Navy & Gold, Princess Castle, Wild Safari, Galaxy Space, and Boho Pampas.",
};

const allThemes = [
  {
    slug: "royal-navy-gold",
    title: "Royal Navy & Metallic Gold",
    category: "Adult Luxury & Milestones",
    description: "Our signature luxury theme featuring deep midnight blues, metallic chrome gold balloons, bespoke illuminated acrylic typography, and giant marquee numbers.",
    colorPalette: ["#0A192F", "#D4AF37", "#1B365D", "#F4F4F0"],
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    highlights: ["Chrome gold & navy organic balloon arch", "3D Acrylic monogram", "Vintage marquee numbers", "Warm evening uplighting"],
  },
  {
    slug: "enchanted-princess-castle",
    title: "Enchanted Princess Castle",
    category: "Kids Fairytale",
    description: "A fairytale wonderland with soft pastel pinks, gold turrets, royal crown pedestals, and whimsical floral balloon clouds crafted for little princesses.",
    colorPalette: ["#FCE7F3", "#D4AF37", "#F472B6", "#FFFFFF"],
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    highlights: ["Castle facade backdrop", "Pastel balloon cloud arches", "Royal carriage cutout", "Crown pedestal table"],
  },
  {
    slug: "wild-safari-adventure",
    title: "Wild One Safari Adventure",
    category: "Kids Jungle Theme",
    description: "Lush tropical palm greenery, animal prints, wooden rustic crates, and life-size giraffe/lion cutouts perfect for 1st to 5th birthdays.",
    colorPalette: ["#064E3B", "#D97706", "#78350F", "#ECFDF5"],
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80",
    highlights: ["Life-sized safari animal cutouts", "Tropical balloon installation", "Wooden barrel plinths", "Safari Jeep photo booth"],
  },
  {
    slug: "astronaut-galaxy-odyssey",
    title: "Astronaut Galaxy Odyssey",
    category: "Kids Space Quest",
    description: "Cosmic space journey featuring deep celestial backdrops, glowing planet balloons, spaceship cutouts, and LED starfield ambient projections.",
    colorPalette: ["#0F172A", "#38BDF8", "#818CF8", "#F1F5F9"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    highlights: ["Rocket ship 3D cutout", "Floating planet balloons", "Star projector lighting", "Astronaut helmet photobooth"],
  },
  {
    slug: "boho-pampas-rose-gold",
    title: "Boho Pampas & Rose Gold",
    category: "Milestone & Chic",
    description: "Earthy neutrals, natural dried pampas grass, macrame details, and warm rose gold accents for trendy young adult celebrations.",
    colorPalette: ["#FDE047", "#FBCFE8", "#D97706", "#FEF3C7"],
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
    highlights: ["Hexagonal wooden arch", "Natural pampas grass florals", "Double-stuffed matte balloons", "Custom calligraphy sign"],
  },
  {
    slug: "dinosaur-jurassic-discovery",
    title: "Jurassic Dinosaur Discovery",
    category: "Kids Adventure",
    description: "Prehistoric adventure featuring towering T-Rex cutouts, tropical volcano backdrops, earth-tone balloon trees, and dinosaur footprint trail decor.",
    colorPalette: ["#14532D", "#854D0E", "#A16207", "#FEF08A"],
    image: "https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?auto=format&fit=crop&w=800&q=80",
    highlights: ["Giant dinosaur cutouts", "Volcano backdrop setup", "Fossil excavation favor table", "Jungle vine balloon garlands"],
  },
];

export default function ThemesPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="badge-gold uppercase tracking-wider text-xs">Visual Concepts</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-navy-950">
          Birthday Themes & Backdrops
        </h1>
        <div className="gold-divider mx-auto" />
        <p className="text-brand-navy-700 max-w-2xl mx-auto text-base sm:text-lg">
          Each theme is bespoke, featuring custom color-matched balloon architecture, illuminated 3D backdrops, and photo-ready cake tables across Islamabad & Rawalpindi.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allThemes.map((theme) => (
            <div key={theme.slug} className="card-luxury flex flex-col justify-between group">
              <div>
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={theme.image}
                    alt={theme.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs">
                      {theme.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex space-x-1.5 bg-brand-navy-950/80 p-1.5 rounded-lg border border-white/20">
                      {theme.colorPalette.map((color, cIdx) => (
                        <span
                          key={cIdx}
                          className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold font-serif text-brand-navy-950">
                    {theme.title}
                  </h3>
                  <p className="text-xs text-brand-navy-700 leading-relaxed">
                    {theme.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-brand-warm-200">
                    <p className="text-[11px] font-bold text-brand-navy-900 uppercase tracking-wider flex items-center">
                      <Sparkles className="w-3 h-3 text-brand-gold-500 mr-1" />
                      Key Features:
                    </p>
                    <ul className="space-y-1 text-xs text-brand-navy-600">
                      {theme.highlights.map((h, i) => (
                        <li key={i}>• {h}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-brand-warm-100">
                <Link
                  href={`/book?theme=${encodeURIComponent(theme.title)}`}
                  className="btn-gold w-full py-2.5 text-xs flex items-center justify-center space-x-1.5"
                >
                  <span>Select & Book This Theme</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
