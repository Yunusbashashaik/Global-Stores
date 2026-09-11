export default function Logo({ className = "" }) {
  const src = `${import.meta.env.BASE_URL}brand-logo.jpg`;
  return (
    <span className={`brand-logo ${className}`.trim()}>
      <img className="brand-mark" src={src} alt="Global Store" />
    </span>
  );
}
