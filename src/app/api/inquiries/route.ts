import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Rate limiting: max 5 inquiries per 15 minutes per IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = await rateLimit(`inquiry_${ip}`, 5, 15 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: "Too many inquiries submitted. Please try again later or contact via WhatsApp." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, city, eventType, preferredTheme, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "Please enter your name, phone number, and event details." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const lead = await prisma.inquiry.create({
      data: {
        name,
        email: email || "inquiry@customer.com",
        phone,
        city: city || "Islamabad",
        eventType: eventType || "Birthday Party",
        preferredTheme: preferredTheme || null,
        message,
        status: "NEW",
      },
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        title: "New Lead Received",
        message: `${name} (${phone}) submitted an inquiry for ${eventType || "Birthday"} in ${city || "Islamabad"}.`,
        channel: "IN_APP",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your celebration inquiry has been received. Our event coordinator will contact you shortly.",
      data: lead,
    });
  } catch (error: any) {
    console.error("Public Inquiry Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry. Please contact us via WhatsApp." },
      { status: 500 }
    );
  }
}
