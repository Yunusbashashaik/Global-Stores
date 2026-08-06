import {
  DEFAULT_SERVICES,
  STANDARD_DESCRIPTION_AR,
  STANDARD_DESCRIPTION_EN,
} from "@shared/defaultServices.js";

export const SUPPORT_NUMBERS = ["923228791573", "923014968769"];

export { STANDARD_DESCRIPTION_EN, STANDARD_DESCRIPTION_AR };

let orderLineIndex = 0;

export function nextSupportNumber() {
  const num = SUPPORT_NUMBERS[orderLineIndex % SUPPORT_NUMBERS.length];
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
