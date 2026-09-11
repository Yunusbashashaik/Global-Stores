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
  if (url.includes("v=")) return url;
  const bust = encodeURIComponent(String(updatedAt || "1").replace(/\s/g, "T"));
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${bust}`;
}

function hasCustomUpload(service) {
  return Boolean(String(service?.imageUrl || "").trim());
}

/** Same-origin JPEG routes only — never blob URLs and never a guessed API host. */
export function serviceImageCandidates(service) {
  const id = service?.id || "";
  const updatedAt = service?.updatedAt || "";
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
    return [...new Set([...relative, ...withHost].map((url) => withCacheBust(url, updatedAt)))];
  }
  const bundled = serviceImageUrl(id);
  return bundled ? [bundled] : [];
}

export function serviceImagePreviewSrc(preview, service) {
  if (!preview) return "";
  if (preview.startsWith("blob:")) return preview;
  return (
    serviceImageCandidates({ ...service, imageUrl: preview })[0] || preview
  );
}
