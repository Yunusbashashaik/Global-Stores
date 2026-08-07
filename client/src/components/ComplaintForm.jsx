import { useRef, useState } from "react";

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|bmp|heic|heif)$/i;
const COMPLAINT_EMAIL =
  import.meta.env.VITE_COMPLAINT_EMAIL || "global2stor2@gmail.com";

const FIELD_ORDER = [
  "fullName",
  "phone",
  "subject",
  "details",
  "screenshot",
];

function isImageFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith("image/")) return true;
  // Some mobile browsers leave type empty for gallery JPGs.
  return IMAGE_EXT.test(file.name || "");
}

function apiUrl(path) {
  const base = import.meta.env.VITE_API_URL || "";
  return `${base}${path}`;
}

function fieldLabel(t, key) {
  return t[key] || key;
}

function missingMessage(t, key) {
  const label = fieldLabel(t, key);
  const template = t.fieldMissing || "{field} is missing.";
  return template.replace("{field}", label);
}

function RequiredMark() {
  return (
    <span className="required-asterisk" aria-hidden="true">
      *
    </span>
  );
}

function sanitizeUserError(message, fallback) {
  const raw = String(message || fallback || "Submission failed");
  // Never surface the admin inbox address in user-facing errors.
  return raw.replace(/[\w.+-]+@[\w.-]+\.\w+/g, "the support inbox");
}

function safeScreenshotName(file) {
  const raw = String(file?.name || "screenshot.png");
  const cleaned = raw.replace(/[^\w.\-()+ ]+/g, "_").trim() || "screenshot.png";
  return cleaned.slice(0, 120);
}

/**
 * Email via FormSubmit (static hosts like GitHub Pages / GoDaddy static).
 * - Email subject = the Subject field the user typed (_subject)
 * - Body includes Full Name, Phone, Subject, and Complaint Details
 * - Screenshot is sent as a file attachment
 */
async function sendComplaintEmail(form) {
  const subject = form.subject.trim();
  const filename = safeScreenshotName(form.screenshot);
  const body = new FormData();

  // Email subject line = user-entered Subject
  body.append("_subject", subject);

  // These fields appear in the email body
  body.append("Full Name", form.fullName.trim());
  body.append("Phone Number", form.phone.trim());
  body.append("Subject", subject);
  body.append("Complaint Details", form.details.trim());

  // Screenshot file → email attachment (do not set Content-Type manually)
  body.append("Screenshot", form.screenshot, filename);
  body.append("attachment", form.screenshot, filename);

  body.append("_template", "table");
  body.append("_captcha", "false");
  body.append("_honey", "");

  const res = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(COMPLAINT_EMAIL)}`,
    {
      method: "POST",
      body,
      headers: { Accept: "application/json" },
    },
  );

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      "Could not reach the email service. Please try again in a moment.",
    );
  }

  if (!res.ok || data.success === "false" || data.success === false) {
    const msg = String(data.message || data.error || "");
    if (/activat/i.test(msg)) {
      throw new Error(
        "Activate email delivery once: open the administrator inbox, find the FormSubmit “Activate Form” email, and click the link. Then submit your complaint again.",
      );
    }
    if (/server\s*error/i.test(msg)) {
      throw new Error(
        "Could not send the complaint right now. Please try again in a moment.",
      );
    }
    throw new Error(
      msg || "Email delivery failed. Please try again in a moment.",
    );
  }
  return data;
}

function looksLikeApiJson(data) {
  return (
    data &&
    typeof data === "object" &&
    ("success" in data || "error" in data || "ticketId" in data)
  );
}

/** Prefer the Node API when hosted; otherwise email via FormSubmit. */
async function submitComplaint(form) {
  const body = new FormData();
  body.append("fullName", form.fullName.trim());
  body.append("phone", form.phone.trim());
  body.append("subject", form.subject.trim());
  body.append("details", form.details.trim());
  body.append("screenshot", form.screenshot);

  try {
    const res = await fetch(apiUrl("/api/complaints"), {
      method: "POST",
      body,
    });
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      return sendComplaintEmail(form);
    }

    if (!looksLikeApiJson(data)) {
      return sendComplaintEmail(form);
    }

    if (!res.ok) {
      throw new Error(data.error || "Submission failed");
    }
    return data;
  } catch (err) {
    if (
      err instanceof TypeError ||
      /Failed to fetch|NetworkError|Load failed/i.test(String(err.message))
    ) {
      return sendComplaintEmail(form);
    }
    throw err;
  }
}

export default function ComplaintForm({ t }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    subject: "",
    details: "",
    screenshot: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const onFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setError("");
    if (!file) {
      setForm({ ...form, screenshot: null });
      return;
    }
    if (!isImageFile(file)) {
      setForm({ ...form, screenshot: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setError(t.screenshotNotImage);
      return;
    }
    if (file.size > MAX_SCREENSHOT_BYTES) {
      setForm({ ...form, screenshot: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setError(t.screenshotTooLarge);
      return;
    }
    setForm({ ...form, screenshot: file });
  };

  const firstMissingField = () => {
    for (const key of FIELD_ORDER) {
      if (key === "screenshot") {
        if (!form.screenshot || !isImageFile(form.screenshot)) return key;
        continue;
      }
      if (!String(form[key] || "").trim()) return key;
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const missing = firstMissingField();
    if (missing) {
      setError(missingMessage(t, missing));
      return;
    }
    if (form.screenshot.size > MAX_SCREENSHOT_BYTES) {
      setError(t.screenshotTooLarge);
      return;
    }

    setSubmitting(true);
    try {
      await submitComplaint(form);
      setSuccess(true);
      setForm({
        fullName: "",
        phone: "",
        subject: "",
        details: "",
        screenshot: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(sanitizeUserError(err.message, t.complaintEmailFailed));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form className="complaint-form" onSubmit={onSubmit} noValidate>
        <label>
          <span>
            {t.fullName}
            <RequiredMark />
          </span>
          <input
            required
            name="fullName"
            autoComplete="name"
            maxLength={120}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </label>
        <label>
          <span>
            {t.phone}
            <RequiredMark />
          </span>
          <input
            required
            name="phone"
            type="text"
            autoComplete="tel"
            inputMode="tel"
            maxLength={40}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label>
          <span>
            {t.subject}
            <RequiredMark />
          </span>
          <input
            required
            name="subject"
            maxLength={160}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </label>
        <label>
          <span>
            {t.details}
            <RequiredMark />
          </span>
          <textarea
            required
            name="details"
            maxLength={4000}
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
          />
        </label>
        <label>
          <span>
            {t.screenshot}
            <RequiredMark />
          </span>
          <input
            ref={fileInputRef}
            required
            name="screenshot"
            type="file"
            accept=".png,.jpg,.jpeg,.gif,.webp,.bmp,.heic,.heif,image/*"
            onChange={onFileChange}
          />
          <span className="field-hint">{t.screenshotHint}</span>
        </label>
        {error ? (
          <p className="error-text" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? t.complaintSending || t.submit : t.submit}
        </button>
      </form>
      {success ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>{t.successTitle}</h3>
            <p>{t.successBody}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setSuccess(false)}
            >
              {t.close}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
