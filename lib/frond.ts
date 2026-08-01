/* ------------------------------------------------------------------ *
 *  The growing frond's geometry.
 *
 *  Pure, and separate from the component for the same reason the reveal
 *  ordering is: `node --test` strips types but cannot transform JSX, so
 *  anything living in a .tsx is unreachable from a test. Geometry this
 *  fiddly is exactly what should be tested.
 * ------------------------------------------------------------------ */

export const MAX_DEPTH = 6;
/* Two levels of branching, not one. At depth 1 the plant is a single fork
   on a long stem — it reads as a slingshot, and shows no recursion at all,
   which is the one thing this control exists to demonstrate. Starting at 2
   means the resting state already says "this shape contains itself". */
export const MIN_DEPTH = 2;

/* Card, and the box the drawing gets inside it. */
export const W = 208;
export const H = 218;
export const BASE_Y = 174; // above the caption's line
const TOP_PAD = 12;
export const AVAIL = BASE_Y - TOP_PAD;
const RATIO = 0.72;

/** How many trunk-lengths tall the plant stands at a given depth. */
export const reach = (d: number) => (1 - RATIO ** (d + 1)) / (1 - RATIO);

/**
 * Trunk length for a depth, chosen so the plant fills a predictable share
 * of the card at every level.
 *
 * With a fixed trunk the drawing occupied about a third of the frame at the
 * resting depth and all of it when full, so most of the time the card was
 * mostly empty and the plant looked lost in it. Solving for the trunk
 * instead pins the silhouette between 66% and 100% of the available
 * height: it still visibly grows, but it is never adrift.
 */
export function trunkFor(depth: number): number {
  const t = (depth - MIN_DEPTH) / (MAX_DEPTH - MIN_DEPTH);
  const fill = 0.66 + 0.34 * t;
  return (AVAIL * fill) / reach(depth);
}

export type Branch = { x1: number; y1: number; x2: number; y2: number; d: number };

/** Build every branch up to `depth`, as a flat list. */
export function grow(depth: number): Branch[] {
  const out: Branch[] = [];

  const rec = (x: number, y: number, len: number, angle: number, d: number) => {
    if (d > depth) return;
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    out.push({ x1: x, y1: y, x2, y2, d });
    if (d === depth) return;
    /* two children, plus a smaller third on alternate levels so the
       silhouette reads as a frond rather than a bare Y-tree */
    rec(x2, y2, len * RATIO, angle - 0.42, d + 1);
    rec(x2, y2, len * RATIO, angle + 0.42, d + 1);
    if (d % 2 === 0) rec(x2, y2, len * 0.45, angle, d + 1);
  };

  /* The base sits above the caption's line, not on it — anchored lower the
     trunk grew straight through "Tap to grow". The frond only ever extends
     upward, so raising the origin costs nothing at depth. */
  rec(W / 2, BASE_Y, trunkFor(depth), -Math.PI / 2, 0);
  return out;
}
