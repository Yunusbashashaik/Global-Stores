/** Shared card body for every catalog service (prices live only on price tags). */
export const STANDARD_DESCRIPTION_EN = `⚡ Fast Delivery •

🚀 Quick Access •

🔒 Secure Access •

🔈 One Device •

✨ Instant Activation •

👑 Premium Access •`;

export const STANDARD_DESCRIPTION_AR = `⚡ توصيل سريع •

🚀 وصول سريع •

🔒 وصول آمن •

🔈 جهاز واحد •

✨ تفعيل فوري •

👑 وصول مميز •`;

function svc({
  id,
  icon,
  nameEn,
  nameAr,
  typeEn = "Shared / Private",
  typeAr = "مشترك / خاص",
  month = 1,
  year = 8,
  accent = "#38bdf8",
}) {
  return {
    id,
    icon,
    accent,
    typeEn,
    typeAr,
    nameEn,
    nameAr,
    prices: { month, year },
    descriptionEn: STANDARD_DESCRIPTION_EN,
    descriptionAr: STANDARD_DESCRIPTION_AR,
  };
}

/** Seed catalog used when server/data/services.json does not exist yet. */
export const DEFAULT_SERVICES = [
  svc({
    id: "netflix-private",
    icon: "👑",
    nameEn: "Netflix",
    nameAr: "نتفليكس",
    typeEn: "Private",
    typeAr: "خاص",
    month: 2,
    year: 14,
    accent: "#E50914",
  }),
  svc({
    id: "netflix-prime",
    icon: "🍿",
    nameEn: "Prime Video",
    nameAr: "برايم فيديو",
    accent: "#00A8E1",
  }),
  svc({
    id: "youtube-premium",
    icon: "▶️",
    nameEn: "YouTube Premium",
    nameAr: "يوتيوب بريميوم",
    accent: "#FF0000",
  }),
  svc({
    id: "iptv",
    icon: "📡",
    nameEn: "IPTV Premium",
    nameAr: "IPTV بريميوم",
    typeEn: "Live TV & VOD",
    typeAr: "بث مباشر و VOD",
    accent: "#6366F1",
  }),
  svc({
    id: "canva",
    icon: "🎨",
    nameEn: "Canva Pro",
    nameAr: "كانفا برو",
    accent: "#00C4CC",
  }),
  svc({
    id: "nordvpn",
    icon: "🛡️",
    nameEn: "NordVPN",
    nameAr: "نورد VPN",
    accent: "#4687FF",
  }),
  svc({
    id: "grok",
    icon: "✦",
    nameEn: "Grok",
    nameAr: "جروك",
    accent: "#1DA1F2",
  }),
  svc({
    id: "google-gemini",
    icon: "✧",
    nameEn: "Google Gemini",
    nameAr: "جوجل جيميني",
    accent: "#4285F4",
  }),
  svc({
    id: "capcut-pro",
    icon: "✂️",
    nameEn: "CapCut Pro",
    nameAr: "كاب كت برو",
    accent: "#000000",
  }),
  svc({
    id: "mubi",
    icon: "🎬",
    nameEn: "MUBI",
    nameAr: "موبي",
    accent: "#1A1A1A",
  }),
  svc({
    id: "hulu",
    icon: "🟢",
    nameEn: "Hulu",
    nameAr: "هولو",
    accent: "#1CE783",
  }),
  svc({
    id: "peacock",
    icon: "🦚",
    nameEn: "Peacock",
    nameAr: "بيكوك",
    accent: "#FF5B9A",
  }),
  svc({
    id: "sonyliv",
    icon: "📺",
    nameEn: "SonyLIV",
    nameAr: "سوني ليف",
    accent: "#FF6B00",
  }),
  svc({
    id: "starzplay",
    icon: "⭐",
    nameEn: "STARZPLAY",
    nameAr: "ستارز بلاي",
    accent: "#000000",
  }),
  svc({
    id: "osn-plus",
    icon: "⭕",
    nameEn: "OSN+",
    nameAr: "أو إس إن+",
    accent: "#E31C23",
  }),
  svc({
    id: "disney-plus",
    icon: "✨",
    nameEn: "Disney+",
    nameAr: "ديزني+",
    accent: "#113CCF",
  }),
  svc({
    id: "shahid",
    icon: "🇸🇦",
    nameEn: "Shahid",
    nameAr: "شاهد",
    accent: "#00A651",
  }),
  svc({
    id: "chatgpt-plus",
    icon: "🤖",
    nameEn: "ChatGPT Plus",
    nameAr: "شات جي بي تي بلس",
    accent: "#10A37F",
  }),
  svc({
    id: "crunchyroll",
    icon: "🍙",
    nameEn: "Crunchyroll",
    nameAr: "كرانشي رول",
    accent: "#F47521",
  }),
  svc({
    id: "paramount-plus",
    icon: "⛰",
    nameEn: "Paramount+",
    nameAr: "باراماونت+",
    accent: "#0064FF",
  }),
  svc({
    id: "hbo-max",
    icon: "🎭",
    nameEn: "HBO Max",
    nameAr: "إتش بي أو ماكس",
    accent: "#B129FF",
  }),
  svc({
    id: "zee5",
    icon: "🟣",
    nameEn: "Zee5",
    nameAr: "زي 5",
    accent: "#8230C6",
  }),
  svc({
    id: "apple-tv-plus",
    icon: "🍎",
    nameEn: "Apple TV+",
    nameAr: "أبل تي في+",
    accent: "#A2AAAD",
  }),
  svc({
    id: "apple-music",
    icon: "🎵",
    nameEn: "Apple Music",
    nameAr: "أبل ميوزك",
    accent: "#FA243C",
  }),
  svc({
    id: "youtube-music",
    icon: "🎧",
    nameEn: "YouTube Music",
    nameAr: "يوتيوب ميوزك",
    accent: "#FF0000",
  }),
  svc({
    id: "spotify-premium",
    icon: "🟢",
    nameEn: "Spotify Premium",
    nameAr: "سبوتيفاي بريميوم",
    accent: "#1DB954",
  }),
  svc({
    id: "proton-vpn",
    icon: "🔐",
    nameEn: "Proton VPN",
    nameAr: "بروتون VPN",
    accent: "#6D4AFF",
  }),
  svc({
    id: "cyberghost-vpn",
    icon: "👻",
    nameEn: "CyberGhost VPN",
    nameAr: "سايبر جوست VPN",
    accent: "#FFCC00",
  }),
  svc({
    id: "surfshark-vpn",
    icon: "🦈",
    nameEn: "Surfshark VPN",
    nameAr: "سيرف شارك VPN",
    accent: "#1EBFBF",
  }),
  svc({
    id: "expressvpn",
    icon: "⚡",
    nameEn: "ExpressVPN",
    nameAr: "إكسبريس VPN",
    accent: "#DA3940",
  }),
];
