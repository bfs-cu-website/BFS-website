export type ApiEvent = {
  id: number;
  title: string;
  date: string;
  category: string;
  status: string;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

export type EventInput = Omit<ApiEvent, "id" | "createdAt" | "updatedAt">;

const BASE = "/api";

export async function fetchEvents(): Promise<ApiEvent[]> {
  const res = await fetch(`${BASE}/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function createEvent(
  data: EventInput,
  password: string,
): Promise<ApiEvent> {
  const res = await fetch(`${BASE}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to create event");
  }
  return res.json();
}

export async function updateEvent(
  id: number,
  data: Partial<EventInput>,
  password: string,
): Promise<ApiEvent> {
  const res = await fetch(`${BASE}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to update event");
  }
  return res.json();
}

export async function deleteEvent(
  id: number,
  password: string,
): Promise<void> {
  const res = await fetch(`${BASE}/events/${id}`, {
    method: "DELETE",
    headers: { "x-admin-password": password },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to delete event");
  }
}
