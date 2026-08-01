import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { SPECTRUM } from "../lib/palette.ts";

/* ------------------------------------------------------------------ *
 *  Guards for THE PALETTE rule documented at the top of globals.css.
 *
 *  The sprawl these catch did not arrive in one bad commit. It grew one
 *  reasonable-looking choice at a time — a purple card here, a yellow
 *  eyebrow there — and every one of them was defensible on its own. A
 *  comment cannot stop that; a failing test can.
 * ------------------------------------------------------------------ */

const ROOT = new URL("../", import.meta.url);
const read = (p: string) => readFileSync(new URL(p, ROOT), "utf8");

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(new URL(dir, ROOT))) {
    const rel = `${dir}/${entry}`;
    if (statSync(new URL(rel, ROOT)).isDirectory()) walk(rel, out);
    else if (/\.tsx?$/.test(entry)) out.push(rel);
  }
  return out;
};
const SOURCES = [...walk("components"), ...walk("app")].filter(
  (f) => !f.endsWith(".d.ts")
);

const BANDS = SPECTRUM.map((s) => s.name);

/* Tier 1 is two values of one hue, and the pair is load-bearing: the
   accent must work as a FILL and as TEXT, and no single lightness does
   both. If they ever drift to different hues, "the accent" stops being a
   colour and becomes two. */
test("the accent has both its forms, and they are the same hue", () => {
  const css = read("app/globals.css");
  const grab = (name: string) =>
    css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1]?.toLowerCase();
  const fill = grab("accent");
  const text = grab("accent-ink");
  assert.ok(fill, "--color-accent must exist — it is the whole of tier 1");
  assert.ok(text, "--color-accent-ink must exist — magenta cannot hold text on white");

  const hueOf = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max === min) return 0;
    const d = max - min;
    const h =
      max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return (h * 60 + 360) % 360;
  };
  const gap = Math.abs(hueOf(fill!) - hueOf(text!));
  assert.ok(
    gap < 8,
    `the accent's two forms are ${gap.toFixed(1)}deg apart — they must be one hue at two lightnesses`
  );
});

/* THE ONE SANCTIONED OVERLAP. The accent IS the magenta band — tier 1 and
   tier 2 share a value, deliberately, because the action colour was asked
   to come from the brand set, and magenta is the band the wordmark is
   mostly made of.

   The cost is real and worth naming: wherever a series walks to magenta
   (one summit, one partner mark, one venture card) that decoration is the
   exact colour of every button. It is tolerable only because the
   convention puts the meaning in FORM — a filled disc with an arrow, a
   pill — and lets colour reinforce rather than carry it.

   The guard is that this stays the ONLY overlap and stays magenta. An
   accent that drifts onto teal or sun would be an accident, not a
   decision. */
