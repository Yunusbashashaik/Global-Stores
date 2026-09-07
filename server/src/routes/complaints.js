import { Router } from "express";
import { createComplaint } from "../controllers/complaintsController.js";
import {
  handleUpload,
  uploadComplaintScreenshot,
} from "../middleware/upload.js";

export const complaintRouter = Router();

complaintRouter.post(
  "/",
  handleUpload(uploadComplaintScreenshot),
  createComplaint,
);
