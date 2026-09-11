import { getDb, getDbEngine } from "./connection.js";
import { readDurableCatalog, writeDurableCatalog } from "./durableStore.js";
import {
  insertService,
  listServices,
  updateService,
} from "../models/Service.js";
import { updateSettings } from "../models/Settings.js";

function rowToPatch(item) {
  if (item.prices && item.nameEn) {
    return {
      id: item.id,
      icon: item.icon,
      accent: item.accent,
      typeEn: item.typeEn,
      typeAr: item.typeAr,
      nameEn: item.nameEn,
      nameAr: item.nameAr,
      descriptionEn: item.descriptionEn,
      descriptionAr: item.descriptionAr,
      prices: item.prices,
      imageUrl: item.imageUrl,
      outOfStock: item.outOfStock,
      sortOrder: item.sortOrder,
    };
  }
  const outOfStock = Boolean(item.out_of_stock);
  return {
    id: item.id,
    icon: item.icon,
    accent: item.accent,
    typeEn: item.type_en,
    typeAr: item.type_ar,
    nameEn: item.name_en,
    nameAr: item.name_ar,
    descriptionEn: item.description_en,
    descriptionAr: item.description_ar,
    prices: {
      month: outOfStock ? 0 : Number(item.price_month),
      year: outOfStock ? 0 : Number(item.price_year),
    },
    imageUrl: item.image_url || null,
    outOfStock,
    sortOrder: item.sort_order,
  };
}

function rawSettingsFromDb() {
  try {
    const rows = getDb().prepare("SELECT key, value FROM settings").all();
    return Object.fromEntries((rows || []).map((row) => [row.key, row.value]));
  } catch {
    return {};
  }
}

export function persistLiveCatalog() {
  try {
    const rows = getDb().prepare("SELECT * FROM services").all();
    writeDurableCatalog({
      services: rows,
      settings: rawSettingsFromDb(),
    });
  } catch (err) {
    console.error("Durable catalog write failed:", err);
  }
}

function restoreSettings(settings) {
  if (!settings || typeof settings !== "object") return;
  if (
    "complaintEmail" in settings ||
    "whatsappNumbers" in settings ||
    "aboutEn" in settings
  ) {
    updateSettings(settings);
    return;
  }
  const db = getDb();
  for (const [key, value] of Object.entries(settings)) {
    db.prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
    ).run(key, typeof value === "string" ? value : JSON.stringify(value));
  }
}

export function restoreCatalogFromBackup() {
  const live = listServices();
  const backup = readDurableCatalog({
    skipActiveJson: getDbEngine() === "json" && live.length > 0,
  });
  if (!backup?.services?.length) return false;

  if (live.length === 0) {
    backup.services.forEach((item, index) => {
      const patch = rowToPatch(item);
      insertService({
        ...patch,
        sortOrder: patch.sortOrder ?? index,
      });
    });
    restoreSettings(backup.settings);
    return true;
  }

  const byId = new Map(live.map((service) => [service.id, service]));
  let changed = false;
  backup.services.forEach((item) => {
    const patch = rowToPatch(item);
    if (!patch.id) return;
    const current = byId.get(patch.id);
    if (!current) {
      insertService(patch);
      changed = true;
      return;
    }
    const samePrice =
      Number(current.prices?.month) === Number(patch.prices?.month) &&
      Number(current.prices?.year) === Number(patch.prices?.year) &&
      Boolean(current.outOfStock) === Boolean(patch.outOfStock) &&
      current.nameEn === patch.nameEn;
    if (samePrice) return;
    const backupStamp = Date.parse(
      String(item.updated_at || item.updatedAt || "").replace(" ", "T"),
    );
    const liveStamp = Date.parse(
      String(current.updatedAt || "").replace(" ", "T"),
    );
    if (
      (Number.isFinite(backupStamp) &&
        Number.isFinite(liveStamp) &&
        backupStamp > liveStamp) ||
      !Number.isFinite(liveStamp)
    ) {
      updateService(patch.id, patch);
      changed = true;
    }
  });
  if (backup.settings && live.length === 0) restoreSettings(backup.settings);
  return changed;
}
