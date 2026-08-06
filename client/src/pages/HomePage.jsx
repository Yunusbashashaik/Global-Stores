import { useEffect, useState } from "react";
import FaqSection from "../components/FaqSection.jsx";
import ServiceIcon from "../components/ServiceIcon.jsx";
import ServicesSection from "../components/ServicesSection.jsx";
import ViewPlansModal from "../components/ViewPlansModal.jsx";
import { SERVICES, fetchServices } from "../data/catalog.js";

const HERO_LOGO_IDS = [
  "netflix-private",
  "netflix-prime",
  "youtube-premium",
  "disney-plus",
  "hbo-max",
  "iptv",
  "canva",
  "nordvpn",
  "apple-tv-plus",
  "paramount-plus",
  "zee5",
  "sonyliv",
  "chatgpt-plus",
  "spotify-premium",
  "expressvpn",
];

export default function HomePage({ lang, t }) {
  const [services, setServices] = useState(SERVICES);
  const [loadError, setLoadError] = useState("");
  const [plansService, setPlansService] = useState(null);
  const [showAll, setShowAll] = useState(false);

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

  const heroLogos = (() => {
    const byId = new Map(services.map((s) => [s.id, s]));
    const picked = HERO_LOGO_IDS.map((id) => byId.get(id)).filter(Boolean);
    return picked.length ? picked.slice(0, 15) : services.slice(0, 15);
  })();

  const headline = t.heroHeadlineParts || {
    before: t.heroHeadline,
    highlight: "",
    after: "",
  };

  return (
    <main className="home-main">
      <section className="hero-banner" id="top">
        <div className="hero-banner-glow" aria-hidden="true" />
        <div className="container hero">
          <div className="hero-layout">
            <div className="hero-copy">
              <p className="hero-badge">
                <span aria-hidden="true">★</span> {t.heroBadge}
              </p>
              <h1>
                {headline.before}
                {headline.highlight ? (
                  <span className="hero-highlight">{headline.highlight}</span>
                ) : null}
                {headline.after}
              </h1>
              <p className="hero-tagline">{t.tagline}</p>
              <div className="hero-actions">
                <a href="#services" className="btn btn-primary">
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
                    <path
                      fill="currentColor"
                      d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                    />
                  </svg>
                  {t.heroCta}
                </a>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("gs:open-modal", { detail: "how" }),
                    )
                  }
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
                    <path fill="currentColor" d="M8 5v14l11-7z" />
                  </svg>
                  {t.navHowItWorks}
                </button>
              </div>
              <ul className="hero-trust">
                {t.heroTrust.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.body}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-orb" />
              <div className="hero-logo-grid">
                {heroLogos.map((service) => (
                  <div key={service.id} className="hero-logo-tile">
                    <ServiceIcon service={service} size="sm" />
                  </div>
                ))}
                <div className="hero-logo-tile hero-logo-more">
                  <span>&amp; {t.heroMore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-bar-wrap">
        <div className="trust-bar container" aria-label={t.trustBarLabel}>
          {t.trustBarDetailed.map((item) => (
            <div key={item.title} className="trust-bar-item">
              <span className="trust-icon" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="catalog-band" id="services">
        <div className="container catalog">
          <div className="catalog-header">
            <h2>
              <span className="catalog-bar" aria-hidden="true" />
              {t.catalogTitle}
            </h2>
            {services.length > 6 ? (
              <button
                type="button"
                className="catalog-view-all catalog-view-all--header"
                onClick={() => setShowAll(true)}
              >
                {t.viewAll}
                <span aria-hidden="true">→</span>
              </button>
            ) : null}
          </div>
          {loadError ? <p className="catalog-note">{loadError}</p> : null}
          <ServicesSection
            services={services}
            lang={lang}
            t={t}
            onViewPlans={setPlansService}
            showAll={showAll}
            onShowAll={() => setShowAll(true)}
            onCloseAll={() => setShowAll(false)}
          />
        </div>
      </section>

      <section className="feature-bars container" aria-label={t.featureBarsLabel}>
        <div className="feature-bar feature-bar--dark">
          {t.featureBarDark.map((item) => (
            <div key={item} className="feature-bar-item">
              {item}
            </div>
          ))}
        </div>
        <div className="feature-bar feature-bar--support">
          {t.featureBarSupport.map((item) => (
            <div key={item} className="feature-bar-item">
              {item}
            </div>
          ))}
        </div>
      </section>

      <FaqSection key={lang} t={t} />

      {plansService ? (
        <ViewPlansModal
          service={plansService}
          lang={lang}
          t={t}
          onClose={() => setPlansService(null)}
        />
      ) : null}
    </main>
  );
}
