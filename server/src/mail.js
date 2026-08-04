import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

const TARGET_EMAIL = process.env.COMPLAINT_EMAIL || "global2stor2@gmail.com";

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

export async function sendComplaintEmail(ticket, screenshotPath) {
  const transport = createTransport();
  const screenshot = await fs.readFile(screenshotPath);

  const mail = {
    from: process.env.SMTP_FROM || "noreply@globalstore.com",
    to: TARGET_EMAIL,
    subject: `[GlobalStore Complaint] ${ticket.subject}`,
    text: [
      `Ticket: ${ticket.id}`,
      `Name: ${ticket.fullName}`,
      `Phone: ${ticket.phone}`,
      "",
      ticket.details,
    ].join("\n"),
    attachments: [
      {
        filename: path.basename(screenshotPath),
        content: screenshot,
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
