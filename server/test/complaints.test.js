import assert from "node:assert/strict";
import { describe, it } from "node:test";
import request from "supertest";
import express from "express";
import { complaintRouter } from "../src/routes/complaints.js";

describe("complaints API", () => {
  const app = express();
  app.use("/api/complaints", complaintRouter);

  it("rejects missing screenshot", async () => {
    const res = await request(app)
      .post("/api/complaints")
      .field("fullName", "Test User")
      .field("phone", "+96550000000")
      .field("subject", "Test")
      .field("details", "Details");
    assert.equal(res.status, 400);
    assert.match(res.body.error, /Screenshot/);
  });
});
