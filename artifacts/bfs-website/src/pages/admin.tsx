import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  loginAdmin,
  logoutAdmin,
  checkAdminSession,
  SessionExpiredError,
  type ApiEvent,
  type EventInput,
} from "@/lib/api";

const CATEGORIES = ["Flagship", "Field Visit", "Orientation", "Competition", "Social", "Workshop", "Talk", "Other"];
const STATUSES = ["upcoming", "past"];

const SESSION_DURATION_MS = (Number(import.meta.env.VITE_SESSION_DURATION_HOURS) || 8) * 60 * 60 * 1000;
const WARNING_THRESHOLD_MS = (Number(import.meta.env.VITE_SESSION_WARNING_MINUTES) || 5) * 60 * 1000;

const DEFAULT_FORM: EventInput = {
  title: "",
  date: "",
  category: "Flagship",
  status: "upcoming",
  description: "",
  image: "",
};

function usePhotoUpload(onUploaded: (imageUrl: string) => void, onSessionExpired: () => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const metaRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "application/octet-stream" }),
      });
      if (metaRes.status === 401) {
        onSessionExpired();
        return;
      }
      if (!metaRes.ok) {
        const data = await metaRes.json() as { error?: string };
        throw new Error(data.error ?? "Failed to get upload URL");
      }
      const { uploadURL, objectPath } = await metaRes.json() as { uploadURL: string; objectPath: string };

      const putRes = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });
      if (!putRes.ok) throw new Error("Upload to storage failed");

      onUploaded(`/api/storage${objectPath}`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }, [onUploaded, onSessionExpired]);

  return { uploadFile, isUploading, uploadError };
}

