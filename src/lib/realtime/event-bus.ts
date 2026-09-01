import { EventEmitter } from "events";

export type RealtimeEventType =
  | "BOOKING_CREATED"
  | "BOOKING_STATUS_UPDATED"
  | "PAYMENT_INITIATED"
  | "PAYMENT_COMPLETED"
  | "PAYMENT_FAILED"
  | "INVOICE_UPDATED"
  | "INVENTORY_CHANGED"
  | "GENERAL_UPDATE";

export interface RealtimeEventPayload {
  id: string;
  type: RealtimeEventType;
  channel: string;
  timestamp: string;
  data: Record<string, any>;
}

class RealtimeEventBus extends EventEmitter {
  constructor() {
    super();
    // Allow high number of concurrent listeners across active connections
    this.setMaxListeners(200);
  }

  /**
   * Broadcast an event to a specific channel and optionally to the admin channel.
   */
  public broadcast(
    type: RealtimeEventType,
    channel: string,
    data: Record<string, any>,
    broadcastToAdmin = true
  ): RealtimeEventPayload {
    const payload: RealtimeEventPayload = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      channel,
      timestamp: new Date().toISOString(),
      data,
    };

    // Emit on specific channel
    this.emit(channel, payload);

    // If channel is not admin and broadcastToAdmin is true, also emit on admin channel
    if (broadcastToAdmin && channel !== "admin") {
      this.emit("admin", { ...payload, targetChannel: channel });
    }

    return payload;
  }
}

// Preserve single instance across Next.js Fast Refresh in development
const globalForEventBus = globalThis as unknown as {
  realtimeEventBus?: RealtimeEventBus;
};

export const eventBus = globalForEventBus.realtimeEventBus || new RealtimeEventBus();

if (process.env.NODE_ENV !== "production") {
  globalForEventBus.realtimeEventBus = eventBus;
}
