import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding AR Events Co. Database with authentic Islamabad/Rawalpindi data...");

  // 1. CLEAR EXISTING DATA SAFELY
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.service.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.package.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.section.deleteMany();
  await prisma.page.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.team.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.locationPage.deleteMany();
  await prisma.redirect.deleteMany();
  await prisma.seoAuditLog.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.user.deleteMany();

  // 2. CREATE SEED USERS
  const rawSeedPassword = process.env.SEED_DEFAULT_PASSWORD || process.env.INITIAL_ADMIN_PASSWORD || "Password123!";
  const defaultPassword = await bcrypt.hash(rawSeedPassword, 10);

  // Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@areventsco.com",
      name: "Abdul Rehman (Super Admin)",
      phone: "+92 300 8555123",
      passwordHash: defaultPassword,
      role: "SUPER_ADMIN",
    },
  });

  // Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "manager@areventsco.com",
      name: "Sara Khan (Admin)",
      phone: "+92 321 5556789",
      passwordHash: defaultPassword,
      role: "ADMIN",
    },
  });

  // Staff / Event Coordinator
  const staffUser = await prisma.user.create({
    data: {
      email: "staff@areventsco.com",
      name: "Hamza Ali (Lead Decorator)",
      phone: "+92 333 4445566",
      passwordHash: defaultPassword,
      role: "STAFF",
      staffProfile: {
        create: {
          jobTitle: "Senior Decorator & Setup Lead",
          department: "Event Operations",
        },
      },
    },
  });

  // Customer 1 (Islamabad)
  const customer1 = await prisma.user.create({
    data: {
      email: "fatima.z@gmail.com",
      name: "Fatima Zahra",
      phone: "+92 300 9876543",
      passwordHash: defaultPassword,
      role: "CUSTOMER",
      customerProfile: {
        create: {
          city: "Islamabad",
          address: "House 42, Street 19, Sector F-8/2, Islamabad",
          emergencyContact: "+92 300 9876540",
          notes: "Prefers elegant gold and pastel colors for kids birthdays.",
        },
      },
    },
    include: { customerProfile: true },
  });

  // Customer 2 (Rawalpindi)
  const customer2 = await prisma.user.create({
    data: {
      email: "usman.tariq@gmail.com",
      name: "Usman Tariq",
      phone: "+92 321 8765432",
      passwordHash: defaultPassword,
      role: "CUSTOMER",
      customerProfile: {
        create: {
          city: "Rawalpindi",
          address: "House 15B, Safari Villas 2, Bahria Town Phase 7, Rawalpindi",
          emergencyContact: "+92 321 8765430",
        },
      },
    },
    include: { customerProfile: true },
  });

  console.log("✅ Seed Users created successfully.");

  // 3. CREATE PACKAGES
  const packagesData = [
    {
      slug: "grand-royal-celebration",
      title: "Grand Royal Celebration",
      subtitle: "Our signature luxury all-inclusive birthday planning experience",
      description: "A breathtaking high-end celebration tailored for milestone birthdays, VIP celebrations, and grand parties across Islamabad & Rawalpindi. Includes bespoke 3D stage backdrop, organic luxury balloon architecture, custom lighting, professional photography, sound, and a dedicated on-site event coordinator.",
      basePriceMinor: 12500000, // PKR 125,000
      guestCapacityMin: 30,
      guestCapacityMax: 150,
      estimatedDurationHours: 5,
      featuredImage: "/images/themes/theme_royal_midnight_prince.jpg",
      features: JSON.stringify([
        "Grand 16ft x 10ft custom thematic backdrop with 3D acrylic name cutout",
        "20ft organic metallic gold & navy balloon garland installation",
        "Stage lighting, warm ambient uplighting & cold spark effects",
        "3-Tier luxury custom fondant cake (matching chosen theme)",
        "3 Hours professional photography with edited digital gallery",
        "Dedicated on-site setup supervisor & 4-member decor crew",
        "Thematic entrance welcome board with floral/balloon detailing",
        "Sound system with wireless mics for speeches and playlist management",
      ]),
      isFeatured: true,
      sortOrder: 1,
    },
    {
      slug: "kids-wonderland-birthday",
      title: "Kids Wonderland Experience",
      subtitle: "Magical birthday wonderland designed to spark pure joy",
      description: "The ultimate birthday package for boys and girls from 1st birthdays up to 12 years. Features vibrant thematic backdrops, life-sized character cutouts, balloon arches, kids entertainment coordination, and photo-ready cake tables.",
      basePriceMinor: 7500000, // PKR 75,000
      guestCapacityMin: 20,
      guestCapacityMax: 80,
      estimatedDurationHours: 4,
      featuredImage: "/images/themes/theme_dusty_rose_bunny.jpg",
      features: JSON.stringify([
        "10ft custom circular or arch backdrop with theme-matched graphics",
        "12ft organic balloon garland with thematic foil accents",
        "Cylindrical cake plinths (set of 3) with customized decals",
        "Themed cutouts (Jungle/Safari, Princess, Superhero, Space)",
        "Kids party favor display corner & custom welcome easel",
        "2 Hours event coverage with 40+ edited high-resolution photos",
        "Complete setup 3 hours prior to event start time",
      ]),
      isFeatured: true,
      sortOrder: 2,
    },
    {
      slug: "elegant-chic-milestone",
      title: "Elegant Chic Milestone",
      subtitle: "Sophisticated minimalism with warm gold accents for teens & adults",
      description: "Designed for 18th, 21st, 30th, 40th, and 50th milestone celebrations. Combines chic shimmer walls or sleek arched backdrops with neon lighting, giant marquee numbers, and sophisticated florals.",
      basePriceMinor: 9500000, // PKR 95,000
      guestCapacityMin: 25,
      guestCapacityMax: 100,
      estimatedDurationHours: 4,
      featuredImage: "/images/themes/theme_sunflower_sunshine.jpg",
      features: JSON.stringify([
        "8ft x 8ft natural wooden slatted or gold shimmer backdrop",
        "Neon LED sign ('Happy Birthday' / Custom name)",
        "Giant 4ft illuminated marquee light-up age numbers",
        "Lush organic balloon garland with fresh floral accents",
        "Luxury cake stand & champagne dessert cart styling",
        "Warm uplighting kit for ambient evening elegance",
        "2 Hours candid event photography",
      ]),
      isFeatured: true,
      sortOrder: 3,
    },
    {
      slug: "pastel-dream-intimate",
      title: "Pastel Dream Intimate",
      subtitle: "Chic and modern setup perfect for home or cafe celebrations",
      description: "An intimate, aesthetic celebration setup crafted for home lounges, private dining rooms, or terrace parties in Islamabad & Rawalpindi. Delivers maximum visual impact in a compact footprint.",
      basePriceMinor: 4500000, // PKR 45,000
      guestCapacityMin: 10,
      guestCapacityMax: 40,
      estimatedDurationHours: 3,
      featuredImage: "/images/themes/theme_lavender_dream.jpg",
      features: JSON.stringify([
        "Double arched wooden/acrylic backdrop in custom pastel palette",
        "8ft pastel balloon cluster with double-stuffed matte finish",
        "Acrylic cylindrical cake pedestal with vinyl personalized lettering",
        "Personalized tabletop welcome sign & floral accents",
        "Professional on-time delivery, assembly, and post-event packdown",
      ]),
      isFeatured: false,
      sortOrder: 4,
    },
  ];

  for (const pkg of packagesData) {
    await prisma.package.create({ data: pkg });
  }
  console.log("✅ Seed Packages created successfully.");

  // 4. CREATE THEMES
  const themesData = [
    {
      slug: "lavender-dream-princess",
      title: "Lavender Dream & Purple Princess",
      category: "Girls",
      description: "Elegant circular lilac backdrop with organic lavender, violet, and pearl white balloon garland, fluted pedestals, and fresh floral accents for 1st birthdays and girls.",
      colorPalette: JSON.stringify(["#9370DB", "#E6E6FA", "#4B0082", "#FFFFFF"]),
      heroImage: "/images/themes/theme_lavender_dream.jpg",
      includedDecor: JSON.stringify(["Lilac circular arch backdrop", "12ft organic balloon garland", "2 White fluted cake pedestals", "Custom cursive 3D lettering", "Floral garden runner"]),
      isPopular: true,
      sortOrder: 1,
    },
    {
      slug: "sunflower-golden-sunshine",
      title: "Golden Sunflower Sunshine",
      category: "Floral",
      description: "Warm rustic-chic wooden panel backdrop illuminated by neon 'Happy Birthday' lighting, cascading sunny yellow balloon arch, and blooming natural sunflowers.",
      colorPalette: JSON.stringify(["#FFD700", "#FFF8DC", "#8B4513", "#228B22"]),
      heroImage: "/images/themes/theme_sunflower_sunshine.jpg",
      includedDecor: JSON.stringify(["Natural slatted wood backdrop", "Warm white neon LED sign", "Sunflower & balloon garland", "3D wooden ONE marquee letters", "Rustic crates & pots"]),
      isPopular: true,
      sortOrder: 2,
    },
    {
      slug: "enchanted-dusty-rose-bunny",
      title: "Enchanted Dusty Rose Bunny",
      category: "First Birthday",
      description: "Lush botanical meadow setup with arched dusty rose velvet backdrop, pastel peach & pink entryway balloon arch, and storybook bunny cutouts.",
      colorPalette: JSON.stringify(["#C08081", "#FFE4E1", "#DDA0DD", "#FFFFFF"]),
      heroImage: "/images/themes/theme_dusty_rose_bunny.jpg",
      includedDecor: JSON.stringify(["Dusty rose velvet arch backdrop", "Fresh meadow floral garden base", "Storybook illustrated bunny cutout", "Pastel entryway balloon arch", "Cane high chair"]),
      isPopular: true,
      sortOrder: 3,
    },
    {
      slug: "vintage-little-racer",
      title: "Vintage Little Racer (Beep Beep)",
      category: "Boys",
      description: "Retro roadster theme with 'Beep Beep! I'm ONE!' backdrop, bold primary and olive balloon clusters, black & white checkered runner, and 3D ONE block letters.",
      colorPalette: JSON.stringify(["#DC2626", "#4B5320", "#EAB308", "#38BDF8"]),
      heroImage: "/images/themes/theme_vintage_racer.jpg",
      includedDecor: JSON.stringify(["Beep Beep custom backdrop", "Multicolor balloon cluster garland", "Checkered tabletop runner", "3D ONE car block letters", "Toy vintage cars"]),
      isPopular: true,
      sortOrder: 4,
    },
    {
      slug: "jungle-safari-kingdom",
      title: "Jungle Safari Kingdom",
      category: "Kids",
      description: "Exotic safari adventure with a grand circular balloon hoop of sage green, gold, and tan balloons, tropical monstera leaves, and lifelike plush safari animals.",
      colorPalette: JSON.stringify(["#2D5A27", "#D4AF37", "#D2B48C", "#0F172A"]),
      heroImage: "/images/themes/theme_jungle_safari.jpg",
      includedDecor: JSON.stringify(["Full circular hoop balloon arch", "Tropical palm & monstera foliage", "Set of 3 glossy white plinths", "Plush lion, giraffe & monkey props", "Acrylic Welcome easel"]),
      isPopular: true,
      sortOrder: 5,
    },
    {
      slug: "pastel-butterfly-wonderland",
      title: "Pastel Butterfly Wonderland",
      category: "Girls",
      description: "Dreamy arched lavender backdrop with fluttering 3D butterflies, soft pink & lilac balloon cascade, fluted metallic pedestal, and garden flower baskets.",
      colorPalette: JSON.stringify(["#D8B4E2", "#FCE7F3", "#B89037", "#FFFFFF"]),
      heroImage: "/images/themes/theme_butterfly_wonderland.jpg",
      includedDecor: JSON.stringify(["Arched lilac backdrop board", "Cascading pastel balloon garland", "3D flutter butterflies assortment", "Fluted metallic cake plinth", "Woven floral floor baskets"]),
      isPopular: true,
      sortOrder: 6,
    },
    {
      slug: "speed-champion-racing-two",
      title: "Speed Champion (Racing to Two)",
      category: "Boys",
      description: "High-octane Formula 1 setup with racing red and black balloon arches, checkered foil balloons, race tire pedestals, trophy display, and illuminated giant number 2.",
      colorPalette: JSON.stringify(["#EF4444", "#000000", "#FFFFFF", "#F59E0B"]),
      heroImage: "/images/themes/theme_speed_champion.jpg",
      includedDecor: JSON.stringify(["Racing track graphic backdrop", "Red & black checkered balloon arch", "Illuminated 3D marquee number 2", "Checkered trophy pedestal", "Formula 1 tire props"]),
      isPopular: false,
      sortOrder: 7,
    },
    {
      slug: "royal-midnight-prince",
      title: "Royal Midnight Prince & Gold",
      category: "Luxury",
      description: "Regal midnight navy and mirror gold setup with gold illuminated royal crown backdrop, massive chrome balloon installation, and metallic cake plinths.",
      colorPalette: JSON.stringify(["#0A192F", "#D4AF37", "#1E3A8A", "#FFFFFF"]),
      heroImage: "/images/themes/theme_royal_midnight_prince.jpg",
      includedDecor: JSON.stringify(["Navy royal crest backdrop", "Illuminated neon crown motif", "Midnight navy & chrome gold balloon arch", "3 Gold mirror cylindrical plinths", "Monogram royal floor decal"]),
      isPopular: true,
      sortOrder: 8,
    },
  ];

  for (const theme of themesData) {
    await prisma.theme.create({ data: theme });
  }
  console.log("✅ Seed Themes created successfully.");

  // 5. CREATE SERVICES
  const servicesData = [
    {
      slug: "luxury-balloon-installations",
      title: "Luxury Organic Balloon Installations",
      category: "Decoration",
      description: "Custom color-matched balloon garlands, double-stuffed matte organic arches, balloon walls, and helium ceiling cascades.",
      priceType: "FIXED",
      basePriceMinor: 2500000, // PKR 25,000
      image: "/images/themes/theme_sunflower_sunshine.jpg",
      sortOrder: 1,
    },
    {
      slug: "custom-backdrop-architecture",
      title: "Custom 3D Backdrops & Shimmer Walls",
      category: "Decoration",
      description: "Curved velvet arches, acrylic boards with 3D personalized typography, iridescent shimmer panels, and slatted wood backdrops.",
      priceType: "FIXED",
      basePriceMinor: 3500000, // PKR 35,000
      image: "/images/themes/theme_lavender_dream.jpg",
      sortOrder: 2,
    },
    {
      slug: "themed-cake-table-styling",
      title: "Themed Cake Table & Pedestal Styling",
      category: "Decoration",
      description: "Fluted cylindrical pedestals, mirrored plinths, luxury cake stands, dessert carts, and matching floral accents.",
      priceType: "FIXED",
      basePriceMinor: 1800000, // PKR 18,000
      image: "/images/themes/theme_dusty_rose_bunny.jpg",
      sortOrder: 3,
    },
    {
      slug: "marquee-illuminated-lighting",
      title: "Illuminated Marquee Numbers & Ambient Lighting",
      category: "Lighting",
      description: "4-foot warm-bulb marquee letters and numbers, ambient LED uplighters, and neon celebration signage.",
      priceType: "FIXED",
      basePriceMinor: 1500000, // PKR 15,000
      image: "/images/themes/theme_royal_midnight_prince.jpg",
      sortOrder: 4,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.create({ data: s });
  }
  console.log("✅ Seed Services created successfully.");

  // 6. CREATE ADD-ONS
  const addonsData = [
    {
      slug: "pro-photography-3hr",
      title: "3-Hour Candid Event Photography",
      category: "Media",
      description: "High-end DSLR coverage, portrait sessions, candid moments, and 50+ professionally color-graded photos delivered in an online private gallery.",
      priceMinor: 1500000, // PKR 15,000
    },
    {
      slug: "cinematic-4k-video-reel",
      title: "Cinematic 4K Video Highlights & Reel",
      category: "Media",
      description: "1-minute social media highlight reel + 3-minute full 4K event summary video with licensed background score.",
      priceMinor: 2500000, // PKR 25,000
    },
    {
      slug: "custom-fondant-cake-2tier",
      title: "2-Tier Themed Fondant Birthday Cake (6 lbs)",
      category: "Catering",
      description: "Artisanal customized cake crafted to match your chosen theme. Flavors: Belgian Chocolate Fudge, Red Velvet, or Salted Caramel.",
      priceMinor: 1400000, // PKR 14,000
    },
    {
      slug: "giant-marquee-numbers",
      title: "Giant 4-Foot Light-Up Marquee Numbers",
      category: "Decor",
      description: "Warm-white vintage bulb marquee numbers representing the birthday age. Iconic photo opportunity centerpiece.",
      priceMinor: 600000, // PKR 6,000
    },
    {
      slug: "cold-spark-fireworks",
      title: "Cold Spark Pyro Machines (Set of 2)",
      category: "Effects",
      description: "100% indoor-safe, smoke-free cold spark fountain machines for grand entrance and cake-cutting moments.",
      priceMinor: 800000, // PKR 8,000
    },
    {
      slug: "kids-magic-puppet-show",
      title: "Kids Magic & Comedy Puppet Show (45 mins)",
      category: "Entertainment",
      description: "Professional interactive magic tricks, comedy puppet interactions, and audience participation that keeps children captivated.",
      priceMinor: 1200000, // PKR 12,000
    },
    {
      slug: "live-cotton-candy-popcorn",
      title: "Live Popcorn & Cotton Candy Carts",
      category: "Catering",
      description: "Vintage carnival-style live counter with unlimited freshly made butter popcorn and colorful cotton candy for 2 hours.",
      priceMinor: 1000000, // PKR 10,000
    },
  ];

  for (const addon of addonsData) {
    await prisma.addon.create({ data: addon });
  }
  console.log("✅ Seed Add-ons created successfully.");

  // 6. CREATE VENUES
  const venuesData = [
    {
      slug: "islamabad-club-banquets",
      name: "Islamabad Club & Marquee Suites",
      city: "Islamabad",
      address: "Main Murree Road, Near Club Road, Islamabad",
      capacity: 120,
      venueType: "Indoor Luxury Hall",
      feeMinor: 5000000, // PKR 50,000
      description: "Prestigious indoor banquet suite with chandeliers, high ceilings, and full climate control.",
    },
    {
      slug: "monal-margalla-lawn",
      name: "Margalla Terraced Event Lawn",
      city: "Islamabad",
      address: "Daman-e-Koh / Margalla Hills Road, Islamabad",
      capacity: 150,
      venueType: "Outdoor Mountain View Terrace",
      feeMinor: 6500000, // PKR 65,000
      description: "Panoramic city views and cool mountain breeze ideal for scenic afternoon and sunset birthday setups.",
    },
    {
      slug: "bahria-grand-lawn-rawalpindi",
      name: "Bahria Grand Garden Terrace",
      city: "Rawalpindi",
      address: "Civic Center, Bahria Town Phase 7, Rawalpindi",
      capacity: 100,
      venueType: "Garden & Indoor Combo",
      feeMinor: 4000000, // PKR 40,000
      description: "Lush private garden with paved gazebo area perfect for family celebrations in Rawalpindi.",
    },
    {
      slug: "private-residence-venue",
      name: "Customer's Private Residence / Farmhouse",
      city: "Islamabad",
      address: "Your home, lounge, terrace or farmhouse in Islamabad/Rawalpindi",
      capacity: 200,
      venueType: "Home / Private Space",
      feeMinor: 0, // No venue fee
      description: "We bring the entire setup to your residence, villa, or rented farmhouse at zero extra venue cost.",
    },
  ];

  for (const venue of venuesData) {
    await prisma.venue.create({ data: venue });
  }
  console.log("✅ Seed Venues created successfully.");

  // 7. CREATE SAMPLE BOOKINGS
  const pkg1 = await prisma.package.findFirst({ where: { slug: "grand-royal-celebration" } });
  const theme1 = await prisma.theme.findFirst({ where: { slug: "royal-midnight-prince" } });
  const venue1 = await prisma.venue.findFirst({ where: { slug: "islamabad-club-banquets" } });

  if (customer1.customerProfile && pkg1 && theme1 && venue1) {
    const booking1 = await prisma.booking.create({
      data: {
        reference: "AR-2026-1042",
        customerId: customer1.customerProfile.id,
        eventType: "Birthday",
        eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days ahead
        startTime: "18:00",
        endTime: "22:00",
        guestCount: 50,
        city: "Islamabad",
        venueLocation: "Islamabad Club & Marquee Suites, F-6 Islamabad",
        packageId: pkg1.id,
        themeId: theme1.id,
        venueId: venue1.id,
        status: "CONFIRMED",
        basePriceMinor: pkg1.basePriceMinor,
        addonsTotalMinor: 2100000, // Photography + Marquee numbers
        venueFeeMinor: venue1.feeMinor,
        travelFeeMinor: 0,
        discountMinor: 500000, // PKR 5,000 discount
        taxMinor: 0,
        totalAmountMinor: 19100000, // PKR 191,000
        depositRequiredMinor: 5000000, // PKR 50,000
        amountPaidMinor: 5000000,
        balanceDueMinor: 14100000,
        specialRequests: "Please ensure cake cutting table is centered beneath the balloon arch with warm spotlights.",
        internalNotes: "Decor team: Lead Hamza Ali. Setup begins at 3:00 PM sharp.",
        items: {
          create: [
            {
              itemType: "PACKAGE",
              itemId: pkg1.id,
              name: pkg1.title,
              unitPriceMinor: pkg1.basePriceMinor,
              quantity: 1,
              totalPriceMinor: pkg1.basePriceMinor,
            },
            {
              itemType: "ADDON",
              name: "3-Hour Candid Event Photography",
              unitPriceMinor: 1500000,
              quantity: 1,
              totalPriceMinor: 1500000,
            },
            {
              itemType: "ADDON",
              name: "Giant 4-Foot Light-Up Marquee Numbers",
              unitPriceMinor: 600000,
              quantity: 1,
              totalPriceMinor: 600000,
            },
            {
              itemType: "VENUE_FEE",
              name: "Venue Reservation: Islamabad Club",
              unitPriceMinor: venue1.feeMinor,
              quantity: 1,
              totalPriceMinor: venue1.feeMinor,
            },
          ],
        },
        payments: {
          create: [
            {
              amountMinor: 5000000,
              currency: "PKR",
              paymentType: "DEPOSIT",
              paymentMethod: "BANK_TRANSFER",
              status: "PAID",
              providerRef: "MBL-TRX-89320148",
              notes: "Initial 50K advance deposit verified via Meezan Bank transfer slip.",
              paidAt: new Date(),
            },
          ],
        },
        invoices: {
          create: [
            {
              invoiceNumber: "INV-2026-0001",
              customerName: customer1.name,
              customerEmail: customer1.email,
              customerPhone: customer1.phone,
              customerAddress: customer1.customerProfile.address,
              subtotalMinor: 19600000,
              discountMinor: 500000,
              totalAmountMinor: 19100000,
              amountPaidMinor: 5000000,
              balanceDueMinor: 14100000,
              status: "PARTIALLY_PAID",
              dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
              items: {
                create: [
                  {
                    description: "Grand Royal Celebration Birthday Package",
                    unitPriceMinor: 12500000,
                    quantity: 1,
                    totalPriceMinor: 12500000,
                  },
                  {
                    description: "3-Hour Candid Event Photography",
                    unitPriceMinor: 1500000,
                    quantity: 1,
                    totalPriceMinor: 1500000,
                  },
                  {
                    description: "Giant 4-Foot Light-Up Marquee Numbers",
                    unitPriceMinor: 600000,
                    quantity: 1,
                    totalPriceMinor: 600000,
                  },
                  {
                    description: "Venue Fee - Islamabad Club Banquets",
                    unitPriceMinor: 5000000,
                    quantity: 1,
                    totalPriceMinor: 5000000,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    console.log(`✅ Sample Booking ${booking1.reference} seeded with invoice and payment.`);
  }

  // 8. CREATE REVIEWS
  const reviewsData = [
    {
      authorName: "Ayesha Malik",
      authorLocation: "F-7/2, Islamabad",
      rating: 5,
      eventTitle: "Zayd's 1st Birthday - Safari Theme",
      comment: "AR Events Co. delivered beyond our wildest expectations! The balloon garland and life-sized safari cutouts looked like they came straight out of a luxury magazine. The entire setup in our Islamabad residence was completed 3 hours before guests arrived. Highly recommended!",
      isVerified: true,
      isFeatured: true,
    },
    {
      authorName: "Brig. (R) Tariq Mahmood",
      authorLocation: "DHA Phase 2, Islamabad",
      rating: 5,
      eventTitle: "Grand 50th Milestone Birthday",
      comment: "Superb execution, polite staff, and impeccable attention to detail. The midnight navy and gold theme with marquee numbers added such a refined elegance to the evening. Abdul Rehman and his team are true professionals in the twin cities.",
      isVerified: true,
      isFeatured: true,
    },
    {
      authorName: "Mahnoor & Bilal",
      authorLocation: "Bahria Town Phase 4, Rawalpindi",
      rating: 5,
      eventTitle: "Princess Castle 5th Birthday",
      comment: "Our daughter was mesmerized by the castle backdrop and balloon clouds. Dealing with AR Events Co. was effortless—from online booking to the final clean-up. Best birthday event planners in Rawalpindi!",
      isVerified: true,
      isFeatured: true,
    },
  ];

  for (const review of reviewsData) {
    await prisma.review.create({ data: review });
  }
  console.log("✅ Seed Reviews created successfully.");

  // 9. CREATE FAQS
  const faqsData = [
    {
      question: "Which areas in Islamabad and Rawalpindi do you serve?",
      answer: "We cover all sectors of Islamabad (F, G, E, H, I, Bani Gala, Chak Shahzad, Park View, Bahria Enclave) and all zones of Rawalpindi including Bahria Town (Phases 1-8), DHA (Phases 1-5), Cantt, Satellite Town, and surrounding locations.",
      category: "General",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      question: "How far in advance should I book my birthday celebration?",
      answer: "We recommend booking at least 1 to 2 weeks in advance to secure your preferred date and time slot. For bespoke custom themes or weekend dates, 3 weeks notice is optimal.",
      category: "Booking",
      isFeatured: true,
      sortOrder: 2,
    },
    {
      question: "Can I customize a package with specific colors, cake, and extra decor?",
      answer: "Absolutely! Our online booking platform allows you to pick your base package, select custom themes, add extra entertainment, photography, marquee numbers, and specify bespoke color palettes.",
      category: "Customization",
      isFeatured: true,
      sortOrder: 3,
    },
    {
      question: "What is your payment policy and deposit requirement?",
      answer: "We require an advance deposit (typically PKR 20,000 - 50,000 depending on package size) upon booking confirmation to secure the date and begin decor production. The remaining balance can be settled on the day of the event.",
      category: "Pricing",
      isFeatured: true,
      sortOrder: 4,
    },
  ];

  for (const faq of faqsData) {
    await prisma.faq.create({ data: faq });
  }
  console.log("✅ Seed FAQs created successfully.");

  // 9.5 CREATE GALLERY MEDIA ASSETS
  const galleryAssetsData = [
    {
      title: "Ayra's 1st Birthday Garden Lawn Setup",
      caption: "Lilac circular backdrop arch with 3D ONE marquee letters in Islamabad F-8 garden.",
      altText: "Outdoor luxury birthday decoration setup in Islamabad with Margalla hills backdrop",
      url: "/images/hero/hero_birthday_lawn.jpg",
      category: "Outdoor Events",
      tags: "Outdoor, Lawn, 1st Birthday, Lavender, Islamabad",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      title: "Lavender Dream Princess Stage",
      caption: "Soft lilac and royal purple circular arch with organic balloon garlands and fluted plinths.",
      altText: "Lilac and violet princess birthday backdrop setup in Islamabad",
      url: "/images/themes/theme_lavender_dream.jpg",
      category: "Kids Birthdays",
      tags: "Girls, Princess, Pastel, Lavender, Stage",
      isFeatured: true,
      sortOrder: 2,
    },
    {
      title: "Golden Sunflower Sunshine Setup",
      caption: "Natural wood slat backdrop with neon 'Happy Birthday' and giant wooden ONE blocks.",
      altText: "Golden sunflower rustic theme birthday decoration in Rawalpindi",
      url: "/images/themes/theme_sunflower_sunshine.jpg",
      category: "Themes",
      tags: "Sunflowers, Rustic, Neon, 1st Birthday, Wooden",
      isFeatured: true,
      sortOrder: 3,
    },
    {
      title: "Enchanted Dusty Rose Bunny Backdrop",
      caption: "Velvet arch panels, floral meadow beds, and Peter Rabbit character props in Islamabad residence.",
      altText: "Dusty rose storybook bunny themed birthday stage setup",
      url: "/images/themes/theme_dusty_rose_bunny.jpg",
      category: "Luxury Events",
      tags: "Dusty Rose, Bunny, Floral, High-End, Velvet",
      isFeatured: true,
      sortOrder: 4,
    },
    {
      title: "Vintage Little Racer Grand Prix",
      caption: "Beep Beep! I'm ONE! backdrop with checkered floor runners and retro roadsters.",
      altText: "Vintage race car themed first birthday decor setup in Bahria Town Rawalpindi",
      url: "/images/themes/theme_vintage_racer.jpg",
      category: "Kids Birthdays",
      tags: "Boys, Racing, Checkered, 1st Birthday, Props",
      isFeatured: false,
      sortOrder: 5,
    },
    {
      title: "Jungle Safari Kingdom Hoop",
      caption: "Circular balloon hoop of sage green and gold balloons with lifelike plush safari animals.",
      altText: "Jungle safari animal birthday party decor in DHA Islamabad",
      url: "/images/themes/theme_jungle_safari.jpg",
      category: "Balloon Decor",
      tags: "Safari, Jungle, Animals, Green, Gold, Balloons",
      isFeatured: true,
      sortOrder: 6,
    },
    {
      title: "Pastel Butterfly Wonderland",
      caption: "Whimsical pastel pink, lilac, and gold butterfly stage with cascading balloon clouds.",
      altText: "Pastel butterfly wonderland birthday setup in Islamabad Club",
      url: "/images/themes/theme_butterfly_wonderland.jpg",
      category: "Luxury Events",
      tags: "Butterflies, Pastel, Girls, Clouds, Luxury",
      isFeatured: false,
      sortOrder: 7,
    },
    {
      title: "Royal Midnight Prince & Gold Banquet",
      caption: "Regal midnight navy and gold mirror finish stage with glowing crown motif and mirror plinths.",
      altText: "Midnight navy and mirror chrome gold royal prince birthday banquet setup",
      url: "/images/themes/theme_royal_midnight_prince.jpg",
      category: "Luxury Events",
      tags: "Royal, Navy, Gold, Mirror Plinths, Milestone, Banquets",
      isFeatured: true,
      sortOrder: 8,
    },
    {
      title: "Speed Champion Two Fast",
      caption: "Racing to Two Formula 1 inspired party setup with illuminated marquee 2 and tire plinths.",
      altText: "Formula 1 racing champion second birthday celebration decor in Rawalpindi",
      url: "/images/themes/theme_speed_champion.jpg",
      category: "Kids Birthdays",
      tags: "Racing, Red, Black, Marquee Numbers, Boys",
      isFeatured: false,
      sortOrder: 9,
    },
  ];

  for (const asset of galleryAssetsData) {
    await prisma.mediaAsset.create({ data: asset });
  }
  console.log("✅ Seed Media Assets created successfully.");

  // 10. CREATE COUPONS
  await prisma.coupon.create({
    data: {
      code: "ISLAMABAD10",
      description: "10% off for Islamabad & Rawalpindi online birthday bookings",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderMinor: 4000000,
      maxUses: 200,
    },
  });
  console.log("✅ Seed Coupons created successfully.");

  // 11. CREATE INVENTORY ITEMS
  const inventoryData = [
    {
      sku: "ARCH-LILAC-01",
      name: "8ft Circular Lilac Wooden Backdrop Board",
      category: "Backdrops",
      image: "/images/themes/theme_lavender_dream.jpg",
      totalQuantity: 2,
      availableQuantity: 2,
      condition: "Excellent",
      location: "Islamabad Sector I-9 Warehouse",
      costMinor: 4500000,
      status: "AVAILABLE",
    },
    {
      sku: "SLAT-WOOD-01",
      name: "Tri-Fold Natural Slatted Wooden Screen Backdrop",
      category: "Backdrops",
      image: "/images/themes/theme_sunflower_sunshine.jpg",
      totalQuantity: 2,
      availableQuantity: 2,
      condition: "Excellent",
      location: "Islamabad Sector I-9 Warehouse",
      costMinor: 5500000,
      status: "AVAILABLE",
    },
    {
      sku: "ARCH-DUSTY-01",
      name: "Semicircular Dusty Rose Velvet Panel Arch",
      category: "Backdrops",
      image: "/images/themes/theme_dusty_rose_bunny.jpg",
      totalQuantity: 2,
      availableQuantity: 1,
      condition: "Excellent",
      location: "Islamabad Sector I-9 Warehouse",
      costMinor: 6500000,
      status: "AVAILABLE",
    },
    {
      sku: "HOOP-JUNGLE-01",
      name: "8ft Freestanding Gold Circular Balloon Hoop",
      category: "Backdrops",
      image: "/images/themes/theme_jungle_safari.jpg",
      totalQuantity: 3,
      availableQuantity: 3,
      condition: "Excellent",
      location: "Islamabad Sector I-9 Warehouse",
      costMinor: 3500000,
      status: "AVAILABLE",
    },
    {
      sku: "NEON-HBD-01",
      name: "Warm White Neon 'Happy Birthday' Sign",
      category: "Lighting",
      totalQuantity: 4,
      availableQuantity: 3,
      condition: "Excellent",
      location: "Tech Storage Room A",
      costMinor: 1800000,
      status: "AVAILABLE",
    },
    {
      sku: "MARQ-ONE-01",
      name: "Giant 4ft 3D Wooden 'ONE' Marquee Letters",
      category: "Props",
      totalQuantity: 3,
      availableQuantity: 2,
      condition: "Excellent",
      location: "Prop Room B",
      costMinor: 3000000,
      status: "AVAILABLE",
    },
    {
      sku: "PLINTH-WHITE-01",
      name: "Glossy White Fluted Cylinder Plinths (Set of 3)",
      category: "Cake Stands",
      totalQuantity: 6,
      availableQuantity: 5,
      condition: "Excellent",
      location: "Furniture Storage",
      costMinor: 2800000,
      status: "AVAILABLE",
    },
    {
      sku: "PLINTH-GOLD-01",
      name: "Mirror Finish Chrome Gold Cake Pedestals (Set of 3)",
      category: "Cake Stands",
      totalQuantity: 3,
      availableQuantity: 3,
      condition: "Excellent",
      location: "Luxury Vault",
      costMinor: 4800000,
      status: "AVAILABLE",
    },
  ];

  for (const inv of inventoryData) {
    await prisma.inventoryItem.create({ data: inv });
  }
  console.log("✅ Seed Inventory Items created successfully.");

  // 12. CREATE TEAMS
  const teamsData = [
    {
      name: "Alpha Decor Crew (Islamabad West)",
      zone: "Islamabad",
      leadStaffName: "Hamza Ali",
      leadPhone: "+92 300 8941234",
      memberCount: 4,
      status: "ACTIVE",
      notes: "Specializes in large outdoor garden setups and floral meadow installations.",
    },
    {
      name: "Bravo Team (Rawalpindi & Bahria)",
      zone: "Rawalpindi",
      leadStaffName: "Zubair Ahmed",
      leadPhone: "+92 302 4589123",
      memberCount: 4,
      status: "ACTIVE",
      notes: "Fast turnaround squad for indoor banquet halls and home lounges.",
    },
  ];

  for (const team of teamsData) {
    await prisma.team.create({ data: team });
  }
  console.log("✅ Seed Teams created successfully.");

  // 13. CREATE CRM INQUIRIES
  const inquiriesData = [
    {
      name: "Farah Hashmi",
      email: "farah.hashmi@gmail.com",
      phone: "+92 321 5566778",
      city: "Islamabad",
      eventType: "1st Birthday Party",
      preferredTheme: "Lavender Dream & Purple Princess",
      budgetMinor: 6000000,
      message: "Looking for an outdoor birthday decoration setup in our garden in Sector F-7 for approximately 40 guests. Need a custom cake table and marquee numbers.",
      status: "NEW",
    },
    {
      name: "Imran Siddiqui",
      email: "imran.siddiqui@yahoo.com",
      phone: "+92 333 4455667",
      city: "Rawalpindi",
      eventType: "2nd Birthday Party",
      preferredTheme: "Vintage Little Racer",
      budgetMinor: 5000000,
      message: "Need a race car birthday theme at Bahria Town Phase 7 for next month.",
      status: "CONTACTED",
      notes: "Followed up via WhatsApp. Client will confirm date after venue availability.",
    },
  ];

  for (const inq of inquiriesData) {
    await prisma.inquiry.create({ data: inq });
  }
  console.log("✅ Seed Inquiries created successfully.");

  // 14. CREATE LOCAL SEO LOCATION PAGES
  const locationPagesData = [
    {
      slug: "islamabad",
      name: "Islamabad",
      city: "Islamabad",
      headline: "Premier Birthday Decoration & Event Planning in Islamabad",
      subheadline: "Turnkey birthday setups delivered to Sector F-6, F-7, F-8, E-11, G-11, I-8, Bani Gala & Chak Shahzad.",
      introContent: "AR Events Co. is Islamabad's leading luxury birthday styling company. From intimate home living room setups to grand outdoor lawn celebrations against the Margalla Hills, we provide bespoke 3D circular arches, organic double-stuffed balloon installations, personalized acrylic name boards, and ambient evening uplighting.",
      coverageAreas: JSON.stringify(["Sector F-6", "Sector F-7", "Sector F-8", "Sector F-10", "Sector F-11", "Sector E-7", "Sector E-11", "Sector G-10", "Sector G-11", "Sector G-13", "Sector I-8", "Bani Gala", "Chak Shahzad", "Park View City", "Bahria Enclave"]),
      featuredImage: "/images/hero/hero_birthday_lawn.jpg",
      seoTitle: "Birthday Decoration Islamabad | Top Event Decorators | AR Events Co.",
      seoDescription: "Luxury birthday decoration and party styling across Islamabad. Thematic 3D backdrops, organic balloon arches, marquee numbers, and cakes in F-6, F-7, F-8, E-11 & Bani Gala.",
      focusKeyword: "birthday decoration Islamabad",
      secondaryKeywords: JSON.stringify(["birthday decorators Islamabad", "birthday party planning Islamabad", "kids birthday themes Islamabad", "balloon decoration Islamabad"]),
      canonicalUrl: "https://areventsco.com/locations/islamabad",
      ogImage: "/images/hero/hero_birthday_lawn.jpg",
      sortOrder: 1,
    },
    {
      slug: "rawalpindi",
      name: "Rawalpindi",
      city: "Rawalpindi",
      headline: "Luxury Birthday Event Styling & Decor in Rawalpindi",
      subheadline: "Full event production across Bahria Town, DHA, Satellite Town, Cantt, Chaklala & PWD.",
      introContent: "Celebrate your child's first birthday or special milestone with Rawalpindi's highest-rated event stylists. AR Events Co. brings commercial-grade party props, illuminated marquee letters, custom tiered bakery masterpieces, and professional event photography right to your doorstep or banquet hall in Rawalpindi.",
      coverageAreas: JSON.stringify(["Bahria Town (Phases 1-8)", "DHA Rawalpindi (Phases 1-5)", "Satellite Town", "Rawalpindi Cantt", "Chaklala Scheme 3", "PWD Housing Society", "Askari (All Schemes)", "Gulraiz Housing Society"]),
      featuredImage: "/images/themes/theme_vintage_racer.jpg",
      seoTitle: "Birthday Decoration Rawalpindi | Event Planners | AR Events Co.",
      seoDescription: "Professional birthday decoration in Rawalpindi. Serving Bahria Town, DHA, Satellite Town, Cantt & PWD with custom backdrops, balloon garlands & party packages.",
      focusKeyword: "birthday decoration Rawalpindi",
      secondaryKeywords: JSON.stringify(["birthday decorators Rawalpindi", "kids birthday party Rawalpindi", "balloon decoration Bahria Town Rawalpindi", "event planners Rawalpindi"]),
      canonicalUrl: "https://areventsco.com/locations/rawalpindi",
      ogImage: "/images/themes/theme_vintage_racer.jpg",
      sortOrder: 2,
    },
    {
      slug: "bahria-town",
      name: "Bahria Town Islamabad & Rawalpindi",
      city: "Rawalpindi",
      headline: "Bespoke Birthday Decoration in Bahria Town (Phases 1–8)",
      subheadline: "Specialized mobile decor crews operating daily in Bahria Town Phase 1 to Phase 8, Safari Villas & Garden City.",
      introContent: "Living in Bahria Town? AR Events Co. maintains dedicated rapid-setup decor crews stationed in Bahria Town. Whether booking a grand outdoor birthday pavilion in Civic Center or styling an intimate living room lounge party, we guarantee on-time 3-hour setup and seamless post-event packdown.",
      coverageAreas: JSON.stringify(["Bahria Town Phase 1", "Bahria Town Phase 2", "Bahria Town Phase 3", "Bahria Town Phase 4", "Bahria Town Phase 7", "Bahria Town Phase 8", "Safari Villas", "Garden City", "Executive Lodges"]),
      featuredImage: "/images/themes/theme_royal_midnight_prince.jpg",
      seoTitle: "Birthday Decoration Bahria Town Islamabad & Rawalpindi | AR Events Co.",
      seoDescription: "Top-rated birthday decoration service in Bahria Town Phases 1-8. Custom backdrops, balloon architecture, cakes & photography with on-time delivery.",
      focusKeyword: "birthday decoration Bahria Town",
      secondaryKeywords: JSON.stringify(["birthday planner Bahria Town Phase 7", "birthday party Bahria Town Phase 4", "balloon arch Bahria Town"]),
      canonicalUrl: "https://areventsco.com/locations/bahria-town",
      ogImage: "/images/themes/theme_royal_midnight_prince.jpg",
      sortOrder: 3,
    },
    {
      slug: "dha-islamabad",
      name: "DHA Islamabad & Rawalpindi",
      city: "Islamabad",
      headline: "Signature Birthday Event Decor in DHA Islamabad (Phases 1–5)",
      subheadline: "High-end party styling in DHA Phase 1, Phase 2, Phase 3, Phase 5 & DHA Valley.",
      introContent: "Exquisite birthday party decoration for residences, terraces, and clubhouses across DHA Islamabad. Our design team curates high-aesthetic color palettes, mirror acrylic pedestals, floral runners, and professional stage sound tailored for milestone celebrations.",
      coverageAreas: JSON.stringify(["DHA Phase 1", "DHA Phase 2 (Sector A to J)", "DHA Phase 3", "DHA Phase 5", "DHA Valley", "DHA Phase 2 Extension"]),
      featuredImage: "/images/themes/theme_dusty_rose_bunny.jpg",
      seoTitle: "Birthday Decoration DHA Islamabad & Rawalpindi | AR Events Co.",
      seoDescription: "Luxury birthday decoration in DHA Islamabad Phases 1, 2, 3, 5. Thematic 3D backdrops, marquee light numbers & high-end balloon styling.",
      focusKeyword: "birthday decoration DHA Islamabad",
      secondaryKeywords: JSON.stringify(["birthday planners DHA Islamabad", "kids party DHA Phase 2", "event decorators DHA Rawalpindi"]),
      canonicalUrl: "https://areventsco.com/locations/dha-islamabad",
      ogImage: "/images/themes/theme_dusty_rose_bunny.jpg",
      sortOrder: 4,
    },
  ];

  for (const loc of locationPagesData) {
    await prisma.locationPage.create({ data: loc });
  }
  console.log("✅ Seed Location Pages created successfully.");

  // 15. CREATE 301 REDIRECTS
  const redirectsData = [
    {
      fromPath: "/birthday-decorations",
      toPath: "/services",
      statusCode: 301,
      notes: "Legacy URL redirect to Services catalog",
    },
    {
      fromPath: "/birthday-planner-islamabad",
      toPath: "/locations/islamabad",
      statusCode: 301,
      notes: "Localized keyword shortcut to Islamabad hub",
    },
    {
      fromPath: "/birthday-planner-rawalpindi",
      toPath: "/locations/rawalpindi",
      statusCode: 301,
      notes: "Localized keyword shortcut to Rawalpindi hub",
    },
    {
      fromPath: "/birthday-themes",
      toPath: "/themes",
      statusCode: 301,
      notes: "Theme shortcut redirect",
    },
  ];

  for (const red of redirectsData) {
    await prisma.redirect.create({ data: red });
  }
  console.log("✅ Seed Redirects created successfully.");

  // 16. CREATE CORE CMS PAGES WITH SEO
  const corePages = [
    {
      slug: "home",
      title: "Home",
      metaTitle: "Birthday Decoration in Islamabad & Rawalpindi | AR Events Co.",
      metaDescription: "AR Events Co. is Islamabad and Rawalpindi's premier luxury birthday decoration and event planning company. Book custom themes, balloon decor, backdrops, and party packages online.",
      focusKeyword: "birthday decoration Islamabad",
      canonicalUrl: "https://areventsco.com",
    },
    {
      slug: "packages",
      title: "Birthday Packages",
      metaTitle: "Birthday Decoration Packages in Islamabad & Rawalpindi | AR Events Co.",
      metaDescription: "Explore all-inclusive birthday decoration packages with transparent pricing in PKR. Luxury 3D backdrops, balloon styling, cakes, photography, and setup included.",
      focusKeyword: "birthday decoration packages Islamabad",
      canonicalUrl: "https://areventsco.com/packages",
    },
    {
      slug: "themes",
      title: "Birthday Themes",
      metaTitle: "Birthday Decoration Themes & Ideas in Islamabad | AR Events Co.",
      metaDescription: "Browse over 8 bespoke birthday themes: Lavender Princess, Jungle Safari, Sunflower Sunshine, Vintage Racer, and Royal Midnight Prince in Islamabad & Rawalpindi.",
      focusKeyword: "birthday themes Islamabad",
      canonicalUrl: "https://areventsco.com/themes",
    },
    {
      slug: "services",
      title: "Services",
      metaTitle: "Birthday Event Services in Islamabad & Rawalpindi | AR Events Co.",
      metaDescription: "A la carte birthday services: Photography, 4K Videography, Custom Fondant Cakes, Magic Shows, Balloon Garlands, and Sound Systems across Islamabad & Rawalpindi.",
      focusKeyword: "birthday services Islamabad",
      canonicalUrl: "https://areventsco.com/services",
    },
    {
      slug: "venues",
      title: "Partner Venues",
      metaTitle: "Birthday Party Venues in Islamabad & Rawalpindi | AR Events Co.",
      metaDescription: "Top partner birthday venues and banquet halls in Islamabad & Rawalpindi, plus turnkey private home and farmhouse decoration services.",
      focusKeyword: "birthday party venues Islamabad",
      canonicalUrl: "https://areventsco.com/venues",
    },
    {
      slug: "gallery",
      title: "Celebration Gallery",
      metaTitle: "Real Birthday Decoration Gallery in Islamabad & Rawalpindi | AR Events Co.",
      metaDescription: "View real event photos of our luxury birthday setups, balloon arches, and marquee numbers delivered across Islamabad and Rawalpindi.",
      focusKeyword: "birthday decoration ideas Islamabad",
      canonicalUrl: "https://areventsco.com/gallery",
    },
    {
      slug: "faq",
      title: "Frequently Asked Questions",
      metaTitle: "Birthday Planning FAQs Islamabad & Rawalpindi | AR Events Co.",
      metaDescription: "Answers to common questions about birthday planning, advance booking notice, package customization, payment terms, and twin cities coverage.",
      focusKeyword: "birthday event planner FAQs",
      canonicalUrl: "https://areventsco.com/faq",
    },
  ];

  for (const page of corePages) {
    await prisma.page.create({
      data: {
        slug: page.slug,
        title: page.title,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        focusKeyword: page.focusKeyword,
        canonicalUrl: page.canonicalUrl,
        isPublished: true,
      },
    });
  }
  console.log("✅ Seed Core CMS Pages with SEO created successfully.");

  // 17. CREATE GLOBAL SEO SETTINGS
  const seoSettings = [
    { key: "seo_site_title", value: "AR Events Co. | Premium Birthday & Event Planning Islamabad & Rawalpindi", group: "seo" },
    { key: "seo_default_description", value: "Your Celebration, Our Passion. Islamabad and Rawalpindi's premier luxury birthday decoration and event styling service.", group: "seo" },
    { key: "seo_canonical_domain", value: "https://areventsco.com", group: "seo" },
    { key: "seo_default_og_image", value: "/images/hero/hero_birthday_lawn.jpg", group: "seo" },
    { key: "seo_business_name", value: "AR Events Co.", group: "seo" },
    { key: "seo_business_phone", value: "+92 300 8555123", group: "seo" },
    { key: "seo_business_whatsapp", value: "+92 300 8555123", group: "seo" },
    { key: "seo_business_email", value: "info@areventsco.com", group: "seo" },
    { key: "seo_business_address", value: "Sector F-7 / Blue Area & Bahria Town Phase 7", group: "seo" },
    { key: "seo_business_city", value: "Islamabad", group: "seo" },
    { key: "seo_geo_lat", value: "33.7294", group: "seo" },
    { key: "seo_geo_lng", value: "73.0931", group: "seo" },
    { key: "seo_opening_hours", value: "Mo-Su 10:00-22:00", group: "seo" },
    { key: "seo_google_site_verification", value: "google-site-verification-token", group: "seo" },
  ];

  for (const s of seoSettings) {
    await prisma.setting.create({
      data: {
        key: s.key,
        value: s.value,
        group: s.group,
        isPublic: true,
      },
    });
  }
  console.log("✅ Seed Global SEO Settings created successfully.");

  console.log("🚀 Complete Database Seeding Finished Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
