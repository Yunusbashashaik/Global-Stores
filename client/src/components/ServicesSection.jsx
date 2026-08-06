import ServiceCard from "./ServiceCard.jsx";

const POPULAR_COUNT = 6;

export default function ServicesSection({
  services,
  lang,
  t,
  onViewPlans,
  showAll,
}) {
  const popular = services.slice(0, POPULAR_COUNT);
  const list = showAll ? services : popular;

  return (
    <div
      className={`services-grid ${showAll ? "all-services-grid catalog-expanded" : "popular-grid"}`}
      data-count={list.length}
    >
      {list.map((service) => (
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
