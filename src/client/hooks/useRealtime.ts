"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { RealtimeEventPayload, RealtimeEventType } from "@/lib/realtime/event-bus";

export type ConnectionState = "connecting" | "connected" | "disconnected" | "reconnecting";

interface UseRealtimeOptions {
  channels: string | string[];
  enabled?: boolean;
  onEvent?: (event: RealtimeEventPayload) => void;
  eventTypes?: RealtimeEventType[];
}

export function useRealtime({
  channels,
  enabled = true,
  onEvent,
  eventTypes,
}: UseRealtimeOptions) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [lastEvent, setLastEvent] = useState<RealtimeEventPayload | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const normalizedChannels = Array.isArray(channels) ? channels.join(",") : channels;

  const connect = useCallback(() => {
    if (!enabled || typeof window === "undefined" || !normalizedChannels) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setConnectionState((prev) => (prev === "connected" ? "reconnecting" : "connecting"));

    try {
      const url = `/api/realtime/stream?channel=${encodeURIComponent(normalizedChannels)}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onopen = () => {
        setConnectionState("connected");
        retryCountRef.current = 0;
      };

      es.onmessage = (e) => {
        try {
          if (!e.data || e.data.startsWith(":")) return;
          const payload: RealtimeEventPayload = JSON.parse(e.data);

          if (payload.type === "GENERAL_UPDATE" && payload.channel === "system") {
            setConnectionState("connected");
            return;
          }

          if (eventTypes && !eventTypes.includes(payload.type)) {
            return;
          }

          setLastEvent(payload);
          if (onEventRef.current) {
            onEventRef.current(payload);
          }
        } catch (err) {
          console.error("[useRealtime] Error parsing event payload:", err);
        }
      };

      es.onerror = () => {
        es.close();
        eventSourceRef.current = null;
        setConnectionState("reconnecting");

        // Exponential backoff with max 10s delay
        const retryDelay = Math.min(1000 * Math.pow(1.5, retryCountRef.current), 10000);
        retryCountRef.current += 1;

        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = setTimeout(() => {
          connect();
        }, retryDelay);
      };
    } catch (err) {
      console.error("[useRealtime] Connection error:", err);
      setConnectionState("disconnected");
    }
  }, [enabled, normalizedChannels, eventTypes]);

  useEffect(() => {
    connect();

    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setConnectionState("disconnected");
    };
  }, [connect]);

  return {
    isConnected: connectionState === "connected",
    connectionState,
    lastEvent,
    reconnect: connect,
  };
}
