import test from "node:test";
import assert from "node:assert/strict";
import { INNER_RATIO, diamondPath, innerRadius } from "../lib/aipan.ts";

/* Parse "M0,-4 L4,0 L0,4 L-4,0 Z" into points. */
const points = (d: string): [number, number][] =>
  d
    .replace(/[MLZ]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return [x, y] as [number, number];
    });

test("the diamond has four points, one on each axis", () => {
  const p = points(diamondPath(4));
  assert.equal(p.length, 4);
  assert.deepEqual(p, [
    [0, -4],
    [4, 0],
    [0, 4],
    [-4, 0],
  ]);
});

test("every point sits exactly r from the centre", () => {
  for (const r of [4, 5.5, 7, 1.9]) {
    for (const [x, y] of points(diamondPath(r))) {
      assert.ok(Math.abs(Math.hypot(x, y) - r) < 1e-9, `r=${r} point ${x},${y}`);
    }
  }
});

test("the figure is symmetric about both axes", () => {
  const p = points(diamondPath(7));
  const xs = p.map(([x]) => x).sort((a, b) => a - b);
  const ys = p.map(([, y]) => y).sort((a, b) => a - b);
  assert.equal(xs[0], -xs[3]);
  assert.equal(ys[0], -ys[3]);
});

test("the inner diamond is the outer at INNER_RATIO", () => {
  assert.equal(innerRadius(4), 1.9);
  assert.equal(innerRadius(4) / 4, INNER_RATIO);
});

/* The band was drawn at 4/1.9 by hand and the corner mark at 7/3.4 — a
   ratio drift of 2% that nobody would catch by eye but which is exactly
   how one figure becomes two. Both now derive from the same call. */
test("every size in use keeps the same ratio", () => {
  for (const r of [4, 5.5, 7]) {
    assert.ok(Math.abs(innerRadius(r) / r - INNER_RATIO) < 1e-3, `r=${r}`);
  }
});

test("the inner clears the outer at the smallest size drawn", () => {
  /* At the 10px eyebrow, outer r=4 and stroke 0.8: the gap between the two
     outlines must stay wider than a stroke or they merge into one ring. */
  const gap = (4 - innerRadius(4)) / Math.SQRT2; // perpendicular, not radial
  assert.ok(gap > 0.8, `gap ${gap} must exceed the 0.8 stroke`);
});

test("the components draw the diamond from this module, not by hand", async () => {
  const { readFileSync } = await import("node:fs");
  for (const f of [
    "components/AipanBorder.tsx",
    "components/AipanMark.tsx",
    "components/Decor.tsx",
  ]) {
    const src = readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
    assert.ok(src.includes("diamondPath"), `${f} should import diamondPath`);
    assert.ok(
      !/d="M0?,?-?[\d.]+ L[\d.]+,0 L/.test(src),
      `${f} still has a hand-written diamond path`
    );
  }
});
