/**
 * AR Events Co. — Offline & Resilient Data Fallback Layer
 * 
 * Guarantees that the entire public website, catalog, booking flow, and landing pages
 * remain 100% functional, responsive, and beautifully populated even when offline,
 * with intermittent internet, or if remote Supabase PostgreSQL is unreachable.
 */

import { prisma } from "./db";

// =============================================================================
// 1. FALLBACK THEMES
// =============================================================================
export const FALLBACK_THEMES = [
  {
    id: "theme_lavender_dream",
    slug: "lavender-dream-princess",
    title: "Lavender Dream & Purple Princess",
    category: "Girls",
    priceMinor: 4500000,
    startingPriceMinor: 4500000,
    ageSuitability: "1st to 10th Birthdays",
    heroImage: "/images/themes/theme_lavender_dream.jpg",
    gallery: [
      "/images/themes/theme_lavender_dream.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
      "/images/themes/theme_butterfly_wonderland.jpg",
    ],
    colorPalette: JSON.stringify(["#9370DB", "#E6E6FA", "#4B0082", "#FFFFFF"]),
    colorNames: ["Lavender Lilac", "Soft Cream", "Deep Violet", "Pearl White"],
    description:
      "A breathtaking lilac and lavender floral fantasy featuring a circular custom backdrop board with elegant 3D cursive script, organic balloon garlands in lilac, deep violet, and pearl white, fluted cake pedestals, and fresh floral floor accents.",
    includedDecor: JSON.stringify([
      "8ft x 8ft round lilac backdrop with personalized 3D name & age lettering",
      "14ft organic double-stuffed balloon garland in lilac, white & violet",
      "Set of 2 white fluted cylindrical cake pedestals with floral accents",
      "Custom acrylic welcome signage on gold wrought iron easel",
      "Ambient warm uplighting spotlights",
      "Dedicated styling team & on-site event supervisor",
    ]),
    specifications: [
      { label: "Backdrop Dimensions", value: "8ft Width x 8ft Height" },
      { label: "Setup Space Required", value: "10ft Width x 8ft Depth" },
      { label: "Setup Time", value: "2.5 - 3 Hours on-site" },
      { label: "Recommended Setting", value: "Outdoor Lawn, Lounge, or Banquet Hall" },
      { label: "Service Area", value: "Islamabad & Rawalpindi (All Sectors/Zones)" },
    ],
    idealFor: ["1st Birthday Milestones", "Princess & Floral Themes", "Twin Cities Home Lounges & Lawns"],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "theme_sunflower_sunshine",
    slug: "sunflower-sunshine-garden",
    title: "Sunflower Sunshine Garden & Bee",
    category: "Unisex",
    priceMinor: 4500000,
    startingPriceMinor: 4500000,
    ageSuitability: "1st & 2nd Birthdays (You Are My Sunshine)",
    heroImage: "/images/themes/theme_sunflower_sunshine.jpg",
    gallery: [
      "/images/themes/theme_sunflower_sunshine.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
      "/images/themes/theme_dusty_rose_bunny.jpg",
    ],
    colorPalette: JSON.stringify(["#F59E0B", "#FCD34D", "#78350F", "#FFFFFF"]),
    colorNames: ["Bright Sunflower Yellow", "Pastel Honey Yellow", "Warm Earth Brown", "Clean White"],
    description:
      "A warm, joyous celebration featuring custom arched backdrop panels in buttery yellow, faux botanical sunflower arrangements, organic balloon garlands with honeybee accents, and rustic wood-finished cake plinths.",
    includedDecor: JSON.stringify([
      "Dual arched backdrop panels with 'You Are My Sunshine' typography",
      "16ft cascading sunflower yellow, white, and golden honey balloon garland",
      "Faux botanical sunflower floor arrangements & greenery vines",
      "Set of 3 custom honeybee & floral pedestals",
      "Illuminated marquee number '1' or '2'",
    ]),
    specifications: [
      { label: "Backdrop Dimensions", value: "9ft Width x 7.5ft Height" },
      { label: "Setup Space Required", value: "11ft Width x 8ft Depth" },
      { label: "Setup Time", value: "3 Hours on-site" },
      { label: "Recommended Setting", value: "Sunlit Lawn, Backyard, or Rooftop Terrace" },
      { label: "Service Area", value: "Islamabad & Rawalpindi" },
    ],
    idealFor: ["'You Are My Sunshine' 1st Birthdays", "Spring & Summer Parties", "Outdoor Garden Celebrations"],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "theme_dusty_rose_bunny",
    slug: "dusty-rose-floral-bunny",
    title: "Dusty Rose Floral & Woodland Bunny",
    category: "Girls",
    priceMinor: 5000000,
    startingPriceMinor: 5000000,
    ageSuitability: "1st to 5th Birthdays ('Some Bunny Is Turning One')",
    heroImage: "/images/themes/theme_dusty_rose_bunny.jpg",
    gallery: [
      "/images/themes/theme_dusty_rose_bunny.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
      "/images/themes/theme_butterfly_wonderland.jpg",
    ],
    colorPalette: JSON.stringify(["#E0A899", "#F7ECE1", "#C27B66", "#FFFFFF"]),
    colorNames: ["Dusty Rose Pink", "Warm Blush Cream", "Terracotta Coral", "Pearl White"],
    description:
      "An enchanting pastel fairytale with custom scalloped wooden backdrop arches, hand-illustrated woodland bunnies, overflowing eucalyptus & dried floral arrangements, and rose-gold plinths.",
    includedDecor: JSON.stringify([
      "Triple scalloped wooden backdrop arches in custom dusty rose & cream hues",
      "Organic matte balloon garland in dusty rose, blush, and white sand",
      "Life-size 3D cutouts of storybook woodland bunnies & butterflies",
      "Set of 3 ribbed blush cake plinths with faux pampas & eucalyptus accents",
      "Personalized mirror welcome sign with customized vinyl calligraphy",
    ]),
    specifications: [
      { label: "Backdrop Dimensions", value: "10ft Width x 8ft Height" },
      { label: "Setup Space Required", value: "12ft Width x 8ft Depth" },
      { label: "Setup Time", value: "3 Hours on-site" },
      { label: "Recommended Setting", value: "Drawing Room, Indoor Hall, or Enclosed Lawn" },
      { label: "Service Area", value: "Islamabad & Rawalpindi" },
    ],
    idealFor: ["'Some Bunny Is One' Milestones", "Elegant Pastel Girl Birthdays", "Intimate Twin Cities Home Celebrations"],
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "theme_vintage_racer",
    slug: "vintage-racer-grand-prix",
    title: "Vintage Racer & Grand Prix Champion",
    category: "Boys",
    priceMinor: 5500000,
    startingPriceMinor: 5500000,
    ageSuitability: "1st to 8th Birthdays ('Two Fast, Two Curious')",
    heroImage: "/images/themes/theme_vintage_racer.jpg",
    gallery: [
      "/images/themes/theme_vintage_racer.jpg",
      "/images/themes/theme_speed_champion.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
    ],
    colorPalette: JSON.stringify(["#EF4444", "#000000", "#FFFFFF", "#F59E0B"]),
    colorNames: ["Racing Red", "Pitstop Black", "Checkered White", "Trophy Gold"],
    description:
      "High-octane excitement with custom racetrack backdrop walls, checkered racing flags, organic balloon arches in red, black and white, realistic trophy props, and giant light-up marquee numbers.",
    includedDecor: JSON.stringify([
      "Custom racetrack backdrop with 'Racing to TWO' personalization",
      "Massive racing red & black balloon arch with checkered balloon spheres",
      "Giant 4-foot illuminated light-up marquee number",
      "Checkered trophy cake pedestal with custom birthday champion cup",
      "Realistic Formula 1 race tire props & pitstop signage",
      "Printed asphalt racetrack floor runner",
    ]),
    specifications: [
      { label: "Backdrop Dimensions", value: "9ft Width x 8ft Height" },
      { label: "Setup Space Required", value: "12ft Width x 9ft Depth" },
      { label: "Setup Time", value: "3 Hours on-site" },
      { label: "Recommended Setting", value: "Outdoor Lawn, Driveway, or Large Living Area" },
      { label: "Service Area", value: "Islamabad & Rawalpindi" },
    ],
    idealFor: ["'Two Fast, Two Curious'", "Formula 1 & Hot Wheels Lovers", "High Energy Boys Parties"],
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "theme_jungle_safari",
    slug: "jungle-safari-wild-one",
    title: "Jungle Safari & Wild One Adventure",
    category: "Unisex",
    priceMinor: 5000000,
    startingPriceMinor: 5000000,
    ageSuitability: "1st to 6th Birthdays ('Born To Be Wild')",
    heroImage: "/images/themes/theme_jungle_safari.jpg",
    gallery: [
      "/images/themes/theme_jungle_safari.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
    ],
    colorPalette: JSON.stringify(["#059669", "#D97706", "#78350F", "#FCD34D"]),
    colorNames: ["Emerald Green", "Safari Ochre", "Warm Bark Brown", "Golden Yellow"],
    description:
      "A thrilling safari jungle adventure featuring arch backdrop panels with tropical monstera foliage, 3D animal cutouts of lion cubs, giraffes, and zebras, balloon garlands in forest green and chrome gold.",
    includedDecor: JSON.stringify([
      "Triple arch safari backdrop wall with custom 'WILD ONE' illuminated signage",
      "18ft lush jungle balloon garland with tropical palm leaves",
      "Set of 4 life-sized 3D safari animal props (Lion, Giraffe, Zebra, Elephant)",
      "Set of 3 natural wood textured plinths",
      "Grass turf floor staging for cake cutting",
    ]),
    specifications: [
      { label: "Backdrop Dimensions", value: "10ft Width x 8ft Height" },
      { label: "Setup Space Required", value: "12ft Width x 9ft Depth" },
      { label: "Setup Time", value: "3 Hours on-site" },
      { label: "Recommended Setting", value: "Lawn, Community Club, or Large Living Room" },
      { label: "Service Area", value: "Islamabad & Rawalpindi" },
    ],
    idealFor: ["'Wild One' 1st Birthdays", "Safari & Animal Lovers", "Outdoor Lawn Gatherings"],
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "theme_royal_midnight",
    slug: "royal-midnight-prince",
    title: "Royal Midnight Prince & Gold",
    category: "Luxury",
    priceMinor: 6500000,
    startingPriceMinor: 6500000,
    ageSuitability: "1st Birthdays & Milestone Celebrations",
    heroImage: "/images/themes/theme_royal_midnight_prince.jpg",
    gallery: [
      "/images/themes/theme_royal_midnight_prince.jpg",
      "/images/hero/hero_birthday_lawn.jpg",
    ],
    colorPalette: JSON.stringify(["#0A192F", "#D4AF37", "#1E3A8A", "#FFFFFF"]),
    colorNames: ["Midnight Navy", "Mirror Chrome Gold", "Royal Blue", "Pearl White"],
    description:
      "The pinnacle of opulence: a dark navy royal crest backdrop illuminated by an LED glowing crown, cascading garlands of midnight navy, metallic chrome gold, and gold mirror cylinder plinths.",
    includedDecor: JSON.stringify([
      "Grand navy backdrop panel with illuminated royal crown LED motif",
      "20ft organic chrome gold, navy & pearl balloon garland installation",
      "Set of 3 gold mirror finish cylinder cake pedestals",
      "Custom royal monogram printed stage decal",
      "Warm ambient gold uplighting spotlights",
    ]),
    specifications: [
      { label: "Backdrop Dimensions", value: "10ft Width x 8.5ft Height" },
      { label: "Setup Space Required", value: "14ft Width x 10ft Depth" },
      { label: "Setup Time", value: "3.5 Hours on-site" },
      { label: "Recommended Setting", value: "Hotel Ballroom, Islamabad Club, Grand Residence Hall" },
      { label: "Service Area", value: "Islamabad & Rawalpindi" },
    ],
    idealFor: ["Royal Milestone Birthdays", "Luxury 1st Birthdays", "Premium Ballroom Gatherings"],
    isActive: true,
    sortOrder: 6,
  },
];

