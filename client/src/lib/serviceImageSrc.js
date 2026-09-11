import { serviceImageUrl } from "../data/serviceImages.js";

const API_BASE_KEY = "globalstores_api_base_v1";

function readPersistedApiBase() {
  if (typeof window === "undefined") return "";
  try {
    return String(localStorage.getItem(API_BASE_KEY) || "").replace(/\/$/, "");
  } catch {
    return "";
  }
}

function withCacheBust(url, updatedAt) {
  if (!url) return "";
  if (url.startsWith("data:")) return url;
  if (url.includes("v=")) return url;
  const bust = encodeURIComponent(String(updatedAt || "1").replace(/\s/g, "T"));
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${bust}`;
}

function inlineSrc(service) {
  const data = String(service?.imageData || "").trim();
  if (data.startsWith("data:")) return data;
  if (data) return `data:image/jpeg;base64,${data}`;
  const url = String(service?.imageUrl || "").trim();
  if (url.startsWith("data:")) return url;
  return "";
}

function hasCustomUpload(service) {
  return Boolean(inlineSrc(service) || String(service?.imageUrl || "").trim());
}

/** Inline JPEG first, then same-origin files, then bundled brand art — never initials first. */
export function serviceImageCandidates(service) {
  const id = service?.id || "";
  const updatedAt = service?.updatedAt || "";
  const bundled = serviceImageUrl(id);
  const list = [];
  const inline = inlineSrc(service);
  if (inline) list.push(inline);
  if (hasCustomUpload(service) && id) {
    const relative = [
      `/api/services/${id}/image`,
      `/service-images/${id}.jpg`,
      `/api/uploads/services/${id}.jpg`,
    ];
    const persisted = readPersistedApiBase();
    const withHost = persisted
      ? relative.map((path) => `${persisted}${path}`)
      : [];
    list.push(
      ...[...relative, ...withHost].map((url) => withCacheBust(url, updatedAt)),
    );
  }
  if (bundled) list.push(bundled);
  return [...new Set(list.filter(Boolean))];
}

export function serviceImagePreviewSrc(preview, service) {
  if (!preview) return "";
  if (preview.startsWith("blob:") || preview.startsWith("data:")) return preview;
  if (service?.imageData) {
    return inlineSrc(service);
  }
  return (
    serviceImageCandidates({ ...service, imageUrl: preview })[0] || preview
  );
}
