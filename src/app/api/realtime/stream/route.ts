import { NextRequest, NextResponse } from "next/server";
import { eventBus, RealtimeEventPayload } from "@/lib/realtime/event-bus";
import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelsParam = searchParams.get("channel") || "general";
  const channels = channelsParam.split(",").map((c) => c.trim()).filter(Boolean);

  // Authentication & Channel Authorization
  const session = await getAuthSession();
  const isAdmin = session && ["ADMIN", "SUPER_ADMIN", "EVENT_MANAGER", "STAFF"].includes(session.role);

  // Filter channels based on authorization
  const authorizedChannels = channels.filter((ch) => {
    if (ch === "general" || ch === "system") return true; // Public channels
    if (ch === "admin") return isAdmin; // Admin-only channel
    if (ch.startsWith("booking:")) {
      // Allow live updates for active booking channels on checkout/tracking pages
      return true;
    }
    return isAdmin; // Default: admin-only for unknown channels
  });

  if (authorizedChannels.length === 0) {
    return NextResponse.json(
      { error: "Unauthorized: no accessible channels" },
      { status: 401 }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send initial connection established message
      const initPayload: RealtimeEventPayload = {
        id: `init_${Date.now()}`,
        type: "GENERAL_UPDATE",
        channel: "system",
        timestamp: new Date().toISOString(),
        data: { message: "Connected to AR Events Co. Real-Time Event Bus", channels: authorizedChannels },
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initPayload)}\n\n`));

      // 2. Event listener for subscribed channels
      const listener = (payload: RealtimeEventPayload) => {
        try {
          const chunk = `data: ${JSON.stringify(payload)}\n\n`;
          controller.enqueue(encoder.encode(chunk));
        } catch (err) {
          console.error("[REALTIME-SSE] Error enqueueing event:", err);
        }
      };

      // Subscribe to each authorized channel
      for (const ch of authorizedChannels) {
        eventBus.on(ch, listener);
      }

      // 3. Heartbeat ping every 15 seconds to prevent gateway / proxy timeout
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(pingInterval);
        }
      }, 15000);

      // 4. Clean up on client disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(pingInterval);
        for (const ch of authorizedChannels) {
          eventBus.off(ch, listener);
        }
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
