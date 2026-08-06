import ServiceIcon from "./ServiceIcon.jsx";

/** Compact card matching Picture 2 — description is hidden until View Plans. */
export default function ServiceCard({ service, lang, t, onViewPlans }) {
  const name = lang === "ar" ? service.nameAr : service.nameEn;
  const type =
    lang === "ar"
      ? service.typeAr || "مشترك / خاص"
      : service.typeEn || "Shared / Private";
  const currency = lang === "ar" ? "د.ك" : "KD";
  const startingPrice = Math.min(
    service.prices.month ?? Infinity,
    service.prices.year ?? Infinity,
  );

  return (
    <article className="card service-card" id={service.id}>
      <ServiceIcon service={service} />
      <h3 className="service-card-name">{name}</h3>
      <p className="service-card-type">{type}</p>

      <div className="service-price-row">
        <div className="service-price-meta">
          <svg className="service-cal-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
            />
          </svg>
          <span>{t.month}</span>
        </div>
        <div className="service-price-start">
          <span className="service-price-label">{t.startingFrom}</span>
          <strong className="price-tag">
            {startingPrice} {currency}
          </strong>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary btn-view-plans"
        onClick={() => onViewPlans?.(service)}
      >
        {t.viewPlans}
      </button>
    </article>
  );
}
