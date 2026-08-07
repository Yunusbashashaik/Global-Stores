import { useRef, useState } from "react";

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|bmp|heic|heif)$/i;
/* TEMP test inbox — revert to global2stor2@gmail.com after verification */
const COMPLAINT_EMAIL =
  import.meta.env.VITE_COMPLAINT_EMAIL || "yunusbasha.shaik@gmail.com";

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

/** Host a copy of the screenshot so the email body always includes a viewable link. */
async function hostScreenshotLink(file) {
  const body = new FormData();
  body.append("file", file, safeScreenshotName(file));
  const res = await fetch("https://tmpfiles.org/api/v1/upload", {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => ({}));
  const pageUrl = data?.data?.url;
  if (!res.ok || !pageUrl) {
    throw new Error("Could not prepare the screenshot link.");
  }
  return String(pageUrl).replace("://tmpfiles.org/", "://tmpfiles.org/dl/");
}

function addHiddenField(formEl, name, value) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  formEl.appendChild(input);
}

/**
 * FormSubmit's /ajax API often drops file attachments.
 * Classic multipart POST (with name="attachment") is the documented path
 * that actually delivers the screenshot as an email attachment.
 */
function sendComplaintEmail(form, screenshotLink) {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Email delivery is only available in the browser."));
      return;
    }

    const subject = form.subject.trim();
    const iframeName = `fs_iframe_${Date.now()}`;
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.title = "complaint-email";
    iframe.setAttribute("aria-hidden", "true");
    Object.assign(iframe.style, {
      position: "fixed",
      width: "1px",
      height: "1px",
      opacity: "0",
      pointerEvents: "none",
      border: "0",
      left: "-9999px",
    });

    const htmlForm = document.createElement("form");
    htmlForm.method = "POST";
    htmlForm.action = `https://formsubmit.co/${encodeURIComponent(COMPLAINT_EMAIL)}`;
    htmlForm.enctype = "multipart/form-data";
    htmlForm.target = iframeName;
    htmlForm.style.display = "none";

    // Email subject = user Subject field
    addHiddenField(htmlForm, "_subject", subject);
    addHiddenField(htmlForm, "_template", "table");
    addHiddenField(htmlForm, "_captcha", "false");
    addHiddenField(htmlForm, "_honey", "");

    // Body fields
    addHiddenField(htmlForm, "Full Name", form.fullName.trim());
    addHiddenField(htmlForm, "Phone Number", form.phone.trim());
    addHiddenField(htmlForm, "Subject", subject);
    addHiddenField(htmlForm, "Complaint Details", form.details.trim());
    addHiddenField(
      htmlForm,
      "Screenshot Note",
      "The uploaded screenshot is attached to this email. A backup view link is also included below.",
    );
    if (screenshotLink) {
      addHiddenField(htmlForm, "Screenshot Link", screenshotLink);
    }

    // Documented FormSubmit attachment field
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.name = "attachment";
    fileInput.accept = "image/*";
    try {
      const dt = new DataTransfer();
      // Ensure the File keeps a sensible name for the attachment
      const named =
        form.screenshot.name && form.screenshot.name.trim()
          ? form.screenshot
          : new File([form.screenshot], safeScreenshotName(form.screenshot), {
              type: form.screenshot.type || "image/png",
            });
      dt.items.add(named);
      fileInput.files = dt.files;
    } catch {
      reject(
        new Error(
          "Could not attach the screenshot. Please try another image file.",
        ),
      );
      return;
    }
    if (!fileInput.files?.length) {
      reject(
        new Error(
          "Could not attach the screenshot. Please try another image file.",
        ),
      );
      return;
    }
    htmlForm.appendChild(fileInput);

    let settled = false;
    let loadCount = 0;
    let timer;

    const cleanup = () => {
      clearTimeout(timer);
      iframe.removeEventListener("load", onLoad);
      htmlForm.remove();
      iframe.remove();
    };

    const finishOk = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ success: true });
    };

    const onLoad = () => {
      loadCount += 1;
      // First load is usually about:blank; FormSubmit navigates after POST.
      if (loadCount >= 2) finishOk();
    };

    // FormSubmit may block reading the iframe; still treat a short wait as sent.
    timer = setTimeout(finishOk, 7000);

    iframe.addEventListener("load", onLoad);
    document.body.appendChild(iframe);
    document.body.appendChild(htmlForm);

    try {
      htmlForm.submit();
    } catch (err) {
      cleanup();
      reject(
        err instanceof Error
          ? err
          : new Error("Could not send the complaint email."),
      );
    }
  });
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
      const screenshotLink = await hostScreenshotLink(form.screenshot).catch(
        () => "",
      );
      return sendComplaintEmail(form, screenshotLink);
    }

    if (!looksLikeApiJson(data)) {
      const screenshotLink = await hostScreenshotLink(form.screenshot).catch(
        () => "",
      );
      return sendComplaintEmail(form, screenshotLink);
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
      const screenshotLink = await hostScreenshotLink(form.screenshot).catch(
        () => "",
      );
      return sendComplaintEmail(form, screenshotLink);
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
