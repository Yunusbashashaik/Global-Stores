import { SERVICES } from "../data/catalog.js";

function trimSlash(value) {
  return String(value || "").replace(/\/$/, "");
}

/** Resolve API origin: runtime config → Vite env → same origin. */
export function getApiBase() {
  if (typeof window !== "undefined") {
    const runtime = window.__GLOBALSTORE_CONFIG__?.apiUrl;
    if (runtime) return trimSlash(runtime);
  }
  return trimSlash(import.meta.env.VITE_API_URL || "");
}

export function apiUrl(path) {
  return `${getApiBase()}${path}`;
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

export function resetBackendAvailability() {
  backendAvailable = undefined;
}

function networkError(err) {
  const message = String(err?.message || err || "");
  if (
    err instanceof TypeError ||
    /failed to fetch|load failed|networkerror|network request failed/i.test(
      message,
    )
  ) {
    return new Error(
      "Cannot reach the API server. On GoDaddy, deploy the Node app and run `npm run build && npm start` (not static files alone). If the API is on another URL, set apiUrl in runtime-config.js.",
    );
  }
  return err instanceof Error ? err : new Error(message || "Request failed");
}

async function requestJson(path, { method = "GET", body, token, formData } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined && !formData) {
    headers["Content-Type"] = "application/json";
  }

  let res;
  try {
    res = await fetch(apiUrl(path), {
      method,
      headers,
      body: formData || (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch (err) {
    throw networkError(err);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function adminLogin(username, password) {
  resetBackendAvailability();
  if (!(await hasBackendApi())) {
    throw new Error(
      "API server is offline. Admin login needs the Node backend on GoDaddy (npm start), not static HTML hosting.",
    );
  }
  const data = await requestJson("/api/admin/login", {
    method: "POST",
    body: { username, password },
  });
  return data.token;
}

export async function adminValidateSession(token) {
  if (!token) return false;
  try {
    await requestJson("/api/admin/me", { token });
    return true;
  } catch {
    return false;
  }
}

export async function adminFetchServices(token) {
  const data = await requestJson("/api/admin/services", { token });
  return data.services;
}

export async function adminCreateService(token, payload, imageFile) {
  const formData = new FormData();
  formData.append("nameEn", payload.nameEn || "");
  formData.append("nameAr", payload.nameAr || payload.nameEn || "");
  formData.append("descriptionEn", payload.descriptionEn || "");
  formData.append("descriptionAr", payload.descriptionAr || "");
  formData.append("priceMonth", String(payload.prices?.month ?? ""));
  formData.append("priceYear", String(payload.prices?.year ?? ""));
  if (payload.outOfStock !== undefined) {
    formData.append("outOfStock", String(Boolean(payload.outOfStock)));
  }
  if (imageFile) formData.append("image", imageFile);

  const data = await requestJson("/api/admin/services", {
    method: "POST",
    token,
    formData,
  });
  window.dispatchEvent(new Event("gs:services-updated"));
  return data.service;
}

export async function adminSaveService(token, id, payload, imageFile) {
  if (imageFile) {
    const formData = new FormData();
    if (payload.nameEn !== undefined) formData.append("nameEn", payload.nameEn);
    if (payload.nameAr !== undefined) formData.append("nameAr", payload.nameAr);
    if (payload.descriptionEn !== undefined) {
      formData.append("descriptionEn", payload.descriptionEn);
    }
    if (payload.descriptionAr !== undefined) {
      formData.append("descriptionAr", payload.descriptionAr);
    }
    if (payload.prices?.month !== undefined) {
      formData.append("priceMonth", String(payload.prices.month));
    }
    if (payload.prices?.year !== undefined) {
      formData.append("priceYear", String(payload.prices.year));
    }
    if (payload.outOfStock !== undefined) {
      formData.append("outOfStock", String(Boolean(payload.outOfStock)));
    }
    formData.append("image", imageFile);
    const data = await requestJson(`/api/admin/services/${id}`, {
      method: "PUT",
      token,
      formData,
    });
    window.dispatchEvent(new Event("gs:services-updated"));
    return data.service;
  }

  const data = await requestJson(`/api/admin/services/${id}`, {
    method: "PUT",
    token,
    body: payload,
  });
  window.dispatchEvent(new Event("gs:services-updated"));
  return data.service;
}

export async function adminFetchSettings(token) {
  const data = await requestJson("/api/admin/settings", { token });
  return data.settings;
}

export async function adminSaveSettings(token, patch) {
  const data = await requestJson("/api/admin/settings", {
    method: "PUT",
    token,
    body: patch,
  });
  window.dispatchEvent(new Event("gs:settings-updated"));
  return data.settings;
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
  return JSON.parse(JSON.stringify(SERVICES));
}

export async function fetchPublicSettings() {
  if (await hasBackendApi()) {
    try {
      const data = await requestJson("/api/settings");
      return data.settings;
    } catch {
      /* fall through */
    }
  }
  return null;
}
