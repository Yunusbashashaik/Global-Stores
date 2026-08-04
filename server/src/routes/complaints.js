import { Router } from "express";
import fs from "fs/promises";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { sendComplaintEmail } from "../mail.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "..", "data", "uploads");

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Screenshot must be an image"));
      return;
    }
    cb(null, true);
  },
});

export const complaintRouter = Router();

complaintRouter.post("/", upload.single("screenshot"), async (req, res) => {
  try {
    const { fullName, phone, subject, details } = req.body;
    if (!fullName?.trim() || !phone?.trim() || !subject?.trim() || !details?.trim()) {
      res.status(400).json({ error: "All text fields are required" });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "Screenshot is required" });
      return;
    }

    const ticket = {
      id: `GS-${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      details: details.trim(),
      screenshotPath: req.file.path,
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
