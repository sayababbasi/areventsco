import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Palette,
  Layers,
  ChevronRight,
  MessageCircle,
  Camera,
  Lightbulb,
  Video,
  Cake,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPKR } from "@/lib/utils";

export const revalidate = 60; // 60s ISR caching for high-speed page loads

// Comprehensive fallback data for twin-cities decoration themes
const STATIC_THEMES: Record<
  string,
  {
    slug: string;
    title: string;
    category: string;
    startingPriceMinor: number;
    description: string;
    ageSuitability: string;
    heroImage: string;
    gallery: string[];
    colorPalette: string[];
    colorNames: string[];
    includedDecor: string[];
    specifications: { label: string; value: string }[];
    idealFor: string[];
  }
> = {
  "lavender-dream-princess": {
    slug: "lavender-dream-princess",
    title: "Lavender Dream & Purple Princess",
    category: "Girls",
    startingPriceMinor: 4500000,
    ageSuitability: "1st to 10th Birthdays",
    description:
      "A breathtaking lilac and lavender floral fantasy featuring a circular custom backdrop board with elegant 3D white cursive script, voluminous organic balloon garlands in lilac, deep violet, and pearl white, fluted cake pedestals, and fresh floral floor runners.",
    heroImage: "/images/themes/theme_lavender_dream.jpg",
    gallery: [
      "/images/themes/theme_lavender_dream.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
      "/images/themes/theme_butterfly_wonderland.jpg",
    ],
    colorPalette: ["#9370DB", "#E6E6FA", "#4B0082", "#FFFFFF"],
    colorNames: ["Lavender Lilac", "Soft Cream", "Deep Violet", "Pearl White"],
    includedDecor: [
      "8ft x 8ft round lilac backdrop with personalized 3D name & age lettering",
      "14ft organic double-stuffed balloon garland in lilac, white & violet",
      "Set of 2 white fluted cylindrical cake pedestals with gold floral accents",
      "Fresh floral floor runner with baby's breath and seasonal blooms",
      "Woven natural fiber carpet runner for the stage area",
      "Warm ambient uplighting spotlight for evening cake cutting",
    ],
    specifications: [
      { label: "Backdrop Dimensions", value: "8ft Diameter Circular Board" },
      { label: "Setup Space Required", value: "10ft Width x 8ft Depth minimum" },
      { label: "Setup Time", value: "2.5 to 3 Hours on-site" },
      { label: "Recommended Setting", value: "Outdoor Lawn, Terrace, or Home Lounge" },
      { label: "Service Area", value: "All Islamabad Sectors & Rawalpindi Zones" },
    ],
    idealFor: ["1st Birthday 'Ayat turns ONE'", "Princess Themed Parties", "Garden Celebrations", "Tea Parties"],
  },
  "sunflower-golden-sunshine": {
    slug: "sunflower-golden-sunshine",
    title: "Golden Sunflower Sunshine",
    category: "Floral",
    startingPriceMinor: 4800000,
    ageSuitability: "1st to 12th Birthdays & Milestones",
    description:
      "Radiant rustic-chic celebration theme combining natural slatted wooden panels with glowing neon 'Happy Birthday' lighting, cascading sunny yellow and cream balloon arches, natural sunflowers, rustic wooden crates, and iconic 3D wooden 'ONE' marquee letters.",
    heroImage: "/images/themes/theme_sunflower_sunshine.jpg",
    gallery: [
      "/images/themes/theme_sunflower_sunshine.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
      "/images/themes/theme_dusty_rose_bunny.jpg",
    ],
    colorPalette: ["#FFD700", "#FFF8DC", "#8B4513", "#228B22"],
    colorNames: ["Golden Sunflower", "Pastel Cream", "Rustic Wood", "Botanical Green"],
    includedDecor: [
      "Natural slatted wooden tri-fold backdrop screen",
      "Warm white neon LED 'Happy Birthday' illumination sign",
      "15ft organic balloon arch with fresh blooming sunflowers",
      "Giant 3D wooden 'ONE' block letters with floral accents",
      "Rustic wooden dessert table with cake stand and potted sunflowers",
      "Jute circular floor rug & mini decorative farm crates",
    ],
    specifications: [
      { label: "Backdrop Dimensions", value: "8ft Width x 7.5ft Height" },
      { label: "Setup Space Required", value: "12ft Width x 8ft Depth" },
      { label: "Setup Time", value: "3 Hours on-site" },
      { label: "Recommended Setting", value: "Garden Lawn, Farmhouse, Patio, or Indoor Hall" },
      { label: "Service Area", value: "Islamabad (F, G, E, H, Bani Gala) & Rawalpindi (Bahria, DHA, Cantt)" },
    ],
    idealFor: ["First Birthday 'You are My Sunshine'", "Rustic Spring & Summer Parties", "Lawn Birthday Picnics"],
  },
  "enchanted-dusty-rose-bunny": {
    slug: "enchanted-dusty-rose-bunny",
    title: "Enchanted Dusty Rose Bunny",
    category: "First Birthday",
    startingPriceMinor: 5500000,
    ageSuitability: "1st to 3rd Birthdays",
    description:
      "An ethereal botanical garden meadow setup featuring a grand arched dusty rose velvet backdrop board, delicate meadow floral gardens overflowing with pastel roses and larkspur, a whimsical storybook bunny cutout, and an inviting pastel entryway balloon arch.",
    heroImage: "/images/themes/theme_dusty_rose_bunny.jpg",
    gallery: [
      "/images/themes/theme_dusty_rose_bunny.jpg",
      "/images/themes/theme_lavender_dream.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
    ],
    colorPalette: ["#C08081", "#FFE4E1", "#DDA0DD", "#FFFFFF"],
    colorNames: ["Dusty Rose Velvet", "Misty Rose", "Soft Peach", "Lustre Pearl"],
    includedDecor: [
      "Semicircular arched dusty rose velvet panel with custom cursive 3D lettering",
      "Lush organic floral meadow bed with real fresh roses, baby's breath & hydrangeas",
      "Storybook illustrated Peter Rabbit standing cutout prop",
      "Natural wicker high chair styling with embroidered keepsake pillow",
      "Cascading peach, blush pink, and cream organic balloon installation",
      "Natural wooden tree trunk cake and dessert pedestals",
    ],
    specifications: [
      { label: "Backdrop Dimensions", value: "9ft Width x 8ft Height Semicircle" },
      { label: "Setup Space Required", value: "12ft Width x 10ft Depth" },
      { label: "Setup Time", value: "3.5 Hours on-site" },
      { label: "Recommended Setting", value: "Manicured Private Lawn, Farmhouse, or Luxury Ballroom" },
      { label: "Service Area", value: "Islamabad & Rawalpindi Twin Cities" },
    ],
    idealFor: ["'Our Little Hanna Turns ONE'", "Storybook Peter Rabbit Theme", "Botanical Meadow First Birthdays"],
  },
  "vintage-little-racer": {
    slug: "vintage-little-racer",
    title: "Vintage Little Racer (Beep Beep)",
    category: "Boys",
    startingPriceMinor: 5000000,
    ageSuitability: "1st & 2nd Birthdays",
    description:
      "A classic boys retro roadster theme with a crisp custom 'Beep Beep! I'm ONE!' backdrop board, traffic stop signs, vintage toy car cutouts, bold balloon clusters in cherry red, sage, mustard, and baby blue, plus a black & white checkered tabletop runner and 3D 'ONE' car letters.",
    heroImage: "/images/themes/theme_vintage_racer.jpg",
    gallery: [
      "/images/themes/theme_vintage_racer.jpg",
      "/images/themes/theme_speed_champion.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
    ],
    colorPalette: ["#DC2626", "#4B5320", "#EAB308", "#38BDF8"],
    colorNames: ["Vintage Racing Red", "Olive Sage", "Mustard Yellow", "Sky Blue"],
    includedDecor: [
      "Square custom backdrop with 'Beep Beep! I'm ONE!' & vintage car graphics",
      "Full balloon cluster garland in primary & matte olive tones",
      "Large 3D 'ONE' block letters with cute wheel bases",
      "Black & white checkered racing flag table runner with toy vintage speedsters",
      "Mini traffic cones, stop signs, and race marshal helmet props",
      "Clear acrylic cake risers with colorful balloon stuffing",
    ],
    specifications: [
      { label: "Backdrop Dimensions", value: "8ft Width x 8ft Height" },
      { label: "Setup Space Required", value: "10ft Width x 8ft Depth" },
      { label: "Setup Time", value: "2.5 Hours on-site" },
      { label: "Recommended Setting", value: "Garden Gazebo, Clubhouse, or Living Room" },
      { label: "Service Area", value: "Islamabad & Rawalpindi" },
    ],
    idealFor: ["'Beep Beep! I'm ONE!'", "Vintage Car Enthusiasts", "Playful Toddler Celebrations"],
  },
  "jungle-safari-kingdom": {
    slug: "jungle-safari-kingdom",
    title: "Jungle Safari Kingdom",
    category: "Kids",
    startingPriceMinor: 5200000,
    ageSuitability: "1st to 7th Birthdays",
    description:
      "An exotic safari expedition designed with a grand circular hoop balloon arch in forest sage green, metallic gold, and tan balloons, tropical monstera leaves, three glossy white cake plinths, and lifelike plush safari animals (lion, giraffe, monkey) overlooking scenic Margalla views.",
    heroImage: "/images/themes/theme_jungle_safari.jpg",
    gallery: [
      "/images/themes/theme_jungle_safari.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
      "/images/themes/theme_sunflower_sunshine.jpg",
    ],
    colorPalette: ["#2D5A27", "#D4AF37", "#D2B48C", "#0F172A"],
    colorNames: ["Forest Sage", "Metallic Gold", "Safari Khaki", "Midnight Slate"],
    includedDecor: [
      "Full 8ft freestanding circular balloon hoop with tropical palm foliage",
      "Set of 3 glossy white cylinder cake plinths with personalized decals",
      "Life-sized plush safari props (standing giraffe, plush lion, playful monkey)",
      "Acrylic clear 'Welcome to Safari' easel sign with palm leaf accents",
      "Gold geometric 'WILD ONE' sign on metallic stand",
      "Wooden log stumps and decorative woven floor runner",
    ],
    specifications: [
      { label: "Backdrop Dimensions", value: "8ft Diameter Freestanding Circle Hoop" },
      { label: "Setup Space Required", value: "11ft Width x 8ft Depth" },
      { label: "Setup Time", value: "3 Hours on-site" },
      { label: "Recommended Setting", value: "Rooftop Terrace, Garden Lawn, or Indoor Marquee" },
      { label: "Service Area", value: "Islamabad & Rawalpindi" },
    ],
    idealFor: ["'Wild ONE' 1st Birthday", "Jungle Explorer Parties", "Twin-Cities Terrace Setups"],
  },
  "pastel-butterfly-wonderland": {
    slug: "pastel-butterfly-wonderland",
    title: "Pastel Butterfly Wonderland",
    category: "Girls",
    startingPriceMinor: 4800000,
    ageSuitability: "1st to 8th Birthdays",
    description:
      "A dreamy fairy-tale setup with an arched lilac backdrop board inscribed with 'Haniya turns ONE', fluttering 3D glitter butterflies, soft pink & lilac balloon cascade, fluted metallic pedestal, and garden flower baskets overflowing with blooms.",
    heroImage: "/images/themes/theme_butterfly_wonderland.jpg",
    gallery: [
      "/images/themes/theme_butterfly_wonderland.jpg",
      "/images/themes/theme_lavender_dream.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
    ],
    colorPalette: ["#D8B4E2", "#FCE7F3", "#B89037", "#FFFFFF"],
    colorNames: ["Pastel Lilac", "Blush Pink", "Champagne Gold", "Pure White"],
    includedDecor: [
      "Tall arched lilac wooden panel with white dimensional lettering",
      "12ft cascading organic balloon garland with 3D paper and glitter butterflies",
      "Fluted metallic lilac and gold cake pedestal with mirror top",
      "Illuminated marquee LED number '1' with warm white glow",
      "Woven floor baskets with fresh blooming garden flowers",
      "Welcome to Butterfly Garden easel board with floral garland",
    ],
    specifications: [
      { label: "Backdrop Dimensions", value: "7.5ft Height x 6ft Width Arch" },
      { label: "Setup Space Required", value: "10ft Width x 8ft Depth" },
      { label: "Setup Time", value: "2.5 Hours on-site" },
      { label: "Recommended Setting", value: "Garden Lawn, Courtyard, or Private Drawing Room" },
      { label: "Service Area", value: "Islamabad & Rawalpindi" },
    ],
    idealFor: ["Butterfly Themed 1st Birthdays", "Fairy Garden Parties", "Sweet Celebrations"],
  },
  "speed-champion-racing-two": {
    slug: "speed-champion-racing-two",
    title: "Speed Champion (Racing to Two)",
    category: "Boys",
    startingPriceMinor: 5200000,
    ageSuitability: "2nd to 8th Birthdays",
    description:
      "A high-octane Formula 1 and supercar party setup with racing red and black balloon arches, checkered foil balloons, race track graphic backdrop, F1 tire stacks, custom trophy pedestal, and a giant illuminated marquee number 2.",
    heroImage: "/images/themes/theme_speed_champion.jpg",
    gallery: [
      "/images/themes/theme_speed_champion.jpg",
      "/images/themes/theme_vintage_racer.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
    ],
    colorPalette: ["#EF4444", "#000000", "#FFFFFF", "#F59E0B"],
    colorNames: ["Racing Red", "Pitstop Black", "Checkered White", "Trophy Gold"],
    includedDecor: [
      "Custom racetrack backdrop with 'Racing to TWO' personalization",
      "Massive racing red & black balloon arch with checkered balloon spheres",
      "Giant 4-foot illuminated light-up marquee number '2'",
      "Checkered trophy cake pedestal with custom birthday champion cup",
      "Realistic Formula 1 race tire props & pitstop signage",
      "Printed asphalt racetrack floor runner",
    ],
    specifications: [
      { label: "Backdrop Dimensions", value: "9ft Width x 8ft Height" },
      { label: "Setup Space Required", value: "12ft Width x 9ft Depth" },
      { label: "Setup Time", value: "3 Hours on-site" },
      { label: "Recommended Setting", value: "Outdoor Lawn, Driveway, or Large Living Area" },
      { label: "Service Area", value: "Islamabad & Rawalpindi" },
    ],
    idealFor: ["'Two Fast, Two Curious'", "Formula 1 & Hot Wheels Lovers", "High Energy Boys Parties"],
  },
  "royal-midnight-prince": {
    slug: "royal-midnight-prince",
    title: "Royal Midnight Prince & Gold",
    category: "Luxury",
    startingPriceMinor: 6500000,
    ageSuitability: "1st Birthdays & Milestone Adult Celebrations",
    description:
      "The pinnacle of opulence: a dark navy royal crest backdrop illuminated by an LED glowing royal crown, massive cascading garlands of midnight navy, metallic chrome gold, and pearl balloons, paired with three gold mirror finish cylinder plinths and a regal monogram floor decal.",
    heroImage: "/images/themes/theme_royal_midnight_prince.jpg",
    gallery: [
      "/images/themes/theme_royal_midnight_prince.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
      "/images/themes/theme_sunflower_sunshine.jpg",
    ],
    colorPalette: ["#0A192F", "#D4AF37", "#1E3A8A", "#FFFFFF"],
    colorNames: ["Midnight Navy", "Mirror Chrome Gold", "Royal Blue", "Pearl White"],
    includedDecor: [
      "Grand navy backdrop panel with illuminated royal crown LED motif",
      "20ft organic chrome gold, navy & pearl balloon garland installation",
      "Set of 3 gold mirror finish cylinder cake pedestals",
      "Custom royal monogram printed dance floor / stage decal",
      "Warm ambient gold uplighting spotlights",
      "Chandelier or spotlight accenting for the cake cutting ceremony",
    ],
    specifications: [
      { label: "Backdrop Dimensions", value: "10ft Width x 8.5ft Height" },
      { label: "Setup Space Required", value: "14ft Width x 10ft Depth" },
      { label: "Setup Time", value: "3.5 Hours on-site" },
      { label: "Recommended Setting", value: "Hotel Ballroom, Islamabad Club, Grand Residence Hall" },
      { label: "Service Area", value: "Islamabad & Rawalpindi" },
    ],
    idealFor: ["'Prince Turns ONE'", "Royal Themed 1st Birthdays", "Luxury Adult Milestone Banquets"],
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  let dbTheme: any = null;
  try {
    dbTheme = await prisma.theme.findUnique({ where: { slug: params.slug } });
  } catch {
    // Fall back safely to static themes when offline
  }
  const theme = dbTheme
    ? {
        title: dbTheme.seoTitle || `${dbTheme.title} Birthday Theme in Islamabad & Rawalpindi | AR Events Co.`,
        description: dbTheme.seoDescription || dbTheme.description,
        focusKeyword: dbTheme.focusKeyword || `${dbTheme.title} birthday theme Islamabad`,
        canonicalUrl: dbTheme.canonicalUrl || `/themes/${dbTheme.slug}`,
        ogImage: dbTheme.ogImage || dbTheme.heroImage || "/images/hero/hero_birthday_lawn.jpg",
        noIndex: dbTheme.noIndex,
        noFollow: dbTheme.noFollow,
      }
    : STATIC_THEMES[params.slug]
    ? {
        title: `${STATIC_THEMES[params.slug].title} Birthday Theme in Islamabad & Rawalpindi | AR Events Co.`,
        description: STATIC_THEMES[params.slug].description,
        focusKeyword: `${STATIC_THEMES[params.slug].title} theme Islamabad`,
        canonicalUrl: `/themes/${STATIC_THEMES[params.slug].slug}`,
        ogImage: STATIC_THEMES[params.slug].heroImage,
        noIndex: false,
        noFollow: false,
      }
    : null;

  if (!theme) return { title: "Theme Not Found | AR Events Co." };

  const { constructMetadata } = await import("@/lib/seo");
  return constructMetadata({
    title: theme.title,
    description: theme.description,
    canonicalPath: theme.canonicalUrl,
    ogImage: theme.ogImage,
    noIndex: theme.noIndex,
    noFollow: theme.noFollow,
    keywords: [
      theme.focusKeyword,
      "birthday themes Islamabad",
      "birthday decoration Rawalpindi",
      "kids party styling Islamabad",
    ],
  });
}

export default async function ThemeDetailPage({ params }: { params: { slug: string } }) {
  let dbTheme: any = null;
  try {
    dbTheme = await prisma.theme.findUnique({ where: { slug: params.slug } });
  } catch {
    // Fall back safely to static themes when offline
  }

  let theme: any = null;

  if (dbTheme) {
    let colors: string[] = [];
    try {
      colors = JSON.parse(dbTheme.colorPalette || "[]");
    } catch {
      colors = ["#9370DB", "#E6E6FA", "#4B0082", "#FFFFFF"];
    }

    let inclusions: string[] = [];
    try {
      inclusions = JSON.parse(dbTheme.includedDecor || "[]");
    } catch {
      inclusions = [
        "Bespoke 3D Theme Backdrop with Custom Age/Name Signage",
        "14ft Organic Double-Stuffed Balloon Garland Installation",
        "Set of 2 Fluted Cylindrical Cake Pedestals",
        "On-Site Setup Supervisor & Dedicated Decor Crew",
      ];
    }

    theme = {
      slug: dbTheme.slug,
      title: dbTheme.title,
      category: dbTheme.category,
      startingPriceMinor: 4500000,
      ageSuitability: "1st to 12th Birthdays & Milestones",
      description: dbTheme.description,
      heroImage: dbTheme.heroImage || "/images/themes/theme_lavender_dream.jpg",
      gallery: [
        dbTheme.heroImage || "/images/themes/theme_lavender_dream.jpg",
        "/images/hero/hero_birthday_lawn.jpg",
      ],
      colorPalette: colors,
      colorNames: colors,
      includedDecor: inclusions,
      specifications: [
        { label: "Backdrop Dimensions", value: "8ft Width x 8ft Height" },
        { label: "Setup Space Required", value: "10ft Width x 8ft Depth" },
        { label: "Setup Time", value: "2.5 - 3 Hours on-site" },
        { label: "Recommended Setting", value: "Outdoor Lawn, Lounge, or Banquet Hall" },
        { label: "Service Area", value: "Islamabad & Rawalpindi (All Sectors/Zones)" },
      ],
      idealFor: ["Luxury Birthday Parties", "1st Birthday Milestone Celebrations", "Twin Cities Home Lounges & Lawns"],
    };
  } else {
    theme = STATIC_THEMES[params.slug];
  }

  if (!theme) {
    notFound();
  }

  // Get other themes for related carousel
  const otherDbThemes = await prisma.theme.findMany({
    where: { isActive: true, slug: { not: theme.slug } },
    take: 3,
  });

  const otherThemes = otherDbThemes.length > 0
    ? otherDbThemes.map((t) => ({
        slug: t.slug,
        title: t.title,
        category: t.category,
        image: t.heroImage || "/images/themes/theme_lavender_dream.jpg",
        startingPriceMinor: 4500000,
      }))
    : Object.values(STATIC_THEMES).filter((t) => t.slug !== theme.slug).slice(0, 3).map((t) => ({
        slug: t.slug,
        title: t.title,
        category: t.category,
        image: t.heroImage,
        startingPriceMinor: t.startingPriceMinor,
      }));

  return (
    <div className="py-8 sm:py-12 space-y-16">
      {/* 1. BREADCRUMBS & TOP NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-brand-navy-600">
          <Link href="/" className="hover:text-brand-gold-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-brand-warm-400" />
          <Link href="/themes" className="hover:text-brand-gold-600 transition-colors">
            Birthday Themes
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-brand-warm-400" />
          <span className="text-brand-navy-950 font-medium truncate">{theme.title}</span>
        </nav>
      </div>

      {/* 2. EDITORIAL HERO SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Large Photography Showcase */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative h-[380px] sm:h-[500px] w-full rounded-2xl overflow-hidden shadow-elevated border border-brand-warm-200 bg-brand-warm-100 group">
              <Image
                src={theme.heroImage}
                alt={`${theme.title} real birthday decoration in Islamabad`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-4 left-4 flex space-x-2">
                <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs px-3 py-1 font-semibold">
                  {theme.category}
                </span>
                <span className="bg-white/95 text-brand-navy-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {theme.ageSuitability}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {theme.gallery.map((img: string, idx: number) => (
                <div
                  key={idx}
                  className="relative h-24 sm:h-32 rounded-xl overflow-hidden border border-brand-warm-200 cursor-pointer group"
                >
                  <Image
                    src={img}
                    alt={`${theme.title} setup view ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Theme Inclusions & Direct Booking Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-gold-700 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold-600" />
                <span>Original AR Events Co. Theme Setup</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy-950 font-bold leading-tight">
                {theme.title}
              </h1>
              <p className="text-brand-navy-700 text-sm sm:text-base leading-relaxed">
                {theme.description}
              </p>
            </div>

            {/* Pricing & Service Guarantee */}
            <div className="p-6 rounded-2xl bg-brand-warm-50 border border-brand-gold-200/70 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase text-brand-navy-500 font-semibold tracking-wider">
                    Starting Package Price
                  </span>
                  <p className="text-3xl font-bold font-serif text-brand-navy-950">
                    {formatPKR(theme.startingPriceMinor)}
                  </p>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                  All Setup & Dismantle Included
                </span>
              </div>

              {/* Color Palette Chips */}
              <div className="pt-2 border-t border-brand-warm-200 space-y-2">
                <span className="text-xs font-semibold text-brand-navy-700 uppercase tracking-wider block">
                  Curated Color Palette:
                </span>
                <div className="flex items-center space-x-2.5">
                  {theme.colorPalette.map((hex: string, i: number) => (
                    <div key={i} className="flex items-center space-x-1.5" title={theme.colorNames[i]}>
                      <span
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm inline-block"
                        style={{ backgroundColor: hex }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href={`/book?theme=${theme.slug}`}
                  className="btn-gold w-full py-4 text-center font-semibold text-base flex items-center justify-center space-x-2 group"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book This Decoration Theme</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href={`https://wa.me/923160513841?text=Hi%20AR%20Events%20Co.,%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(
                    theme.title
                  )}%20birthday%20theme%20in%20Islamabad/Rawalpindi.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl border border-brand-warm-300 text-brand-navy-800 text-sm font-medium hover:bg-white flex items-center justify-center space-x-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Fast Inquiry & Custom Quote</span>
                </a>
              </div>
            </div>

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs text-brand-navy-700">
              <div className="flex items-center space-x-2 p-3 bg-white rounded-xl border border-brand-warm-200">
                <CheckCircle2 className="w-4 h-4 text-brand-gold-600 shrink-0" />
                <span>Custom Name Cutout Included</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-white rounded-xl border border-brand-warm-200">
                <ShieldCheck className="w-4 h-4 text-brand-gold-600 shrink-0" />
                <span>Twin-Cities On-Time Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DETAILED INCLUSIONS & TECHNICAL SPECS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Included Items */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-brand-warm-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif text-brand-navy-950 font-bold">
                What&apos;s Included in This Setup
              </h2>
              <p className="text-xs text-brand-navy-500">
                Everything required for a magazine-worthy celebration in Islamabad or Rawalpindi
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {theme.includedDecor.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start space-x-3 p-3.5 bg-brand-warm-50/70 rounded-xl border border-brand-warm-200">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-brand-navy-900">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Setup Specifications */}
          <div className="lg:col-span-5 bg-brand-navy-950 text-white p-8 rounded-2xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-brand-gold-400 font-semibold tracking-wider uppercase">
                Technical Details
              </span>
              <h3 className="text-xl font-serif text-white font-bold">
                Space & Setup Requirements
              </h3>
            </div>
            <div className="space-y-3.5 border-t border-brand-navy-800 pt-4">
              {theme.specifications.map((spec: { label: string; value: string }, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs sm:text-sm py-1 border-b border-brand-navy-900/60 pb-2">
                  <span className="text-brand-navy-300 font-medium">{spec.label}</span>
                  <span className="text-white font-semibold text-right max-w-[200px]">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR ADD-ONS SELECTOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="badge-gold uppercase text-xs">Enhance Your Celebration</span>
          <h2 className="text-3xl font-serif text-brand-navy-950 font-bold">
            Popular Add-ons for This Theme
          </h2>
          <p className="text-sm text-brand-navy-600 max-w-xl mx-auto">
            You can add any of these services during step 6 of the online booking process.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3 group hover:border-brand-gold-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-gold-50 border border-brand-gold-200/80 flex items-center justify-center text-brand-gold-700 group-hover:bg-brand-gold-500 group-hover:text-brand-navy-950 transition-colors">
              <Camera className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-brand-navy-950 text-base">3-Hour Candid Photography</h4>
            <p className="text-xs text-brand-navy-600">50+ edited high-res digital photos with DSLR color grading.</p>
            <p className="text-sm font-bold text-brand-gold-700 pt-2 border-t border-brand-warm-100">+ PKR 15,000</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3 group hover:border-brand-gold-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-gold-50 border border-brand-gold-200/80 flex items-center justify-center text-brand-gold-700 group-hover:bg-brand-gold-500 group-hover:text-brand-navy-950 transition-colors">
              <Cake className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-brand-navy-950 text-base">Custom Themed Fondant Cake</h4>
            <p className="text-xs text-brand-navy-600">2-Tier (6 lbs) artisanal cake matching the theme color palette.</p>
            <p className="text-sm font-bold text-brand-gold-700 pt-2 border-t border-brand-warm-100">+ PKR 14,000</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3 group hover:border-brand-gold-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-gold-50 border border-brand-gold-200/80 flex items-center justify-center text-brand-gold-700 group-hover:bg-brand-gold-500 group-hover:text-brand-navy-950 transition-colors">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-brand-navy-950 text-base">Giant 4ft Marquee Numbers</h4>
            <p className="text-xs text-brand-navy-600">Warm-white vintage bulb marquee lights for iconic birthday photos.</p>
            <p className="text-sm font-bold text-brand-gold-700 pt-2 border-t border-brand-warm-100">+ PKR 6,000</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-brand-warm-200 shadow-sm space-y-3 group hover:border-brand-gold-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-gold-50 border border-brand-gold-200/80 flex items-center justify-center text-brand-gold-700 group-hover:bg-brand-gold-500 group-hover:text-brand-navy-950 transition-colors">
              <Video className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-brand-navy-950 text-base">Cinematic 4K Video Reel</h4>
            <p className="text-xs text-brand-navy-600">1-minute viral Instagram reel + 3-minute full 4K highlight video.</p>
            <p className="text-sm font-bold text-brand-gold-700 pt-2 border-t border-brand-warm-100">+ PKR 25,000</p>
          </div>
        </div>
      </section>

      {/* 5. RELATED THEMES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8 border-t border-brand-warm-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="badge-gold uppercase text-xs">Explore More</span>
            <h3 className="text-2xl sm:text-3xl font-serif text-brand-navy-950 font-bold">
              Related Birthday Themes
            </h3>
          </div>
          <Link href="/themes" className="text-sm font-semibold text-brand-gold-700 hover:text-brand-gold-800 flex items-center space-x-1">
            <span>View All 8 Themes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherThemes.map((t) => (
            <div key={t.slug} className="card-luxury flex flex-col justify-between group">
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={t.image}
                    alt={t.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge-gold bg-brand-navy-950/90 text-brand-gold-300 border-brand-gold-400 text-xs">
                      {t.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="font-serif text-lg font-bold text-brand-navy-950">{t.title}</h4>
                  <p className="text-xs text-brand-navy-600 line-clamp-2">{t.category} Theme</p>
                </div>
              </div>
              <div className="p-5 pt-0 flex items-center justify-between border-t border-brand-warm-200/80 mt-2">
                <div>
                  <span className="text-[10px] text-brand-navy-500 uppercase font-semibold">From</span>
                  <p className="text-sm font-bold text-brand-navy-900">{formatPKR(t.startingPriceMinor)}</p>
                </div>
                <Link
                  href={`/themes/${t.slug}`}
                  className="text-xs font-semibold text-brand-gold-700 hover:text-brand-gold-800 flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
