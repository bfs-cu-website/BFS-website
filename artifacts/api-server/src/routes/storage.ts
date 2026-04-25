import { Router, type IRouter, type Request, type Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { COOKIE_NAME, refreshSession } from "./auth";

const router: IRouter = Router();

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

function getCloudinaryConfig(): { cloudName: string; apiKey: string; apiSecret: string } | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

router.post("/storage/uploads/data", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const config = getCloudinaryConfig();
  if (!config) {
    res.status(503).json({
      error: "Image uploads are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the server.",
    });
    return;
  }

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

  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
  });

  try {
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    await new Promise<void>((resolve, reject) => {
      req.on("data", (chunk: Buffer) => {
        totalBytes += chunk.length;
        if (totalBytes > MAX_UPLOAD_BYTES) {
          req.destroy();
          reject(new Error("FILE_TOO_LARGE"));
          return;
        }
        chunks.push(chunk);
      });
      req.on("end", resolve);
      req.on("error", reject);
    });

    const fileBuffer = Buffer.concat(chunks);

    const url = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "bfs-events", resource_type: "image" },
        (error, result) => {
          if (error) reject(new Error(error.message));
          else if (result) resolve(result.secure_url);
          else reject(new Error("No result from Cloudinary"));
        }
      );
      uploadStream.end(fileBuffer);
    });

    res.json({ url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg === "FILE_TOO_LARGE") {
      res.status(413).json({ error: "File too large. Maximum allowed size is 10 MB." });
      return;
    }
    req.log.error({ err: error }, "Error uploading file to Cloudinary");
    res.status(500).json({ error: "Upload failed. Please try again." });
  }
});

export default router;
