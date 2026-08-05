import { SERVICES } from "../data/catalog.js";

const CATALOG_KEY = "globalstores_catalog_overrides";
const STATIC_TOKEN = "static-admin-session";

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "globalstores";

export function apiUrl(path) {
  const base = import.meta.env.VITE_API_URL || "";
  return `${base}${path}`;
}

let backendAvailable;

export async function hasBackendApi() {
  if (backendAvailable !== undefined) return backendAvailable;
  try {
    const res = await fetch(apiUrl("/api/health"), { method: "GET" });
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

function readLocalCatalog() {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function getLocalCatalog() {
  const saved = readLocalCatalog();
  if (saved?.length) return saved;
  return JSON.parse(JSON.stringify(SERVICES));
}

function writeLocalCatalog(services) {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(services));
}

async function requestJson(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(apiUrl(path), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function adminLogin(username, password) {
  if (await hasBackendApi()) {
    const data = await requestJson("/api/admin/login", {
      method: "POST",
      body: { username, password },
    });
    return data.token;
  }
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return STATIC_TOKEN;
  }
  throw new Error("Invalid username or password");
}

export async function adminValidateSession(token) {
  if (!token) return false;
  if (await hasBackendApi()) {
    try {
      await requestJson("/api/admin/me", { token });
      return true;
    } catch {
      return false;
    }
  }
  return token === STATIC_TOKEN;
}

export async function adminFetchServices(token) {
  if (await hasBackendApi()) {
    const data = await requestJson("/api/admin/services", { token });
    return data.services;
  }
  if (token !== STATIC_TOKEN) throw new Error("Unauthorized");
  return getLocalCatalog();
}

export async function adminSaveService(token, id, payload) {
  if (await hasBackendApi()) {
    const data = await requestJson(`/api/admin/services/${id}`, {
      method: "PUT",
      token,
      body: payload,
    });
    return data.service;
  }
  if (token !== STATIC_TOKEN) throw new Error("Unauthorized");
  const list = getLocalCatalog();
  const next = list.map((service) => {
    if (service.id !== id) return service;
    return {
      ...service,
      nameEn: payload.nameEn,
      nameAr: payload.nameAr,
      descriptionEn: payload.descriptionEn,
      descriptionAr: payload.descriptionAr,
      prices: { ...payload.prices },
    };
  });
  writeLocalCatalog(next);
  return next.find((s) => s.id === id);
}

export async function fetchPublicServices() {
  if (await hasBackendApi()) {
    try {
      const data = await requestJson("/api/services");
      return data.services;
    } catch {
      /* fall through */
    }
  }
  return getLocalCatalog();
}
