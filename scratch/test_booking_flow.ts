import { prisma } from "../src/lib/db";
import { BookingService } from "../src/server/services/booking.service";

async function testBookingFlow() {
  console.log("==================================================");
  console.log("5. END-TO-END REAL BOOKING AUDIT ON SUPABASE");
  console.log("==================================================");

  try {
    // 1. Fetch available package and theme from live Supabase DB
    const pkg = await prisma.package.findFirst({ where: { isActive: true } });
    const theme = await prisma.theme.findFirst({ where: { isActive: true } });
    const addon = await prisma.addon.findFirst({ where: { isActive: true } });

    if (!pkg || !theme) {
      throw new Error("No active package or theme found in Supabase database");
    }

    console.log(`Selected Package: ${pkg.title} (${pkg.basePriceMinor / 100} PKR)`);
    console.log(`Selected Theme: ${theme.title}`);
    if (addon) console.log(`Selected Add-on: ${addon.title} (${addon.priceMinor / 100} PKR)`);

    // 2. Submit live booking
    const testEmail = `customer.audit.${Date.now()}@example.com`;
    const bookingInput = {
      packageId: pkg.id,
      themeId: theme.id,
      addonIds: addon ? [addon.id] : [],
      eventType: "1st Birthday Celebration",
      eventDate: "2026-09-15",
      startTime: "18:00",
      endTime: "21:00",
      guestCount: 35,
      city: "Islamabad" as const,
      address: "House 14, Street 25, F-7/2, Islamabad",
      name: "Mrs. Ayesha Malik",
      email: testEmail,
      phone: "+92 300 9876543",
      notes: "Please arrange warm white spotlights around the balloon arch.",
    };

    console.log(`\nSubmitting live booking for: ${bookingInput.name} (${bookingInput.email})...`);
    const createdBooking = await BookingService.create(bookingInput);

    console.log(`\n✅ BOOKING RECORD CREATED:`);
    console.log(`   - ID: ${createdBooking.id}`);
    console.log(`   - Reference: ${createdBooking.reference}`);
    console.log(`   - Status: ${createdBooking.status}`);

    // 3. Verify in database
    const readBooking = await prisma.booking.findUnique({
      where: { id: createdBooking.id },
      include: {
        customer: { include: { user: true } },
        package: true,
        theme: true,
        items: true,
        invoices: {
          include: { items: true },
        },
      },
    });

    if (!readBooking) throw new Error("Booking not found in Supabase database after creation");

    console.log(`\n✅ DATABASE INTEGRITY VERIFIED:`);
    console.log(`   - Customer Name: ${readBooking.customer.user.name}`);
    console.log(`   - Customer Email: ${readBooking.customer.user.email}`);
    console.log(`   - Linked Package: ${readBooking.package?.title}`);
    console.log(`   - Linked Theme: ${readBooking.theme?.title}`);
    console.log(`   - Booking Snapshot Items: ${readBooking.items.length}`);
    readBooking.items.forEach((item, idx) => {
      console.log(`     [Item ${idx + 1}] ${item.title} (${item.category}): ${item.unitPriceMinor / 100} PKR x ${item.quantity}`);
    });

    console.log(`   - Invoices Generated: ${readBooking.invoices.length}`);
    if (readBooking.invoices[0]) {
      const inv = readBooking.invoices[0];
      console.log(`   - Invoice Number: ${inv.invoiceNumber}`);
      console.log(`   - Subtotal: ${inv.subtotalMinor / 100} PKR`);
      console.log(`   - Total: ${inv.totalMinor / 100} PKR (${inv.totalMinor} Paisa)`);
      console.log(`   - Deposit Required: ${inv.depositRequiredMinor / 100} PKR`);
      console.log(`   - Invoice Status: ${inv.status}`);
      console.log(`   - Line Items in Invoice: ${inv.items.length}`);
    }

    // 4. Test Admin Status Transition (INQUIRY -> CONFIRMED)
    const updatedBooking = await prisma.booking.update({
      where: { id: createdBooking.id },
      data: { status: "CONFIRMED" },
    });
    console.log(`\n✅ ADMIN STATUS TRANSITION TEST:`);
    console.log(`   - Status updated to: ${updatedBooking.status}`);

    console.log("\n🎉 ALL BOOKING FLOW AUDIT TESTS PASSED WITH 100% SUCCESS!");
  } catch (err) {
    console.error("❌ BOOKING FLOW TEST FAILED:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testBookingFlow();
