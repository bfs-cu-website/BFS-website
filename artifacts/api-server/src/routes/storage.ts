import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import jwt from "jsonwebtoken";
import { ObjectStorageService, ObjectNotFoundError, UploadTooLargeError } from "../lib/objectStorage";
import { COOKIE_NAME, refreshSession } from "./auth";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

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

/**
 * Upload an event photo through the server.
 * The server streams the request body directly to GCS while counting bytes in
 * real time.  If the stream exceeds MAX_UPLOAD_BYTES the write is aborted
 * before GCS commits any data and 413 is returned.  Content-Type is taken from
 * the request header (not a client-declared JSON field) and validated against
 * an image-only allowlist before any data is read.
 */
router.post("/storage/uploads/data", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const contentType = String(req.headers["content-type"] || "");
  if (!ALLOWED_IMAGE_MIME_TYPES.has(contentType)) {
    res.status(415).json({ error: "Unsupported file type. Only JPEG, PNG, GIF, WebP, and AVIF images are allowed." });
    return;
  }

  const contentLengthHeader = req.headers["content-length"];
  if (contentLengthHeader !== undefined) {
    const declaredLength = parseInt(contentLengthHeader, 10);
    if (!isNaN(declaredLength) && declaredLength > MAX_UPLOAD_BYTES) {
      res.status(413).json({ error: "File too large. Maximum allowed size is 10 MB." });
      return;
    }
  }

  try {
    const objectPath = await objectStorageService.uploadObjectEntity(req, contentType, MAX_UPLOAD_BYTES);
    res.json({ objectPath });
  } catch (error) {
    if (error instanceof UploadTooLargeError) {
      res.status(413).json({ error: "File too large. Maximum allowed size is 10 MB." });
      return;
    }
    req.log.error({ err: error }, "Error uploading file");
    res.status(500).json({ error: "Upload failed" });
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

/**
 * Serve confirmed event photos.
 * getObjectEntityFile() rejects staging paths at the library level so
 * unconfirmed / directly-staged objects are never reachable.
 * Only allowlisted image MIME types are served inline; everything else is
 * forced to an attachment download (defense-in-depth for legacy objects).
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    const response = await objectStorageService.downloadObject(objectFile);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    const storedContentType = response.headers.get("content-type") ?? "application/octet-stream";
    if (ALLOWED_IMAGE_MIME_TYPES.has(storedContentType)) {
      res.setHeader("Content-Type", storedContentType);
      res.setHeader("X-Content-Type-Options", "nosniff");
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", "attachment");
      res.setHeader("X-Content-Type-Options", "nosniff");
    }

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
