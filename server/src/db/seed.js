import { persistLiveCatalog, restoreCatalogFromBackup } from "./persist.js";
import { DEFAULT_SERVICES } from "../config/defaultServices.js";
import { seedServicesIfEmpty } from "../models/Service.js";
import { seedSettingsIfEmpty } from "../models/Settings.js";

export function seedDatabase() {
  const restored = restoreCatalogFromBackup();
  const servicesSeeded = restored ? false : seedServicesIfEmpty(DEFAULT_SERVICES);
  const settingsSeeded = seedSettingsIfEmpty();
  persistLiveCatalog();
  return { servicesSeeded, settingsSeeded, restored };
}
