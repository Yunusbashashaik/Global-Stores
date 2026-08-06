import { serviceImageUrl } from "../data/serviceImages.js";

/** Brand artwork from uploaded GitHub images, with SVG fallback. */
export default function ServiceIcon({ service, size = "md" }) {
  const accent = service.accent || "#0055ff";
  const id = service.id || "";
  const imageUrl = serviceImageUrl(id);
  const name = service.nameEn || id;

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
            loading="lazy"
            decoding="async"
          />
        ) : (
          renderFallback(id, accent, name)
        )}
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
