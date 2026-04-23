import { Router, type IRouter, type Request, type Response } from "express";
import { db, eventsTable, insertEventSchema, updateEventSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { COOKIE_NAME, refreshSession } from "./auth";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response): boolean {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(503).json({ error: "Auth not configured on server." });
    return false;
  }

  const token = (req.cookies as Record<string, string | undefined>)[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: "Unauthorized. Please log in." });
    return false;
  }

  try {
    jwt.verify(token, jwtSecret);
    refreshSession(res);
    return true;
  } catch {
    res.status(401).json({ error: "Session expired. Please log in again." });
    return false;
  }
}

function isZodError(err: unknown): err is { issues: unknown[] } {
  return (
    typeof err === "object" &&
    err !== null &&
    "issues" in err &&
    Array.isArray((err as Record<string, unknown>).issues)
  );
}

router.get("/events", async (_req, res) => {
  try {
    const allEvents = await db
      .select()
      .from(eventsTable)
      .orderBy(eventsTable.id);
    res.json(allEvents);
  } catch {
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

router.post("/events", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const parsed = insertEventSchema.parse(req.body);
    const [created] = await db.insert(eventsTable).values(parsed).returning();
    res.status(201).json(created);
  } catch (err) {
    if (isZodError(err)) {
      res.status(400).json({ error: "Invalid event data.", details: err.issues });
      return;
    }
    res.status(500).json({ error: "Failed to create event." });
  }
});

router.put("/events/:id", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid event ID." });
    return;
  }
  try {
    const parsed = updateEventSchema.parse(req.body);
    const [updated] = await db
      .update(eventsTable)
      .set({ ...parsed, updatedAt: new Date() })
      .where(eq(eventsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Event not found." });
      return;
    }
    res.json(updated);
  } catch (err) {
    if (isZodError(err)) {
      res.status(400).json({ error: "Invalid event data.", details: err.issues });
      return;
    }
    res.status(500).json({ error: "Failed to update event." });
  }
});

router.delete("/events/:id", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid event ID." });
    return;
  }
  try {
    const [deleted] = await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Event not found." });
      return;
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete event." });
  }
});

export default router;
