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
  await prisma.customerProfile.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.user.deleteMany();

  // 2. CREATE SEED USERS
  const defaultPassword = await bcrypt.hash("Password123!", 10);

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
      featuredImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
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
      featuredImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
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
      featuredImage: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
      features: JSON.stringify([
        "8ft x 8ft metallic gold shimmer wall or ribbed wooden panel",
        "Neon LED sign ('Happy Birthday' / Custom name)",
        "Giant 4ft illuminated marquee light-up age numbers",
        "Lush organic balloon garland with faux floral accents",
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
      featuredImage: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
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
      slug: "royal-navy-gold",
      title: "Royal Navy & Metallic Gold",
      category: "Adult Luxury & Milestones",
      description: "Our signature luxury colorway featuring deep midnight blues, metallic chrome gold balloons, and bespoke illuminated typography.",
      colorPalette: JSON.stringify(["#0A192F", "#D4AF37", "#1B365D", "#F4F4F0"]),
      heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      includedDecor: JSON.stringify(["Chrome gold balloons", "Navy drape backdrop", "Neon signage", "Marquee numbers"]),
      isPopular: true,
      sortOrder: 1,
    },
    {
      slug: "enchanted-princess-castle",
      title: "Enchanted Princess Castle",
      category: "Kids Birthday",
      description: "Fairytale dreamscape with pastel pinks, gold turrets, royal crests, and floral balloon clouds for little princesses.",
      colorPalette: JSON.stringify(["#FCE7F3", "#D4AF37", "#F472B6", "#FFFFFF"]),
      heroImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
      includedDecor: JSON.stringify(["Castle facade", "Pink & gold balloon arch", "Royal crown pedestals"]),
      isPopular: true,
      sortOrder: 2,
    },
    {
      slug: "wild-safari-adventure",
      title: "Wild One Safari Adventure",
      category: "Kids Birthday",
      description: "Jungle greenery, animal prints, wooden crates, and life-size giraffe/lion cutouts perfect for 1st to 5th birthdays.",
      colorPalette: JSON.stringify(["#064E3B", "#D97706", "#78350F", "#ECFDF5"]),
      heroImage: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80",
      includedDecor: JSON.stringify(["Safari Jeep cutout", "Tropical palm balloon installation", "Wooden plinths"]),
      isPopular: true,
      sortOrder: 3,
    },
    {
      slug: "astronaut-galaxy-odyssey",
      title: "Astronaut Galaxy Odyssey",
      category: "Kids Birthday",
      description: "Cosmic journey with deep space dark backdrops, glowing planet balloons, spaceship cutouts, and LED starfield lights.",
      colorPalette: JSON.stringify(["#0F172A", "#38BDF8", "#818CF8", "#F1F5F9"]),
      heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      includedDecor: JSON.stringify(["Rocket ship backdrop", "Galaxy balloon garland", "LED star projector"]),
      isPopular: false,
      sortOrder: 4,
    },
    {
      slug: "boho-pampas-rose-gold",
      title: "Boho Pampas & Rose Gold",
      category: "Milestone & Chic",
      description: "Earthy neutrals, dried pampas grass, macrame details, and warm rose gold accents for trendy young adult celebrations.",
      colorPalette: JSON.stringify(["#FDE047", "#FBCFE8", "#D97706", "#FEF3C7"]),
      heroImage: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
      includedDecor: JSON.stringify(["Natural dried pampas", "Wooden hexagon arch", "Macrame backdrop"]),
      isPopular: true,
      sortOrder: 5,
    },
  ];

  for (const theme of themesData) {
    await prisma.theme.create({ data: theme });
  }
  console.log("✅ Seed Themes created successfully.");

  // 5. CREATE SERVICES & ADD-ONS
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
  const theme1 = await prisma.theme.findFirst({ where: { slug: "royal-navy-gold" } });
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
    },
    {
      question: "How far in advance should I book my birthday celebration?",
      answer: "We recommend booking at least 1 to 2 weeks in advance to secure your preferred date and time slot. For bespoke custom themes or weekend dates, 3 weeks notice is optimal.",
      category: "Booking",
      isFeatured: true,
    },
    {
      question: "Can I customize a package with specific colors, cake, and extra decor?",
      answer: "Absolutely! Our online booking platform allows you to pick your base package, select custom themes, add extra entertainment, photography, marquee numbers, and specify bespoke color palettes.",
      category: "Customization",
      isFeatured: true,
    },
    {
      question: "What is your payment policy and deposit requirement?",
      answer: "We require an advance deposit (typically PKR 20,000 - 50,000 depending on package size) upon booking confirmation to secure the date and begin decor production. The remaining balance can be settled on the day of the event.",
      category: "Pricing",
      isFeatured: true,
    },
  ];

  for (const faq of faqsData) {
    await prisma.faq.create({ data: faq });
  }
  console.log("✅ Seed FAQs created successfully.");

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