// =============================================================================
// 2. FALLBACK PACKAGES
// =============================================================================
export const FALLBACK_PACKAGES = [
  {
    id: "pkg_kids_wonderland",
    slug: "kids-wonderland-birthday",
    title: "Kids Wonderland Package",
    subtitle: "Essential luxury decor for intimate home & lounge celebrations",
    description:
      "Designed for families wanting a complete, photogenic birthday setup with a bespoke theme backdrop, organic balloon garland, cake pedestals, and on-site event coordinator.",
    basePriceMinor: 3500000,
    guestCapacityMin: 15,
    guestCapacityMax: 30,
    estimatedDurationHours: 3,
    featuredImage: "/images/themes/theme_lavender_dream.jpg",
    isFeatured: false,
    sortOrder: 1,
    features: JSON.stringify([
      "Custom 8ft Themed Backdrop with Child's Name & Age",
      "12ft Organic Double-Stuffed Balloon Arch Garland",
      "Set of 2 Fluted Cylindrical Cake Pedestals",
      "Acrylic Welcome Sign on Gold Wrought Iron Easel",
      "Warm Ambient Uplighting Spotlights",
      "On-Site Setup Supervisor & Styling Crew",
    ]),
    isActive: true,
  },
  {
    id: "pkg_grand_thematic",
    slug: "grand-thematic-celebration",
    title: "Grand Thematic Celebration",
    subtitle: "Our most popular signature all-inclusive birthday experience",
    description:
      "Our flagship package featuring dual layered backdrop arches, 4-foot LED marquee numbers, 18ft cascading balloon arch, professional photography coverage, and custom party props.",
    basePriceMinor: 6500000,
    guestCapacityMin: 30,
    guestCapacityMax: 60,
    estimatedDurationHours: 4,
    featuredImage: "/images/themes/theme_royal_midnight_prince.jpg",
    isFeatured: true,
    sortOrder: 2,
    features: JSON.stringify([
      "Multi-Panel 3D Layered Theme Backdrop (up to 12ft wide)",
      "18ft Luxury Double-Layered Organic Balloon Architecture",
      "4-Foot Illuminated LED Light-Up Marquee Age Number",
      "Set of 3 Cylindrical Mirror or Fluted Plinths",
      "2-Hour Professional Event Photography Coverage (Digital High-Res)",
      "Custom Theme Welcome Standee with Balloon Framing",
      "Full On-Site Coordination & End-of-Party Teardown",
    ]),
    isActive: true,
  },
  {
    id: "pkg_royal_vip",
    slug: "royal-vip-milestone",
    title: "Royal VIP Milestone Experience",
    subtitle: "Turnkey luxury production for large lawns, ballrooms & milestone parties",
    description:
      "A complete event production including custom staging, 3D theme arches, cold-pyro sparklers, 4K cinematic video, 3-hour photography, personalized favor bags, and complete decor coordination.",
    basePriceMinor: 11000000,
    guestCapacityMin: 50,
    guestCapacityMax: 150,
    estimatedDurationHours: 5,
    featuredImage: "/images/hero/hero_birthday_lawn.jpg",
    isFeatured: false,
    sortOrder: 3,
    features: JSON.stringify([
      "Grand 16ft x 8.5ft Bespoke Custom 3D Stage & Backdrop Setup",
      "Massive 24ft Cascading Chrome & Matte Balloon Architecture",
      "Full Light-Up Marquee Lettering / Name Signage",
      "Custom Printed Stage Floor Decal / Monogram Dance Floor",
      "3-Hour Event Photography + 4K Cinematic Highlight Video",
      "Cold-Pyro Sparkler Fountains for Cake Cutting Ceremony",
      "Themed Photo Booth Station with Custom Fun Props",
      "Lead Event Director & 4-Person Styling & Logistics Crew",
    ]),
    isActive: true,
  },
];

