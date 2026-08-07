import { useRef, useState } from "react";

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|bmp|heic|heif)$/i;
const COMPLAINT_EMAIL =
  import.meta.env.VITE_COMPLAINT_EMAIL || "global2stor2@gmail.com";

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

/** Email the complaint via FormSubmit (works on static GitHub Pages). */
async function sendComplaintEmail(form) {
  const body = new FormData();
  body.append("fullName", form.fullName.trim());
  body.append("phone", form.phone.trim());
  body.append("subject", form.subject.trim());
  body.append(
    "_subject",
    `[GlobalStore Complaint] ${form.subject.trim()}`,
  );
  body.append("details", form.details.trim());
  body.append("screenshot", form.screenshot, form.screenshot.name);
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
        `Activate email delivery once: open the inbox for ${COMPLAINT_EMAIL}, find the FormSubmit “Activate Form” email, and click the link. Then submit your complaint again.`,
      );
    }
    throw new Error(
      msg ||
        `Email delivery failed. Please try again, or check ${COMPLAINT_EMAIL}.`,
    );
  }
  return data;
}

/** Prefer the Node API when hosted; otherwise email directly from the browser. */
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
      // Static host / HTML response — use email service instead.
      return sendComplaintEmail(form);
    }
    if (!res.ok) {
      throw new Error(data.error || "Submission failed");
    }
    return data;
  } catch (err) {
    // Network failure talking to API — fall back to email service.
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.subject.trim() ||
      !form.details.trim()
    ) {
      setError(t.complaintFieldsRequired || "All text fields are required");
      return;
    }
    if (!form.screenshot || !isImageFile(form.screenshot)) {
      setError(t.screenshotRequired || "Screenshot is required");
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
      setError(err.message || t.complaintEmailFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form className="complaint-form" onSubmit={onSubmit} noValidate>
        <p className="field-hint complaint-email-note">
          {t.complaintEmailLabel}:{" "}
          <a href={`mailto:${COMPLAINT_EMAIL}`}>{COMPLAINT_EMAIL}</a>
        </p>
        <label>
          {t.fullName}
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
          {t.phone}
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
          {t.subject}
          <input
            required
            name="subject"
            maxLength={160}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </label>
        <label>
          {t.details}
          <textarea
            required
            name="details"
            maxLength={4000}
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
          />
        </label>
        <label>
          {t.screenshot}
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
        {error ? <p className="error-text">{error}</p> : null}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !form.screenshot}
        >
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
