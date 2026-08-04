import { useState } from "react";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  nextSupportNumber,
} from "../data/catalog.js";

export default function ServiceCard({ service, lang, t }) {
  const [duration, setDuration] = useState("month");
  const price = service.prices[duration];
  const name = lang === "ar" ? service.nameAr : service.nameEn;
  const description =
    lang === "ar" ? service.descriptionAr : service.descriptionEn;

  const onOrder = () => {
    const phone = nextSupportNumber();
    const message = buildOrderMessage(service, duration, price, lang);
    window.open(buildWhatsAppUrl(phone, message), "_blank", "noopener,noreferrer");
  };

  return (
    <article className="card" id={service.id}>
      <h3>
        {service.icon} {name}
      </h3>
      <pre>{description}</pre>
      <div className="price-toggle" role="group" aria-label="Duration">
        <button
          type="button"
          className={duration === "month" ? "active" : ""}
          onClick={() => setDuration("month")}
        >
          {t.month}
        </button>
        <button
          type="button"
          className={duration === "year" ? "active" : ""}
          onClick={() => setDuration("year")}
        >
          {t.year}
        </button>
      </div>
      <div className="price-tag">
        {price} {lang === "ar" ? "د.ك" : "KD"}
      </div>
      <button type="button" className="btn btn-whatsapp" onClick={onOrder}>
        {t.order}
      </button>
    </article>
  );
}
