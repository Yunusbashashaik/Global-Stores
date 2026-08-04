import assert from "node:assert/strict";
import { describe, it, before, after } from "node:test";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import request from "supertest";
import express from "express";
import { adminRouter } from "../src/routes/admin.js";
import { servicesRouter } from "../src/routes/services.js";
import { SERVICES_PATH, writeServices } from "../src/servicesStore.js";
import { DEFAULT_SERVICES } from "../src/defaultServices.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupPath = path.join(__dirname, "services.backup.json");

describe("services + admin API", () => {
  const app = express();
  app.use(express.json());
  app.use("/api/services", servicesRouter);
  app.use("/api/admin", adminRouter);

  before(async () => {
    try {
      await fs.copyFile(SERVICES_PATH, backupPath);
    } catch {
      /* no existing file */
    }
    await writeServices(structuredClone(DEFAULT_SERVICES));
  });

  after(async () => {
    try {
      await fs.copyFile(backupPath, SERVICES_PATH);
      await fs.unlink(backupPath);
    } catch {
      await writeServices(structuredClone(DEFAULT_SERVICES));
    }
  });

  it("lists services publicly", async () => {
    const res = await request(app).get("/api/services");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.services));
    assert.ok(res.body.services.length >= 1);
  });

  it("rejects bad login", async () => {
    const res = await request(app)
      .post("/api/admin/login")
      .send({ username: "admin", password: "wrong" });
    assert.equal(res.status, 401);
  });

  it("logs in and updates a service price/description", async () => {
    const login = await request(app)
      .post("/api/admin/login")
      .send({ username: "admin", password: "globalstores" });
    assert.equal(login.status, 200);
    assert.ok(login.body.token);

    const token = login.body.token;
    const update = await request(app)
      .put("/api/admin/services/netflix-private")
      .set("Authorization", `Bearer ${token}`)
      .send({
        prices: { month: 3, year: 20 },
        descriptionEn: "Updated EN desc",
        descriptionAr: "وصف محدث",
      });
    assert.equal(update.status, 200);
    assert.equal(update.body.service.prices.month, 3);
    assert.equal(update.body.service.prices.year, 20);
    assert.equal(update.body.service.descriptionEn, "Updated EN desc");

    const listed = await request(app).get("/api/services");
    const item = listed.body.services.find((s) => s.id === "netflix-private");
    assert.equal(item.prices.month, 3);
    assert.equal(item.descriptionAr, "وصف محدث");
  });

  it("requires auth for updates", async () => {
    const res = await request(app)
      .put("/api/admin/services/netflix-private")
      .send({ prices: { month: 9 } });
    assert.equal(res.status, 401);
  });
});
