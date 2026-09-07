const MAX_EDGE = 960;
const QUALITY = 0.82;
const SKIP_UNDER_BYTES = 180_000;

function canvasToJpegBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not compress image"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

/** Shrink large JPEGs before upload so add/edit service requests stay fast. */
export async function compressJpeg(file) {
  if (!file || !(file instanceof Blob)) return file;
  if (file.size <= SKIP_UNDER_BYTES) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await canvasToJpegBlob(canvas, QUALITY);
  if (blob.size >= file.size) return file;

  const name = String(file.name || "service.jpg").replace(/\.[^.]+$/, ".jpg");
  return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
}
