function haystack(service) {
  return [
    service.nameEn,
    service.nameAr,
    service.descriptionEn,
    service.descriptionAr,
    service.typeEn,
    service.typeAr,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function filterCatalog(services, query) {
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return services;
  return services.filter((service) => haystack(service).includes(needle));
}
