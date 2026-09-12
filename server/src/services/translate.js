const ARABIC_RE = /[\u0600-\u06FF]/;
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const fetchImpl = (...args) => globalThis.fetch(...args);

function hasArabic(text) {
  return ARABIC_RE.test(String(text || ""));
}

function isUsableTranslation(source, translated) {
  const out = String(translated || "").trim();
  if (!out) return false;
  if (/MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE PAIR/i.test(out)) {
    return false;
  }
  if (hasArabic(source)) return true;
  if (hasArabic(out)) return true;
  // Keep punctuation-only lines (✓ •) even if no Arabic letters were produced.
  return !/[A-Za-z]/.test(source);
}

async function readJson(url, options = {}) {
  const response = await fetchImpl(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "User-Agent": BROWSER_UA,
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Translate HTTP ${response.status}`);
  }
  return response.json();
}

async function translateGoogleGtx(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`;
  const data = await readJson(url);
  const parts = Array.isArray(data?.[0]) ? data[0] : [];
  return parts.map((part) => part?.[0] || "").join("");
}

async function translateGoogleClients(text) {
  const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=ar&q=${encodeURIComponent(text)}`;
  const data = await readJson(url);
  if (Array.isArray(data)) return data.flat(2).filter((item) => typeof item === "string").join("");
  return "";
}

async function translateLingva(text) {
  const url = `https://lingva.ml/api/v1/en/ar/${encodeURIComponent(text)}`;
  const data = await readJson(url);
  return data?.translation || "";
}

async function translateMyMemory(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`;
  const data = await readJson(url);
  return data?.responseData?.translatedText || "";
}

const PROVIDERS = [
  translateGoogleGtx,
  translateGoogleClients,
  translateLingva,
  translateMyMemory,
];

export function splitTranslateChunks(text) {
  if (text.length <= 450) return [text];
  const lines = text.split("\n");
  const chunks = [];
  let current = "";
  for (const line of lines) {
    if (`${current}\n${line}`.length > 450 && current) {
      chunks.push(current);
      current = line;
    } else {
      current = current ? `${current}\n${line}` : line;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translateChunk(chunk) {
  const trimmed = String(chunk || "").trim();
  if (!trimmed) return chunk;
  if (hasArabic(trimmed) && !/[A-Za-z]/.test(trimmed)) return trimmed;

  let lastError = null;
  for (const provider of PROVIDERS) {
    try {
      const translated = String(await provider(trimmed)).trim();
      if (isUsableTranslation(trimmed, translated)) return translated;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Translation service is unavailable");
}

export async function translateEnglishToArabic(text) {
  const source = String(text || "").trim();
  if (!source) {
    throw new Error("Text is required");
  }
  const chunks = splitTranslateChunks(source);
  const parts = [];
  for (const chunk of chunks) {
    parts.push(await translateChunk(chunk));
  }
  return parts.join("\n");
}
