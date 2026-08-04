const SOCIAL_LINKS = [
  {
    id: "whatsapp",
    labelKey: "socialWhatsApp",
    href: "https://whatsapp.com/channel/0029Vb8CHOHJf05iTMmChh1U",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12.04 2c-5.46 0-9.91 4.43-9.91 9.9 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.9-4.44 9.9-9.9C21.95 6.44 17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.48-1.38-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74 1.75.76 2.22.76 2.64.68.4-.08 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.17-.47-.29z"
        />
      </svg>
    ),
  },
  {
    id: "instagram",
    labelKey: "socialInstagram",
    href: "https://www.instagram.com/globalstoreold?igsh=MW1yZjdvZTYwODg1NQ==",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
        />
      </svg>
    ),
  },
  {
    id: "tiktok",
    labelKey: "socialTikTok",
    href: "https://www.tiktok.com/@globalstoreshub?_r=1&_t=ZS-98c4ZtYmpmR",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .55.04.81.1v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.16 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.78a8.2 8.2 0 0 0 4.76 1.52V6.86a4.85 4.85 0 0 1-1.01-.17z"
        />
      </svg>
    ),
  },
  {
    id: "youtube",
    labelKey: "socialYouTube",
    href: "https://youtube.com/@globalstore-k7m?si=N-FuMtagfU6Z5Spa",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.84.56 9.38.56 9.38.56s7.54 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"
        />
      </svg>
    ),
  },
  {
    id: "facebook",
    labelKey: "socialFacebook",
    href: "https://www.facebook.com/share/1C137NoNxY/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M13.5 22v-8.2h2.76l.41-3.2H13.5V8.55c0-.93.26-1.56 1.59-1.56H16.8V4.14C16.4 4.09 15.1 4 13.64 4 10.58 4 8.5 5.87 8.5 9.15v2.45H5.9v3.2H8.5V22h5z"
        />
      </svg>
    ),
  },
];

export default function SocialLinks({ t }) {
  return (
    <div className="social-links" aria-label={t.socialFollow}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.id}
          className={`social-link social-${item.id}`}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t[item.labelKey]}
          title={t[item.labelKey]}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
