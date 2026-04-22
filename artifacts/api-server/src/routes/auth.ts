import { Router, type IRouter, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

const router: IRouter = Router();

const COOKIE_NAME = "admin_session";

function sessionMaxAge(): number {
  return (Number(process.env.SESSION_DURATION_HOURS) || 8) * 60 * 60 * 1000;
}

function sessionExpiresIn(): number {
  return (Number(process.env.SESSION_DURATION_HOURS) || 8) * 60 * 60;
}

router.post("/auth/login", (req: Request, res: Response) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminPassword || !jwtSecret) {
    res.status(503).json({ error: "Auth not configured on server." });
    return;
  }

  const { password } = req.body as { password?: string };
  if (!password || password !== adminPassword) {
    res.status(401).json({ error: "Incorrect password." });
    return;
  }

  const token = jwt.sign({ sub: "admin" }, jwtSecret, {
    expiresIn: sessionExpiresIn(),
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: sessionMaxAge(),
    path: "/api",
  });

  res.json({ ok: true });
});

router.post("/auth/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/api" });
  res.json({ ok: true });
});

router.get("/auth/check", (req: Request, res: Response) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(503).json({ error: "Auth not configured." });
    return;
  }

  const token = (req.cookies as Record<string, string | undefined>)[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  try {
    jwt.verify(token, jwtSecret);
    res.json({ ok: true });
  } catch {
    res.status(401).json({ error: "Session expired or invalid." });
  }
});

export { COOKIE_NAME };
export default router;
