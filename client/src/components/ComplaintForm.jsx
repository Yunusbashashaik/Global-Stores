import { useEffect, useRef, useState } from "react";
import { apiUrl, hasBackendApi } from "../lib/adminApi.js";

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

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
    if (!file.type.startsWith("image/")) {
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
    if (apiReady === false) {
      setError(t.complaintApiUnavailable);
      return;
    }
    if (!form.screenshot) {
      setError(t.screenshotRequired || "Screenshot is required");
      return;
    }
    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("fullName", form.fullName);
      body.append("phone", form.phone);
      body.append("subject", form.subject);
      body.append("details", form.details);
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
        throw new Error(
          res.ok
            ? t.complaintApiUnavailable
            : data.error || t.complaintApiUnavailable,
        );
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
      <form className="complaint-form" onSubmit={onSubmit}>
        {apiReady === false ? (
          <p className="error-text" role="status">
            {t.complaintApiUnavailable}
          </p>
        ) : null}
        <label>
          {t.fullName}
          <input
            required
            maxLength={120}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </label>
        <label>
          {t.phone}
          <input
            required
            maxLength={40}
            inputMode="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label>
          {t.subject}
          <input
            required
            maxLength={160}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </label>
        <label>
          {t.details}
          <textarea
            required
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
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
          <span className="field-hint">{t.screenshotHint}</span>
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !form.screenshot || apiReady === false}
        >
          {t.submit}
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
