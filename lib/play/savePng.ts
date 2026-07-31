/* "Save as PNG" for the /play toys.
 *
 * The WebGL canvas holds only the fractal rectangle — the letterform cut-out is
 * a CSS mask, which a canvas export knows nothing about. So the export path
 * re-renders at the requested size, then composites: fractal, mask (as
 * destination-in), backdrop (as destination-over).
 */

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });

export type SavePngOptions = {
  /** The live canvas to capture. */
  source: HTMLCanvasElement;
  /** WebGL toys pass useJulia's draw(), so the export can force a bigger buffer. */
  forceRender?: (size?: { w: number; h: number }) => void;
  width: number;
  height: number;
  /** True for the baked 235x57 grid, so upscaling keeps its hard cell edges. */
  pixelated?: boolean;
  /** Letterform mask to cut the image to, e.g. /play/monal-letters-mask.svg */
  maskUrl?: string;
  /** Painted underneath the result. Omit for a transparent PNG. */
  background?: string;
  filename: string;
};

export async function savePng({
  source,
  forceRender,
  width,
  height,
  pixelated = false,
  maskUrl,
  background,
  filename,
}: SavePngOptions): Promise<void> {
  // Load the mask first: everything after this must stay synchronous so the
  // oversized drawing buffer is never composited to the screen.
  const mask = maskUrl ? await loadImage(maskUrl) : null;

  let snapshot: string;
  if (forceRender) {
    forceRender({ w: width, h: height });
    snapshot = source.toDataURL("image/png");
    forceRender();                       // restore the on-screen size at once
  } else {
    snapshot = source.toDataURL("image/png");
  }

  const frame = await loadImage(snapshot);
  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");

  ctx.imageSmoothingEnabled = !pixelated;
  ctx.drawImage(frame, 0, 0, width, height);

  if (mask) {
    ctx.imageSmoothingEnabled = true;    // the mask is vector; keep its edges smooth
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(mask, 0, 0, width, height);
  }
  if (background) {
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }

  const blob = await new Promise<Blob | null>((r) => out.toBlob(r, "image/png"));
  if (!blob) throw new Error("PNG encoding failed");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  a.click();
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Kid-friendly file name: "ziggy-the-twirlwhisker.png". */
export const slugifyFilename = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "monal-fractal";
