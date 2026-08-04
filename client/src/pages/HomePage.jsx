import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard.jsx";
import { SERVICES, buildWhatsAppUrl, fetchServices } from "../data/catalog.js";

export default function HomePage({ lang, t }) {
  const [services, setServices] = useState(SERVICES);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchServices()
      .then((list) => {
        if (!cancelled) {
          setServices(list);
          setLoadError("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(t.servicesLoadFallback);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [t.servicesLoadFallback]);

  const supportLinks = [
    { label: "+923228791573", phone: "923228791573" },
    { label: "+923014968769", phone: "923014968769" },
  ];

  return (
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
        {loadError ? <p className="catalog-note">{loadError}</p> : null}
        <div className="grid">
          {services.map((service) => (
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
    </main>
  );
}
