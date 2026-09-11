import express from "express";
import { getServiceUploadsDir, getUploadsDir } from "../db/connection.js";

function serve(rootGetter, { jpeg = false } = {}) {
  const staticOptions = {
    fallthrough: false,
    index: false,
    maxAge: 0,
    setHeaders(res) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      if (jpeg) res.setHeader("Content-Type", "image/jpeg");
    },
  };
  return (req, res, next) => {
    express.static(rootGetter(), staticOptions)(req, res, next);
  };
}

export function mountUploadStatic(app) {
  app.use("/api/uploads", serve(getUploadsDir));
  app.use("/service-images", serve(getServiceUploadsDir, { jpeg: true }));
}
