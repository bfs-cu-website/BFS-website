export class SessionExpiredError extends Error {
  constructor() {
    super("Your session has expired. Please sign in again.");
    this.name = "SessionExpiredError";
  }
}

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

export async function loginAdmin(password: string): Promise<void> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ password }),
  });
  if (res.status === 429) {
    throw new Error("Too many failed login attempts. Please try again in 15 minutes.");
  }
  if (res.status === 401) {
    throw new Error("Incorrect password. Please try again.");
  }
  if (!res.ok) {
    throw new Error("Could not connect to the server. Please try again.");
  }
}

export async function logoutAdmin(): Promise<void> {
  await fetch(`${BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function checkAdminSession(): Promise<boolean> {
  const res = await fetch(`${BASE}/auth/check`, {
    credentials: "include",
  });
  return res.ok;
}

export async function fetchEvents(signal?: AbortSignal): Promise<ApiEvent[]> {
  const res = await fetch(`${BASE}/events`, { signal });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function createEvent(data: EventInput): Promise<ApiEvent> {
  const res = await fetch(`${BASE}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new SessionExpiredError();
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to create event");
  }
  return res.json();
}

export async function updateEvent(
  id: number,
  data: Partial<EventInput>,
): Promise<ApiEvent> {
  const res = await fetch(`${BASE}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new SessionExpiredError();
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to update event");
  }
  return res.json();
}

export async function deleteEvent(id: number): Promise<void> {
  const res = await fetch(`${BASE}/events/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (res.status === 401) throw new SessionExpiredError();
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to delete event");
  }
}
