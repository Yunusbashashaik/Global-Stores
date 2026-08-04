import { Router } from "express";
import {
  authenticateAdmin,
  createSessionToken,
  requireAdmin,
} from "../auth.js";
import { readServices, updateService } from "../servicesStore.js";

export const adminRouter = Router();

adminRouter.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!authenticateAdmin(username, password)) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }
  res.json({ token: createSessionToken() });
});

adminRouter.get("/me", requireAdmin, (_req, res) => {
  res.json({ ok: true, role: "admin" });
});

adminRouter.get("/services", requireAdmin, async (_req, res) => {
  try {
    const services = await readServices();
    res.json({ services });
  } catch (err) {
    console.error("Admin services load failed:", err);
    res.status(500).json({ error: "Failed to load services" });
  }
});

adminRouter.put("/services/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await updateService(req.params.id, req.body || {});
    if (!updated) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json({ service: updated });
  } catch (err) {
    console.error("Service update failed:", err);
    res.status(400).json({ error: err.message || "Update failed" });
  }
});
