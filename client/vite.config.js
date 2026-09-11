import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVICE_IMAGE_DIRS = [
  path.resolve(__dirname, "../server/data/uploads/services"),
  path.resolve(__dirname, "public/service-images"),
];

function firstExistingImage(idOrFile) {
  const names = [`${idOrFile}.jpg`, idOrFile];
  for (const dir of SERVICE_IMAGE_DIRS) {
    for (const name of names) {
      const file = path.join(dir, path.basename(name));
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
    }
  }
  return null;
}

function serviceImagesPlugin() {
  return {
    name: "globalstore-service-images",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = String(req.url || "").split("?")[0];
        const byId = url.match(/^\/api\/services\/([^/]+)\/image$/);
        const byStatic = url.match(/^\/service-images\/([^/]+)$/);
        const byUpload = url.match(/^\/api\/uploads\/services\/([^/]+)$/);
        const token = byId?.[1] || byStatic?.[1] || byUpload?.[1];
        if (!token) {
          next();
          return;
        }
        const file = firstExistingImage(token);
        if (!file) {
          next();
          return;
        }
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react(), serviceImagesPlugin()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    fs: {
      allow: [path.resolve(__dirname, "..")],
    },
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/service-images": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
