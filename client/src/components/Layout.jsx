import { useCallback } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { buildWhatsAppUrl, nextSupportNumber } from "../data/catalog.js";

export default function Layout({ lang, setLang, t }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const openFab = useCallback(() => {
    const phone = nextSupportNumber();
    const msg =
      lang === "ar"
        ? "مرحباً، أحتاج مساعدة من GlobalStores.com"
        : "Hello, I need help from GlobalStores.com";
    window.open(buildWhatsAppUrl(phone, msg), "_blank", "noopener,noreferrer");
  }, [lang]);

  const servicesHref = isHome ? "#services" : "/#services";
  const whatsappHref = isHome ? "#whatsapp" : "/#whatsapp";

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            GlobalStores.com
          </Link>
          <nav className="nav-links" aria-label="Main">
            <a href={servicesHref}>{t.navServices}</a>
            <a href={whatsappHref}>{t.navWhatsApp}</a>
          </nav>
          <div className="header-actions">
            <Link
              to="/complaint"
              className={`btn btn-complaint-header${location.pathname === "/complaint" ? " active" : ""}`}
            >
              {t.complaintButton}
            </Link>
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
          <strong>GlobalStores.com</strong>
          <div>{t.footerOwners}</div>
          <div>
            +923228791573 | +923014968769 | global2stor2@gmail.com
          </div>
          <div className="footer-links">
            <a href={servicesHref}>{t.navServices}</a>
            <Link to="/complaint">{t.navComplaint}</Link>
            <Link to="/">{t.footerTerms}</Link>
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
