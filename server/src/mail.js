import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

/* TEMP test inbox — revert to global2stor2@gmail.com after verification */
const TARGET_EMAIL =
  process.env.COMPLAINT_EMAIL || "yunusbasha.shaik@gmail.com";

const CID = "complaint-screenshot";

function createTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build HTML + text bodies with the screenshot shown inline in the HTML body. */
export function buildComplaintEmailContent(ticket) {
  const text = [
    `Ticket: ${ticket.id}`,
    `Name: ${ticket.fullName}`,
    `Phone: ${ticket.phone}`,
    `Subject: ${ticket.subject}`,
    "",
    ticket.details,
    "",
    "Screenshot: see attached / inline image in the HTML email.",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="padding:20px 24px;background:#0b1220;color:#f8fafc;">
        <strong style="font-size:18px;">GlobalStore Complaint</strong>
        <div style="opacity:0.8;font-size:13px;margin-top:4px;">${escapeHtml(ticket.id)}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 24px;">
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(ticket.fullName)}</p>
        <p style="margin:0 0 8px;"><strong>Phone:</strong> ${escapeHtml(ticket.phone)}</p>
        <p style="margin:0 0 16px;"><strong>Subject:</strong> ${escapeHtml(ticket.subject)}</p>
        <p style="margin:0 0 8px;"><strong>Details:</strong></p>
        <p style="margin:0 0 20px;white-space:pre-wrap;line-height:1.5;">${escapeHtml(ticket.details)}</p>
        <p style="margin:0 0 10px;"><strong>Screenshot:</strong></p>
        <img
          src="cid:${CID}"
          alt="Complaint screenshot"
          style="display:block;max-width:100%;height:auto;border:1px solid #e2e8f0;border-radius:8px;"
        />
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { text, html };
}

export async function sendComplaintEmail(ticket, screenshotPath) {
  const transport = createTransport();
  const screenshot = await fs.readFile(screenshotPath);
  const filename = path.basename(screenshotPath);
  const { text, html } = buildComplaintEmailContent(ticket);

  const mail = {
    from: process.env.SMTP_FROM || "noreply@globalstore.com",
    to: TARGET_EMAIL,
    // Email subject = the Subject field from the complaint form
    subject: ticket.subject,
    text,
    html,
    attachments: [
      {
        filename,
        content: screenshot,
        cid: CID,
        contentDisposition: "inline",
      },
      {
        filename,
        content: screenshot,
        contentDisposition: "attachment",
      },
    ],
  };

  if (transport) {
    await transport.sendMail(mail);
    return { mode: "smtp" };
  }

  console.log(
    `[dev] Complaint ${ticket.id} logged (no SMTP). Would email ${TARGET_EMAIL}.`,
  );
  return { mode: "dev-log" };
}
