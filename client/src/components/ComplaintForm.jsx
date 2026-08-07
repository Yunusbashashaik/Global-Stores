import { useEffect, useRef, useState } from "react";

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
  return raw.replace(/[\w.+-]+@[\w.-]+\.\w+/g, "the support inbox");
}

function addHiddenField(formEl, name, value) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  formEl.appendChild(input);
}

function looksLikeApiJson(data) {
  return (
    data &&
    typeof data === "object" &&
    ("success" in data || "error" in data || "ticketId" in data)
  );
}

/** Node API path — SMTP embeds + attaches the screenshot image. */
async function submitViaApi(form) {
  const body = new FormData();
  body.append("fullName", form.fullName.trim());
  body.append("phone", form.phone.trim());
  body.append("subject", form.subject.trim());
  body.append("details", form.details.trim());
  body.append("screenshot", form.screenshot);

  const res = await fetch(apiUrl("/api/complaints"), {
    method: "POST",
    body,
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    return null;
  }
  if (!looksLikeApiJson(data)) return null;
  if (!res.ok) throw new Error(data.error || "Submission failed");
  return data;
}

/**
 * FormSubmit classic multipart POST using the USER'S real file input.
 * AJAX / synthetic DataTransfer inputs drop attachments; native file inputs do not.
 * The screenshot arrives on the email as a real image attachment.
 */
function submitViaFormSubmitNative(form, fileInputEl, fileSlotEl) {
  return new Promise((resolve, reject) => {
    if (!fileInputEl?.files?.length) {
      reject(new Error("Screenshot is missing."));
      return;
    }

    const subject = form.subject.trim();
    const iframeName = `fs_native_${Date.now()}`;
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

    addHiddenField(htmlForm, "_subject", subject);
    addHiddenField(htmlForm, "_template", "table");
    addHiddenField(htmlForm, "_captcha", "false");
    addHiddenField(htmlForm, "_honey", "");
    addHiddenField(htmlForm, "Full Name", form.fullName.trim());
    addHiddenField(htmlForm, "Phone Number", form.phone.trim());
    addHiddenField(htmlForm, "Subject", subject);
    addHiddenField(htmlForm, "Complaint Details", form.details.trim());

    // Move the real user-selected file input (required for FormSubmit attachments)
    const originalParent = fileSlotEl || fileInputEl.parentElement;
    const originalName = fileInputEl.name;
    fileInputEl.name = "attachment";
    htmlForm.appendChild(fileInputEl);

    let settled = false;
    let loadCount = 0;
    let timer;

    const restoreFileInput = () => {
      fileInputEl.name = originalName;
      if (originalParent) originalParent.appendChild(fileInputEl);
    };

    const cleanup = () => {
      clearTimeout(timer);
      iframe.removeEventListener("load", onLoad);
      restoreFileInput();
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
      if (loadCount >= 2) finishOk();
    };

    timer = setTimeout(finishOk, 8000);
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
  const fileSlotRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("sent") === "1") {
      setSuccess(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("sent");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  }, []);

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
    if (!fileInputRef.current?.files?.length) {
      setError(missingMessage(t, "screenshot"));
      return;
    }

    setSubmitting(true);
    try {
      // Prefer Node API when it is a real JSON API (embeds image in email).
      try {
        const apiResult = await submitViaApi(form);
        if (apiResult) {
          setSuccess(true);
          setForm({
            fullName: "",
            phone: "",
            subject: "",
            details: "",
            screenshot: null,
          });
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
      } catch (apiErr) {
        // Only fall through to FormSubmit for network / non-API hosts.
        if (
          !(apiErr instanceof TypeError) &&
          !/Failed to fetch|NetworkError|Load failed/i.test(
            String(apiErr.message),
          )
        ) {
          // API returned a real validation/server error
          throw apiErr;
        }
      }

      // FormSubmit native multipart with the real file input → image attachment
      await submitViaFormSubmitNative(
        form,
        fileInputRef.current,
        fileSlotRef.current,
      );
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
          <span ref={fileSlotRef}>
            <input
              ref={fileInputRef}
              required
              name="attachment"
              type="file"
              accept=".png,.jpg,.jpeg,.gif,.webp,.bmp,.heic,.heif,image/*"
              onChange={onFileChange}
            />
          </span>
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
