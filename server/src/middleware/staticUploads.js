import express from "express";
import { getServiceUploadsDir, getUploadsDir } from "../db/connection.js";

const staticOptions = {
  fallthrough: true,
  index: false,
  maxAge: 0,
  setHeaders(res) {
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  },
};

function serve(rootGetter) {
  return (req, res, next) => {
    express.static(rootGetter(), staticOptions)(req, res, next);
  };
}

export function mountUploadStatic(app) {
  app.use("/api/uploads", serve(getUploadsDir));
  app.use("/service-images", serve(getServiceUploadsDir));
}