test("the accent overlaps exactly one band, and it is magenta", () => {
  const css = read("app/globals.css");
  const fill = css.match(/--color-accent:\s*(#[0-9a-fA-F]{6})/)?.[1]?.toLowerCase();
  const matches = SPECTRUM.filter((s) => s.hex.toLowerCase() === fill);
  assert.equal(matches.length, 1, `--color-accent (${fill}) should match exactly one band`);
  assert.equal(
    matches[0].name,
    "magenta",
    `the accent has moved onto the ${matches[0].name} band — only the magenta overlap is intended`
  );
});

/* The signature band and the accent must stay different bands. The
   signature is a fixed decoration (the eyebrow diamond, the heading
   highlight, the pull quotes); the accent means "you can act on this". If
   the two ever land on one band, a highlight is indistinguishable from a
   button and the accent stops carrying meaning. This caught nothing when
   written — the point is that it fails the day someone moves one of them
   onto the other. */
test("the signature band is not the accent band", () => {
  const css = read("app/globals.css");
  const accent = css.match(/--color-accent:\s*(#[0-9a-fA-F]{6})/)?.[1]?.toLowerCase();
  const mark = css.match(/^\.mark \{ background: var\(--color-([a-z-]+)\)/m)?.[1];
  assert.ok(mark, ".mark must take its background from a band token");
  const signature = SPECTRUM.find((s) => s.name === mark);
  assert.ok(signature, `.mark uses --color-${mark}, which is not one of the eight bands`);
  assert.notEqual(
    signature!.hex.toLowerCase(),
    accent,
    `the signature band (${mark}) is now the accent colour — a highlight and a ` +
      `button would be the same colour, which is the one thing the tiers exist to prevent`
  );
});

test("no `-ink` sibling comes back", () => {
  const css = read("app/globals.css");
  for (const band of BANDS) {
    assert.ok(
      !new RegExp(`--color-${band}-ink:`).test(css),
      `--color-${band}-ink is back. Bands are decorative; if one needs to ` +
        `carry text it is being used semantically and the fix is upstream.`
    );
  }
});

/* A series must walk the set. Picking a band by name is the specific move
   that produced six unrelated venture hues, three pastel plates cycled
   across six cards, and four team pastels unrelated to the logo.

   This used to scan every component for `stop("teal")`. The accessor is
   now gone, so the rule holds by CONSTRUCTION rather than by detection —
   and what is worth guarding is that nobody quietly puts it back. */
test("there is no by-name accessor to reintroduce the problem", () => {
  const src = read("lib/palette.ts");
  assert.ok(
    !/export const stop\b/.test(src),
    "a by-name band accessor is back — a series must walk SPECTRUM by index"
  );
  assert.ok(
    /readonly SpectrumStop\[\]/.test(src),
    "SPECTRUM must stay readonly; a mutable export can be pushed to at runtime"
  );
});

/* WCAG AA, measured against the ground each colour ACTUALLY lands on.
   Both of these were set by checking them on white, and both passed there
   while failing on the alternating off-white sections — muted at 4.47:1
   and the accent's text form at 4.22:1. A colour is only as legible as
   its worst real background, and on this page that is `mist`. */
test("body copy and accent text clear AA on the darkest ground they sit on", () => {
  const css = read("app/globals.css");
  const val = (name: string) =>
    css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1] as string;

  const srgb = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
  };
  const contrast = (a: string, b: string) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };

  const MIST = val("mist");
  for (const token of ["muted", "accent-ink"]) {
    const ratio = contrast(val(token), MIST);
    assert.ok(
      ratio >= 4.5,
      `--color-${token} is ${ratio.toFixed(2)}:1 on --color-mist, under AA. ` +
        `Check it against mist, not white — half the page's copy sits on mist.`
    );
  }
});

test("the heading highlight has exactly one flavour", () => {
  const css = read("app/globals.css");
  assert.ok(/^\.mark \{/m.test(css), ".mark should exist");
  assert.ok(
    !/\.mark-(sun|teal|violet|royal)/.test(css),
    "the .mark-* variants are back — a highlight is a singleton and takes " +
      "the signature band, not whichever hue suited that heading"
  );
});

test("there is exactly one filled button colour", () => {
  const css = read("app/globals.css");
  const filled = [...css.matchAll(/^\s*\.btn-([a-z]+)\s*\{/gm)].map((m) => m[1]);
  assert.deepEqual(
    filled.sort(),
    ["outline", "primary"],
    "a second filled button variant is back; `primary` is the only one that " +
      "may carry a fill, because a button is where royal means what it says"
  );
});

/* Aipan is the one sanctioned exception, and it is worth asserting that it
   stays confined — the moment its ochre appears in a second file it has
   stopped being an exception and become a fourth palette. */
test("Aipan's pigment lives in exactly one component", () => {
  const holders = SOURCES.filter((f) => /#a81f16|#82130c|#f7f4ef/i.test(read(f)));
  assert.deepEqual(holders, ["components/AipanBorder.tsx"]);
});
