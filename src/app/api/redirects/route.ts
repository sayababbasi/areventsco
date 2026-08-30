import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ redirect: null });
    }

    const redirect = await prisma.redirect.findUnique({
      where: { fromPath: path },
    });

    if (redirect && redirect.isActive) {
      // Async increment hit count in background
      prisma.redirect
        .update({
          where: { id: redirect.id },
          data: { hitCount: { increment: 1 } },
        })
        .catch(() => {});

      return NextResponse.json({
        redirect: {
          toPath: redirect.toPath,
          statusCode: redirect.statusCode,
        },
      });
    }

    return NextResponse.json({ redirect: null });
  } catch (error) {
    return NextResponse.json({ redirect: null });
  }
}
