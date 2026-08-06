/** Shared outline icons for trust / feature bars (Point 3, 5, 7). */
export function UiIcon({ name, className = "ui-icon" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: false,
  };

  switch (name) {
    case "tag":
      return (
        <svg {...common}>
          <path d="M20.6 13.05 12.7 21a1.8 1.8 0 0 1-2.55 0L3 13.85V4.2A1.2 1.2 0 0 1 4.2 3h9.65l6.75 6.75a1.8 1.8 0 0 1 0 2.55z" />
          <circle cx="8.2" cy="8.2" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "seal":
      return (
        <svg {...common}>
          <path d="M12 2.8 14.2 5l2.7.4-2 2.2.5 2.7L12 9.2 8.6 10.3l.5-2.7-2-2.2 2.7-.4L12 2.8z" />
          <path d="M7 12.5v3.2L12 21l5-5.3v-3.2" />
          <path d="m10 15.2 1.4 1.4L14.5 13" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...common}>
          <path d="M5.5 15.5 4 20l4.5-1.5" />
          <path d="M14.5 4.5c3.2 1.1 5.4 3.3 6.5 6.5-2.2 3.5-5.4 6.5-9.2 8.2-1.4-1.4-2.5-2.8-3.4-4.4C10 11.2 12 7.8 14.5 4.5z" />
          <circle cx="14.2" cy="9.8" r="1.3" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 19 6.2v5.3c0 4.4-2.9 7.5-7 8.9-4.1-1.4-7-4.5-7-8.9V6.2L12 3z" />
          <path d="m9.2 12 1.9 1.9 3.7-3.8" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common}>
          <circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="17" cy="20" r="1.2" fill="currentColor" stroke="none" />
          <path d="M3 4h2l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.3L21 8H7" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12.04 2c-5.46 0-9.91 4.43-9.91 9.9 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.9-4.44 9.9-9.9C21.95 6.44 17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24z" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 2 5.5 13.2H12L11 22l7.5-12.5H12L13 2z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16.5 19.5v-1.2a3.3 3.3 0 0 0-3.3-3.3H7.8A3.3 3.3 0 0 0 4.5 18.3v1.2" />
          <circle cx="10.5" cy="8.2" r="3" />
          <path d="M19.5 19.5v-1.1a2.8 2.8 0 0 0-2.1-2.7" />
          <path d="M15.2 5.3a3 3 0 0 1 0 5.8" />
        </svg>
      );
    case "headset":
      return (
        <svg {...common}>
          <path d="M4.5 13.5v-1.8A7.5 7.5 0 0 1 12 4.2a7.5 7.5 0 0 1 7.5 7.5v1.8" />
          <rect x="3.2" y="13" width="3.6" height="5.2" rx="1.2" />
          <rect x="17.2" y="13" width="3.6" height="5.2" rx="1.2" />
          <path d="M20.8 16.5v1.2A2.8 2.8 0 0 1 18 20.5h-2.2" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
