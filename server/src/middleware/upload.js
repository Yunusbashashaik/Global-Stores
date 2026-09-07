import fs from "fs";
import multer from "multer";
import path from "path";
import { SERVICE_UPLOADS_DIR, UPLOADS_DIR } from "../db/connection.js";

export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
export const MAX_SERVICE_IMAGE_BYTES = 5 * 1024 * 1024;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function makeStorage(destDir) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      try {
        ensureDir(destDir);
        cb(null, destDir);
      } catch (err) {
        cb(err);
      }
    },
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      cb(null, `${Date.now()}-${safe || "upload"}`);
    },
  });
}

const jpegOnly = (_req, file, cb) => {
  const mime = (file.mimetype || "").toLowerCase();
  const name = (file.originalname || "").toLowerCase();
  const ok =
    mime === "image/jpeg" ||
    mime === "image/jpg" ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg");
  if (!ok) {
    cb(new Error("Image must be JPEG/JPG format"));
    return;
  }
  cb(null, true);
};

const anyImage = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Screenshot must be an image (PNG, JPG, WEBP, GIF, etc.)"));
    return;
  }
  cb(null, true);
};

export const uploadServiceImage = multer({
  storage: makeStorage(SERVICE_UPLOADS_DIR),
  limits: { fileSize: MAX_SERVICE_IMAGE_BYTES },
  fileFilter: jpegOnly,
}).single("image");

export const uploadComplaintScreenshot = multer({
  storage: makeStorage(path.join(UPLOADS_DIR)),
  limits: { fileSize: MAX_SCREENSHOT_BYTES },
  fileFilter: anyImage,
}).single("screenshot");

export function handleUpload(uploader) {
  return (req, res, next) => {
    uploader(req, res, (err) => {
      if (!err) {
        next();
        return;
      }
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          res.status(400).json({ error: "File must be 5 MB or smaller" });
          return;
        }
        res.status(400).json({ error: err.message || "Invalid upload" });
        return;
      }
      res.status(400).json({ error: err.message || "Invalid upload" });
    });
  };
}

export function serviceImagePublicUrl(filename) {
  return `/api/uploads/services/${filename}`;
}
