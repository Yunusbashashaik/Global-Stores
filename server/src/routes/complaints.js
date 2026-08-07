import { Router } from "express";
import fs from "fs/promises";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { sendComplaintEmail } from "../mail.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "..", "data", "uploads");

export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (_req, file, cb) => {
    // Keep only ASCII-safe characters; non-ASCII (e.g. Arabic) becomes "_".
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe || "screenshot"}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SCREENSHOT_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Screenshot must be an image (PNG, JPG, WEBP, GIF, etc.)"));
      return;
    }
    cb(null, true);
  },
});

function uploadScreenshot(req, res, next) {
  upload.single("screenshot")(req, res, (err) => {
    if (!err) {
      next();
      return;
    }
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({
          error: "Screenshot must be 5 MB or smaller",
        });
        return;
      }
      res.status(400).json({ error: err.message || "Invalid upload" });
      return;
    }
    res.status(400).json({ error: err.message || "Invalid upload" });
  });
}

export const complaintRouter = Router();

complaintRouter.post("/", uploadScreenshot, async (req, res) => {
  try {
    const { fullName, phone, subject, details } = req.body;
    const missing = [
      ["fullName", "Full Name", fullName],
      ["phone", "Phone Number", phone],
      ["subject", "Subject", subject],
      ["details", "Complaint Details", details],
    ].find(([, , value]) => !String(value || "").trim());

    if (missing) {
      res.status(400).json({ error: `${missing[1]} is missing.` });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "Screenshot is missing." });
      return;
    }

    const ticket = {
      id: `GS-${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      details: details.trim(),
      screenshotPath: req.file.path,
      originalFilename: req.file.originalname,
      createdAt: new Date().toISOString(),
    };

    const logPath = path.join(path.dirname(uploadDir), "complaints.jsonl");
    await fs.appendFile(logPath, `${JSON.stringify(ticket)}\n`);

    await sendComplaintEmail(ticket, req.file.path);

    res.json({ success: true, ticketId: ticket.id });
  } catch (err) {
    console.error("Complaint submission failed:", err);
    res.status(500).json({ error: err.message || "Submission failed" });
  }
});
