import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const staff = await prisma.staffProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, isActive: true } },
        _count: { select: { assignedBookings: true } },
      },
    });

    const teams = await prisma.team.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: { staff, teams } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, jobTitle, department, zone, memberCount } = body;

    // If creating a team
    if (body.type === "team") {
      const team = await prisma.team.create({
        data: {
          name,
          zone: zone || "Islamabad",
          leadStaffName: name,
          leadPhone: phone || null,
          memberCount: Number(memberCount) || 3,
        },
      });
      return NextResponse.json({ success: true, data: team });
    }

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required." }, { status: 400 });
    }

    // Create staff user & profile
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash: "$2a$10$w8TKnB3kXo4h5W3eNf4LdOQfN2Yq7r4FfW2gH8nJ9kJ0lP8mQ7yKa", // default temporary hash
        role: "STAFF",
        staffProfile: {
          create: {
            jobTitle: jobTitle || "Event Decorator",
            department: department || "Operations",
          },
        },
      },
      include: { staffProfile: true },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
