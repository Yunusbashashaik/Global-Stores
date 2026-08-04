import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SERVICES,
  buildOrderMessage,
  buildWhatsAppUrl,
  nextSupportNumber,
} from "./data/catalog.js";
import { COPY } from "./data/copy.js";

const LANG_KEY = "globalstores_lang";

function useLanguage() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "ar" ? "ar" : "en";
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    document.body.classList.toggle("rtl", lang === "ar");
  }, [lang]);

  return [lang, setLang];
}

function ServiceCard({ service, lang, t }) {
  const [duration, setDuration] = useState("month");
  const price = service.prices[duration];
  const name = lang === "ar" ? service.nameAr : service.nameEn;
  const description =
    lang === "ar" ? service.descriptionAr : service.descriptionEn;

  const onOrder = () => {
    const phone = nextSupportNumber();
    const message = buildOrderMessage(service, duration, price, lang);
    window.open(buildWhatsAppUrl(phone, message), "_blank", "noopener,noreferrer");
  };

  return (
    <article className="card" id={service.id}>
      <h3>
        {service.icon} {name}
      </h3>
      <pre>{description}</pre>
      <div className="price-toggle" role="group" aria-label="Duration">
        <button
          type="button"
          className={duration === "month" ? "active" : ""}
          onClick={() => setDuration("month")}
        >
          {t.month}
        </button>
        <button
          type="button"
          className={duration === "year" ? "active" : ""}
          onClick={() => setDuration("year")}
        >
          {t.year}
        </button>
      </div>
      <div className="price-tag">
        {price} {lang === "ar" ? "د.ك" : "KD"}
      </div>
      <button type="button" className="btn btn-whatsapp" onClick={onOrder}>
        {t.order}
      </button>
    </article>
  );
}

function ComplaintForm({ t }) {
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

export default function App() {
  const [lang, setLang] = useLanguage();
  const t = COPY[lang];

  const openFab = useCallback(() => {
    const phone = nextSupportNumber();
    const msg =
      lang === "ar"
        ? "مرحباً، أحتاج مساعدة من GlobalStores.com"
        : "Hello, I need help from GlobalStores.com";
    window.open(buildWhatsAppUrl(phone, msg), "_blank", "noopener,noreferrer");
  }, [lang]);

  const supportLinks = useMemo(
    () => [
      { label: "+923228791573", phone: "923228791573" },
      { label: "+923014968769", phone: "923014968769" },
    ],
    [],
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a href="#" className="logo">
            GlobalStores.com
          </a>
          <nav className="nav-links" aria-label="Main">
            <a href="#services">{t.navServices}</a>
            <a href="#whatsapp">{t.navWhatsApp}</a>
            <a href="#complaint">{t.navComplaint}</a>
          </nav>
          <div className="lang-switch" aria-label="Language">
            <button
              type="button"
              className={lang === "en" ? "active" : ""}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === "ar" ? "active" : ""}
              onClick={() => setLang("ar")}
            >
              العربية
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero container" id="top">
          <div className="region-badge">🇰🇼 {t.region}</div>
          <h1>{t.catalogTitle}</h1>
          <p>{t.tagline}</p>
          <a href="#services" className="btn btn-primary">
            {t.heroCta}
          </a>
        </section>

        <section className="intro container">
          <p>{t.brandIntro}</p>
        </section>

        <section className="catalog container" id="services">
          <h2>{t.catalogTitle}</h2>
          <div className="grid">
            {SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section className="support-section container" id="whatsapp">
          <h2>{t.supportTitle}</h2>
          <p>{t.supportBody}</p>
          <div className="support-lines">
            {supportLinks.map((line) => (
              <a
                key={line.phone}
                className="btn btn-whatsapp"
                href={buildWhatsAppUrl(
                  line.phone,
                  lang === "ar"
                    ? "مرحباً GlobalStores.com"
                    : "Hello GlobalStores.com",
                )}
                target="_blank"
                rel="noreferrer"
              >
                {line.label}
              </a>
            ))}
          </div>
        </section>

        <section className="complaint-section container" id="complaint">
          <h2 style={{ textAlign: "center" }}>{t.complaintTitle}</h2>
          <ComplaintForm t={t} />
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <strong>GlobalStores.com</strong>
          <div>{t.footerOwners}</div>
          <div>
            +923228791573 | +923014968769 | global2stor2@gmail.com
          </div>
          <div className="footer-links">
            <a href="#services">{t.navServices}</a>
            <a href="#complaint">{t.navComplaint}</a>
            <a href="#top">{t.footerTerms}</a>
          </div>
        </div>
      </footer>

      <button
        type="button"
        className="fab"
        aria-label={t.fabLabel}
        onClick={openFab}
      >
        💬
      </button>
    </div>
  );
}
