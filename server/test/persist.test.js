import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import fs from "fs";
import os from "os";
import path from "path";
import { closeDatabase, initDatabase } from "../src/db/connection.js";
import { persistLiveCatalog } from "../src/db/persist.js";
import { seedDatabase } from "../src/db/seed.js";
import { insertService, listServices, updateService } from "../src/models/Service.js";
import { getAllSettings, updateSettings } from "../src/models/Settings.js";
import { commitServiceImage } from "../src/services/serviceImages.js";
import { getServiceUploadsDir } from "../src/db/connection.js";

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "gs-persist-"));
}

function wipeSqlite(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith("live.db")) {
      fs.rmSync(path.join(dir, name), { force: true });
    }
  }
}

describe("admin catalog survives restarts", () => {
  let dir;

  afterEach(() => {
    closeDatabase();
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  });

  it("restores edited prices after the sqlite file is deleted", () => {
    dir = tmpDir();
    process.env.GODADDY_SYNC_DIR = path.join(dir, "godaddy-sync");
    initDatabase(path.join(dir, "live.db"));
    seedDatabase();

    const updated = updateService("netflix-private", {
      prices: { month: 9.5, year: 40 },
    });
    assert.equal(updated.prices.month, 9.5);
    persistLiveCatalog();
    closeDatabase();

    wipeSqlite(dir);
    initDatabase(path.join(dir, "live.db"));
    seedDatabase();

    const restored = listServices().find((s) => s.id === "netflix-private");
    assert.equal(restored.prices.month, 9.5);
    assert.equal(restored.prices.year, 40);
  });

  it("imports json-engine admin edits into a fresh sqlite database", () => {
    dir = tmpDir();
    process.env.GODADDY_SYNC_DIR = path.join(dir, "godaddy-sync");
    const jsonPath = path.join(dir, "globalstore.json");
    initDatabase(path.join(dir, "unused.db"), { engine: "json", jsonPath });
    seedDatabase();
    updateService("netflix-private", { prices: { month: 7, year: 30 } });
    persistLiveCatalog();
    closeDatabase();

    initDatabase(path.join(dir, "live.db"), { jsonPath });
    seedDatabase();
    const restored = listServices().find((s) => s.id === "netflix-private");
    assert.equal(restored.prices.month, 7);
    assert.equal(restored.prices.year, 30);
  });

  it("restores new services, descriptions, email, WhatsApp, and About Us", () => {
    dir = tmpDir();
    process.env.GODADDY_SYNC_DIR = path.join(dir, "godaddy-sync");
    initDatabase(path.join(dir, "live.db"));
    seedDatabase();

    updateService("netflix-private", {
      descriptionEn: "Admin custom Netflix desc",
      descriptionAr: "وصف مخصص",
      prices: { month: 4, year: 22 },
    });
    insertService({
      id: "admin-special",
      nameEn: "Admin Special",
      nameAr: "خاص",
      descriptionEn: "Added by admin",
      descriptionAr: "أضيف",
      prices: { month: 3, year: 12 },
    });
    updateSettings({
      complaintEmail: "ops-forever@example.com",
      whatsappNumbers: ["96550001111", "96550002222"],
      aboutEn: "Custom about forever",
      aboutAr: "نبذة مخصصة",
      socialLinks: { instagram: "https://instagram.com/globalstore-kuwait" },
    });
    persistLiveCatalog();
    closeDatabase();

    wipeSqlite(dir);
    initDatabase(path.join(dir, "live.db"));
    seedDatabase();

    const netflix = listServices().find((s) => s.id === "netflix-private");
    const added = listServices().find((s) => s.id === "admin-special");
    const settings = getAllSettings();
    assert.equal(netflix.prices.month, 4);
    assert.equal(netflix.descriptionEn, "Admin custom Netflix desc");
    assert.equal(added?.nameEn, "Admin Special");
    assert.equal(added?.prices.year, 12);
    assert.equal(settings.complaintEmail, "ops-forever@example.com");
    assert.deepEqual(settings.whatsappNumbers, ["96550001111", "96550002222"]);
    assert.equal(settings.aboutEn, "Custom about forever");
    assert.equal(settings.aboutAr, "نبذة مخصصة");
    assert.equal(
      settings.socialLinks.instagram,
      "https://instagram.com/globalstore-kuwait",
    );
  });

  it("restores uploaded JPEGs after sqlite and the uploads folder are wiped", () => {
    dir = tmpDir();
    process.env.GODADDY_SYNC_DIR = path.join(dir, "godaddy-sync");
    initDatabase(path.join(dir, "live.db"));
    seedDatabase();

    const jpeg = Buffer.from(
      "ffd8ffe000104a46494600010100000100010000ffdb004300080606070605080707070909080a0c140d0c0b0b0c1912130f141d1a1f1e1d1a1c1c20242e2720222c231c1c2837292c30313434341f27393d38323c2e333432ffc0000b080001000101011100ffc40014100100000000000000000000000000000000ffda00080001000100003f00fbffd9",
      "hex",
    );
    const tmpUpload = path.join(dir, "fresh.jpg");
    fs.writeFileSync(tmpUpload, jpeg);
    const committed = commitServiceImage("netflix-private", tmpUpload);
    updateService("netflix-private", committed);
    persistLiveCatalog();
    const uploadsDir = getServiceUploadsDir();
    closeDatabase();

    wipeSqlite(dir);
    fs.rmSync(uploadsDir, { recursive: true, force: true });

    initDatabase(path.join(dir, "live.db"));
    seedDatabase();

    const restored = listServices().find((s) => s.id === "netflix-private");
    assert.equal(restored.imageUrl, "/api/services/netflix-private/image");
    assert.ok(restored.imageData && restored.imageData.length > 20);
    assert.equal(
      fs.existsSync(path.join(getServiceUploadsDir(), "netflix-private.jpg")),
      true,
    );
  });
});
