import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import jwt from "jsonwebtoken";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { COOKIE_NAME, refreshSession } from "./auth";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

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

router.post("/storage/uploads/request-url", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  try {
    const { name, size, contentType } = parsed.data;
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
    res.json(RequestUploadUrlResponse.parse({ uploadURL, objectPath, metadata: { name, size, contentType } }));
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    const response = await objectStorageService.downloadObject(file);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      Readable.fromWeb(response.body as ReadableStream<Uint8Array>).pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

// Event photos are intentionally public — they are displayed to all website visitors.
// Upload access is admin-gated (see POST /storage/uploads/request-url above).
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    const response = await objectStorageService.downloadObject(objectFile);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      Readable.fromWeb(response.body as ReadableStream<Uint8Array>).pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
