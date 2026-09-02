import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSessionToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Basic IP-based rate limiting: max 5 login attempts per 15 minutes
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = await rateLimit(`login_${ip}`, 5, 15 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many login attempts. Try again later." } },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_CREDENTIALS", message: "Email and password are required" } },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } },
        { status: 401 }
      );
    }

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

    // Set secure session cookie
    response.cookies.set("ar_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "AUTH_ERROR", message: (error as Error).message } },
      { status: 500 }
    );
  }
}
