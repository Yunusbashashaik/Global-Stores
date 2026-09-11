import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import fs from "fs";
import os from "os";
import path from "path";
import { closeDatabase, initDatabase } from "../src/db/connection.js";
import { persistLiveCatalog } from "../src/db/persist.js";
import { seedDatabase } from "../src/db/seed.js";
import { listServices, updateService } from "../src/models/Service.js";

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
});
