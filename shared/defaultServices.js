/** Shared catalog service data with service-specific prices and descriptions. */

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
  outOfStock = false,
  descriptionEn,
  descriptionAr,
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
    outOfStock,
    descriptionEn,
    descriptionAr,
  };
}

/** Seed catalog used when server/data/services.json does not exist yet. */
export const DEFAULT_SERVICES = [

  svc({
    id: "netflix-private",
    icon: "👑",
    nameEn: "Netflix Shared Screen",
    nameAr: "نتفليكس شاشة مشتركة",
    typeEn: "Shared Screen",
    typeAr: "شاشة مشتركة",
    month: 1,
    year: 8,
    accent: "#E50914",
    descriptionEn: `✓ Shared Screen Access •
✓ Dedicated Profile •
✓ HD Streaming Quality •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ Smooth & Reliable Service •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ وصول بشاشة مشتركة •
✓ ملف شخصي مخصص •
✓ جودة بث عالية الوضوح (HD) •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ خدمة سلسة وموثوقة •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "netflix-prime",
    icon: "🍿",
    nameEn: "Prime Video Shared Screen",
    nameAr: "برايم فيديو شاشة مشتركة",
    typeEn: "Shared Screen",
    typeAr: "شاشة مشتركة",
    month: 1,
    year: 8,
    accent: "#00A8E1",
    descriptionEn: `✓ Shared Screen Access •
✓ Dedicated Profile •
✓ HD Streaming Quality •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ Smooth & Reliable Service •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ وصول بشاشة مشتركة •
✓ ملف شخصي مخصص •
✓ جودة بث عالية الوضوح (HD) •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ خدمة سلسة وموثوقة •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "youtube-premium",
    icon: "▶️",
    nameEn: "YouTube Premium",
    nameAr: "يوتيوب بريميوم",
    month: 1.5,
    year: 10,
    accent: "#FF0000",
    descriptionEn: `✓ Ad-Free Videos •
✓ YouTube Music Included •
✓ Background Play •
✓ Offline Downloads •
✓ HD Streaming Quality •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ فيديوهات بدون إعلانات •
✓ يتضمن يوتيوب ميوزك •
✓ التشغيل في الخلفية •
✓ تنزيل لمشاهدة بدون إنترنت •
✓ جودة بث عالية الوضوح (HD) •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "iptv",
    icon: "📡",
    nameEn: "IPTV Premium",
    nameAr: "IPTV بريميوم",
    typeEn: "Live TV & VOD",
    typeAr: "بث مباشر و VOD",
    month: 1.5,
    year: 10,
    accent: "#6366F1",
    descriptionEn: `✓ Live TV Channels •
✓ Sports & Entertainment •
✓ HD / Full HD Quality •
✓ Movies & TV Shows •
✓ Multiple Content Options •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ قنوات تلفزيونية مباشرة •
✓ رياضة والترفيه •
✓ جودة HD / Full HD •
✓ أفلام ومسلسلات •
✓ خيارات محتوى متعددة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "canva",
    icon: "🎨",
    nameEn: "Canva Pro",
    nameAr: "كانفا برو",
    month: 1.5,
    year: 10,
    accent: "#00C4CC",
    descriptionEn: `✓ Premium Templates •
✓ Pro Elements & Graphics •
✓ Background Remover •
✓ Magic Resize •
✓ Brand Kit •
✓ Premium Fonts & Assets •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ قوالب ممتازة (مدفوعة) •
✓ عناصر ورسومات احترافية •
✓ أداة إزالة الخلفية •
✓ تغيير الحجم السحري •
✓ هوية العلامة التجارية (Brand Kit) •
✓ خطوط وأصول مدفوعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "nordvpn",
    icon: "🛡️",
    nameEn: "NordVPN Premium",
    nameAr: "نورد VPN بريميوم",
    month: 1.5,
    year: 10,
    accent: "#4687FF",
    descriptionEn: `✓ Secure & Private Browsing •
✓ Fast VPN Connection •
✓ Multiple Server Locations •
✓ Advanced Online Protection •
✓ No-Logs Privacy •
✓ Works on Multiple Devices •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ تصفح آمن وخاص •
✓ اتصال VPN سريع •
✓ مواقع خوادم متعددة •
✓ حماية متقدمة عبر الإنترنت •
✓ سياسة عدم الاحتفاظ بالسجلات •
✓ يعمل على أجهزة متعددة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "grok",
    icon: "✦",
    nameEn: "Grok Premium",
    nameAr: "جروك بريميوم",
    month: 1.5,
    year: 10,
    accent: "#1DA1F2",
    descriptionEn: `✓ Advanced AI Access •
✓ Premium Features •
✓ Faster AI Responses •
✓ Image Generation •
✓ Advanced Reasoning •
✓ Priority Access •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ وصول للذكاء الاصطناعي المتقدم •
✓ ميزات مدفوعة •
✓ إجابات أسرع من الذكاء الاصطناعي •
✓ إنشاء الصور •
✓ تفكير وتحليل متقدم •
✓ أولوية الوصول •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "google-gemini",
    icon: "✧",
    nameEn: "Google Gemini Premium",
    nameAr: "جوجل جيميني بريميوم",
    month: 1.5,
    year: 10,
    accent: "#4285F4",
    descriptionEn: `✓ Advanced AI Access •
✓ Enhanced AI Responses •
✓ Advanced Reasoning •
✓ Image Generation •
✓ Premium AI Features •
✓ Priority Access •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ وصول للذكاء الاصطناعي المتقدم •
✓ إجابات محسّنة من الذكاء الاصطناعي •
✓ تفكير وتحليل متقدم •
✓ إنشاء الصور •
✓ ميزات ذكاء اصطناعي مدفوعة •
✓ أولوية الوصول •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "capcut-pro",
    icon: "✂️",
    nameEn: "CapCut Pro",
    nameAr: "كاب كت برو",
    month: 1.5,
    year: 10,
    accent: "#000000",
    descriptionEn: `✓ Premium Editing Tools •
✓ Pro Effects & Filters •
✓ Premium Templates •
✓ AI-Powered Features •
✓ Advanced Video Editing •
✓ No Watermark •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ أدوات تعديل احترافية •
✓ تأثيرات وفلاتر احترافية •
✓ قوالب مدفوعة •
✓ ميزات مدعومة بالذكاء الاصطناعي •
✓ تحرير فيديو متقدم •
✓ بدون علامة مائية •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "mubi",
    icon: "🎬",
    nameEn: "MUBI Premium",
    nameAr: "موبي بريميوم",
    month: 1.5,
    year: 10,
    accent: "#1A1A1A",
    descriptionEn: `✓ Handpicked Films •
✓ Award-Winning Movies •
✓ Independent Cinema •
✓ Exclusive Film Selection •
✓ HD Streaming Quality •
✓ New Films Regularly •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ أفلام مختارة بعناية •
✓ أفلام حائزة على جوائز •
✓ سينما مستقلة •
✓ تشكيلة أفلام حصرية •
✓ جودة بث عالية الوضوح (HD) •
✓ أفلام جديدة بانتظام •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "hulu",
    icon: "🟢",
    nameEn: "Hulu Premium",
    nameAr: "هولو بريميوم",
    month: 1.5,
    year: 10,
    accent: "#1CE783",
    descriptionEn: `✓ Premium TV Shows •
✓ Movies & Originals •
✓ Exclusive Content •
✓ HD Streaming Quality •
✓ Wide Content Library •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ مسلسلات تلفزيونية مدفوعة •
✓ أفلام وأعمال أصلية •
✓ محتوى حصري •
✓ جودة بث عالية الوضوح (HD) •
✓ مكتبة محتوى واسعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "peacock",
    icon: "🦚",
    nameEn: "Peacock Premium",
    nameAr: "بيكوك بريميوم",
    month: 0,
    year: 0,
    accent: "#FF5B9A",
    outOfStock: true,
    descriptionEn: `✓ Premium Movies & TV Shows •
✓ Peacock Originals •
✓ Live Sports & Events •
✓ Exclusive Content •
✓ HD Streaming Quality •
✓ Wide Content Library •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ أفلام ومسلسلات ممتازة •
✓ أعمال بيكوك الأصلية •
✓ رياضات وفعاليات مباشرة •
✓ محتوى حصري •
✓ جودة بث عالية الوضوح (HD) •
✓ مكتبة محتوى واسعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "sonyliv",
    icon: "📺",
    nameEn: "SonyLIV Premium",
    nameAr: "سوني ليف بريميوم",
    month: 0,
    year: 0,
    accent: "#FF6B00",
    outOfStock: true,
    descriptionEn: `✓ Live TV Channels •
✓ Live Sports & Events •
✓ Premium Movies & Shows •
✓ Sony Originals •
✓ HD Streaming Quality •
✓ Exclusive Content •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ قنوات تلفزيونية مباشرة •
✓ رياضات وفعاليات مباشرة •
✓ أفلام ومسلسلات مدفوعة •
✓ أعمال سوني الأصلية •
✓ جودة بث عالية الوضوح (HD) •
✓ محتوى حصري •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "starzplay",
    icon: "⭐",
    nameEn: "STARZPLAY Premium",
    nameAr: "ستارز بلاي بريميوم",
    month: 0,
    year: 0,
    accent: "#000000",
    outOfStock: true,
    descriptionEn: `✓ Premium Movies & Series •
✓ Exclusive Originals •
✓ Arabic & International Content •
✓ HD Streaming Quality •
✓ Latest Entertainment •
✓ Wide Content Library •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ أفلام ومسلسلات مدفوعة •
✓ أعمال أصلية الحصرية •
✓ محتوى عربي ودولي •
✓ جودة بث عالية الوضوح (HD) •
✓ أحدث العروض الترفيهية •
✓ مكتبة محتوى واسعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "osn-plus",
    icon: "⭕",
    nameEn: "OSN+ Premium",
    nameAr: "أو إس إن+ بريميوم",
    month: 0,
    year: 0,
    accent: "#E31C23",
    outOfStock: true,
    descriptionEn: `✓ Premium Movies & Series •
✓ Exclusive HBO Content •
✓ OSN Original Productions •
✓ Arabic & International Content •
✓ HD Streaming Quality •
✓ Latest Entertainment •
✓ Wide Content Library •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ أفلام ومسلسلات مدفوعة •
✓ محتوى HBO الحصري •
✓ إنتاجات OSN الأصلية •
✓ محتوى عربي ودولي •
✓ جودة بث عالية الوضوح (HD) •
✓ أحدث العروض الترفيهية •
✓ مكتبة محتوى واسعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "disney-plus",
    icon: "✨",
    nameEn: "Disney+ Premium",
    nameAr: "ديزني+ بريميوم",
    month: 1.5,
    year: 10,
    accent: "#113CCF",
    descriptionEn: `✓ Disney Movies & Shows •
✓ Marvel & Star Wars •
✓ Pixar & National Geographic •
✓ Exclusive Originals •
✓ HD / 4K Streaming •
✓ Wide Content Library •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ أفلام ومسلسلات ديزني •
✓ مارفل وحرب النجوم (Star Wars) •
✓ بيكسار وناشونال جيوغرافيك •
✓ أعمال أصلية الحصرية •
✓ بث بجودة HD / 4K •
✓ مكتبة محتوى واسعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "shahid",
    icon: "🇸🇦",
    nameEn: "Shahid VIP Premium",
    nameAr: "شاهد VIP بريميوم",
    month: 0,
    year: 0,
    accent: "#00A651",
    outOfStock: true,
    descriptionEn: `✓ Arabic Movies & Series •
✓ Exclusive Shahid Originals •
✓ Live TV Channels •
✓ Live Sports & Events •
✓ HD / 4K Streaming •
✓ Latest Arabic Content •
✓ Wide Content Library •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ أفلام ومسلسلات عربية •
✓ أعمال شاهد الأصلية الحصرية •
✓ قنوات تلفزيونية مباشرة •
✓ رياضات وفعاليات مباشرة •
✓ بث بجودة HD / 4K •
✓ أحدث المحتوى العربي •
✓ مكتبة محتوى واسعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "chatgpt-plus",
    icon: "🤖",
    nameEn: "ChatGPT Plus",
    nameAr: "شات جي بي تي بلس",
    month: 1.5,
    year: 10,
    accent: "#10A37F",
    descriptionEn: `✓ Advanced AI Access •
✓ Faster Responses •
✓ Advanced Reasoning •
✓ Image Generation •
✓ File Upload & Analysis •
✓ Voice Conversations •
✓ Premium AI Features •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ وصول للذكاء الاصطناعي المتقدم •
✓ إجابات أسرع •
✓ تفكير وتحليل متقدم •
✓ إنشاء الصور •
✓ تحميل الملفات وتحليلها •
✓ محادثات صوتية •
✓ ميزات ذكاء اصطناعي مدفوعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "crunchyroll",
    icon: "🍙",
    nameEn: "Crunchyroll Premium",
    nameAr: "كرانشي رول بريميوم",
    month: 1,
    year: 8,
    accent: "#F47521",
    descriptionEn: `✓ Unlimited Anime Streaming •
✓ Latest Anime Episodes •
✓ Ad-Free Viewing •
✓ Exclusive Anime Content •
✓ HD / 4K Quality •
✓ Manga & Premium Content •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ مشاهدة أنمي غير محدودة •
✓ أحدث حلقات الأنمي •
✓ مشاهدة بدون إعلانات •
✓ محتوى أنمي حصري •
✓ جودة HD / 4K •
✓ مانغا ومحتوى مميز •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "paramount-plus",
    icon: "⛰",
    nameEn: "Paramount+ Premium",
    nameAr: "باراماونت+ بريميوم",
    month: 1.5,
    year: 10,
    accent: "#0064FF",
    descriptionEn: `✓ Premium Movies & Series •
✓ Exclusive Originals •
✓ Live Sports & Events •
✓ Popular TV Shows •
✓ HD / 4K Streaming •
✓ Wide Content Library •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ أفلام ومسلسلات مدفوعة •
✓ أعمال أصلية الحصرية •
✓ رياضات وفعاليات مباشرة •
✓ برامج تلفزيونية شهيرة •
✓ بث بجودة HD / 4K •
✓ مكتبة محتوى واسعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "hbo-max",
    icon: "🎭",
    nameEn: "HBO Max Premium",
    nameAr: "إتش بي أو ماكس بريميوم",
    month: 1.5,
    year: 10,
    accent: "#B129FF",
    descriptionEn: `✓ Premium Movies & Series •
✓ HBO Original Content •
✓ Max Originals •
✓ Exclusive Entertainment •
✓ HD / 4K Streaming •
✓ Wide Content Library •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ أفلام ومسلسلات مدفوعة •
✓ محتوى HBO الأصلي •
✓ أعمال Max الأصلية •
✓ عروض ترفيهية الحصرية •
✓ بث بجودة HD / 4K •
✓ مكتبة محتوى واسعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "zee5",
    icon: "🟣",
    nameEn: "ZEE5 Premium",
    nameAr: "زي 5 بريميوم",
    month: 1.5,
    year: 10,
    accent: "#8230C6",
    descriptionEn: `✓ Premium Movies & Series •
✓ Latest TV Shows •
✓ ZEE5 Originals •
✓ Live TV Channels •
✓ Regional & International Content •
✓ HD Streaming Quality •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ أفلام ومسلسلات مدفوعة •
✓ أحدث البرامج التلفزيونية •
✓ أعمال ZEE5 الأصلية •
✓ قنوات تلفزيونية مباشرة •
✓ محتوى إقليمي ودولي •
✓ جودة بث عالية الوضوح (HD) •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "apple-tv-plus",
    icon: "🍎",
    nameEn: "Apple TV+ Premium",
    nameAr: "أبل تي في+ بريميوم",
    month: 1.5,
    year: 10,
    accent: "#A2AAAD",
    descriptionEn: `✓ Apple Originals •
✓ Premium Movies & Series •
✓ Exclusive TV Shows •
✓ Award-Winning Content •
✓ HD / 4K Streaming •
✓ Wide Content Library •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ أعمال آبل الأصلية •
✓ أفلام ومسلسلات مدفوعة •
✓ برامج تلفزيونية الحصرية •
✓ محتوى حائز على جوائز •
✓ بث بجودة HD / 4K •
✓ مكتبة محتوى واسعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "apple-music",
    icon: "🎵",
    nameEn: "Apple Music Premium",
    nameAr: "أبل ميوزك بريميوم",
    month: 1.5,
    year: 10,
    accent: "#FA243C",
    descriptionEn: `✓ Ad-Free Music •
✓ 100M+ Songs •
✓ High-Quality Audio •
✓ Offline Downloads •
✓ Personalized Playlists •
✓ Exclusive Music & Content •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ موسيقى بدون إعلانات •
✓ أكثر من 100 مليون أغنية •
✓ صوت عالي الجودة •
✓ تنزيل للاستماع بدون إنترنت •
✓ قوائم تشغيل مخصصة •
✓ موسيقى ومحتوى حصري •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "youtube-music",
    icon: "🎧",
    nameEn: "YouTube Music Premium",
    nameAr: "يوتيوب ميوزك بريميوم",
    month: 1.5,
    year: 10,
    accent: "#FF0000",
    descriptionEn: `✓ Ad-Free Videos •
✓ YouTube Music Included •
✓ Background Play •
✓ Offline Downloads •
✓ HD / 4K Streaming •
✓ Premium YouTube Features •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ فيديوهات بدون إعلانات •
✓ يتضمن يوتيوب ميوزك •
✓ التشغيل في الخلفية •
✓ تنزيل للاستماع بدون إنترنت •
✓ بث بجودة HD / 4K •
✓ ميزات يوتيوب المدفوعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "spotify-premium",
    icon: "🟢",
    nameEn: "Spotify Premium",
    nameAr: "سبوتيفاي بريميوم",
    month: 1.5,
    year: 10,
    accent: "#1DB954",
    descriptionEn: `✓ Ad-Free Music •
✓ Unlimited Music Streaming •
✓ High-Quality Audio •
✓ Offline Downloads •
✓ Unlimited Skips •
✓ Personalized Playlists •
✓ Premium Music Features •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ موسيقى بدون إعلانات •
✓ استماع للموسيقى بدون حدود •
✓ صوت عالي الجودة •
✓ تنزيل للاستماع بدون إنترنت •
✓ تخطي غير محدود للأغاني •
✓ قوائم تشغيل مخصصة •
✓ ميزات موسيقى مدفوعة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "proton-vpn",
    icon: "🔐",
    nameEn: "Proton VPN Premium",
    nameAr: "بروتون VPN بريميوم",
    month: 1.5,
    year: 10,
    accent: "#6D4AFF",
    descriptionEn: `✓ Secure & Private Browsing •
✓ High-Speed VPN Servers •
✓ Multiple Server Locations •
✓ Strong Online Protection •
✓ No-Logs Privacy •
✓ Secure Internet Connection •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ تصفح آمن وخاص •
✓ خوادم VPN عالية السرعة •
✓ مواقع خوادم متعددة •
✓ حماية قوية عبر الإنترنت •
✓ سياسة عدم الاحتفاظ بالسجلات •
✓ اتصال إنترنت آمن •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "cyberghost-vpn",
    icon: "👻",
    nameEn: "CyberGhost VPN Premium",
    nameAr: "سايبر جوست VPN بريميوم",
    month: 1.5,
    year: 10,
    accent: "#FFCC00",
    descriptionEn: `✓ Secure & Private Browsing •
✓ High-Speed VPN Connection •
✓ Thousands of VPN Servers •
✓ Multiple Server Locations •
✓ Online Privacy Protection •
✓ No-Logs Privacy •
✓ Works on Multiple Devices •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ تصفح آمن وخاص •
✓ اتصال VPN عالٍ السرعة •
✓ آلاف خوادم VPN •
✓ مواقع خوادم متعددة •
✓ حماية الخصوصية عبر الإنترنت •
✓ سياسة عدم الاحتفاظ بالسجلات •
✓ يعمل على أجهزة متعددة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "surfshark-vpn",
    icon: "🦈",
    nameEn: "Surfshark VPN Premium",
    nameAr: "سيرف شارك VPN بريميوم",
    month: 1.5,
    year: 10,
    accent: "#1EBFBF",
    descriptionEn: `✓ Secure & Private Browsing •
✓ High-Speed VPN Connection •
✓ Multiple Server Locations •
✓ Unlimited Device Connections •
✓ Online Privacy Protection •
✓ No-Logs Privacy •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ تصفح آمن وخاص •
✓ اتصال VPN عالٍ السرعة •
✓ مواقع خوادم متعددة •
✓ توصيل أجهزة غير محدود •
✓ حماية الخصوصية عبر الإنترنت •
✓ سياسة عدم الاحتفاظ بالسجلات •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

  svc({
    id: "expressvpn",
    icon: "⚡",
    nameEn: "ExpressVPN Premium",
    nameAr: "إكسبريس VPN بريميوم",
    month: 1.5,
    year: 10,
    accent: "#DA3940",
    descriptionEn: `✓ Secure & Private Browsing •
✓ High-Speed VPN Connection •
✓ Multiple Server Locations •
✓ Advanced Online Protection •
✓ No-Logs Privacy •
✓ Unlimited Bandwidth •
✓ Works on Multiple Devices •
✓ Fast Activation •
✓ Full 1 Month Validity •
✓ 24/7 Customer Support`,
    descriptionAr: `✓ تصفح آمن وخاص •
✓ اتصال VPN عالٍ السرعة •
✓ مواقع خوادم متعددة •
✓ حماية متقدمة عبر الإنترنت •
✓ سياسة عدم الاحتفاظ بالسجلات •
✓ نطاق تبادلي (Bandwidth) غير محدود •
✓ يعمل على أجهزة متعددة •
✓ تفعيل سريع •
✓ صلاحية لمدة شهر كامل •
✓ دعم عملاء على مدار 24/7`,
  }),

];
