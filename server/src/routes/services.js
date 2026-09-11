import { Router } from "express";
import { getPublicServices } from "../controllers/servicesController.js";
import { sendServiceImage } from "../services/serviceImages.js";

export const servicesRouter = Router();

servicesRouter.get("/:id/image", sendServiceImage);
servicesRouter.get("/", getPublicServices);
