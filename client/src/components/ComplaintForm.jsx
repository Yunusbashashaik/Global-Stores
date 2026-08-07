import { useEffect, useRef, useState } from "react";
import {
  buildWhatsAppUrl,
  nextSupportNumber,
} from "../data/catalog.js";
import { apiUrl, hasBackendApi } from "../lib/adminApi.js";

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|bmp|heic|heif)$/i;
export const COMPLAINT_EMAIL = "global2stor2@gmail.com";

function isImageFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith("image/")) return true;
  // Some mobile browsers leave type empty for gallery JPGs.
  return IMAGE_EXT.test(file.name || "");
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
  const [apiReady, setApiReady] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    hasBackendApi().then((ok) => {
      if (!cancelled) setApiReady(ok);
    });
    return () => {
      cancelled = true;
    };
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

  const openWhatsAppFallback = () => {
    const phone = nextSupportNumber();
    const msg = [
      t.complaintWhatsAppIntro || "GlobalStore complaint:",
      `${t.fullName}: ${form.fullName.trim()}`,
      `${t.phone}: ${form.phone.trim()}`,
      `${t.subject}: ${form.subject.trim()}`,
      "",
      form.details.trim(),
      "",
      form.screenshot
        ? `${t.complaintWhatsAppAttachHint || "I will attach a screenshot next."} (${form.screenshot.name})`
        : "",
      `${t.complaintEmailLabel || "Email"}: ${COMPLAINT_EMAIL}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(buildWhatsAppUrl(phone, msg), "_blank", "noopener,noreferrer");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim() || !form.phone.trim() || !form.subject.trim() || !form.details.trim()) {
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

    // Static GitHub Pages has no API — send via WhatsApp instead.
    if (apiReady === false) {
      openWhatsAppFallback();
      setSuccess(true);
      return;
    }

    setSubmitting(true);
    try {
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
        // API missing/HTML response — fall back to WhatsApp so the live site still works.
        openWhatsAppFallback();
        setSuccess(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Failed");
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
      setError(err.message || t.complaintApiUnavailable);
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
          {apiReady === false ? (
            <>
              {" "}
              — {t.complaintStaticFallbackNote}
            </>
          ) : null}
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
          {apiReady === false ? t.complaintWhatsAppSubmit || t.submit : t.submit}
        </button>
      </form>
      {success ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>{t.successTitle}</h3>
            <p>
              {apiReady === false
                ? t.complaintWhatsAppSuccessBody || t.successBody
                : t.successBody}
            </p>
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
