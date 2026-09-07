import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase, UPLOADS_DIR } from "./db/connection.js";
import { seedDatabase } from "./db/seed.js";
import { adminRouter } from "./routes/admin.js";
import { complaintRouter } from "./routes/complaints.js";
import { servicesRouter } from "./routes/services.js";
import { settingsRouter } from "./routes/settings.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

initDatabase();
seedDatabase();

const app = express();
app.set("trust proxy", 1);
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "global-store-api",
    db: "sqlite",
    time: new Date().toISOString(),
  });
});

app.use("/api/uploads", express.static(UPLOADS_DIR));
app.use("/api/services", servicesRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/complaints", complaintRouter);

const clientDist = path.join(__dirname, "..", "..", "client", "dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, HOST, () => {
    console.log(`GlobalStore API listening on http://${HOST}:${PORT}`);
  });
}

export { app };
