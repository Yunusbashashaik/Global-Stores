import cors from "cors";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { adminRouter } from "./routes/admin.js";
import { complaintRouter } from "./routes/complaints.js";
import { servicesRouter } from "./routes/services.js";
import { readServices } from "./servicesStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const DATA_DIR = path.join(__dirname, "..", "data");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "global-stores-api" });
});

app.use("/api/services", servicesRouter);
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

await fs.mkdir(DATA_DIR, { recursive: true });
await readServices();

app.listen(PORT, () => {
  console.log(`GlobalStores API listening on http://localhost:${PORT}`);
});

export { app, DATA_DIR };
