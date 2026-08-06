export default function ServiceIcon({ service }) {
  const accent = service.accent || "#38bdf8";
  const label = (service.nameEn || "?").trim().slice(0, 2).toUpperCase();

  return (
    <div
      className="service-icon"
      style={{
        "--service-accent": accent,
      }}
      aria-hidden="true"
    >
      <span className="service-icon-glow" />
      <span className="service-icon-mark">
        {service.icon ? (
          <span className="service-icon-emoji">{service.icon}</span>
        ) : (
          <span className="service-icon-letters">{label}</span>
        )}
      </span>
    </div>
  );
}
