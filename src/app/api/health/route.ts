import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const timestamp = new Date().toISOString();
  let dbStatus = "disconnected";

  try {
    // Quick test query
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (error) {
    dbStatus = `unavailable: ${(error as Error).message}`;
  }

  return NextResponse.json({
    status: "ok",
    service: "AR Events Co. Platform API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp,
    system: {
      database: dbStatus,
      uptimeSeconds: Math.floor(process.uptime()),
    },
  });
}
