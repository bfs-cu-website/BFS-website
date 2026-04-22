import { useState, useEffect, useRef } from "react";
import { fetchEvents, type ApiEvent } from "@/lib/api";
import { events as staticEvents } from "@/data/events";

const POLL_INTERVAL_MS = 60_000;

export function useEvents() {
  const [events, setEvents] = useState<ApiEvent[]>(staticEvents);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function load() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await fetchEvents(controller.signal);
      if (!controller.signal.aborted) {
        setEvents(data);
        setLastUpdated(new Date());
      }
    } catch {
      // Keep existing data (static fallback or last successful fetch)
    }
  }

  useEffect(() => {
    load();

    const interval = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, []);

  return { events, lastUpdated };
}