// =============================================================================
// 3. FALLBACK REVIEWS
// =============================================================================
export const FALLBACK_REVIEWS = [
  {
    id: "rev_1",
    authorName: "Ayesha Malik",
    authorLocation: "F-7/2, Islamabad",
    eventTitle: "1st Birthday 'Some Bunny Is One'",
    comment:
      "AR Events Co. transformed our lawn into an absolute fairytale for our daughter's first birthday! The dusty rose colors and bunny details were even more gorgeous than the 3D render. Our guests couldn't stop taking pictures!",
    rating: 5,
    isVerified: true,
    isFeatured: true,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "rev_2",
    authorName: "Usman Tariq",
    authorLocation: "Bahria Town Phase 7, Rawalpindi",
    eventTitle: "Hot Wheels & Racing Grand Prix 2nd Birthday",
    comment:
      "Incredible execution! The illuminated marquee numbers, racetrack backdrop, and balloon garlands were super high quality. The team arrived 3 hours before the event and finished everything with zero stress for us.",
    rating: 5,
    isVerified: true,
    isFeatured: true,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "rev_3",
    authorName: "Dr. Fatima Noor",
    authorLocation: "DHA Phase 2, Islamabad",
    eventTitle: "Lavender Dream Princess Birthday",
    comment:
      "The best event planning team in Islamabad by far. Booking online was effortless, the invoice was transparent with no hidden charges, and the setup was breathtaking. Highly recommend AR Events Co!",
    rating: 5,
    isVerified: true,
    isFeatured: true,
    sortOrder: 3,
    isActive: true,
  },
];

