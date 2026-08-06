import ServiceCard from "./ServiceCard.jsx";

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
  const list = showAll ? services : popular;

  return (
    <>
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

      {services.length > POPULAR_COUNT ? (
        <div className="catalog-view-all-wrap catalog-view-all-wrap--footer">
          {showAll ? (
            <button type="button" className="catalog-view-all" onClick={onCloseAll}>
              {t.showLess || "Show Less"}
              <span aria-hidden="true">↑</span>
            </button>
          ) : (
            <button type="button" className="catalog-view-all" onClick={onShowAll}>
              {t.viewAll}
              <span aria-hidden="true">→</span>
            </button>
          )}
          <p className="catalog-count">
            {showAll
              ? `${services.length} ${t.servicesShown || "services"}`
              : `${POPULAR_COUNT} / ${services.length}`}
          </p>
        </div>
      ) : null}
    </>
  );
}
