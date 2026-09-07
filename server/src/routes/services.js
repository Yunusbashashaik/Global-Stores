import { Router } from "express";
import { getPublicServices } from "../controllers/servicesController.js";

export const servicesRouter = Router();

servicesRouter.get("/", getPublicServices);