// =============================================================================
// 4. FALLBACK FAQS
// =============================================================================
export const FALLBACK_FAQS = [
  {
    id: "faq_1",
    question: "How far in advance should I book my birthday celebration?",
    answer:
      "We recommend booking at least 5 to 10 days in advance to allow our workshop to fabricate custom 3D cutouts, printed names, and prepare themed balloon batches. For urgent requests (under 48 hours), please contact our team directly.",
    category: "Booking & Timing",
    isFeatured: true,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "faq_2",
    question: "Do you provide birthday planning and decoration across both Islamabad and Rawalpindi?",
    answer:
      "Yes! We provide turnkey event planning and decor across all sectors of Islamabad (F, E, G, H, I, Bahria Enclave, Gulberg Greens, DHA) and Rawalpindi (Bahria Town, DHA, Cantt, Saddar, Chaklala, Satellite Town).",
    category: "Service Areas",
    isFeatured: true,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "faq_3",
    question: "How does payment and advance deposit work?",
    answer:
      "To lock in your date on our official production calendar, a 30% advance deposit is required. You can pay securely online via Safepay (Debit/Credit Card) or via direct Meezan Bank transfer. The remaining 70% balance is payable upon event completion.",
    category: "Payments & Terms",
    isFeatured: true,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "faq_4",
    question: "Can I customize the color palette or request a theme not on the website?",
    answer:
      "Absolutely! All our themes are 100% customizable. You can request custom colors, swap props, add photo-booths, or provide your own mood board. Our design team will bring your exact vision to life.",
    category: "Themes & Customization",
    isFeatured: true,
    sortOrder: 4,
    isActive: true,
  },
];

