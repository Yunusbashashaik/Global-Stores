import { getAllSettings } from "../models/Settings.js";

export function getPublicSettings(_req, res) {
  try {
    res.json({ settings: getAllSettings() });
  } catch (err) {
    console.error("Failed to load settings:", err);
    res.status(500).json({ error: "Failed to load settings" });
  }
}
