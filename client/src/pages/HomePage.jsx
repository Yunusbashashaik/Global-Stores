import { useEffect, useState } from "react";
import FaqSection from "../components/FaqSection.jsx";
import ServicesCarousel from "../components/ServicesCarousel.jsx";
import { SERVICES, fetchServices } from "../data/catalog.js";

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

  return (
    <main className="home-main">
      <section className="hero container" id="top">
        <h1>{t.heroHeadline}</h1>
        <p>{t.tagline}</p>
        <a href="#services" className="btn btn-primary">
          {t.heroCta}
        </a>
      </section>

      <section className="catalog container" id="services">
        <h2>{t.catalogTitle}</h2>
        {loadError ? <p className="catalog-note">{loadError}</p> : null}
        <ServicesCarousel services={services} lang={lang} t={t} />
      </section>

      <FaqSection key={lang} t={t} />
    </main>
  );
}
