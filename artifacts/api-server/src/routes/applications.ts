import { Router, type IRouter, type Request, type Response } from "express";
import { db, applicationsTable, insertApplicationSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { COOKIE_NAME, refreshSession } from "./auth";

const router: IRouter = Router();

const applicationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many applications submitted from this IP. Please try again later." },
});

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

router.post("/applications", applicationRateLimiter, async (req, res) => {
  try {
    const body = req.body as {
      name?: unknown;
      email?: unknown;
      department?: unknown;
      year?: unknown;
      interests?: unknown;
      essay?: unknown;
    };

    const interestsRaw = body.interests;
    const interestsStr = Array.isArray(interestsRaw)
      ? (interestsRaw as string[]).join(", ")
      : String(interestsRaw ?? "");

    const parsed = insertApplicationSchema.parse({
      name: body.name,
      email: typeof body.email === "string" ? body.email.trim().toLowerCase() : body.email,
      department: body.department,
      year: body.year,
      interests: interestsStr,
      essay: body.essay,
    });

    const existing = await db
      .select({ id: applicationsTable.id })
      .from(applicationsTable)
      .where(eq(applicationsTable.email, parsed.email))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "An application with this email address already exists." });
      return;
    }

    const [created] = await db
      .insert(applicationsTable)
      .values({ ...parsed, status: "pending" })
      .returning();
    res.status(201).json(created);
  } catch (err) {
    if (isZodError(err)) {
      res.status(400).json({ error: "Invalid application data.", details: err.issues });
      return;
    }
    res.status(500).json({ error: "Failed to submit application." });
  }
});

router.get("/applications", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const all = await db
      .select()
      .from(applicationsTable)
      .orderBy(applicationsTable.createdAt);
    res.json(all);
  } catch {
    res.status(500).json({ error: "Failed to fetch applications." });
  }
});

router.patch("/applications/:id/status", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid application ID." });
    return;
  }
  const { status } = req.body as { status?: string };
  if (!status || !["pending", "accepted", "rejected"].includes(status)) {
    res.status(400).json({ error: "Status must be pending, accepted, or rejected." });
    return;
  }
  try {
    const [updated] = await db
      .update(applicationsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(applicationsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Application not found." });
      return;
    }
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update application status." });
  }
});

router.delete("/applications/:id", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid application ID." });
    return;
  }
  try {
    const [deleted] = await db
      .delete(applicationsTable)
      .where(eq(applicationsTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Application not found." });
      return;
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete application." });
  }
});

export default router;
