import { serviceImageUrl } from "../data/serviceImages.js";
import { apiUrl } from "./adminApi.js";

function withCacheBust(url, updatedAt) {
  if (!url) return "";
  if (!updatedAt || url.includes("v=")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${encodeURIComponent(String(updatedAt).replace(/\s/g, "T"))}`;
}

function toAbsolute(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (
    pathOrUrl.startsWith("http://") ||
    pathOrUrl.startsWith("https://") ||
    pathOrUrl.startsWith("blob:")
  ) {
    return pathOrUrl;
  }
  return apiUrl(pathOrUrl);
}

/** Uploaded artwork first; bundled brand files only when no custom image is stored. */
export function serviceImageCandidates(service) {
  const id = service?.id || "";
  const updatedAt = service?.updatedAt || "";
  const uploaded = String(service?.imageUrl || "").trim();
  if (uploaded) {
    return [
      ...new Set(
        [
          withCacheBust(toAbsolute(uploaded), updatedAt),
          withCacheBust(toAbsolute(`/api/uploads/services/${id}.jpg`), updatedAt),
          withCacheBust(toAbsolute(`/service-images/${id}.jpg`), updatedAt),
        ].filter(Boolean),
      ),
    ];
  }
  const bundled = serviceImageUrl(id);
  return bundled ? [bundled] : [];
}

export function serviceImagePreviewSrc(preview, service) {
  if (!preview) return "";
  if (preview.startsWith("blob:")) return preview;
  return serviceImageCandidates({ ...service, imageUrl: preview })[0] || toAbsolute(preview);
}
