import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LOGO_C, SPECTRUM, SPECTRUM_HEX, stop } from "../lib/palette.ts";

/* WCAG relative luminance + contrast, so the accessibility claims in
   palette.ts are checked rather than asserted in a comment. */
const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const WHITE = "#ffffff";
const INK = "#18181b";
const ROYAL = "#6c4df6";

test("the spectrum is eight uniquely-named stops", () => {
  assert.equal(SPECTRUM.length, 8);
  assert.equal(new Set(SPECTRUM.map((s) => s.name)).size, 8);
  assert.equal(new Set(SPECTRUM_HEX).size, 8);
  SPECTRUM.forEach((s) => {
    assert.match(s.hex, /^#[0-9a-f]{6}$/, `${s.name} hex malformed`);
    assert.match(s.ink, /^#[0-9a-f]{6}$/, `${s.name} ink malformed`);
  });
});

/* This is the constraint the whole colour decision rested on: the logo
   bands are decoration, never text on a light surface. If a future band
   quietly passed, the rule in palette.ts would be wrong. */
test("no raw band may carry body text on white", () => {
  SPECTRUM.forEach((s) => {
    assert.ok(
      contrast(s.hex, WHITE) < 4.5,
      `${s.name} now passes on white — the decoration-only rule needs revisiting`,
    );
  });
});

test("every ink sibling does pass on white", () => {
  SPECTRUM.forEach((s) => {
    assert.ok(
      contrast(s.ink, WHITE) >= 4.5,
      `${s.name}-ink is ${contrast(s.ink, WHITE).toFixed(2)}:1, below 4.5`,
    );
  });
});

test("every raw band is legible on the near-black, where the logo lives", () => {
  SPECTRUM.forEach((s) => {
    assert.ok(
      contrast(s.hex, INK) >= 4.5,
      `${s.name} is only ${contrast(s.hex, INK).toFixed(2)}:1 on ink`,
    );
  });
});

test("royal stays the primary: it is the accent that carries text on white", () => {
  assert.ok(contrast(ROYAL, WHITE) >= 4.5);
});

test("magenta and blush converge once darkened", () => {
  assert.equal(stop("magenta").ink, stop("blush").ink);
});

test("stop() throws on an unknown name rather than returning undefined", () => {
  assert.throws(() => stop("chartreuse"), /unknown spectrum stop/);
});

test("the wordmark's Julia constant is the one the painter uses", () => {
  assert.deepEqual([...LOGO_C], [-0.8, 0.156]);
  const painter = readFileSync(new URL("../components/FractalField.tsx", import.meta.url), "utf8");
  assert.ok(
    painter.includes("LOGO_C"),
    "FractalField should import the constant, not restate it",
  );
});

/* The drift guard. palette.ts and globals.css necessarily hold the same
   values — canvas cannot read a CSS variable — so the only thing keeping
   them in step used to be a comment. */
test("globals.css matches the spectrum exactly", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const declared = new Map(
    [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map(([, k, v]) => [
      k,
      v.toLowerCase(),
    ]),
  );
  SPECTRUM.forEach((s) => {
    assert.equal(declared.get(s.name), s.hex, `--color-${s.name} drifted from palette.ts`);
    assert.equal(
      declared.get(`${s.name}-ink`),
      s.ink,
      `--color-${s.name}-ink drifted from palette.ts`,
    );
  });
});
