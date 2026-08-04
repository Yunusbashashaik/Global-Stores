export const SUPPORT_NUMBERS = ["923228791573", "923014968769"];

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
export const SERVICES = [
  {
    id: "netflix-private",
    icon: "👑",
    nameEn: "Netflix Private Screen",
    nameAr: "شاشة نتفليكس خاصة",
    prices: { month: 2, year: 14 },
    descriptionEn: `✨ Enjoy your own private Netflix profile

👤 Personal Profile
🔐 Private PIN Protection
🎭 Custom Profile Picture
📺 HD Streaming
⚡ Instant Activation
🛟 24/7 Support`,
    descriptionAr: `✨ استمتع بملف نتفليكس خاص بك

👤 ملف شخصي
🔐 حماية برمز PIN
🎭 صورة ملف مخصصة
📺 بث HD
⚡ تفعيل فوري
🛟 دعم 24/7`,
  },
  {
    id: "netflix-prime",
    icon: "🍿",
    nameEn: "Netflix & Prime Video Sharing (Bundle)",
    nameAr: "نتفليكس وبرايم فيديو (باقة)",
    prices: { month: 1, year: 8 },
    descriptionEn: `✨ Premium streaming at the best price

👥 Shared Screen Access
📺 HD Quality Streaming
🚀 Smooth & Stable Service
⚡ Instant Activation
🛟 24/7 Customer Support`,
    descriptionAr: `✨ بث مميز بأفضل سعر

👥 وصول شاشة مشتركة
📺 جودة HD
🚀 خدمة سلسة ومستقرة
⚡ تفعيل فوري
🛟 دعم 24/7`,
  },
  {
    id: "youtube-premium",
    icon: "🎬",
    nameEn: "YouTube Premium",
    nameAr: "يوتيوب بريميوم",
    prices: { month: 1, year: 8 },
    descriptionEn: `✨ Enjoy YouTube without limits

🚫 Ad-Free Videos
🎧 Background Play
📥 Offline Downloads
🎵 YouTube Music Premium
⚡ Instant Activation
🛟 24/7 Customer Support`,
    descriptionAr: `✨ يوتيوب بلا حدود

🚫 بدون إعلانات
🎧 تشغيل في الخلفية
📥 تنزيلات دون اتصال
🎵 يوتيوب ميوزك بريميوم
⚡ تفعيل فوري
🛟 دعم 24/7`,
  },
  {
    id: "iptv",
    icon: "📡",
    nameEn: "IPTV Premium",
    nameAr: "IPTV بريميوم",
    prices: { month: 1, year: 8 },
    descriptionEn: `✨ Unlimited entertainment, anytime, anywhere

🔹 Live TV Channels
🎬 Movies & TV Series
⚽ Sports & Premium Channels
📺 HD & FHD Streaming
⚡ Instant Activation
🛟 24/7 Customer Support`,
    descriptionAr: `✨ ترفيه بلا حدود

🔹 قنوات مباشرة
🎬 أفلام ومسلسلات
⚽ رياضة وقنوات مميزة
📺 HD و FHD
⚡ تفعيل فوري
🛟 دعم 24/7`,
  },
  {
    id: "canva",
    icon: "🎨",
    nameEn: "Canva Pro",
    nameAr: "كانفا برو",
    prices: { month: 1, year: 8 },
    descriptionEn: `✨ Create stunning designs with premium tools

🎯 Full Canva Pro Access
📂 Millions of Premium Templates
🖼️ Premium Photos, Videos & Fonts
🪄 Background Remover & Magic Resize
🤖 AI Design Tools & Brand Kit
🚀 Instant Activation
🛟 24/7 Customer Support`,
    descriptionAr: `✨ تصاميم احترافية

🎯 وصول كامل لكانفا برو
📂 قوالب مميزة
🖼️ صور وفيديوهات وخطوط
🪄 إزالة الخلفية
🤖 أدوات ذكاء اصطناعي
🚀 تفعيل فوري
🛟 دعم 24/7`,
  },
  {
    id: "nordvpn",
    icon: "🔐",
    nameEn: "NordVPN",
    nameAr: "نورد VPN",
    prices: { month: 1, year: 8 },
    descriptionEn: `⚡ Fast & Secure Connection
🌎 Access Global Content
🛡️ Protect Your Privacy
📱 Works on Multiple Devices
✅ Instant Activation`,
    descriptionAr: `⚡ اتصال سريع وآمن
🌎 محتوى عالمي
🛡️ حماية الخصوصية
📱 أجهزة متعددة
✅ تفعيل فوري`,
  },
];

export async function fetchServices() {
  const res = await fetch("/api/services");
  if (!res.ok) {
    throw new Error("Failed to load services");
  }
  const data = await res.json();
  if (!Array.isArray(data.services)) {
    throw new Error("Invalid services response");
  }
  return data.services;
}
