/* ------------------------------------------------------------------ *
 *  The brand spectrum — the eight bands of the fractal wordmark.
 *
 *  Listed in the order they occur by area in the artwork, so SPECTRUM[0]
 *  is the magenta that dominates it.
 *
 *  SIX WERE GIVEN; TWO WERE DERIVED. The six brand values are magenta,
 *  tangerine's neighbours sun and leaf, teal, azure and violet. Laid out
 *  by hue they left three holes of roughly 77° each, so two bands were
 *  built to fill the two that add a hue the set does not already own:
 *
 *    tangerine  24°   between magenta (329°) and sun (46°) — the set had
 *                     exactly one warm colour before this
 *    orchid    291°   between violet (253°) and magenta (329°)
 *
 *  Both take the family's own saturation (97%) and sit at the lightness
 *  that clears the tier-2 rules — under 4.5:1 on white so they cannot
 *  carry text, over 4.5:1 on the ink slabs so they read there.
 *
 *  ORCHID REPLACES `blush`, WHICH WAS NEVER A BAND. Old blush was hue
 *  328.9° and old magenta 328.8° — the same hue, 0.3° apart, one of them
 *  simply lighter. That is why the two collapsed onto a single value the
 *  moment anything darkened them. Orchid is 38° from both its neighbours.
 *
 *  THE ORDER IS THE HUE WHEEL. 329, 24, 46, 102, 180, 209, 253, 291 —
 *  a continuous walk, so anything that takes its colour from position
 *  (the summits west to east, the partner wall) moves through the
 *  spectrum in order rather than jumping about.
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
 *  THESE ARE TIER 2 — DECORATIVE ONLY. None of the eight reaches 4.5:1
 *  against white, so none may carry body text, links or any small copy on
 *  a light surface. That is not a limitation to work around; it is the
 *  reason the rule exists. Text takes `ink` or `muted`, and the accent
 *  takes `accent`.
 *
 *  Each stop used to carry an `ink` sibling — itself darkened past 4.5:1
 *  so it *could* hold text. That escape hatch is gone, along with the
 *  eight CSS tokens behind it: every use of it turned out to be a band
 *  quietly doing a semantic job. If one seems necessary again, the thing
 *  that needs it is in the wrong tier.
 *
 *  A SERIES WALKS THIS ARRAY BY INDEX. It is not a menu to pick from —
 *  see THE PALETTE in app/globals.css.
 * ------------------------------------------------------------------ */

export type SpectrumStop = {
  /** Token suffix — matches --color-<name> in globals.css. */
  name: string;
  /** Decorative fill. Never text — see THE PALETTE in globals.css. */
  hex: string;
};

export const SPECTRUM: readonly SpectrumStop[] = [
  { name: "magenta", hex: "#fc0383" }, // 329°
  { name: "tangerine", hex: "#fc7922" }, //  24°  — added, see above
  /* Named `sun`, not `lemon`: this band replaced the old --color-sun token
     and inherited its 24 usages, so the CSS variable is --color-sun. One
     colour, one name — the mismatch is exactly what the drift test in
     tests/palette.test.ts exists to catch, and it caught this. */
  { name: "sun", hex: "#fdd13e" }, //  46°
  { name: "leaf", hex: "#7cd655" }, // 102°
  { name: "teal", hex: "#23c6c7" }, // 180°
  { name: "azure", hex: "#399ffd" }, // 209°
  { name: "violet", hex: "#8b6bfd" }, // 253°
  { name: "orchid", hex: "#db22fc" }, // 291°  — added, replaces `blush`
];

/* THERE IS DELIBERATELY NO `stop(name)` ACCESSOR.
   There was one, and a test in tests/palette-rule.test.ts that failed if
   any component called it — a rule enforced by detection. Removing the
   function enforces it by construction instead: with no way to ask for
   "the teal one", a series can only walk the array, which is the whole
   point. If a single fixed hue is genuinely wanted, that is the SIGNATURE
   band (--color-teal) and it belongs in CSS, not here. */

/** Just the fills, in HUE order — for walking the set. */
export const SPECTRUM_HEX: readonly string[] = SPECTRUM.map((s) => s.hex);

/* ------------------------------------------------------------------ *
 *  MOTIF TONE — the bands, darkened until they can actually be seen.
 *
 *  The venture cards draw their fractal motif in whatever band their
 *  POSITION hands them, at 42% over the mist card. Measured on that
 *  ground the six were nowhere near equal: magenta landed at 1.98:1 and
 *  sun at 1.15:1. The row read as though three cards had artwork and
 *  three had been left blank, and the blank-looking ones were simply the
 *  light half of the spectrum.
 *
 *  OPACITY CANNOT FIX IT. Sun at FULL strength is 1.35:1 on mist — the
 *  band is too light to register on a near-white card no matter how much
 *  of it you lay down. The only lever left is value.
 *
 *  So every band is scaled toward black until its blend clears
 *  MOTIF_MIN_CONTRAST. Scaling all three channels by ONE factor leaves
 *  HSL hue and saturation untouched and moves only lightness, so each
 *  card still draws its own band — sun stays a gold, leaf stays a green —
 *  just deep enough to see. Magenta is already past the target and comes
 *  back unchanged.
 *
 *  THIS IS NOT THE `-ink` SIBLINGS COMING BACK. Those existed so a band
 *  could pretend to be text, and were picked per caller. This is
 *  decoration being made visible AS decoration, by a rule applied
 *  uniformly to all eight — which is what the no-colour-in-the-table rule
 *  in Services.tsx actually asks for. A card still cannot choose a hue;
 *  it only gets its own one rendered at a value that survives the card.
 *
 *  Only the MOTIF takes this. The number plate on the same card is the
 *  raw band laid thinly on purpose — it is a pale ground holding ink
 *  text, and darkening it would break the thing it is for.
 * ------------------------------------------------------------------ */

/** Mirrors --color-mist in globals.css — the venture cards' ground. */
export const CARD_GROUND = "#f6f6f7";
/** Mirrors the motif span's resting opacity in components/Services.tsx. */
export const MOTIF_ALPHA = 0.42;
/** Under this a motif stops reading as artwork and the card looks empty. */
export const MOTIF_MIN_CONTRAST = 1.6;

const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (c: readonly number[]) =>
  "#" +
  c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");

const linear = (c: number) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
  const [r, g, b] = channels(hex);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
};
/** `fg` laid over `bg` at `alpha` — what the eye actually receives. */
const composite = (fg: string, bg: string, alpha: number) =>
  toHex(channels(fg).map((c, i) => c * alpha + channels(bg)[i] * (1 - alpha)));

/**
 * A band at a value that survives the mist card. Hue and saturation are
 * preserved exactly; only lightness moves. Returns the band untouched if
 * it already clears the target.
 */
export const motifTone = (band: string): string => {
  for (let step = 0; step <= 80; step++) {
    const scaled = toHex(channels(band).map((c) => c * (1 - step / 100)));
    if (ratio(composite(scaled, CARD_GROUND, MOTIF_ALPHA), CARD_GROUND) >= MOTIF_MIN_CONTRAST) {
      return scaled;
    }
  }
  return toHex(channels(band).map((c) => c * 0.2));
};

/**
 * The Julia constant the wordmark is drawn from: z ← z² + c.
 *
 * It lives beside the spectrum because it is what generates it — the eight
 * bands above are the escape-time bands of this exact set. Mirrored in
 * FractalField's julia painter.
 */
export const LOGO_C: readonly [number, number] = [-0.8, 0.156];
