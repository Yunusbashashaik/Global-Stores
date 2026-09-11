import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CatalogSearchContext = createContext({
  query: "",
  setQuery: () => {},
});

export function CatalogSearchProvider({ children }) {
  const [query, setQueryState] = useState("");

  const setQuery = useCallback((next, options = {}) => {
    setQueryState(String(next ?? ""));
    if (options.scrollToCatalog) {
      requestAnimationFrame(() => {
        document.getElementById("services")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, []);

  const value = useMemo(() => ({ query, setQuery }), [query, setQuery]);

  return (
    <CatalogSearchContext.Provider value={value}>{children}</CatalogSearchContext.Provider>
  );
}

export function useCatalogSearch() {
  return useContext(CatalogSearchContext);
}
