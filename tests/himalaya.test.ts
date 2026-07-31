import { test } from "node:test";
import assert from "node:assert/strict";
import {
  KUMAON_SKYLINE,
  peakLabel,
  ridgeCrests,
  ridgePath,
  ridgePoints,
} from "../lib/himalaya.ts";

const W = 1440;
const H = 520;
const TOP = 150;

/* These are the numbers the footer actually draws with, so a regression
   here is a regression on the page. */
const opts = [KUMAON_SKYLINE, W, H, TOP] as const;

test("ridgePoints places one point per summit, evenly across the frame", () => {
  const pts = ridgePoints(...opts);
  assert.equal(pts.length, KUMAON_SKYLINE.length);
  assert.equal(pts[0].x, 0);
  assert.equal(pts.at(-1)!.x, W);
  const step = W / (KUMAON_SKYLINE.length - 1);
  pts.forEach((p, i) => assert.ok(Math.abs(p.x - i * step) < 1e-9));
});

test("the tallest peak sits exactly at `top`, and height ordering is preserved", () => {
  const pts = ridgePoints(...opts);
  const tallest = pts.reduce((a, b) => (a.peak.m >= b.peak.m ? a : b));
  assert.equal(tallest.peak.name, "Nanda Devi"); // highest wholly in India
  assert.equal(tallest.y, TOP);

  /* y grows downward, so a higher summit must have a SMALLER y. */
  const byElevation = [...pts].sort((a, b) => b.peak.m - a.peak.m);
  for (let i = 1; i < byElevation.length; i++) {
    assert.ok(
      byElevation[i].y >= byElevation[i - 1].y,
      `${byElevation[i].peak.name} is lower but drawn higher`,
    );
  }
});

test("every point lands inside the frame", () => {
  for (const { y } of ridgePoints(...opts)) {
    assert.ok(y >= TOP && y <= H, `y=${y} escaped [${TOP}, ${H}]`);
  }
});

test("ridgePath closes to the baseline and starts at the first summit", () => {
  const d = ridgePath(KUMAON_SKYLINE, W, H, TOP, 0.34);
  assert.match(d, /^M0,520 L0,/);
  assert.match(d, /L1440,520 Z$/);
});

/* The regression that shipped once: the summit markers were drawn 14 units
   BELOW the peak they named, so every label pointed at open sky. */
test("each crest's apex is exactly its summit — no offset", () => {
  const pts = ridgePoints(...opts);
  const crests = ridgeCrests(KUMAON_SKYLINE, W, H, TOP, 0.34);
  assert.equal(crests.length, pts.length);

  crests.forEach((c, i) => {
    const nums = [...c.d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map(([, x, y]) => [
      Number(x),
      Number(y),
    ]);
    /* interior crests are left–apex–right; the two on the frame edge are
       one-sided, because ridgePath drops straight down there */
    const apex = nums.length === 3 ? nums[1] : i === 0 ? nums[0] : nums.at(-1)!;
    assert.ok(Math.abs(apex[0] - pts[i].x) < 0.05, `${c.peak.name} apex x drifted`);
    assert.ok(Math.abs(apex[1] - pts[i].y) < 0.05, `${c.peak.name} apex y drifted`);
  });
});

test("only the frame-edge crests are one-sided", () => {
  const crests = ridgeCrests(KUMAON_SKYLINE, W, H, TOP, 0.34);
  const sides = crests.map((c) => [...c.d.matchAll(/,/g)].length);
  assert.equal(sides[0], 2, "first crest should have no left slope");
  assert.equal(sides.at(-1), 2, "last crest should have no right slope");
  sides.slice(1, -1).forEach((n, i) => assert.equal(n, 3, `crest ${i + 1} should be two-sided`));
});

test("crest ends move toward the neighbouring col, never past it", () => {
  const reach = 0.3;
  const pts = ridgePoints(...opts);
  const crests = ridgeCrests(KUMAON_SKYLINE, W, H, TOP, 0.34, reach);
  const step = W / (KUMAON_SKYLINE.length - 1);
  crests.forEach((c, i) => {
    const xs = [...c.d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((m) => Number(m[1]));
    for (const x of xs) {
      /* a col sits half a step away; travelling `reach` of that distance
         can never exceed it */
      assert.ok(
        Math.abs(x - pts[i].x) <= (step / 2) * reach + 0.05,
        `${c.peak.name} crest overshot its col`,
      );
    }
  });
});

test("peakLabel reads as name · elevation", () => {
  assert.equal(peakLabel({ name: "Nanda Devi", m: 7816 }), "Nanda Devi · 7,816 m");
});
