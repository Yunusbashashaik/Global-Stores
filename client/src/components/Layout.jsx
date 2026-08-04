import { useCallback } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { buildWhatsAppUrl, nextSupportNumber } from "../data/catalog.js";
import Logo from "./Logo.jsx";
import SocialLinks from "./SocialLinks.jsx";

export default function Layout({ lang, setLang, t }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAdmin = location.pathname.startsWith("/admin");

  const openFab = useCallback(() => {
    const phone = nextSupportNumber();
    const msg =
      lang === "ar"
        ? "مرحباً، أحتاج مساعدة من GlobalStores.com"
        : "Hello, I need help from GlobalStores.com";
    window.open(buildWhatsAppUrl(phone, msg), "_blank", "noopener,noreferrer");
  }, [lang]);

  const servicesHref = isHome ? "#services" : "/#services";
  const aboutHref = isHome ? "#about" : "/#about";

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo" aria-label="GlobalStores.com">
            <Logo />
          </Link>
          {!isAdmin ? (
            <nav className="nav-links" aria-label="Main">
              <a href={servicesHref}>{t.navServices}</a>
              <a href={aboutHref}>{t.aboutTitle}</a>
            </nav>
          ) : (
            <nav className="nav-links" aria-label="Main">
              <span className="nav-muted">{t.adminNavLabel}</span>
            </nav>
          )}
          <div className="header-actions">
            {!isAdmin ? (
              <Link
                to="/complaint"
                className={`btn btn-complaint-header${location.pathname === "/complaint" ? " active" : ""}`}
              >
                {t.complaintButton}
              </Link>
            ) : null}
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
        </div>
      </header>

      <Outlet />

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand-block">
            <strong className="footer-brand">
              <Logo className="logo-footer" />
            </strong>
            <div>{t.footerOwners}</div>
            <div>
              +923228791573 | +923014968769 | global2stor2@gmail.com
            </div>
          </div>

          <section
            className="footer-about"
            id="about"
            aria-labelledby="footer-about-title"
          >
            <h2 id="footer-about-title">{t.aboutTitle}</h2>
            <p>{t.brandIntro}</p>
            <SocialLinks t={t} />
          </section>

          <div className="footer-links">
            <a href={servicesHref}>{t.navServices}</a>
            <a href={aboutHref}>{t.aboutTitle}</a>
            <Link to="/complaint">{t.navComplaint}</Link>
            <Link to="/">{t.footerTerms}</Link>
            <Link to="/admin">{t.navAdmin}</Link>
          </div>
        </div>
      </footer>

      {!isAdmin ? (
        <button
          type="button"
          className="fab"
          aria-label={t.fabLabel}
          onClick={openFab}
        >
          💬
        </button>
      ) : null}
    </div>
  );
}
