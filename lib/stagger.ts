/* ------------------------------------------------------------------ *
 *  Reveal ordering.
 *
 *  Pure, and deliberately kept out of the animation hook: the hook pulls
 *  in GSAP, which cannot load outside a browser, so anything left in there
 *  is untestable by construction.
 * ------------------------------------------------------------------ */

/**
 * Recursion depth of each index under repeated bisection.
 *
 * Halve the range and take the middle; that item is depth 0. Halve each
 * side and take their middles; depth 1. And so on — so using depth as a
 * delay multiplier makes a group arrive middle-first, then quarters, then
 * eighths. For eight items the depths come out [2,1,2,0,2,1,2,3]: index 3
 * lands alone, then 1 and 5 together, then 0, 2, 4 and 6, then 7.
 */
export function bisectDepths(n: number): number[] {
  const out = new Array<number>(Math.max(0, n)).fill(0);
  const walk = (lo: number, hi: number, d: number) => {
    if (lo > hi) return;
    const mid = Math.floor((lo + hi) / 2);
    out[mid] = d;
    walk(lo, mid - 1, d + 1);
    walk(mid + 1, hi, d + 1);
  };
  walk(0, n - 1, 0);
  return out;
}
