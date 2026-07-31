/* Colour ramps for the /play fractal toys.
 *
 * The "logo" ramp is special: it is built so that stop b sits exactly at
 * t = (b + 0.5)/N. A cell of the baked wordmark whose colour index is b looks
 * up t = (b + 0.5)/N and gets stop b back unchanged, so palette phase 0
 * reproduces the original SVG artwork colour for colour. Every other ramp
 * follows the same convention, which keeps the toys interchangeable.
 */

export type Rgb = [number, number, number];

export type Palette = {
  id: string;
  /** Shown to visitors. Kept plain and concrete — this page is for kids. */
  name: string;
  stops: readonly string[];
};

export const PALETTES: readonly Palette[] = [
  {
    id: "logo",
    name: "Monal",
    stops: ["#3aa0ff", "#22c9c9", "#7ed957", "#ffd23f", "#ff8a3c", "#ff0185", "#ff5db1", "#8c6bff"],
  },
  {
    id: "sunset",
    name: "Sunset",
    stops: ["#2b1055", "#7a2a8f", "#c62368", "#f5533d", "#ff8a3c", "#ffd23f", "#ffeebb", "#8c6bff"],
  },
  {
    id: "himalaya",
    name: "Himalaya",
    stops: ["#0b1d3a", "#14476e", "#2a86a8", "#63c7c1", "#b9e6d3", "#f2f6d0", "#ffd23f", "#5a7fa8"],
  },
  {
    id: "candy",
    name: "Candy",
    stops: ["#ff8fc4", "#ff5db1", "#ba8cff", "#8caaff", "#78dce8", "#a8f0c6", "#ffe082", "#ffab78"],
  },
  {
    id: "forest",
    name: "Forest",
    stops: ["#04342c", "#085041", "#0f6e56", "#1d9e75", "#5dcaa5", "#9fe1cb", "#ffd23f", "#2f6b4f"],
  },
  {
    id: "mono",
    name: "Ink",
    stops: ["#18181b", "#2f2f36", "#4b4b55", "#6c6c78", "#9b9ba6", "#c9c9d1", "#efeff1", "#7a7a86"],
  },
];

export const DEFAULT_PALETTE = PALETTES[0];

export const paletteById = (id: string | null | undefined): Palette =>
  PALETTES.find((p) => p.id === id) ?? DEFAULT_PALETTE;

const hexToRgb = (hex: string): Rgb => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

/** Resolution of the generated lookup table. A multiple of 2·N keeps the
 *  stop-b-at-(b+0.5)/N alignment exact for every palette length we use. */
export const LUT_SIZE = 1024;

/**
 * Piecewise-linear cyclic ramp as flat RGB bytes, LUT_SIZE entries long.
 * Sampling at t = (b + 0.5)/stops.length returns stop b exactly.
 */
export function buildLut(palette: Palette): Uint8Array {
  const stops = palette.stops.map(hexToRgb);
  const n = stops.length;
  const lut = new Uint8Array(LUT_SIZE * 3);
  for (let i = 0; i < LUT_SIZE; i++) {
    const p = (i / LUT_SIZE) * n - 0.5;
    const floor = Math.floor(p);
    const a = ((floor % n) + n) % n;
    const b = (a + 1) % n;
    const f = p - floor;
    for (let k = 0; k < 3; k++) {
      lut[i * 3 + k] = Math.round(stops[a][k] + (stops[b][k] - stops[a][k]) * f);
    }
  }
  return lut;
}

/** The same ramp as RGBA, ready for gl.texImage2D. */
export function buildLutRgba(palette: Palette): Uint8Array {
  const rgb = buildLut(palette);
  const rgba = new Uint8Array(LUT_SIZE * 4);
  for (let i = 0; i < LUT_SIZE; i++) {
    rgba[i * 4] = rgb[i * 3];
    rgba[i * 4 + 1] = rgb[i * 3 + 1];
    rgba[i * 4 + 2] = rgb[i * 3 + 2];
    rgba[i * 4 + 3] = 255;
  }
  return rgba;
}

/** The site's ink, and the wordmark's flat interior pink, as shader vec3s. */
export const INK_RGB: Rgb = [0.086, 0.075, 0.11];
export const PINK_RGB: Rgb = [1.0, 0.004, 0.522];

/** The logo's own Julia constant. Every toy orbits or departs from this. */
export const LOGO_C: readonly [number, number] = [-0.8, 0.156];
