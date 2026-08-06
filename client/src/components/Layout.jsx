import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FEATURED_SERVICE_IDS,
  SERVICES,
  buildWhatsAppUrl,
  fetchServices,
  nextSupportNumber,
} from "../data/catalog.js";
import ComplaintForm from "./ComplaintForm.jsx";
import GlassModal from "./GlassModal.jsx";
import Logo from "./Logo.jsx";
import SocialLinks from "./SocialLinks.jsx";

export default function Layout({ lang, setLang, t }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/" || location.pathname === "";
  const isAdmin = location.pathname.startsWith("/admin");
  const [modal, setModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subsOpen, setSubsOpen] = useState(false);
  const [services, setServices] = useState(SERVICES);
  const subsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchServices()
      .then((list) => {
        if (!cancelled && Array.isArray(list) && list.length) {
          setServices(list);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSubsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onDoc = (e) => {
      if (subsRef.current && !subsRef.current.contains(e.target)) {
        setSubsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  const featured = useMemo(() => {
    const byId = new Map(services.map((s) => [s.id, s]));
    const picked = FEATURED_SERVICE_IDS.map((id) => byId.get(id)).filter(Boolean);
    if (picked.length >= 3) return picked.slice(0, 3);
    return services.slice(0, 3);
  }, [services]);

  const openFab = useCallback(() => {
    const phone = nextSupportNumber();
    const msg =
      lang === "ar"
        ? "مرحباً، أحتاج مساعدة من GlobalStore.com"
        : "Hello, I need help from GlobalStore.com";
    window.open(buildWhatsAppUrl(phone, msg), "_blank", "noopener,noreferrer");
  }, [lang]);

  const goHome = useCallback(() => {
    setModal(null);
    setMenuOpen(false);
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.location.reload();
      return;
    }
    navigate("/");
  }, [isHome, navigate]);

  const openServices = useCallback(() => {
    setSubsOpen(false);
    setMenuOpen(false);
    setModal(null);
    if (isHome) {
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#services");
    }
  }, [isHome, navigate]);

  const openModal = useCallback((id) => {
    setModal(id);
    setMenuOpen(false);
    setSubsOpen(false);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    if (location.hash === "#services" && isHome) {
      requestAnimationFrame(() => {
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [location.hash, isHome]);

  useEffect(() => {
    const onOpen = (e) => {
      if (typeof e.detail === "string") openModal(e.detail);
    };
    window.addEventListener("gs:open-modal", onOpen);
    return () => window.removeEventListener("gs:open-modal", onOpen);
  }, [openModal]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo" aria-label="Global Store" onClick={() => setModal(null)}>
            <Logo showTagline />
          </Link>

          <nav className={`site-nav${menuOpen ? " open" : ""}`} aria-label="Primary">
            <ul className="nav-links">
              <li>
                <button type="button" className="nav-link-btn" onClick={goHome}>
                  {t.navHome}
                </button>
              </li>
              <li className={`nav-dropdown${subsOpen ? " open" : ""}`} ref={subsRef}>
                <button
                  type="button"
                  className="nav-link-btn"
                  aria-expanded={subsOpen}
                  aria-haspopup="true"
                  onClick={() => setSubsOpen((v) => !v)}
                >
                  {t.navSubscriptions}
                  <svg className="nav-caret" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
                {subsOpen ? (
                  <div className="nav-dropdown-panel" role="menu">
                    {featured.map((service) => {
                      const label = lang === "ar" ? service.nameAr : service.nameEn;
                      return (
                        <a
                          key={service.id}
                          role="menuitem"
                          href={`/#${service.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setSubsOpen(false);
                            setMenuOpen(false);
                            if (!isHome) {
                              navigate(`/#${service.id}`);
                              return;
                            }
                            document
                              .getElementById(service.id)
                              ?.scrollIntoView({ behavior: "smooth", block: "center" });
                          }}
                        >
                          <span aria-hidden="true">{service.icon}</span>
                          {label}
                        </a>
                      );
                    })}
                    <button
                      type="button"
                      className="nav-dropdown-more"
                      role="menuitem"
                      onClick={openServices}
                    >
                      {t.navViewMore}
                    </button>
                  </div>
                ) : null}
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link-btn"
                  onClick={() => openModal("how")}
                >
                  {t.navHowItWorks}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link-btn"
                  onClick={() => openModal("about")}
                >
                  {t.aboutTitle}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link-btn"
                  onClick={() => openModal("contact")}
                >
                  {t.navContact}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link-btn"
                  onClick={() => openModal("complaint")}
                >
                  {t.navComplaint}
                </button>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="header-icon-btn header-whatsapp"
              aria-label={t.fabLabel}
              onClick={openFab}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M12.04 2c-5.46 0-9.91 4.43-9.91 9.9 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.9-4.44 9.9-9.9C21.95 6.44 17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.48-1.38-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74 1.75.76 2.22.76 2.64.68.4-.08 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.17-.47-.29z"
                />
              </svg>
            </button>

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

            <Link
              to="/admin"
              className="header-icon-btn header-admin"
              aria-label={t.navAdmin}
              title={t.navAdmin}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                />
              </svg>
            </Link>

            <button
              type="button"
              className={`nav-toggle${menuOpen ? " open" : ""}`}
              aria-expanded={menuOpen}
              aria-label={t.navMenu}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="site-footer">
        <div className="container footer-grid footer-grid--compact">
          <div className="footer-brand-block">
            <strong className="footer-brand">
              <Logo className="logo-footer" />
            </strong>
            <div>{t.footerOwners}</div>
            <div>
              +923228791573 | +923014968769 | global2stor2@gmail.com
            </div>
          </div>

          <div className="footer-links">
            <button type="button" className="footer-link-btn" onClick={openServices}>
              {t.navSubscriptions}
            </button>
            <a href={isHome ? "#faq" : "/#faq"}>{t.faqTitle}</a>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => openModal("about")}
            >
              {t.aboutTitle}
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => openModal("contact")}
            >
              {t.navContact}
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => openModal("complaint")}
            >
              {t.navComplaint}
            </button>
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
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M12.04 2c-5.46 0-9.91 4.43-9.91 9.9 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.9-4.44 9.9-9.9C21.95 6.44 17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.48-1.38-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74 1.75.76 2.22.76 2.64.68.4-.08 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.17-.47-.29z"
            />
          </svg>
        </button>
      ) : null}

      {modal === "how" ? (
        <GlassModal title={t.howTitle} onClose={closeModal}>
          <ol className="how-steps">
            {t.howSteps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </GlassModal>
      ) : null}

      {modal === "about" ? (
        <GlassModal title={t.aboutTitle} onClose={closeModal}>
          <p className="modal-prose">{t.brandIntro}</p>
          <p className="modal-owners">{t.footerOwners}</p>
          <SocialLinks t={t} />
        </GlassModal>
      ) : null}

      {modal === "contact" ? (
        <GlassModal title={t.contactTitle} onClose={closeModal}>
          <div className="contact-details">
            <p className="modal-owners">{t.footerOwners}</p>
            <ul>
              <li>
                <span>{t.contactPhone}</span>
                <a href="https://wa.me/923228791573">+923228791573</a>
              </li>
              <li>
                <span>{t.contactPhone}</span>
                <a href="https://wa.me/923014968769">+923014968769</a>
              </li>
              <li>
                <span>{t.contactEmail}</span>
                <a href="mailto:global2stor2@gmail.com">global2stor2@gmail.com</a>
              </li>
            </ul>
            <button type="button" className="btn btn-whatsapp" onClick={openFab}>
              {t.fabLabel}
            </button>
          </div>
        </GlassModal>
      ) : null}

      {modal === "complaint" ? (
        <GlassModal title={t.complaintTitle} onClose={closeModal} wide>
          <p className="modal-prose complaint-modal-lead">{t.complaintLead}</p>
          <ComplaintForm t={t} />
        </GlassModal>
      ) : null}
    </div>
  );
}
