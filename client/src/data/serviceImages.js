/** Brand artwork is uploaded in Admin — no bundled catalog images. */
export function serviceImageUrl() {
  return null;
}

const assetBase = import.meta.env.BASE_URL || "/";

export function wallpaperUrl() {
  return `${assetBase}kuwait-living-room.jpg`;
}
