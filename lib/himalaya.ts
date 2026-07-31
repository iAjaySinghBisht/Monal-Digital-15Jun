/* ------------------------------------------------------------------ *
 *  The Kumaon skyline, from real elevations.
 *
 *  The footer ranges used to be invented zig-zags. These are the peaks
 *  actually on the horizon north of Haldwani — the view from the Kumaon
 *  ridges at Kausani and Binsar — listed roughly west to east with their
 *  true heights in metres.
 *
 *  Honest about what this is: the SILHOUETTE PROPORTIONS are real (peak
 *  order and relative heights come from the elevations below, so Nanda
 *  Devi genuinely towers over Nanda Ghunti by the right amount). It is
 *  not a surveyed profile — the horizontal spacing is even rather than
 *  angular-distance-accurate, and the valleys between are interpolated.
 * ------------------------------------------------------------------ */

export type Peak = { name: string; m: number };

/* West to east, as the range reads from the Kumaon side. */
export const KUMAON_SKYLINE: Peak[] = [
  { name: "Chaukhamba", m: 7138 },
  { name: "Nilkanth", m: 6596 },
  { name: "Trishul", m: 7120 },
  { name: "Nanda Ghunti", m: 6309 },
  { name: "Nanda Devi", m: 7816 }, // highest wholly in India
  { name: "Nanda Devi East", m: 7434 },
  { name: "Nanda Kot", m: 6861 },
  { name: "Panchachuli II", m: 6904 },
];

/** Elevation of the valley floor the peaks are measured against. */
const BASE_M = 1500;

/**
 * Build an SVG path for a skyline.
 *
 * @param peaks   the summits, in view order
 * @param width   viewBox width
 * @param height  viewBox height (the path closes to this baseline)
 * @param top     y of the tallest summit — how much of the box it fills
 * @param drop    how far the cols between summits fall back down, 0..1
 */
export function ridgePath(
  peaks: Peak[],
  width: number,
  height: number,
  top: number,
  drop = 0.45,
): string {
  const max = Math.max(...peaks.map((p) => p.m));
  const span = max - BASE_M;
  /* map a real elevation onto the box: the tallest peak sits at `top`,
     the valley floor at `height` */
  const y = (m: number) => height - ((m - BASE_M) / span) * (height - top);

  const step = width / (peaks.length - 1);
  const pts: string[] = [];

  peaks.forEach((p, i) => {
    if (i === 0) return; // the first summit is placed by the opening move
    const x = i * step;
    {
      /* the col between two summits, sunk by `drop` of the lower one */
      const prev = peaks[i - 1];
      const colM = Math.min(prev.m, p.m) - Math.abs(prev.m - p.m) * drop - span * 0.12;
      pts.push(`L${(x - step / 2).toFixed(0)},${y(colM).toFixed(0)}`);
    }
    pts.push(`L${x.toFixed(0)},${y(p.m).toFixed(0)}`);
  });

  return `M0,${height} L0,${y(peaks[0].m).toFixed(0)} ${pts.join(" ")} L${width},${height} Z`;
}

/**
 * Where each summit lands in the same box `ridgePath` draws into.
 *
 * Shares the elevation mapping above rather than re-deriving it, so a
 * hotspot placed from this can never drift away from the ridge it labels.
 */
export function ridgePoints(
  peaks: Peak[],
  width: number,
  height: number,
  top: number,
): { peak: Peak; x: number; y: number }[] {
  const max = Math.max(...peaks.map((p) => p.m));
  const span = max - BASE_M;
  const step = width / (peaks.length - 1);
  return peaks.map((peak, i) => ({
    peak,
    x: i * step,
    y: height - ((peak.m - BASE_M) / span) * (height - top),
  }));
}

/**
 * A short stretch of the ridge either side of each summit — the "lit crest".
 *
 * This has to trace the ACTUAL slopes, not an approximation: the cue is the
 * skyline brightening, so any drift shows up immediately as a second line
 * beside the real one. It therefore rebuilds the same cols `ridgePath` uses
 * rather than guessing an angle, and returns a path in the same viewBox, to
 * be drawn in the same stretched SVG so it inherits identical distortion.
 *
 * @param reach how far along each slope to travel from the apex, 0..1 of
 *              the distance to the neighbouring col
 */
export function ridgeCrests(
  peaks: Peak[],
  width: number,
  height: number,
  top: number,
  drop = 0.45,
  reach = 0.3,
): { peak: Peak; d: string }[] {
  const max = Math.max(...peaks.map((p) => p.m));
  const span = max - BASE_M;
  const y = (m: number) => height - ((m - BASE_M) / span) * (height - top);
  const step = width / (peaks.length - 1);

  /* The col between two summits, sunk by `drop` of the lower one — the
     same expression ridgePath uses, so the two cannot disagree. */
  const col = (a: Peak, b: Peak) =>
    Math.min(a.m, b.m) - Math.abs(a.m - b.m) * drop - span * 0.12;

  return peaks.map((peak, i) => {
    const ax = i * step;
    const ay = y(peak.m);
    const pt = (nx: number, ny: number) =>
      `${(ax + (nx - ax) * reach).toFixed(1)},${(ay + (ny - ay) * reach).toFixed(1)}`;

    /* The first and last summits sit on the frame edge, where ridgePath
       drops straight down — there is no outward slope to light, so those
       crests are one-sided. */
    const left =
      i === 0 ? null : pt(ax - step / 2, y(col(peaks[i - 1], peak)));
    const right =
      i === peaks.length - 1 ? null : pt(ax + step / 2, y(col(peak, peaks[i + 1])));

    const head = left ? `M${left} L` : "M";
    return { peak, d: `${head}${ax.toFixed(1)},${ay.toFixed(1)}${right ? ` L${right}` : ""}` };
  });
}

/** "Nanda Devi · 7,816 m" */
export const peakLabel = (p: Peak) =>
  `${p.name} · ${p.m.toLocaleString("en-IN")} m`;
