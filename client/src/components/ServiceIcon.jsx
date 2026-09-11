import { useEffect, useState } from "react";
import { serviceImageCandidates } from "../lib/serviceImageSrc.js";

/** Brand artwork from DB upload or static public assets, with SVG fallback. */
export default function ServiceIcon({ service, size = "md" }) {
  const accent = service.accent || "#0055ff";
  const id = service.id || "";
  const name = service.nameEn || id;
  const candidates = serviceImageCandidates(service);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIndex(0);
    setFailed(false);
  }, [service.id, service.imageUrl, service.updatedAt]);

  const imageUrl = !failed ? candidates[index] : null;

  return (
    <div
      className={`service-icon service-icon--${size}`}
      style={{ "--service-accent": accent }}
      aria-hidden="true"
    >
      <span className="service-icon-glow" />
      <span className="service-icon-mark" data-brand={id}>
        {imageUrl ? (
          <img
            className="service-icon-img"
            src={imageUrl}
            alt=""
            loading={service.imageUrl ? "eager" : "lazy"}
            decoding="async"
            onError={() => {
              if (index + 1 < candidates.length) {
                setIndex((current) => current + 1);
                return;
              }
              setFailed(true);
            }}
          />
        ) : null}
        <span hidden={Boolean(imageUrl)} className="service-icon-fallback">
          {renderFallback(id, accent, name)}
        </span>
      </span>
    </div>
  );
}

function renderFallback(id, accent, name) {
  const label = (name || id || "??").slice(0, 2).toUpperCase();
  return (
    <svg viewBox="0 0 48 48" className="brand-svg">
      <rect width="48" height="48" rx="12" fill="#0b1220" />
      <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} opacity="0.92" />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fill="#fff"
        fontSize="14"
        fontWeight="800"
        fontFamily="Sora,sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}
