import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { DEFAULT_SERVICES } from "./defaultServices.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const SERVICES_PATH = path.join(DATA_DIR, "services.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readServices() {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(SERVICES_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("empty");
    }
    return parsed;
  } catch {
    const seed = structuredClone(DEFAULT_SERVICES);
    await writeServices(seed);
    return seed;
  }
}

export async function writeServices(services) {
  await ensureDataDir();
  await fs.writeFile(SERVICES_PATH, `${JSON.stringify(services, null, 2)}\n`);
}

export async function updateService(id, patch) {
  const services = await readServices();
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) {
    return null;
  }

  const current = services[index];
  const next = {
    ...current,
    ...pickEditable(patch),
    prices: {
      ...current.prices,
      ...(patch.prices && typeof patch.prices === "object" ? sanitizePrices(patch.prices) : {}),
    },
  };

  services[index] = next;
  await writeServices(services);
  return next;
}

function pickEditable(patch) {
  const out = {};
  for (const key of ["nameEn", "nameAr", "descriptionEn", "descriptionAr", "icon"]) {
    if (typeof patch[key] === "string") {
      out[key] = patch[key];
    }
  }
  return out;
}

function sanitizePrices(prices) {
  const out = {};
  for (const key of ["month", "year"]) {
    if (prices[key] === undefined || prices[key] === null || prices[key] === "") continue;
    const n = Number(prices[key]);
    if (!Number.isFinite(n) || n < 0) {
      throw new Error(`Invalid ${key} price`);
    }
    out[key] = Math.round(n * 1000) / 1000;
  }
  return out;
}

export { SERVICES_PATH, DATA_DIR };
