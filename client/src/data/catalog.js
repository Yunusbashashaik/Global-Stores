import {
  DEFAULT_SERVICES,
} from "@shared/defaultServices.js";
import { DEFAULT_SETTINGS } from "./defaultSettings.js";

let supportNumbers = [...DEFAULT_SETTINGS.whatsappNumbers];
let orderLineIndex = 0;

export function setSupportNumbers(numbers) {
  if (Array.isArray(numbers) && numbers.length) {
    supportNumbers = numbers.map((n) => String(n).replace(/\D/g, "")).filter(Boolean);
    if (!supportNumbers.length) {
      supportNumbers = [...DEFAULT_SETTINGS.whatsappNumbers];
    }
  }
}

export function getSupportNumbers() {
  return supportNumbers;
}

export function nextSupportNumber() {
  const num = supportNumbers[orderLineIndex % supportNumbers.length];
  orderLineIndex += 1;
  return num;
}

export function buildWhatsAppUrl(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage(service, durationKey, priceKd, lang) {
  const durationEn = durationKey === "month" ? "1 Month" : "1 Year";
  const durationAr = durationKey === "month" ? "شهر واحد" : "سنة واحدة";
  if (lang === "ar") {
    return `مرحباً فريق دعم GlobalStore.com، أود شراء الاشتراك التالي:

الدولة: الكويت
الخدمة: ${service.nameAr}
المدة: ${durationAr}
السعر: ${priceKd} د.ك

يرجى تزويدي بتفاصيل الدفع وإتمام طلبي.`;
  }
  return `Hello GlobalStore.com Support Team, I would like to purchase the following subscription:

Country: Kuwait
Service: ${service.nameEn}
Duration: ${durationEn}
Price: ${priceKd} KD

Please provide payment details and complete my order.`;
}

/** Fallback catalog if the API is unavailable. */
export const SERVICES = structuredClone(DEFAULT_SERVICES);

/** Featured names shown in the Subscriptions dropdown (first 3). */
export const FEATURED_SERVICE_IDS = [
  "netflix-private",
  "youtube-premium",
  "disney-plus",
];

export async function fetchServices() {
  const { fetchPublicServices } = await import("../lib/adminApi.js");
  return fetchPublicServices();
}

export function isOutOfStock(service) {
  if (!service) return false;
  if (service.outOfStock) return true;
  const month = Number(service.prices?.month);
  const year = Number(service.prices?.year);
  return month === 0 || year === 0;
}
