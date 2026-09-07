import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS } from "../data/defaultSettings.js";
import { fetchPublicSettings } from "../lib/adminApi.js";

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const refreshSettings = useCallback(async () => {
    try {
      const next = await fetchPublicSettings();
      if (next) setSettings(next);
    } catch {
      /* keep last known settings */
    }
  }, []);

  useEffect(() => {
    refreshSettings();
    const onUpdate = () => {
      refreshSettings();
    };
    window.addEventListener("gs:settings-updated", onUpdate);
    return () => window.removeEventListener("gs:settings-updated", onUpdate);
  }, [refreshSettings]);

  const value = useMemo(
    () => ({ settings, refreshSettings }),
    [settings, refreshSettings],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
