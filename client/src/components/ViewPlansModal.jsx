import { useState } from "react";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  nextSupportNumber,
} from "../data/catalog.js";
import GlassModal from "./GlassModal.jsx";
import ServiceIcon from "./ServiceIcon.jsx";

export default function ViewPlansModal({ service, lang, t, onClose }) {
  const [duration, setDuration] = useState("month");
  const price = service.prices[duration];
  const name = lang === "ar" ? service.nameAr : service.nameEn;
  const type =
    lang === "ar"
      ? service.typeAr || "مشترك / خاص"
      : service.typeEn || "Shared / Private";
  const description =
    lang === "ar" ? service.descriptionAr : service.descriptionEn;
  const currency = lang === "ar" ? "د.ك" : "KD";

  const onOrder = () => {
    const phone = nextSupportNumber();
    const message = buildOrderMessage(service, duration, price, lang);
    window.open(buildWhatsAppUrl(phone, message), "_blank", "noopener,noreferrer");
  };

  return (
    <GlassModal title={name} onClose={onClose} tone="light">
      <div className="view-plans-modal">
        <div className="view-plans-hero">
          <ServiceIcon service={service} size="lg" />
          <p className="service-card-type">{type}</p>
        </div>

        <pre className="view-plans-desc">{description}</pre>

        <div className="service-price-row view-plans-price-row">
          <div className="service-price-meta">
            <svg className="service-cal-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
              />
            </svg>
            <span>{duration === "month" ? t.month : t.year}</span>
          </div>
          <div className="service-price-start">
            <span className="service-price-label">{t.startingFrom}</span>
            <strong className="price-tag">
              {price} {currency}
            </strong>
          </div>
        </div>

        <div className="price-toggle" role="group" aria-label="Duration">
          <button
            type="button"
            className={duration === "month" ? "active" : ""}
            onClick={() => setDuration("month")}
          >
            {t.month}
            <span className="plan-price">
              {service.prices.month} {currency}
            </span>
          </button>
          <button
            type="button"
            className={duration === "year" ? "active" : ""}
            onClick={() => setDuration("year")}
          >
            {t.year}
            <span className="plan-price">
              {service.prices.year} {currency}
            </span>
          </button>
        </div>

        <button type="button" className="btn btn-whatsapp" onClick={onOrder}>
          {t.order}
        </button>
      </div>
    </GlassModal>
  );
}
