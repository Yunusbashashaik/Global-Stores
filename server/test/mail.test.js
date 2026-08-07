import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildComplaintEmailContent } from "../src/mail.js";

describe("complaint email content", () => {
  it("embeds an inline screenshot image in the HTML body", () => {
    const { text, html } = buildComplaintEmailContent({
      id: "GS-1",
      fullName: "Ada <Test>",
      phone: "+96550000000",
      subject: "Login issue",
      details: "Cannot sign in\nPlease help",
    });

    assert.match(text, /Ada <Test>/);
    assert.match(html, /cid:complaint-screenshot/);
    assert.match(html, /<img[\s\S]*cid:complaint-screenshot/);
    assert.match(html, /Ada &lt;Test&gt;/);
    assert.match(html, /Cannot sign in/);
  });
});
