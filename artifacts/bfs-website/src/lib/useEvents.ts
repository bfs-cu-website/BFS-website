import { useState, useEffect, useRef } from "react";
import { fetchEvents, type ApiEvent } from "@/lib/api";
import { events as staticEvents } from "@/data/events";

const POLL_INTERVAL_MS = 60_000;

export function useEvents() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const initializedRef = useRef(false);

  async function load() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await fetchEvents(controller.signal);
      if (!controller.signal.aborted) {
        setEvents(data);
        setLastUpdated(new Date());
        setLoading(false);
        initializedRef.current = true;
      }
    } catch {
      if (!controller.signal.aborted && !initializedRef.current) {
        // Only fall back to static data on the first load if the API fails
        setEvents(staticEvents);
        setLoading(false);
        initializedRef.current = true;
      }
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

  return { events, loading, lastUpdated };
}
