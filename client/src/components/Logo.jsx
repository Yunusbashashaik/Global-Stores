export default function Logo({ className = "", showTagline = false }) {
  const src = `${import.meta.env.BASE_URL}brand-logo.jpg`;
  return (
    <span className={`brand-logo ${className}`.trim()}>
      <span className="brand-mark-wrap" aria-hidden="true">
        <img className="brand-mark" src={src} alt="" />
      </span>
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
