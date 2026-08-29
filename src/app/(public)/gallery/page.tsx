import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Calendar, MapPin } from "lucide-react";

export const metadata = {
  title: "Real Birthday Decoration Gallery Islamabad & Rawalpindi | AR Events Co.",
  description: "Browse authentic birthday celebration setups, 3D backdrops, marquee numbers, and balloon installations delivered across Islamabad and Rawalpindi.",
};

const galleryItems = [
  {
    title: "Ayra's 1st Birthday Garden Setup",
    category: "First Birthday",
    location: "Private Lawn, Sector F-7 Islamabad",
    image: "/images/hero/hero_birthday_lawn.jpg",
    details: "3D ONE marquee letters, lavender balloon arch, fluted pedestals with Margalla hills backdrop.",
  },
  {
    title: "Lavender Dream & Purple Princess",
    category: "Girls",
    location: "Terrace Garden, Sector E-7 Islamabad",
    image: "/images/themes/theme_lavender_dream.jpg",
    details: "Circular lilac backdrop with 3D cursive script, organic balloon garland, and fluted pedestals.",
  },
  {
    title: "Golden Sunflower Sunshine 1st Birthday",
    category: "Floral",
    location: "Chak Shahzad Farmhouse, Islamabad",
    image: "/images/themes/theme_sunflower_sunshine.jpg",
    details: "Slatted natural wood panels with neon 'Happy Birthday' lighting, sunny balloon arch & sunflowers.",
  },
  {
    title: "Enchanted Dusty Rose Bunny Meadow",
    category: "First Birthday",
    location: "Private Garden, Bani Gala Islamabad",
    image: "/images/themes/theme_dusty_rose_bunny.jpg",
    details: "Dusty rose velvet arch panel, fresh floral meadow bed, and storybook illustrated Peter Rabbit cutout.",
  },
  {
    title: "Vintage Little Racer 'Beep Beep! I'm ONE!'",
    category: "Boys",
    location: "Gazebo Lawn, Bahria Town Phase 7 Rawalpindi",
    image: "/images/themes/theme_vintage_racer.jpg",
    details: "Vintage roadster backdrop, colorful balloon cluster, checkered tabletop runner & 3D car blocks.",
  },
  {
    title: "Jungle Safari Kingdom Expedition",
    category: "Kids",
    location: "Rooftop Terrace, Sector F-8 Islamabad",
    image: "/images/themes/theme_jungle_safari.jpg",
    details: "Grand circular balloon hoop, monstera palm foliage, white cake plinths & plush safari animals.",
  },
  {
    title: "Pastel Butterfly Wonderland",
    category: "Girls",
    location: "Courtyard Lawn, DHA Phase 2 Islamabad",
    image: "/images/themes/theme_butterfly_wonderland.jpg",
    details: "Arched lilac panel with 3D flutter butterflies, soft pink balloon cascade & fluted metallic plinth.",
  },
  {
    title: "Speed Champion 'Racing to Two'",
    category: "Boys",
    location: "Private Lawn, Sector G-10 Islamabad",
    image: "/images/themes/theme_speed_champion.jpg",
    details: "Formula 1 racing backdrop, red & black balloon arches, F1 tire stacks & marquee number 2.",
  },
  {
    title: "Royal Midnight Prince & Gold Milestone",
    category: "Luxury",
    location: "Islamabad Club Banquet Suites, F-6 Islamabad",
    image: "/images/themes/theme_royal_midnight_prince.jpg",
    details: "Navy royal crest backdrop with illuminated crown, chrome gold balloon arch & 3 gold mirror plinths.",
  },
];

export default function GalleryPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="card-luxury group overflow-hidden flex flex-col justify-between">
              <div className="relative h-80 w-full overflow-hidden bg-brand-warm-100">
                <Image
                  src={item.image}
                  alt={`${item.title} real event in Islamabad`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/85 via-brand-navy-950/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

                <div className="absolute top-4 left-4">
                  <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs font-semibold shadow-sm">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-[11px] text-brand-gold-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <h3 className="text-lg font-bold font-serif leading-snug">{item.title}</h3>
                  <p className="text-xs text-brand-navy-200 line-clamp-2">{item.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 p-10 bg-brand-warm-50 rounded-3xl border border-brand-warm-200 space-y-4">
          <span className="text-xs font-semibold uppercase text-brand-gold-700 tracking-wider">
            Ready to Celebrate?
          </span>
          <h3 className="text-3xl font-serif text-brand-navy-950 font-bold">
            Want a Setup Like This for Your Birthday?
          </h3>
          <p className="text-sm text-brand-navy-700 max-w-xl mx-auto leading-relaxed">
            Choose your favorite theme or request a bespoke custom setup. Our team arrives 3 hours early to assemble everything seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link href="/themes" className="btn-gold px-8 py-3.5 text-sm font-semibold inline-flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Browse Themes</span>
            </Link>
            <Link href="/book" className="btn-outline-navy px-8 py-3.5 text-sm font-semibold inline-flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Book Online</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
