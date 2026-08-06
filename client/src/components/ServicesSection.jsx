import ServiceCard from "./ServiceCard.jsx";
import GlassModal from "./GlassModal.jsx";

const POPULAR_COUNT = 6;

export default function ServicesSection({
  services,
  lang,
  t,
  onViewPlans,
  showAll,
  onShowAll,
  onCloseAll,
}) {
  const popular = services.slice(0, POPULAR_COUNT);

  return (
    <>
      <div className="services-grid popular-grid">
        {popular.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            lang={lang}
            t={t}
            onViewPlans={onViewPlans}
          />
        ))}
      </div>

      {services.length > POPULAR_COUNT ? (
        <div className="catalog-view-all-wrap">
          <button type="button" className="catalog-view-all" onClick={onShowAll}>
            {t.viewAll}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}

      {showAll ? (
        <GlassModal
          title={t.allServicesTitle}
          onClose={onCloseAll}
          wide
          tone="light"
          className="all-services-modal"
        >
          <div className="services-grid all-services-grid">
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
        </GlassModal>
      ) : null}
    </>
  );
}
