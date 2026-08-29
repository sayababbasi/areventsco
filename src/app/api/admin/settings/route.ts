import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    return NextResponse.json({ success: true, data: settingsMap });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // key-value object

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value, group: "general", isPublic: true },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
