import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TOKEN_KEY = "globalstores_admin_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function api(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

const emptyDraft = {
  prices: { month: "", year: "" },
  descriptionEn: "",
  descriptionAr: "",
  nameEn: "",
  nameAr: "",
};

export default function AdminPage({ t }) {
  const [token, setTokenState] = useState(() => getToken());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [services, setServices] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    setChecking(true);
    api("/api/admin/me", { token })
      .then(() => api("/api/admin/services", { token }))
      .then((data) => {
        if (cancelled) return;
        setServices(data.services);
        const first = data.services[0];
        if (first) {
          setSelectedId(first.id);
          setDraft(toDraft(first));
        }
        setError("");
      })
      .catch(() => {
        if (cancelled) return;
        setToken("");
        setTokenState("");
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const onLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const data = await api("/api/admin/login", {
        method: "POST",
        body: { username, password },
      });
      setToken(data.token);
      setTokenState(data.token);
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onSelect = (id) => {
    setSelectedId(id);
    const service = services.find((s) => s.id === id);
    if (service) setDraft(toDraft(service));
    setMessage("");
    setError("");
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!selectedId) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const data = await api(`/api/admin/services/${selectedId}`, {
        method: "PUT",
        token,
        body: {
          nameEn: draft.nameEn,
          nameAr: draft.nameAr,
          descriptionEn: draft.descriptionEn,
          descriptionAr: draft.descriptionAr,
          prices: {
            month: Number(draft.prices.month),
            year: Number(draft.prices.year),
          },
        },
      });
      setServices((prev) =>
        prev.map((s) => (s.id === selectedId ? data.service : s)),
      );
      setDraft(toDraft(data.service));
      setMessage(t.adminSaved);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    setToken("");
    setTokenState("");
    setServices([]);
    setSelectedId("");
    setDraft(emptyDraft);
    setMessage("");
    setError("");
  };

  if (checking) {
    return (
      <main className="admin-page container">
        <p className="catalog-note">{t.adminLoading}</p>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="admin-page container">
        <p className="complaint-back">
          <Link to="/">← {t.backToHome}</Link>
        </p>
        <h1 className="admin-title">{t.adminLoginTitle}</h1>
        <p className="admin-lead">{t.adminLoginLead}</p>
        <form className="admin-login-form" onSubmit={onLogin}>
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
      </main>
    );
  }

  return (
    <main className="admin-page container">
      <div className="admin-toolbar">
        <p className="complaint-back">
          <Link to="/">← {t.backToHome}</Link>
        </p>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          {t.adminLogout}
        </button>
      </div>
      <h1 className="admin-title">{t.adminDashboardTitle}</h1>
      <p className="admin-lead">{t.adminDashboardLead}</p>

      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Services">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              className={`admin-service-btn${selectedId === service.id ? " active" : ""}`}
              onClick={() => onSelect(service.id)}
            >
              <span>
                {service.icon} {service.nameEn}
              </span>
              <small>
                {service.prices.month} / {service.prices.year} KD
              </small>
            </button>
          ))}
        </aside>

        <form className="admin-editor" onSubmit={onSave}>
          <label>
            {t.adminNameEn}
            <input
              value={draft.nameEn}
              onChange={(e) => setDraft((d) => ({ ...d, nameEn: e.target.value }))}
              required
            />
          </label>
          <label>
            {t.adminNameAr}
            <input
              value={draft.nameAr}
              onChange={(e) => setDraft((d) => ({ ...d, nameAr: e.target.value }))}
              required
              dir="rtl"
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
              />
            </label>
          </div>
          <label>
            {t.adminDescEn}
            <textarea
              value={draft.descriptionEn}
              onChange={(e) =>
                setDraft((d) => ({ ...d, descriptionEn: e.target.value }))
              }
              required
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
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          {message ? <p className="success-text">{message}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={busy || !selectedId}>
            {busy ? t.adminWorking : t.adminSave}
          </button>
        </form>
      </div>
    </main>
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
