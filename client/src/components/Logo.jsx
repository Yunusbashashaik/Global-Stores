export default function Logo({ className = "", showTagline = false }) {
  return (
    <span className={`brand-logo ${className}`.trim()}>
      <svg
        className="brand-mark"
        viewBox="0 0 64 64"
        width="48"
        height="48"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="gs-globe" x1="8" y1="4" x2="56" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7dd3fc" />
            <stop offset="0.55" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#0055ff" />
          </linearGradient>
        </defs>
        <circle
          cx="32"
          cy="32"
          r="24"
          fill="none"
          stroke="url(#gs-globe)"
          strokeWidth="2.2"
        />
        <ellipse
          cx="32"
          cy="32"
          rx="10"
          ry="24"
          fill="none"
          stroke="url(#gs-globe)"
          strokeWidth="1.6"
        />
        <path
          d="M10 32h44M14 20h36M14 44h36"
          fill="none"
          stroke="url(#gs-globe)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="32" cy="32" r="2.4" fill="#7dd3fc" />
      </svg>
      <span className="brand-text">
        <span className="brand-wordmark">
          GLOBAL <span>STORE</span>
        </span>
        {showTagline ? (
          <span className="brand-tagline">Premium Subscriptions, Global Access.</span>
        ) : null}
      </span>
    </span>
  );
}
