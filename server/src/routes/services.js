import { Router } from "express";
import { readServices } from "../servicesStore.js";

export const servicesRouter = Router();

servicesRouter.get("/", async (_req, res) => {
  try {
    const services = await readServices();
    res.json({ services });
  } catch (err) {
    console.error("Failed to load services:", err);
    res.status(500).json({ error: "Failed to load services" });
  }
});