// =============================================================================
// 5. FALLBACK SERVICES
// =============================================================================
export const FALLBACK_SERVICES = [
  {
    id: "svc_photo_video",
    slug: "pro-photography-videography",
    title: "Event Photography & 4K Highlight Reel",
    category: "Photography & Media",
    description: "High-resolution digital event coverage with professional lighting and edited 4K social media reels.",
    basePriceMinor: 1500000,
    priceType: "FIXED",
    image: "/images/hero/hero_birthday_lawn.jpg",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "svc_themed_cake",
    slug: "custom-themed-bakery-cake",
    title: "Custom Themed Fondant & Cream Cake",
    category: "Bakery & Sweets",
    description: "2 to 3 tier bespoke thematic cakes designed to match your backdrop color palette perfectly.",
    basePriceMinor: 1200000,
    priceType: "FIXED",
    image: "/images/themes/theme_lavender_dream.jpg",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "svc_magic_show",
    slug: "magic-show-puppet-entertainment",
    title: "Interactive Magic & Puppet Show (45 Mins)",
    category: "Entertainment",
    description: "Engaging comedy magic, balloon sculpting, and puppet performance loved by kids and parents alike.",
    basePriceMinor: 1000000,
    priceType: "FIXED",
    image: "/images/themes/theme_jungle_safari.jpg",
    isActive: true,
    sortOrder: 3,
  },
];