function EventForm({
  initial,
  onSave,
  onCancel,
  onSessionExpired,
  loading,
}: {
  initial: EventInput;
  onSave: (data: EventInput) => void;
  onCancel: () => void;
  onSessionExpired: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<EventInput>(initial);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(key: keyof EventInput, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const { uploadFile, isUploading, uploadError } = usePhotoUpload((url) => set("image", url), onSessionExpired);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-[#0A2540] mb-6">
          {initial.title ? "Edit Event" : "Add New Event"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Event Title *</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Biz Fair 3.0"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date *</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                placeholder="e.g. April 29, 2026"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Status *</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description *</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227] resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of the event"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Cover Photo</label>
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="https://images.unsplash.com/… or upload below"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#0A2540] text-white text-sm font-bold rounded-lg hover:bg-[#0d2f50] transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isUploading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Uploading…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Photo
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}
            {form.image && form.image.startsWith("/api/storage") && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-16 h-10 object-cover rounded-md border border-gray-200"
                />
                <span className="text-xs text-green-600 font-medium">Photo uploaded</span>
              </div>
            )}
            {!form.image && (
              <p className="text-xs text-gray-400 mt-1">Upload a photo from your device, or paste an image URL above.</p>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(form)}
            disabled={loading || isUploading || !form.title || !form.date || !form.description}
            className="flex-1 bg-[#C9A227] text-[#0A2540] font-bold py-2.5 rounded-lg hover:bg-[#b8911f] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : "Save Event"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading || isUploading}
            className="px-5 py-2.5 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({
  event,
  onConfirm,
  onCancel,
  loading,
}: {
  event: ApiEvent;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Event?</h3>
        <p className="text-gray-500 text-sm mb-6">
          "<span className="font-semibold">{event.title}</span>" will be permanently removed from the website.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-gray-300 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<ApiEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiEvent | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "past">("all");

  const [sessionWarnSeconds, setSessionWarnSeconds] = useState<number | null>(null);
  const [extendingSession, setExtendingSession] = useState(false);
  const lastRefreshRef = useRef<number>(Date.now());

  useEffect(() => {
    checkAdminSession()
      .then((valid) => {
        if (valid) lastRefreshRef.current = Date.now();
        setAuthed(valid);
      })
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    if (!authed) {
      setSessionWarnSeconds(null);
      return;
    }
    lastRefreshRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastRefreshRef.current;
      const remaining = SESSION_DURATION_MS - elapsed;
      if (remaining <= WARNING_THRESHOLD_MS) {
        setSessionWarnSeconds(Math.max(0, Math.round(remaining / 1000)));
      } else {
        setSessionWarnSeconds(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [authed]);

  async function handleExtendSession() {
    setExtendingSession(true);
    try {
      const valid = await checkAdminSession();
      if (valid) {
        lastRefreshRef.current = Date.now();
        setSessionWarnSeconds(null);
      } else {
        handleSessionExpired();
      }
    } catch {
      handleSessionExpired();
    } finally {
      setExtendingSession(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      await loginAdmin(password);
      lastRefreshRef.current = Date.now();
      setAuthed(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "An error occurred.");
    }
    setAuthLoading(false);
  }

  async function handleSignOut() {
    await logoutAdmin();
    setAuthed(false);
    setPassword("");
    setEvents([]);
  }

  async function loadEvents() {
    setEventsLoading(true);
    setEventsError("");
    try {
      const data = await fetchEvents();
      setEvents(data);
      lastRefreshRef.current = Date.now();
      setSessionWarnSeconds(null);
    } catch {
      setEventsError("Failed to load events. Please refresh.");
    }
    setEventsLoading(false);
  }

  useEffect(() => {
    if (authed) loadEvents();
  }, [authed]);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  function handleSessionExpired() {
    setAuthed(false);
    setPassword("");
    setEvents([]);
    setShowForm(false);
    setEditTarget(null);
    setDeleteTarget(null);
    setAuthError("Your session has expired. Please sign in again.");
  }

  async function handleSave(data: EventInput) {
    setActionLoading(true);
    setActionError("");
    try {
      if (editTarget) {
        await updateEvent(editTarget.id, data);
        showSuccess("Event updated successfully.");
      } else {
        await createEvent(data);
        showSuccess("Event added successfully.");
      }
      lastRefreshRef.current = Date.now();
      setSessionWarnSeconds(null);
      setShowForm(false);
      setEditTarget(null);
      await loadEvents();
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        handleSessionExpired();
      } else {
        setActionError(err instanceof Error ? err.message : "An error occurred.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setActionLoading(true);
    setActionError("");
    try {
      await deleteEvent(deleteTarget.id);
      lastRefreshRef.current = Date.now();
      setSessionWarnSeconds(null);
      showSuccess("Event deleted successfully.");
      setDeleteTarget(null);
      await loadEvents();
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        handleSessionExpired();
      } else {
        setActionError(err instanceof Error ? err.message : "An error occurred.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  const filtered = events.filter((e) =>
    filterStatus === "all" ? true : e.status === filterStatus,
  );

  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#0A2540] flex items-center justify-center">
        <div className="text-white text-sm opacity-60">Checking session…</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0A2540] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
          <div className="text-center mb-8">
            <img src="/bfs-logo.png" alt="B&FS Logo" className="w-16 h-16 mx-auto mb-4 rounded-full" />
            <h1 className="text-2xl font-black text-[#0A2540]">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">Business & Finance Society</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-sm text-red-500 font-medium">{authError}</p>
            )}
            <button
              type="submit"
              disabled={authLoading || !password}
              className="w-full bg-[#C9A227] text-[#0A2540] font-bold py-2.5 rounded-lg hover:bg-[#b8911f] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? "Verifying…" : "Sign In"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">
            Contact the B&FS team lead for the password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/bfs-logo.png" alt="B&FS Logo" className="w-9 h-9 rounded-full" />
          <div>
            <h1 className="font-black text-lg leading-tight">B&FS Admin Panel</h1>
            <p className="text-xs text-gray-400">Event Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-sm text-gray-300 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            ← View Website
          </a>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-300 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            Sign Out
          </button>
        </div>
      </header>

      {sessionWarnSeconds !== null && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
            <svg className="w-4 h-4 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Your session will expire in{" "}
              <span className="font-bold tabular-nums">
                {sessionWarnSeconds >= 60
                  ? `${Math.ceil(sessionWarnSeconds / 60)} minute${Math.ceil(sessionWarnSeconds / 60) !== 1 ? "s" : ""}`
                  : `${sessionWarnSeconds} second${sessionWarnSeconds !== 1 ? "s" : ""}`}
              </span>
              . Click to stay signed in.
            </span>
          </div>
          <button
            onClick={handleExtendSession}
            disabled={extendingSession}
            className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold px-4 py-1.5 rounded-lg transition"
          >
            {extendingSession ? "Extending…" : "Stay Signed In"}
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-medium text-sm">
            ✓ {successMsg}
          </div>
        )}
        {actionError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium text-sm">
            ✗ {actionError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#0A2540]">Events</h2>
            <p className="text-sm text-gray-500">{events.length} total events on the website</p>
          </div>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true); }}
            className="bg-[#C9A227] text-[#0A2540] font-bold px-5 py-2.5 rounded-xl hover:bg-[#b8911f] transition flex items-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Event
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {(["all", "upcoming", "past"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
                filterStatus === s
                  ? "bg-[#0A2540] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#0A2540]"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s === "upcoming" && (
                <span className="ml-1.5 bg-[#C9A227] text-[#0A2540] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {events.filter((e) => e.status === "upcoming").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {eventsLoading ? (
          <div className="text-center py-16 text-gray-400">Loading events…</div>
        ) : eventsError ? (
          <div className="text-center py-16 text-red-500">{eventsError}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No events found. Click "Add New Event" to get started.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Event</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs hidden sm:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-500 uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0A2540] leading-tight">{event.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{event.description}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600 hidden sm:table-cell whitespace-nowrap">{event.date}</td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        event.status === "upcoming"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {event.status === "upcoming" ? "Upcoming" : "Past"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setEditTarget(event); setShowForm(true); }}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#C9A227] hover:text-[#C9A227] transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(event)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-400 hover:text-red-500 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <EventForm
          initial={editTarget
            ? { title: editTarget.title, date: editTarget.date, category: editTarget.category, status: editTarget.status, description: editTarget.description, image: editTarget.image }
            : DEFAULT_FORM}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null); }}
          onSessionExpired={handleSessionExpired}
          loading={actionLoading}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          event={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
