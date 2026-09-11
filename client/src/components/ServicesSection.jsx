import ServiceCard from "./ServiceCard.jsx";

export default function ServicesSection({
  services,
  lang,
  t,
  onViewPlans,
}) {
  return (
    <div
      className="services-grid all-services-grid catalog-expanded"
      data-count={services.length}
    >
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          lang={lang}
          t={t}
          onViewPlans={onViewPlans}
        />
      ))}
    </div>
  );
}
