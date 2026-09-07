import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import fs from "fs";
import os from "os";
import path from "path";
import express from "express";
import request from "supertest";
import { closeDatabase, initDatabase } from "../src/db/connection.js";
import { seedDatabase } from "../src/db/seed.js";
import { DEFAULT_SERVICES } from "../src/config/defaultServices.js";
import { adminRouter } from "../src/routes/admin.js";
import { servicesRouter } from "../src/routes/services.js";
import { settingsRouter } from "../src/routes/settings.js";

const testDir = fs.mkdtempSync(path.join(os.tmpdir(), "gs-admin-"));

describe("services + admin API", () => {
  let app;

  before(() => {
    initDatabase(path.join(testDir, "test.db"));
    seedDatabase();
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/services", servicesRouter);
    app.use("/api/settings", settingsRouter);
    app.use("/api/admin", adminRouter);
  });

  after(() => {
    closeDatabase();
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it("lists services publicly from the database", async () => {
    const res = await request(app).get("/api/services");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.services));
    assert.ok(res.body.services.length >= 1);
  });

  it("lists public settings from the database", async () => {
    const res = await request(app).get("/api/settings");
    assert.equal(res.status, 200);
    assert.ok(res.body.settings.complaintEmail);
    assert.ok(Array.isArray(res.body.settings.whatsappNumbers));
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

  it("creates a new service that appears on the public list", async () => {
    const login = await request(app)
      .post("/api/admin/login")
      .send({ username: "admin", password: "globalstores" });
    const token = login.body.token;

    const create = await request(app)
      .post("/api/admin/services")
      .set("Authorization", `Bearer ${token}`)
      .field("nameEn", "Test Stream")
      .field("nameAr", "اختبار")
      .field("descriptionEn", "EN desc")
      .field("descriptionAr", "AR desc")
      .field("priceMonth", "2.5")
      .field("priceYear", "18");

    assert.equal(create.status, 201);
    assert.equal(create.body.service.nameEn, "Test Stream");
    assert.equal(create.body.service.prices.month, 2.5);

    const listed = await request(app).get("/api/services");
    const item = listed.body.services.find((s) => s.nameEn === "Test Stream");
    assert.ok(item);
  });

  it("marks zero-price services as out of stock", async () => {
    const login = await request(app)
      .post("/api/admin/login")
      .send({ username: "admin", password: "globalstores" });
    const token = login.body.token;

    const update = await request(app)
      .put("/api/admin/services/netflix-private")
      .set("Authorization", `Bearer ${token}`)
      .send({ prices: { month: 0, year: 0 } });

    assert.equal(update.status, 200);
    assert.equal(update.body.service.outOfStock, true);
    assert.equal(update.body.service.prices.month, 0);
  });

  it("updates complaint email and WhatsApp numbers in settings", async () => {
    const login = await request(app)
      .post("/api/admin/login")
      .send({ username: "admin", password: "globalstores" });
    const token = login.body.token;

    const update = await request(app)
      .put("/api/admin/settings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        complaintEmail: "ops@example.com",
        whatsappNumbers: ["96550001111", "96550002222"],
        aboutEn: "New about",
        socialLinks: { instagram: "https://instagram.com/example" },
      });

    assert.equal(update.status, 200);
    assert.equal(update.body.settings.complaintEmail, "ops@example.com");
    assert.deepEqual(update.body.settings.whatsappNumbers, [
      "96550001111",
      "96550002222",
    ]);
    assert.equal(update.body.settings.aboutEn, "New about");
    assert.equal(
      update.body.settings.socialLinks.instagram,
      "https://instagram.com/example",
    );

    const publicSettings = await request(app).get("/api/settings");
    assert.equal(publicSettings.body.settings.complaintEmail, "ops@example.com");
  });

  it("requires auth for updates", async () => {
    const res = await request(app)
      .put("/api/admin/services/netflix-private")
      .send({ prices: { month: 9 } });
    assert.equal(res.status, 401);
  });

  it("includes newly seeded catalog services", async () => {
    const res = await request(app).get("/api/services");
    assert.equal(res.status, 200);
    const ids = res.body.services.map((s) => s.id);
    assert.ok(ids.includes("disney-plus"));
    assert.ok(ids.includes("chatgpt-plus"));
    assert.ok(ids.includes("expressvpn"));
    assert.ok(res.body.services.length >= DEFAULT_SERVICES.length);
  });

  it("deletes a service from the public catalog", async () => {
    const login = await request(app)
      .post("/api/admin/login")
      .send({ username: "admin", password: "globalstores" });
    const token = login.body.token;

    const created = await request(app)
      .post("/api/admin/services")
      .set("Authorization", `Bearer ${token}`)
      .field("nameEn", "Temp Delete Me")
      .field("descriptionEn", "EN")
      .field("descriptionAr", "AR")
      .field("priceMonth", "1")
      .field("priceYear", "8");
    assert.equal(created.status, 201);
    const id = created.body.service.id;

    const del = await request(app)
      .delete(`/api/admin/services/${id}`)
      .set("Authorization", `Bearer ${token}`);
    assert.equal(del.status, 200);

    const listed = await request(app).get("/api/services");
    assert.equal(
      listed.body.services.some((s) => s.id === id),
      false,
    );
  });

  it("returns and updates owner copy in public settings", async () => {
    const res = await request(app).get("/api/settings");
    assert.ok(res.body.settings.ownersEn);

    const login = await request(app)
      .post("/api/admin/login")
      .send({ username: "admin", password: "globalstores" });
    const token = login.body.token;
    const put = await request(app)
      .put("/api/admin/settings")
      .set("Authorization", `Bearer ${token}`)
      .send({ ownersEn: "Owned by Test Owners" });
    assert.equal(put.status, 200);
    assert.equal(put.body.settings.ownersEn, "Owned by Test Owners");

    const again = await request(app).get("/api/settings");
    assert.equal(again.body.settings.ownersEn, "Owned by Test Owners");
  });

  it("rejects unauthenticated translate and delete", async () => {
    const translate = await request(app)
      .post("/api/admin/translate")
      .send({ text: "Hello" });
    assert.equal(translate.status, 401);

    const del = await request(app).delete("/api/admin/services/netflix-private");
    assert.equal(del.status, 401);
  });
});
