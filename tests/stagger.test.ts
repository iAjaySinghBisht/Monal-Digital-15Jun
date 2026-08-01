import { test } from "node:test";
import assert from "node:assert/strict";
import { bisectDepths } from "../lib/stagger.ts";

test("eight items assemble middle, quarters, eighths", () => {
  assert.deepEqual(bisectDepths(8), [2, 1, 2, 0, 2, 1, 2, 3]);
});

test("exactly one item goes first, and it is the middle", () => {
  for (const n of [1, 2, 5, 8, 13, 40]) {
    const d = bisectDepths(n);
    const firsts = d.filter((v) => v === 0);
    assert.equal(firsts.length, 1, `n=${n} should have a single leader`);
    assert.equal(d.indexOf(0), Math.floor((n - 1) / 2), `n=${n} leader is not the middle`);
  }
});

test("each wave is at most twice the size of the one before", () => {
  const d = bisectDepths(64);
  const waves: number[] = [];
  d.forEach((v) => (waves[v] = (waves[v] || 0) + 1));
  waves.forEach((count, i) => {
    if (i === 0) return;
    assert.ok(count <= waves[i - 1] * 2, `wave ${i} grew faster than doubling`);
  });
});

test("depth stays logarithmic, so a long list never trails off", () => {
  for (const n of [8, 64, 1000]) {
    const max = Math.max(...bisectDepths(n));
    assert.ok(max <= Math.ceil(Math.log2(n + 1)), `n=${n} reached depth ${max}`);
  }
});

test("degenerate sizes do not throw", () => {
  assert.deepEqual(bisectDepths(0), []);
  assert.deepEqual(bisectDepths(1), [0]);
  assert.deepEqual(bisectDepths(-3), []);
});
