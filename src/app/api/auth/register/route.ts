import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, city, address } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Name, email, and password are required" } },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: "USER_EXISTS", message: "An account with this email already exists" } },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: "CUSTOMER",
        customerProfile: {
          create: {
            city: city || "Islamabad",
            address: address ? address.trim() : null,
          },
        },
      },
    });

    const token = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
    });

    response.cookies.set("ar_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "REGISTRATION_FAILED", message: (error as Error).message } },
      { status: 500 }
    );
  }
}
