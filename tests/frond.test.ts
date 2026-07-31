import { test } from "node:test";
import assert from "node:assert/strict";

/* The geometry lives in lib/, not in the component: `node --test` strips
   types but cannot transform JSX, so anything inside a .tsx is unreachable
   from here. Moving it out is what made these assertions possible. */
import { AVAIL, grow, MAX_DEPTH, MIN_DEPTH, reach, trunkFor } from "../lib/frond.ts";

const levels = Array.from({ length: MAX_DEPTH - MIN_DEPTH + 1 }, (_, i) => i + MIN_DEPTH);
const height = (d: number) => {
  const ys = grow(d).flatMap((b) => [b.y1, b.y2]);
  return Math.max(...ys) - Math.min(...ys);
};

/* The defect this replaced: a fixed trunk left the plant filling about a
   third of the card at the resting level, adrift in empty space. */
test("the plant always fills most of the card, at every level", () => {
  for (const d of levels) {
    const fill = height(d) / AVAIL;
    assert.ok(fill >= 0.6, `level ${d} fills only ${(fill * 100).toFixed(0)}%`);
    assert.ok(fill <= 1.001, `level ${d} overflows at ${(fill * 100).toFixed(0)}%`);
  }
});

test("it still visibly grows — every level is taller than the last", () => {
  for (let i = 1; i < levels.length; i++) {
    assert.ok(
      height(levels[i]) > height(levels[i - 1]),
      `level ${levels[i]} is not taller than ${levels[i - 1]}`,
    );
  }
});

/* Starting at depth 1 showed a single fork on a long stem: no recursion,
   which is the only thing this control exists to show. */
test("the resting state already shows more than one branching", () => {
  const depths = new Set(grow(MIN_DEPTH).map((b) => b.d));
  assert.ok(depths.size >= 3, `resting state has only ${depths.size} levels of branch`);
  assert.ok(grow(MIN_DEPTH).length >= 8, "resting state is too sparse to read as a plant");
});

test("branch count grows monotonically and stays bounded", () => {
  const counts = levels.map((d) => grow(d).length);
  counts.forEach((c, i) => {
    if (i) assert.ok(c > counts[i - 1], `level ${levels[i]} added no branches`);
  });
  assert.ok(counts.at(-1)! < 2000, "full depth would render too many nodes");
});

test("nothing is drawn above the card's top padding", () => {
  for (const d of levels) {
    const top = Math.min(...grow(d).map((b) => Math.min(b.y1, b.y2)));
    assert.ok(top >= 0, `level ${d} escapes the top of the card at y=${top.toFixed(1)}`);
  }
});

test("reach is the closed form of the branch chain", () => {
  /* sum of RATIO^k for k = 0..d, which is what the trunk solve inverts */
  for (const d of levels) {
    let sum = 0;
    for (let k = 0; k <= d; k++) sum += 0.72 ** k;
    assert.ok(Math.abs(reach(d) - sum) < 1e-9, `reach(${d}) disagrees with the series`);
    assert.ok(trunkFor(d) > 0, `trunkFor(${d}) must be positive`);
  }
});