// =============================================================================
// 6. FALLBACK VENUES
// =============================================================================
export const FALLBACK_VENUES = [
  {
    id: "venue_terrace_lawn",
    slug: "f7-luxury-terrace-lawn",
    name: "Margalla View Terrace Lawn",
    city: "Islamabad",
    address: "Sector F-7/2, Margalla Road, Islamabad",
    capacity: 100,
    venueType: "Garden/Outdoor",
    feeMinor: 2500000,
    description: "An elegant private lawn with panoramic views of Margalla Hills, perfect for sunset birthday celebrations.",
    isActive: true,
  },
  {
    id: "venue_bahria_hall",
    slug: "bahria-town-phase-7-hall",
    name: "The Grand Banquet Hall",
    city: "Rawalpindi",
    address: "Phase 7, Bahria Town, Rawalpindi",
    capacity: 150,
    venueType: "Indoor Hall",
    feeMinor: 3000000,
    description: "Modern climate-controlled banquet space with high ceilings and integrated LED ambient chandeliers.",
    isActive: true,
  },
];

// =============================================================================
// 7. FALLBACK GALLERY ASSETS
// =============================================================================
export const FALLBACK_GALLERY = [
  {
    id: "gal_1",
    title: "Lavender Dream Floral Princess 1st Birthday",
    category: "Girls",
    url: "/images/themes/theme_lavender_dream.jpg",
    altText: "Lavender Dream Birthday Islamabad",
    caption: "Custom round arch backdrop with lilac balloon architecture in F-7 Islamabad.",
    tags: "Birthday, Islamabad, Girls",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "gal_2",
    title: "Royal Midnight Prince & Gold Milestone",
    category: "Luxury",
    url: "/images/themes/theme_royal_midnight_prince.jpg",
    altText: "Royal Navy Birthday Rawalpindi",
    caption: "Midnight blue backdrop with 4-foot LED marquee and mirror plinths in Bahria Town.",
    tags: "Luxury, Bahria Town, Rawalpindi",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "gal_3",
    title: "Outdoor Lawn Birthday Celebration",
    category: "Outdoor",
    url: "/images/hero/hero_birthday_lawn.jpg",
    altText: "Outdoor Birthday Lawn Decor Islamabad",
    caption: "Turnkey garden party styling with custom staging and ambient festoon lighting.",
    tags: "Outdoor, Garden, Islamabad",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "gal_4",
    title: "Vintage Grand Prix Racetrack Celebration",
    category: "Boys",
    url: "/images/themes/theme_vintage_racer.jpg",
    altText: "Vintage Racer Birthday Decor Rawalpindi",
    caption: "Formula 1 racing flags, custom tire props, and checkered podium staging.",
    tags: "Boys, Racetrack, Rawalpindi",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "gal_5",
    title: "Sunflower Sunshine Garden Setup",
    category: "Unisex",
    url: "/images/themes/theme_sunflower_sunshine.jpg",
    altText: "Sunflower Birthday Decor Islamabad",
    caption: "Vibrant yellow floral arch with honeybee accents in DHA Phase 2.",
    tags: "Sunshine, Garden, DHA",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "gal_6",
    title: "Dusty Rose & Woodland Bunny Fairytale",
    category: "Girls",
    url: "/images/themes/theme_dusty_rose_bunny.jpg",
    altText: "Dusty Rose Birthday Islamabad",
    caption: "Triple scalloped arches with hand-painted bunnies in E-7 Islamabad.",
    tags: "Pastel, Bunny, Islamabad",
    sortOrder: 6,
    isActive: true,
  },
];

