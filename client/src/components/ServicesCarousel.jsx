import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard.jsx";

const PAGE_SIZE = 3;

export default function ServicesCarousel({ services, lang, t }) {
  const pageCount = Math.max(1, Math.ceil(services.length / PAGE_SIZE));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  const goNext = () => {
    setPage((current) => (current + 1) % pageCount);
  };

  const goPrev = () => {
    setPage((current) => (current - 1 + pageCount) % pageCount);
  };

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="services-carousel">
      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {Array.from({ length: pageCount }, (_, pageIndex) => {
            const slice = services.slice(
              pageIndex * PAGE_SIZE,
              pageIndex * PAGE_SIZE + PAGE_SIZE,
            );
            return (
              <div className="carousel-page" key={`page-${pageIndex}`}>
                <div className="grid carousel-grid">
                  {slice.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      lang={lang}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {pageCount > 1 ? (
        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-arrow carousel-arrow-prev"
            onClick={goPrev}
            aria-label={t.carouselPrev}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
              />
            </svg>
          </button>
          <div className="carousel-dots" role="tablist" aria-label={t.catalogTitle}>
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                role="tab"
                aria-selected={page === index}
                className={`carousel-dot${page === index ? " active" : ""}`}
                onClick={() => setPage(index)}
                aria-label={`${t.carouselPage} ${index + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="carousel-arrow carousel-arrow-next"
            onClick={goNext}
            aria-label={t.carouselNext}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
