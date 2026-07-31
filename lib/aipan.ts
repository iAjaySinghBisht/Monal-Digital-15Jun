/* ------------------------------------------------------------------ *
 *  The nested diamond — one figure, one definition.
 *
 *  A diamond containing a smaller diamond is the single unit the Aipan
 *  band at the foot of the page is built from, and it is also the site's
 *  own construction stated plainly: the same shape at two scales.
 *
 *  It is drawn in four places at four sizes — the closing band, the
 *  section eyebrows, the corner mark, the ruled divider. Written out four
 *  times those would drift into four slightly different diamonds within a
 *  month, which is exactly what happened to the inner ratio before this
 *  file existed (0.475 in the band, 0.486 in the corner, absent in the
 *  rule). Defined once, they cannot.
 * ------------------------------------------------------------------ */

/* The inner diamond's half-diagonal as a fraction of the outer's. Chosen
   by eye on the 16px band: much larger and the two outlines crowd into a
   single thick ring, much smaller and the inner reads as a dot. */
export const INNER_RATIO = 0.475;

/** A diamond centred on the origin, `r` from centre to each point. */
export const diamondPath = (r: number): string =>
  `M0,${-r} L${r},0 L0,${r} L${-r},0 Z`;

/** The inner diamond's radius for a given outer radius. */
export const innerRadius = (r: number): number =>
  Math.round(r * INNER_RATIO * 1000) / 1000;
