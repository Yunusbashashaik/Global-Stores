import { useEffect, useState } from "react";
import GlassModal from "./GlassModal.jsx";
import {
  adminCreateService,
  adminFetchServices,
  adminFetchSettings,
  adminLogin,
  adminSaveService,
  adminSaveSettings,
  adminValidateSession,
} from "../lib/adminApi.js";

const TOKEN_KEY = "globalstores_admin_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

const emptyServiceDraft = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  prices: { month: "", year: "" },
};

const EDIT_SECTIONS = [
  { id: "services", labelKey: "adminEditServices" },
  { id: "email", labelKey: "adminEditEmail" },
  { id: "contact", labelKey: "adminEditContact" },
  { id: "about", labelKey: "adminEditAbout" },
];

export default function AdminPanel({ open, onClose, t }) {
  const [token, setTokenState] = useState(() => getToken());
  const [view, setView] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);

  const [services, setServices] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState(emptyServiceDraft);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [editMenuOpen, setEditMenuOpen] = useState(false);

  const [settingsDraft, setSettingsDraft] = useState(null);
  const [confirmContact, setConfirmContact] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError("");
    setMessage("");
    setEditMenuOpen(false);
    setImageFile(null);
    setImagePreview("");
    setConfirmContact(false);

    const existing = getToken();
    if (!existing) {
      setTokenState("");
      setView("login");
      return;
    }

    let cancelled = false;
    setChecking(true);
    adminValidateSession(existing)
      .then((ok) => {
        if (cancelled) return;
        if (!ok) {
          setToken("");
          setTokenState("");
          setView("login");
          return;
        }
        setTokenState(existing);
        setView("dashboard");
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const loadServices = async (sessionToken) => {
    const list = await adminFetchServices(sessionToken);
    setServices(list);
    return list;
  };

  const loadSettings = async (sessionToken) => {
    const settings = await adminFetchSettings(sessionToken);
    setSettingsDraft({
      complaintEmail: settings.complaintEmail || "",
      whatsappNumbers: [...(settings.whatsappNumbers || [])],
      aboutEn: settings.aboutEn || "",
      aboutAr: settings.aboutAr || "",
      socialLinks: {
        whatsapp: settings.socialLinks?.whatsapp || "",
        instagram: settings.socialLinks?.instagram || "",
        tiktok: settings.socialLinks?.tiktok || "",
        youtube: settings.socialLinks?.youtube || "",
        facebook: settings.socialLinks?.facebook || "",
      },
    });
    return settings;
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const sessionToken = await adminLogin(username, password);
      setToken(sessionToken);
      setTokenState(sessionToken);
      setPassword("");
      setView("dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    setToken("");
    setTokenState("");
    setView("login");
    setServices([]);
    setSelectedId("");
    setDraft(emptyServiceDraft);
    setSettingsDraft(null);
    setMessage("");
    setError("");
  };

  const openAdd = () => {
    setView("add");
    setDraft(emptyServiceDraft);
    setImageFile(null);
    setImagePreview("");
    setError("");
    setMessage("");
  };

  const openEditMenu = () => {
    setEditMenuOpen((v) => !v);
  };

  const selectEditSection = async (sectionId) => {
    setEditMenuOpen(false);
    setError("");
    setMessage("");
    setBusy(true);
    try {
      if (sectionId === "services") {
        const list = await loadServices(token);
        const first = list[0];
        setSelectedId(first?.id || "");
        setDraft(first ? toDraft(first) : emptyServiceDraft);
        setImageFile(null);
        setImagePreview(first?.imageUrl || "");
        setView("edit-services");
      } else {
        await loadSettings(token);
        setView(`edit-${sectionId}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onSelectService = (id) => {
    setSelectedId(id);
    const service = services.find((s) => s.id === id);
    if (service) {
      setDraft(toDraft(service));
      setImagePreview(service.imageUrl || "");
    }
    setImageFile(null);
    setMessage("");
    setError("");
  };

  const onPickImage = (file) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    const ok =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg");
    if (!ok) {
      setError(t.adminImageJpegOnly);
      return;
    }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSaveNew = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await adminCreateService(
        token,
        {
          nameEn: draft.nameEn,
          nameAr: draft.nameAr || draft.nameEn,
          descriptionEn: draft.descriptionEn,
          descriptionAr: draft.descriptionAr,
          prices: {
            month: Number(draft.prices.month),
            year: Number(draft.prices.year),
          },
        },
        imageFile,
      );
      setMessage(t.adminCreated);
      setDraft(emptyServiceDraft);
      setImageFile(null);
      setImagePreview("");
      setView("dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onSaveEditService = async (e) => {
    e.preventDefault();
    if (!selectedId) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const updated = await adminSaveService(
        token,
        selectedId,
        {
          nameEn: draft.nameEn,
          nameAr: draft.nameAr,
          descriptionEn: draft.descriptionEn,
          descriptionAr: draft.descriptionAr,
          prices: {
            month: Number(draft.prices.month),
            year: Number(draft.prices.year),
          },
        },
        imageFile,
      );
      setServices((prev) => prev.map((s) => (s.id === selectedId ? updated : s)));
      setDraft(toDraft(updated));
      setImageFile(null);
      setImagePreview(updated.imageUrl || "");
      setMessage(t.adminSaved);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const cancelServiceEdit = () => {
    setSelectedId("");
    setDraft(emptyServiceDraft);
    setImageFile(null);
    setImagePreview("");
    setMessage("");
    setError("");
    setView("dashboard");
  };

  const onSaveEmail = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await adminSaveSettings(token, {
        complaintEmail: settingsDraft.complaintEmail,
      });
      setMessage(t.adminSettingsSaved);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onSaveContact = async (e) => {
    e.preventDefault();
    setConfirmContact(true);
  };

  const confirmSaveContact = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const numbers = (settingsDraft.whatsappNumbers || [])
        .map((n) => String(n).replace(/\D/g, ""))
        .filter(Boolean);
      await adminSaveSettings(token, { whatsappNumbers: numbers });
      setConfirmContact(false);
      setMessage(t.adminSettingsSaved);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onSaveAbout = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await adminSaveSettings(token, {
        aboutEn: settingsDraft.aboutEn,
        aboutAr: settingsDraft.aboutAr,
        socialLinks: settingsDraft.socialLinks,
      });
      setMessage(t.adminSettingsSaved);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  const title =
    view === "login"
      ? t.adminLoginTitle
      : view === "dashboard"
        ? t.adminDashboardTitle
        : view === "add"
          ? t.adminAddServices
          : view === "edit-services"
            ? t.adminEditServices
            : view === "edit-email"
              ? t.adminEditEmail
              : view === "edit-contact"
                ? t.adminEditContact
                : view === "edit-about"
                  ? t.adminEditAbout
                  : t.adminNavLabel;

  return (
    <>
      <GlassModal title={title} onClose={onClose} wide className="admin-modal">
        {checking ? (
          <p className="catalog-note">{t.adminLoading}</p>
        ) : view === "login" ? (
          <form className="admin-login-form" onSubmit={onLogin}>
            <p className="admin-lead">{t.adminLoginLead}</p>
            <label>
              {t.adminUsername}
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label>
              {t.adminPassword}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {error ? <p className="error-text">{error}</p> : null}
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? t.adminWorking : t.adminSignIn}
            </button>
          </form>
        ) : view === "dashboard" ? (
          <div className="admin-dashboard">
            <p className="admin-lead">{t.adminDashboardLead}</p>
            <div className="admin-dashboard-actions">
              <button type="button" className="btn btn-primary" onClick={openAdd}>
                {t.adminAddServices}
              </button>
              <div className="admin-edit-menu">
                <button
                  type="button"
                  className="btn btn-ghost"
                  aria-expanded={editMenuOpen}
                  onClick={openEditMenu}
                >
                  {t.adminEditServicesBtn}
                </button>
                {editMenuOpen ? (
                  <div className="admin-edit-dropdown" role="menu">
                    {EDIT_SECTIONS.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        role="menuitem"
                        onClick={() => selectEditSection(section.id)}
                        disabled={busy}
                      >
                        {t[section.labelKey]}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            {error ? <p className="error-text">{error}</p> : null}
            {message ? <p className="success-text">{message}</p> : null}
            <button type="button" className="btn btn-ghost admin-logout-btn" onClick={logout}>
              {t.adminLogout}
            </button>
          </div>
        ) : view === "add" ? (
          <ServiceForm
            t={t}
            draft={draft}
            setDraft={setDraft}
            imagePreview={imagePreview}
            onPickImage={onPickImage}
            onSubmit={onSaveNew}
            onCancel={() => setView("dashboard")}
            busy={busy}
            error={error}
            message={message}
            requireImage
          />
        ) : view === "edit-services" ? (
          <div className="admin-layout">
            <aside className="admin-sidebar" aria-label="Services">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={`admin-service-btn${selectedId === service.id ? " active" : ""}`}
                  onClick={() => onSelectService(service.id)}
                >
                  <span>
                    {service.icon} {service.nameEn}
                  </span>
                  <small>
                    {service.outOfStock
                      ? t.outOfStock
                      : `${service.prices.month} / ${service.prices.year} KD`}
                  </small>
                </button>
              ))}
            </aside>
            <ServiceForm
              t={t}
              draft={draft}
              setDraft={setDraft}
              imagePreview={imagePreview}
              onPickImage={onPickImage}
              onSubmit={onSaveEditService}
              onCancel={cancelServiceEdit}
              busy={busy}
              error={error}
              message={message}
              disabled={!selectedId}
            />
          </div>
        ) : view === "edit-email" && settingsDraft ? (
          <form className="admin-editor" onSubmit={onSaveEmail}>
            <label>
              {t.adminComplaintEmail}
              <input
                type="email"
                value={settingsDraft.complaintEmail}
                onChange={(e) =>
                  setSettingsDraft((d) => ({ ...d, complaintEmail: e.target.value }))
                }
                required
              />
            </label>
            {error ? <p className="error-text">{error}</p> : null}
            {message ? <p className="success-text">{message}</p> : null}
            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? t.adminWorking : t.adminSave}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setView("dashboard")}
              >
                {t.adminCancel}
              </button>
            </div>
          </form>
        ) : view === "edit-contact" && settingsDraft ? (
          <form className="admin-editor" onSubmit={onSaveContact}>
            <p className="admin-lead">{t.adminContactLead}</p>
            {(settingsDraft.whatsappNumbers || []).map((num, index) => (
              <label key={`wa-${index}`}>
                {t.adminWhatsAppNumber} {index + 1}
                <input
                  value={num}
                  onChange={(e) =>
                    setSettingsDraft((d) => {
                      const next = [...d.whatsappNumbers];
                      next[index] = e.target.value;
                      return { ...d, whatsappNumbers: next };
                    })
                  }
                  required
                />
              </label>
            ))}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                setSettingsDraft((d) => ({
                  ...d,
                  whatsappNumbers: [...d.whatsappNumbers, ""],
                }))
              }
            >
              {t.adminAddWhatsApp}
            </button>
            {error ? <p className="error-text">{error}</p> : null}
            {message ? <p className="success-text">{message}</p> : null}
            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? t.adminWorking : t.adminSave}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setView("dashboard")}
              >
                {t.adminCancel}
              </button>
            </div>
          </form>
        ) : view === "edit-about" && settingsDraft ? (
          <form className="admin-editor" onSubmit={onSaveAbout}>
            <label>
              {t.adminAboutEn}
              <textarea
                value={settingsDraft.aboutEn}
                onChange={(e) =>
                  setSettingsDraft((d) => ({ ...d, aboutEn: e.target.value }))
                }
                required
              />
            </label>
            <label>
              {t.adminAboutAr}
              <textarea
                value={settingsDraft.aboutAr}
                onChange={(e) =>
                  setSettingsDraft((d) => ({ ...d, aboutAr: e.target.value }))
                }
                required
                dir="rtl"
              />
            </label>
            {["whatsapp", "instagram", "tiktok", "youtube", "facebook"].map(
              (key) => {
                const labelMap = {
                  whatsapp: "socialWhatsApp",
                  instagram: "socialInstagram",
                  tiktok: "socialTikTok",
                  youtube: "socialYouTube",
                  facebook: "socialFacebook",
                };
                return (
                <label key={key}>
                  {t[labelMap[key]] || key}
                  <input
                    type="url"
                    value={settingsDraft.socialLinks[key] || ""}
                    onChange={(e) =>
                      setSettingsDraft((d) => ({
                        ...d,
                        socialLinks: { ...d.socialLinks, [key]: e.target.value },
                      }))
                    }
                  />
                </label>
                );
              },
            )}
            {error ? <p className="error-text">{error}</p> : null}
            {message ? <p className="success-text">{message}</p> : null}
            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? t.adminWorking : t.adminSave}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setView("dashboard")}
              >
                {t.adminCancel}
              </button>
            </div>
          </form>
        ) : null}
      </GlassModal>

      {confirmContact ? (
        <GlassModal
          title={t.adminConfirmContactTitle}
          onClose={() => setConfirmContact(false)}
        >
          <p className="modal-prose">{t.adminConfirmContactBody}</p>
          <div className="admin-form-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={confirmSaveContact}
            >
              {busy ? t.adminWorking : t.adminConfirm}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setConfirmContact(false)}
            >
              {t.adminCancel}
            </button>
          </div>
        </GlassModal>
      ) : null}
    </>
  );
}

function ServiceForm({
  t,
  draft,
  setDraft,
  imagePreview,
  onPickImage,
  onSubmit,
  onCancel,
  busy,
  error,
  message,
  requireImage = false,
  disabled = false,
}) {
  return (
    <form className="admin-editor" onSubmit={onSubmit}>
      <label>
        {t.adminImageUpload}
        <input
          type="file"
          accept=".jpg,.jpeg,image/jpeg"
          onChange={(e) => onPickImage(e.target.files?.[0])}
          required={requireImage && !imagePreview}
          disabled={disabled}
        />
      </label>
      {imagePreview ? (
        <div className="admin-image-preview">
          <img src={imagePreview} alt="" />
        </div>
      ) : null}
      <label>
        {t.adminNameEn}
        <input
          value={draft.nameEn}
          onChange={(e) => setDraft((d) => ({ ...d, nameEn: e.target.value }))}
          required
          disabled={disabled}
        />
      </label>
      <label>
        {t.adminDescEn}
        <textarea
          value={draft.descriptionEn}
          onChange={(e) =>
            setDraft((d) => ({ ...d, descriptionEn: e.target.value }))
          }
          required
          disabled={disabled}
        />
      </label>
      <label>
        {t.adminDescAr}
        <textarea
          value={draft.descriptionAr}
          onChange={(e) =>
            setDraft((d) => ({ ...d, descriptionAr: e.target.value }))
          }
          required
          dir="rtl"
          disabled={disabled}
        />
      </label>
      <div className="admin-price-row">
        <label>
          {t.adminPriceMonth}
          <input
            type="number"
            min="0"
            step="0.001"
            value={draft.prices.month}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                prices: { ...d.prices, month: e.target.value },
              }))
            }
            required
            disabled={disabled}
          />
        </label>
        <label>
          {t.adminPriceYear}
          <input
            type="number"
            min="0"
            step="0.001"
            value={draft.prices.year}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                prices: { ...d.prices, year: e.target.value },
              }))
            }
            required
            disabled={disabled}
          />
        </label>
      </div>
      <p className="admin-hint">{t.adminOutOfStockHint}</p>
      {error ? <p className="error-text">{error}</p> : null}
      {message ? <p className="success-text">{message}</p> : null}
      <div className="admin-form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy || disabled}>
          {busy ? t.adminWorking : t.adminSave}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          {t.adminCancel}
        </button>
      </div>
    </form>
  );
}

function toDraft(service) {
  return {
    nameEn: service.nameEn || "",
    nameAr: service.nameAr || "",
    descriptionEn: service.descriptionEn || "",
    descriptionAr: service.descriptionAr || "",
    prices: {
      month: service.prices?.month ?? "",
      year: service.prices?.year ?? "",
    },
  };
}
