import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const city = searchParams.get("city");
    const id = searchParams.get("id");

    // Single Customer Detail View
    if (id) {
      const customer = await prisma.customerProfile.findUnique({
        where: { id },
        include: {
          user: true,
          bookings: {
            orderBy: { eventDate: "desc" },
            include: {
              package: true,
              theme: true,
              venue: true,
              invoices: {
                include: { items: true },
              },
              payments: true,
              items: true,
            },
          },
          reviews: true,
        },
      });

      if (!customer) {
        return NextResponse.json({ success: false, error: "Customer not found." }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: customer });
    }

    // List View with Filtering & Computed Metrics
    const customers = await prisma.customerProfile.findMany({
      where: {
        AND: [
          city && city !== "ALL" ? { city } : {},
          search
            ? {
                OR: [
                  { user: { name: { contains: search } } },
                  { user: { email: { contains: search } } },
                  { user: { phone: { contains: search } } },
                  { address: { contains: search } },
                ],
              }
            : {},
        ],
      },
      include: {
        user: true,
        bookings: {
          include: {
            package: true,
            theme: true,
            payments: true,
            invoices: true,
          },
        },
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedCustomers = customers.map((c) => {
      const totalSpendMinor = c.bookings.reduce((sum, b) => sum + (b.amountPaidMinor || 0), 0);
      const totalBilledMinor = c.bookings.reduce((sum, b) => sum + (b.totalAmountMinor || 0), 0);
      const outstandingMinor = Math.max(0, totalBilledMinor - totalSpendMinor);
      const lastBooking = c.bookings[0] || null;

      return {
        id: c.id,
        userId: c.userId,
        name: c.user.name,
        email: c.user.email,
        phone: c.user.phone || "N/A",
        city: c.city || "Islamabad",
        address: c.address || "N/A",
        emergencyContact: c.emergencyContact || null,
        notes: c.notes || null,
        isActive: c.user.isActive,
        createdAt: c.createdAt,
        totalBookings: c.bookings.length,
        totalSpendMinor,
        outstandingMinor,
        lastBookingDate: lastBooking ? lastBooking.eventDate : null,
        lastBookingReference: lastBooking ? lastBooking.reference : null,
        bookings: c.bookings,
      };
    });

    const totalCustomers = formattedCustomers.length;
    const activeCustomers = formattedCustomers.filter((c) => c.isActive).length;
    const aggregateSpendMinor = formattedCustomers.reduce((sum, c) => sum + c.totalSpendMinor, 0);
    const aggregateOutstandingMinor = formattedCustomers.reduce((sum, c) => sum + c.outstandingMinor, 0);

    return NextResponse.json({
      success: true,
      data: formattedCustomers,
      summary: {
        totalCustomers,
        activeCustomers,
        aggregateSpendMinor,
        aggregateOutstandingMinor,
      },
    });
  } catch (error: any) {
    console.error("Customers API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, city, address, emergencyContact, notes } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "A user with this email address already exists." },
        { status: 400 }
      );
    }

    const temporaryPassword = await hashPassword("Customer@" + Math.floor(1000 + Math.random() * 9000));

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        passwordHash: temporaryPassword,
        role: "CUSTOMER",
        isActive: true,
        customerProfile: {
          create: {
            city: city || "Islamabad",
            address: address ? address.trim() : null,
            emergencyContact: emergencyContact ? emergencyContact.trim() : null,
            notes: notes ? notes.trim() : null,
          },
        },
      },
      include: { customerProfile: true },
    });

    return NextResponse.json({ success: true, data: user.customerProfile }, { status: 201 });
  } catch (error: any) {
    console.error("Create Customer Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, phone, city, address, emergencyContact, notes, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Customer ID is required." }, { status: 400 });
    }

    const customer = await prisma.customerProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found." }, { status: 404 });
    }

    // Update Customer Profile and linked User
    const [updatedProfile] = await prisma.$transaction([
      prisma.customerProfile.update({
        where: { id },
        data: {
          city: city !== undefined ? city : customer.city,
          address: address !== undefined ? address : customer.address,
          emergencyContact: emergencyContact !== undefined ? emergencyContact : customer.emergencyContact,
          notes: notes !== undefined ? notes : customer.notes,
        },
      }),
      prisma.user.update({
        where: { id: customer.userId },
        data: {
          name: name !== undefined ? name.trim() : customer.user.name,
          phone: phone !== undefined ? phone.trim() : customer.user.phone,
          isActive: isActive !== undefined ? isActive : customer.user.isActive,
        },
      }),
    ]);

    return NextResponse.json({ success: true, data: updatedProfile });
  } catch (error: any) {
    console.error("Update Customer Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Customer ID is required." }, { status: 400 });
    }

    const customer = await prisma.customerProfile.findUnique({
      where: { id },
      include: { bookings: true, user: true },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found." }, { status: 404 });
    }

    // If customer has bookings, soft-deactivate to protect financial and booking history
    if (customer.bookings.length > 0) {
      await prisma.user.update({
        where: { id: customer.userId },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: "Customer account deactivated (historical bookings and invoices preserved).",
      });
    }

    // If no bookings exist, safe to delete permanently
    await prisma.user.delete({
      where: { id: customer.userId },
    });

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully.",
    });
  } catch (error: any) {
    console.error("Delete Customer Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