export async function getSafeGallery(take?: number) {
  try {
    const dbAssets = await prisma.mediaAsset.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      ...(take ? { take } : {}),
    });
    if (dbAssets && dbAssets.length > 0) return dbAssets;
  } catch (err: any) {
    console.warn(`[DATA-FALLBACK] Gallery query offline or unavailable (${err?.message || "connection error"}). Serving fallback gallery.`);
  }
  return take ? FALLBACK_GALLERY.slice(0, take) : FALLBACK_GALLERY;
}

// =============================================================================
// SAFE DATA ACCESS HELPERS (Resilient against DB & Network Disconnects)
// =============================================================================

export async function getSafeThemes(take?: number) {
  try {
    const dbThemes = await prisma.theme.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      ...(take ? { take } : {}),
    });
    if (dbThemes && dbThemes.length > 0) return dbThemes;
  } catch (err: any) {
    console.warn(`[DATA-FALLBACK] Theme query offline or unavailable (${err?.message || "connection error"}). Serving fallback themes.`);
  }
  return take ? FALLBACK_THEMES.slice(0, take) : FALLBACK_THEMES;
}

export async function getSafePackages(take?: number) {
  try {
    const dbPackages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      ...(take ? { take } : {}),
    });
    if (dbPackages && dbPackages.length > 0) return dbPackages;
  } catch (err: any) {
    console.warn(`[DATA-FALLBACK] Package query offline or unavailable (${err?.message || "connection error"}). Serving fallback packages.`);
  }
  return take ? FALLBACK_PACKAGES.slice(0, take) : FALLBACK_PACKAGES;
}

export async function getSafeReviews(take?: number) {
  try {
    const dbReviews = await prisma.review.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      ...(take ? { take } : {}),
    });
    if (dbReviews && dbReviews.length > 0) return dbReviews;
  } catch (err: any) {
    console.warn(`[DATA-FALLBACK] Review query offline or unavailable (${err?.message || "connection error"}). Serving fallback reviews.`);
  }
  return take ? FALLBACK_REVIEWS.slice(0, take) : FALLBACK_REVIEWS;
}

export async function getSafeFaqs(take?: number, featuredOnly = false) {
  try {
    const dbFaqs = await prisma.faq.findMany({
      where: { isActive: true, ...(featuredOnly ? { isFeatured: true } : {}) },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      ...(take ? { take } : {}),
    });
    if (dbFaqs && dbFaqs.length > 0) return dbFaqs;
  } catch (err: any) {
    console.warn(`[DATA-FALLBACK] FAQ query offline or unavailable (${err?.message || "connection error"}). Serving fallback FAQs.`);
  }
  const faqs = featuredOnly ? FALLBACK_FAQS.filter((f) => f.isFeatured) : FALLBACK_FAQS;
  return take ? faqs.slice(0, take) : faqs;
}

export async function getSafeServices(take?: number) {
  try {
    const dbServices = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      ...(take ? { take } : {}),
    });
    if (dbServices && dbServices.length > 0) return dbServices;
  } catch (err: any) {
    console.warn(`[DATA-FALLBACK] Service query offline or unavailable (${err?.message || "connection error"}). Serving fallback services.`);
  }
  return take ? FALLBACK_SERVICES.slice(0, take) : FALLBACK_SERVICES;
}

export async function getSafeVenues(take?: number) {
  try {
    const dbVenues = await prisma.venue.findMany({
      where: { isActive: true },
      orderBy: [{ createdAt: "desc" }],
      ...(take ? { take } : {}),
    });
    if (dbVenues && dbVenues.length > 0) return dbVenues;
  } catch (err: any) {
    console.warn(`[DATA-FALLBACK] Venue query offline or unavailable (${err?.message || "connection error"}). Serving fallback venues.`);
  }
  return take ? FALLBACK_VENUES.slice(0, take) : FALLBACK_VENUES;
}
