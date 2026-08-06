/** Map catalog service IDs → uploaded brand artwork in /public. */
const FILES = {
  "netflix-private": "Netflix.JPG",
  "netflix-prime": "Prime.JPG",
  "youtube-premium": "YTPremium.JPG",
  "youtube-music": "YTMusic.JPG",
  iptv: "IPTV.JPG",
  canva: "CanvaPro.JPG",
  grok: "Grok.JPG",
  "google-gemini": "Gemini.JPG",
  "capcut-pro": "CapCutPro.JPG",
  mubi: "Mubi.JPG",
  hulu: "Hulu.JPG",
  peacock: "Peacock.JPG",
  sonyliv: "SonyLiv.JPG",
  starzplay: "StarzPlay.JPG",
  "osn-plus": "osnPlus.JPG",
  "disney-plus": "DisneyPlus.JPG",
  shahid: "Shahid.JPG",
  "chatgpt-plus": "ChatGPTPlus.JPG",
  crunchyroll: "Crunchyroll.JPG",
  "paramount-plus": "ParamountPlus.JPG",
  "hbo-max": "HBOMax.JPG",
  zee5: "Zee5.JPG",
  "apple-tv-plus": "AppleTVPlus.JPG",
  "apple-music": "AppleMusic.JPG",
  "spotify-premium": "SpotifyPremium.JPG",
  "proton-vpn": "ProtonVPN.JPG",
  "cyberghost-vpn": "CyberGhostVPN.JPG",
  "surfshark-vpn": "Surfshark.JPG",
  expressvpn: "ExpressVPN.JPG",
  /* No dedicated NordVPN upload — reuse Express shield art as temporary mark */
  nordvpn: "ExpressVPN.JPG",
};

const assetBase = import.meta.env.BASE_URL || "/";

export function serviceImageUrl(serviceId) {
  const file = FILES[serviceId];
  if (!file) return null;
  // Keep "+" unescaped — static hosts and Vite both serve the literal filenames.
  const safe = file.replace(/ /g, "%20");
  return `${assetBase}${safe}`;
}

export function wallpaperUrl() {
  return `${assetBase}Global_bg.JPG`;
}
