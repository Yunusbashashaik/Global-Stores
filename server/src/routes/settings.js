import { Router } from "express";
import { getPublicSettings } from "../controllers/settingsController.js";

export const settingsRouter = Router();

settingsRouter.get("/", getPublicSettings);
