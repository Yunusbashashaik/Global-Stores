import { useState } from "react";

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

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("fullName", form.fullName);
      body.append("phone", form.phone);
      body.append("subject", form.subject);
      body.append("details", form.details);
      body.append("screenshot", form.screenshot);
      const res = await fetch("/api/complaints", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSuccess(true);
      setForm({
        fullName: "",
        phone: "",
        subject: "",
        details: "",
        screenshot: null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form className="complaint-form" onSubmit={onSubmit}>
        <label>
          {t.fullName}
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </label>
        <label>
          {t.phone}
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label>
          {t.subject}
          <input
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </label>
        <label>
          {t.details}
          <textarea
            required
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
          />
        </label>
        <label>
          {t.screenshot}
          <input
            required
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, screenshot: e.target.files?.[0] ?? null })
            }
          />
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !form.screenshot}
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
