/** Compact brand marks for service cards — approximate official logo treatments. */
export default function ServiceIcon({ service, size = "md" }) {
  const accent = service.accent || "#0055ff";
  const id = service.id || "";
  const gid = `ic-${id}-${size}`;
  const mark = renderMark(id, accent, gid);

  return (
    <div
      className={`service-icon service-icon--${size}`}
      style={{ "--service-accent": accent }}
      aria-hidden="true"
    >
      <span className="service-icon-glow" />
      <span className="service-icon-mark" data-brand={id}>
        {mark}
      </span>
    </div>
  );
}

function renderMark(id, accent, gid) {
  switch (id) {
    case "netflix-private":
    case "netflix-prime":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#111" />
          <path
            d="M16 10h6.2l9.8 28H25.6L16 10zm10.2 0H34v28h-6.2V10z"
            fill="#E50914"
          />
        </svg>
      );
    case "youtube-premium":
    case "youtube-music":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#FF0000" />
          <path d="M19 15h4.8l.4 1.2H30c1.8 0 2.8 1 2.8 2.5V30c0 1.6-1 2.6-2.8 2.6h-6.4L19 34V15zm6.2 4.2v10.4h3.2c.5 0 .8-.3.8-.8V20c0-.5-.3-.8-.8-.8h-3.2z" fill="#fff" />
          <path d="M14 18.5c0-1.2.8-2 2-2h2.4v15H16c-1.2 0-2-.8-2-2v-11z" fill="#fff" />
          <text x="24" y="42" textAnchor="middle" fill="#fff" fontSize="5.5" fontWeight="700" fontFamily="Sora,sans-serif">
            {id === "youtube-music" ? "MUSIC" : "PREMIUM"}
          </text>
        </svg>
      );
    case "disney-plus":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#001554" />
          <path
            d="M8 28c6-10 16-14 28-10"
            fill="none"
            stroke={`url(#${gid}-dplus)`}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id={`${gid}-dplus`} x1="8" y1="20" x2="40" y2="20">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <text x="24" y="30" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="Georgia,serif" fontStyle="italic" fontWeight="700">
            Disney+
          </text>
        </svg>
      );
    case "hbo-max":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#000" />
          <text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800" fontFamily="Sora,sans-serif" letterSpacing="0.5">
            max
          </text>
        </svg>
      );
    case "iptv":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#1e1b4b" />
          <rect x="10" y="14" width="28" height="18" rx="3" fill="none" stroke="#818cf8" strokeWidth="2" />
          <path d="M18 38h12M24 32v6" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="23" r="3" fill="#6366F1" />
        </svg>
      );
    case "canva":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <defs>
            <linearGradient id={`${gid}-canva`} x1="6" y1="4" x2="42" y2="44">
              <stop stopColor="#00C4CC" />
              <stop offset="1" stopColor="#7B2FF7" />
            </linearGradient>
          </defs>
          <rect width="48" height="48" rx="14" fill={`url(#${gid}-canva)`} />
          <text x="24" y="29" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="Georgia,serif" fontStyle="italic" fontWeight="700">
            Canva
          </text>
        </svg>
      );
    case "nordvpn":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#0a1f44" />
          <path d="M24 10l12 6v8c0 8-5.2 13.5-12 16-6.8-2.5-12-8-12-16v-8l12-6z" fill="#4687FF" />
          <path d="M24 16l6 3v5c0 4.5-2.6 7.5-6 9-3.4-1.5-6-4.5-6-9v-5l6-3z" fill="#fff" opacity=".95" />
        </svg>
      );
    case "grok":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#000" />
          <circle cx="24" cy="24" r="10" fill="none" stroke="#fff" strokeWidth="2.4" />
          <path d="M14 34L34 14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case "google-gemini":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#111" />
          <defs>
            <linearGradient id={`${gid}-gem`} x1="12" y1="36" x2="36" y2="12">
              <stop stopColor="#F9AB00" />
              <stop offset="0.35" stopColor="#EA4335" />
              <stop offset="0.7" stopColor="#4285F4" />
              <stop offset="1" stopColor="#34A853" />
            </linearGradient>
          </defs>
          <path
            d="M24 8c2 8 8 14 16 16-8 2-14 8-16 16-2-8-8-14-16-16 8-2 14-8 16-16z"
            fill={`url(#${gid}-gem)`}
          />
        </svg>
      );
    case "capcut-pro":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#111" />
          <rect x="10" y="10" width="28" height="28" rx="8" fill="#fff" />
          <path d="M18 18h8l-4 6 5 8h-8l-3-6 2-8z" fill="#111" />
          <circle cx="36" cy="12" r="5" fill="#F5C542" />
        </svg>
      );
    case "mubi":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#000" />
          <text x="15" y="28" fill="#fff" fontSize="9" fontWeight="800" fontFamily="Sora,sans-serif">
            MUBI
          </text>
          <circle cx="36" cy="18" r="1.6" fill="#fff" />
          <circle cx="40" cy="18" r="1.6" fill="#fff" />
          <circle cx="36" cy="23" r="1.6" fill="#fff" />
          <circle cx="40" cy="23" r="1.6" fill="#fff" />
          <circle cx="36" cy="28" r="1.6" fill="#fff" />
          <circle cx="40" cy="28" r="1.6" fill="#fff" />
          <circle cx="44" cy="23" r="1.6" fill="#fff" />
        </svg>
      );
    case "hulu":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#000" />
          <text x="24" y="29" textAnchor="middle" fill="#1CE783" fontSize="14" fontWeight="800" fontFamily="Sora,sans-serif">
            hulu
          </text>
        </svg>
      );
    case "peacock":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#000" />
          <text x="8" y="28" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Sora,sans-serif">
            peacock
          </text>
          <circle cx="40" cy="14" r="2" fill="#F4C430" />
          <circle cx="40" cy="19" r="2" fill="#F97316" />
          <circle cx="40" cy="24" r="2" fill="#EF4444" />
          <circle cx="40" cy="29" r="2" fill="#EC4899" />
          <circle cx="40" cy="34" r="2" fill="#3B82F6" />
          <circle cx="40" cy="39" r="2" fill="#22C55E" />
        </svg>
      );
    case "sonyliv":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <defs>
            <linearGradient id={`${gid}-sony`} x1="4" y1="4" x2="44" y2="44">
              <stop stopColor="#00E5FF" />
              <stop offset="0.45" stopColor="#7C3AED" />
              <stop offset="1" stopColor="#FF6B00" />
            </linearGradient>
          </defs>
          <rect width="48" height="48" rx="12" fill={`url(#${gid}-sony)`} />
          <text x="24" y="22" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Georgia,serif">
            SONY
          </text>
          <text x="24" y="34" textAnchor="middle" fill="#FFE566" fontSize="12" fontWeight="800" fontFamily="Sora,sans-serif">
            liv
          </text>
        </svg>
      );
    case "starzplay":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#000" />
          <text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="Sora,sans-serif">
            <tspan fontWeight="800">STARZ</tspan>
            <tspan fontWeight="300">PLAY</tspan>
          </text>
        </svg>
      );
    case "osn-plus":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#0b1220" stroke="#c0c8d4" strokeWidth="2" />
          <text x="22" y="28" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="Sora,sans-serif">
            osn
          </text>
          <text x="36" y="28" fill="#E31C23" fontSize="14" fontWeight="800">
            +
          </text>
        </svg>
      );
    case "shahid":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#1a1d23" />
          <circle cx="28" cy="14" r="2.2" fill="#A3E635" />
          <circle cx="34" cy="14" r="2.2" fill="#2DD4BF" />
          <circle cx="40" cy="14" r="2.2" fill="#3B82F6" />
          <text x="24" y="32" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="Tajawal,sans-serif">
            شاهد
          </text>
        </svg>
      );
    case "chatgpt-plus":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#0b3d36" />
          <path
            d="M24 12c3.2 0 5.9 1.7 7.4 4.2a7.2 7.2 0 0 1 5.1 6.9c0 2.2-.9 4.2-2.4 5.6a7.3 7.3 0 0 1-4.9 11c-1.5 2.4-4.2 4-7.2 4s-5.7-1.6-7.2-4a7.3 7.3 0 0 1-4.9-11 7.2 7.2 0 0 1-2.4-5.6 7.2 7.2 0 0 1 5.1-6.9A8.3 8.3 0 0 1 24 12z"
            fill="none"
            stroke="#10A37F"
            strokeWidth="2"
          />
          <text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="6.5" fontWeight="700" fontFamily="Sora,sans-serif">
            ChatGPT
          </text>
          <rect x="15" y="32" width="18" height="7" rx="2" fill="#D4AF37" />
          <text x="24" y="37.2" textAnchor="middle" fill="#111" fontSize="5" fontWeight="800" fontFamily="Sora,sans-serif">
            PLUS
          </text>
        </svg>
      );
    case "crunchyroll":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#000" />
          <circle cx="24" cy="22" r="10" fill="#F47521" />
          <path d="M24 12a10 10 0 0 1 8 15.2 12 12 0 0 0-16-12.4" fill="#000" />
          <text x="24" y="42" textAnchor="middle" fill="#F47521" fontSize="5.5" fontWeight="700" fontFamily="Sora,sans-serif">
            crunchyroll
          </text>
        </svg>
      );
    case "paramount-plus":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#0064FF" />
          <path d="M24 18l8 12H16l8-12z" fill="#fff" />
          <path d="M16 16c2.5-2 5.5-3 8-3s5.5 1 8 3" fill="none" stroke="#fff" strokeWidth="1.2" />
          <text x="24" y="40" textAnchor="middle" fill="#fff" fontSize="6" fontFamily="Georgia,serif" fontStyle="italic">
            Paramount+
          </text>
        </svg>
      );
    case "zee5":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#8230C6" />
          <text x="24" y="29" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800" fontFamily="Sora,sans-serif">
            ZEE5
          </text>
        </svg>
      );
    case "apple-tv-plus":
    case "apple-music":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#111" />
          <path
            d="M28.5 16.2c-.4 1.7-1.5 3.2-3 4-.7-2.1.2-4.3 1.5-5.6 1.2-.9 2.8-1.4 3.8-1.5-.2 1.2-.8 2.3-2.3 3.1zM31.8 21c2.2.1 4.1 1.5 4.9 1.4-.2.7-.7 1.7-1.4 2.6-1.2 1.6-2.4 3.1-4.3 3.1-1.1 0-1.8-.4-2.8-.4s-1.8.4-2.8.4c-1.8.1-3.4-1.8-4.6-3.3-2.4-3.3-2.1-7.2-.1-9.2 1.2-1.3 2.9-2 4.4-2 1.1 0 2.2.5 2.9.5s2.1-.7 3.5-.6c.6 0 2.5.2 3.7 1.8-.1.1-2.2 1.3-2.2 4.1 0 3.2 2.8 4.3 2.8 4.3z"
            fill="#fff"
          />
          <text x="24" y="42" textAnchor="middle" fill="#fff" fontSize="5.5" fontWeight="600" fontFamily="Sora,sans-serif">
            {id === "apple-music" ? "Music" : "tv+"}
          </text>
        </svg>
      );
    case "spotify-premium":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#111" />
          <circle cx="24" cy="24" r="14" fill="#1DB954" />
          <path
            d="M15 21c5.5-1.6 12.2-1.2 17.5 1.2M16.5 26c4.5-1.2 10-1 14.2.8M18 31c3.5-.9 7.6-.7 11 .6"
            fill="none"
            stroke="#111"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "proton-vpn":
    case "cyberghost-vpn":
    case "surfshark-vpn":
    case "expressvpn":
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#0b1220" />
          <path
            d="M24 10l14 6v9c0 9-6 15-14 17-8-2-14-8-14-17v-9l14-6z"
            fill={accent}
          />
          <path d="M24 18v12M20 26h8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    default: {
      const label = (id || "??").replace(/-/g, " ").slice(0, 2).toUpperCase();
      return (
        <svg viewBox="0 0 48 48" className="brand-svg">
          <rect width="48" height="48" rx="12" fill="#0b1220" />
          <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} opacity="0.9" />
          <text x="24" y="29" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800" fontFamily="Sora,sans-serif">
            {label}
          </text>
        </svg>
      );
    }
  }
}

