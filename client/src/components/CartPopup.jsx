import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  buildWhatsAppUrl,
  nextSupportNumber,
} from "../data/catalog.js";
import { useCart } from "../cart/CartContext.jsx";
import ServiceIcon from "./ServiceIcon.jsx";

function durationLabel(duration, t) {
  return duration === "month" ? t.month : t.year;
}

function buildCartOrderMessage(items, lang, t) {
  const currency = lang === "ar" ? "د.ك" : "KD";
  const lines = items.map((item, idx) => {
    const name = lang === "ar" ? item.nameAr : item.nameEn;
    const dur = durationLabel(item.duration, t);
    const price = Number((item.unitPrice * item.qty).toFixed(3));
    return `${idx + 1}. ${name} — ${dur} × ${item.qty} = ${price} ${currency}`;
  });

  const total = Number(
    items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0).toFixed(3),
  );

  if (lang === "ar") {
    return `مرحباً فريق دعم GlobalStore.com، أود شراء الاشتراكات التالية:

الدولة: الكويت
${lines.join("\n")}

الإجمالي: ${total} ${currency}

يرجى تزويدي بتفاصيل الدفع وإتمام طلبي.`;
  }

  return `Hello GlobalStore.com Support Team, I would like to purchase the following subscriptions:

Country: Kuwait
${lines.join("\n")}

Total: ${total} ${currency}

Please provide payment details and complete my order.`;
}

export default function CartPopup({ open, onClose, lang, t }) {
  const { items, increment, decrement, removeItem, totalPrice, clearCart } =
    useCart();
  const currency = lang === "ar" ? "د.ك" : "KD";

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("cart-open");

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("cart-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const onOrderWhatsApp = () => {
    if (!items.length) return;
    const phone = nextSupportNumber();
    const message = buildCartOrderMessage(items, lang, t);
    window.open(buildWhatsAppUrl(phone, message), "_blank", "noopener,noreferrer");
  };

  return createPortal(
    <div className="cart-layer" role="presentation">
      <button
        type="button"
        className="cart-backdrop"
        aria-label={t.close}
        onClick={onClose}
      />
      <div
        className="cart-popup cart-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={t.cartTitle}
      >
        <header className="cart-popup-header">
          <h3>{t.cartTitle}</h3>
          <button
            type="button"
            className="cart-popup-close"
            onClick={onClose}
            aria-label={t.close}
          >
            ×
          </button>
        </header>

        <div className="cart-popup-body">
          {items.length === 0 ? (
            <p className="cart-empty">{t.cartEmpty}</p>
          ) : (
            <ul className="cart-item-list">
              {items.map((item) => {
                const name = lang === "ar" ? item.nameAr : item.nameEn;
                const line = Number((item.unitPrice * item.qty).toFixed(3));
                return (
                  <li key={item.key} className="cart-item">
                    <div className="cart-item-icon" aria-hidden="true">
                      <ServiceIcon
                        service={{
                          id: item.serviceId,
                          nameEn: item.nameEn,
                          accent: item.accent,
                        }}
                        size="sm"
                      />
                    </div>
                    <div className="cart-item-meta">
                      <strong>{name}</strong>
                      <span>
                        {durationLabel(item.duration, t)} · {item.unitPrice}{" "}
                        {currency}
                      </span>
                      <div className="qty-selector qty-selector--compact">
                        <button
                          type="button"
                          aria-label={t.qtyDecrease}
                          onClick={() => decrement(item.key)}
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          aria-label={t.qtyIncrease}
                          onClick={() => increment(item.key)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-side">
                      <strong>
                        {line} {currency}
                      </strong>
                      <button
                        type="button"
                        className="cart-item-remove"
                        onClick={() => removeItem(item.key)}
                      >
                        {t.cartRemove}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="cart-popup-footer">
          <div className="cart-total">
            <span>{t.cartTotal}</span>
            <strong>
              {Number(totalPrice.toFixed(3))} {currency}
            </strong>
          </div>
          <p className="cart-payment-note" role="note">
            {t.cartPaymentNote}
          </p>
          <button
            type="button"
            className="btn btn-whatsapp"
            disabled={!items.length}
            onClick={onOrderWhatsApp}
          >
            {t.order}
          </button>
          {items.length ? (
            <button
              type="button"
              className="btn btn-ghost cart-clear"
              onClick={clearCart}
            >
              {t.cartClear}
            </button>
          ) : null}
        </footer>
      </div>
    </div>,
    document.body,
  );
}
