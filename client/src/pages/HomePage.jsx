import { useEffect, useState } from "react";
import FaqSection from "../components/FaqSection.jsx";
import ServiceIcon from "../components/ServiceIcon.jsx";
import ServicesCarousel from "../components/ServicesCarousel.jsx";
import { SERVICES, fetchServices } from "../data/catalog.js";

const HERO_LOGO_IDS = [
  "netflix-private",
  "youtube-premium",
  "disney-plus",
  "hbo-max",
  "iptv",
  "canva",
  "nordvpn",
  "chatgpt-plus",
  "spotify-premium",
  "apple-tv-plus",
  "paramount-plus",
  "shahid",
  "crunchyroll",
  "expressvpn",
  "google-gemini",
];

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

  const heroLogos = (() => {
    const byId = new Map(services.map((s) => [s.id, s]));
    const picked = HERO_LOGO_IDS.map((id) => byId.get(id)).filter(Boolean);
    return picked.length ? picked.slice(0, 15) : services.slice(0, 15);
  })();

  return (
    <main className="home-main">
      <section className="hero container" id="top">
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-kicker">{t.heroKicker}</p>
            <h1>{t.heroHeadline}</h1>
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
                  <ServiceIcon service={service} />
                </div>
              ))}
              <div className="hero-logo-tile hero-logo-more">
                <span>&amp; {t.heroMore}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-bar container" aria-label={t.trustBarLabel}>
        {t.trustBar.map((item) => (
          <div key={item} className="trust-bar-item">
            <span className="trust-dot" aria-hidden="true" />
            {item}
          </div>
        ))}
      </section>

      <section className="catalog container" id="services">
        <div className="catalog-header">
          <h2>
            <span className="catalog-bar" aria-hidden="true" />
            {t.catalogTitle}
          </h2>
        </div>
        {loadError ? <p className="catalog-note">{loadError}</p> : null}
        <ServicesCarousel services={services} lang={lang} t={t} />
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
    </main>
  );
}
