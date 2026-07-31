/* ------------------------------------------------------------------ *
 *  The brand spectrum — the eight bands of the fractal wordmark.
 *
 *  These are read straight off the logo (public/assets/monal-logo.png),
 *  listed in the order they occur by area in the artwork, so SPECTRUM[0]
 *  is the magenta that dominates it.
 *
 *  WHY THIS FILE EXISTS AS WELL AS CSS VARIABLES
 *  A 2D canvas context cannot resolve CSS custom properties — passing
 *  "var(--color-teal)" as a fillStyle silently paints black. Everything
 *  drawn on canvas (FractalField and its callers) therefore needs real
 *  hex, which is what this module is for. Anything styling the DOM
 *  should use the matching --color-* variable in globals.css instead.
 *
 *  Keep the two in step: the values here are mirrored in the ":root"
 *  block of app/globals.css.
 *
 *  ACCESSIBILITY
 *  None of the eight reaches 4.5:1 against white, so none may carry body
 *  text, links or any small copy on a light surface. They are decoration
 *  and fills. On the near-black ink they all clear 4.7:1 comfortably.
 *
 *  Where a spectrum hue *must* carry text on white, use its `ink`
 *  sibling — the same hue darkened to just past 4.5:1. Note that magenta
 *  and blush converge on the same value once darkened, so the eight
 *  decorative bands are seven distinct text-safe hues.
 *
 *  The primary action colour is NOT from this set: it stays
 *  --color-royal (#6c4df6, 5.21:1 on white), which is the only accent
 *  that can carry a link or a tagline unaided.
 * ------------------------------------------------------------------ */

export type SpectrumStop = {
  /** Token suffix — matches --color-<name> in globals.css. */
  name: string;
  /** Decorative fill. Not safe for text on a light surface. */
  hex: string;
  /** Same hue, darkened past 4.5:1 on white, for text use. */
  ink: string;
};

export const SPECTRUM: SpectrumStop[] = [
  { name: "magenta", hex: "#ff0185", ink: "#e60078" },
  /* Named `sun`, not `lemon`: this band replaced the old --color-sun token
     and inherited its 24 usages, so the CSS variable is --color-sun. One
     colour, one name — the mismatch is exactly what the drift test in
     tests/palette.test.ts exists to catch, and it caught this. */
  { name: "sun", hex: "#ffd23f", ink: "#947200" },
  { name: "leaf", hex: "#7ed957", ink: "#3e861e" },
  { name: "teal", hex: "#22c9c9", ink: "#168383" },
  { name: "azure", hex: "#3aa0ff", ink: "#0075e3" },
  { name: "violet", hex: "#8c6bff", ink: "#7c57ff" },
  { name: "tangerine", hex: "#ff8a3c", ink: "#c95100" },
  { name: "blush", hex: "#ff5db1", ink: "#e60078" },
];

/** Look a stop up by name, for call sites that want a specific hue. */
export const stop = (name: string): SpectrumStop => {
  const found = SPECTRUM.find((s) => s.name === name);
  if (!found) throw new Error(`unknown spectrum stop: ${name}`);
  return found;
};

/** Just the fills, in artwork order — for walking the set. */
export const SPECTRUM_HEX = SPECTRUM.map((s) => s.hex);

/**
 * The Julia constant the wordmark is drawn from: z ← z² + c.
 *
 * It lives beside the spectrum because it is what generates it — the eight
 * bands above are the escape-time bands of this exact set. Mirrored in
 * FractalField's julia painter.
 */
export const LOGO_C: readonly [number, number] = [-0.8, 0.156];
