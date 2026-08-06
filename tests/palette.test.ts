import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  LOGO_C,
  SPECTRUM,
  SPECTRUM_HEX,
  motifTone,
  CARD_GROUND,
  MOTIF_ALPHA,
  MOTIF_MIN_CONTRAST,
} from "../lib/palette.ts";

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
const MIST = "#f6f6f7";

/* READ THE TOKEN, DO NOT RESTATE IT. This was `const ROYAL = "#6c4df6"`,
   a purple hardcoded here from a palette two accents ago — the CSS moved
   to magenta and then to teal without it ever changing, and because every
   assertion below compared ROYAL against white rather than against the
   real token, all of them passed the whole time while testing a colour
   the site had not used in months. A test that keeps its own copy of the
   value it is guarding is not guarding anything. */
const cssToken = (name: string): string => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`--color-${name} not found in globals.css`);
  return m[1].toLowerCase();
};
const ACCENT = cssToken("accent");
const ACCENT_INK = cssToken("accent-ink");
const ACCENT_2 = cssToken("accent-2");

test("the spectrum is eight uniquely-named stops", () => {
  assert.equal(SPECTRUM.length, 8);
  assert.equal(new Set(SPECTRUM.map((s) => s.name)).size, 8);
  assert.equal(new Set(SPECTRUM_HEX).size, 8);
  SPECTRUM.forEach((s) => {
    assert.match(s.hex, /^#[0-9a-f]{6}$/, `${s.name} hex malformed`);
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

/* The `ink` siblings are gone — see lib/palette.ts. What replaces that
   test is the rule they existed to dodge: a band may not carry text, and
   the accent IS a band, so the darkened form has to carry it instead. If
   this failed, tier 1 would have nothing that could hold a link. */
test("the accent's dark form carries text, since the band cannot", () => {
  assert.ok(
    contrast(ACCENT_INK, WHITE) >= 4.5,
    `accent-ink ${ACCENT_INK} is ${contrast(ACCENT_INK, WHITE).toFixed(2)}:1 on paper`,
  );
  assert.ok(
    contrast(ACCENT_INK, MIST) >= 4.5,
    `accent-ink ${ACCENT_INK} is ${contrast(ACCENT_INK, MIST).toFixed(2)}:1 on mist, ` +
      `which is the ground most of the accent's text actually lands on`,
  );
});

/* THE BUTTON'S TYPE COLOUR IS LOAD-BEARING. On magenta this shipped white
   at 3.83:1, knowingly under AA. The accent is a LIGHT band now, so white
   would be 2.11:1 — worse, and indefensible. Ink is what makes a bright
   fill work, and both states have to hold it, not just the resting one. */
test("ink clears AA on both button states", () => {
  assert.ok(
    contrast(ACCENT, INK) >= 4.5,
    `ink on the resting button is only ${contrast(ACCENT, INK).toFixed(2)}:1`,
  );
  assert.ok(
    contrast(ACCENT_2, INK) >= 4.5,
    `ink on the pressed button is only ${contrast(ACCENT_2, INK).toFixed(2)}:1`,
  );
  assert.ok(
    contrast(ACCENT, WHITE) < 4.5,
    `white now passes on the accent (${contrast(ACCENT, WHITE).toFixed(2)}:1) — if the ` +
      `accent got dark enough for white type, the ink-on-bright-band rule needs revisiting`,
  );
});

/* accent-ink is the accent DARKENED, not a second colour that happens to
   look related. Hue is what makes it read as the same teal. */
test("the accent's two forms are one hue, and -ink is the darker", () => {
  assert.ok(
    hueGap(hue(ACCENT), hue(ACCENT_INK)) <= 1,
    `the accent's two forms are ${hueGap(hue(ACCENT), hue(ACCENT_INK)).toFixed(1)}deg apart`,
  );
  assert.ok(
    lum(ACCENT_INK) < lum(ACCENT),
    "accent-ink must be darker than the band it is derived from",
  );
});

/* THE SIGNATURE AND THE ACCENT MAY NOT BE THE SAME BAND — the rule stated
   at the top of globals.css, which nothing enforced until now. A pull
   quote wearing the button's colour is how "you can act on this" stops
   meaning anything. */
test("the signature is not the accent's band", () => {
  const violet = SPECTRUM.find((s) => s.name === "violet")!.hex;
  assert.ok(
    hueGap(hue(violet), hue(ACCENT)) >= 20,
    "the signature band and the accent have collapsed onto one hue",
  );
});

test("every raw band is legible on the near-black, where the logo lives", () => {
  SPECTRUM.forEach((s) => {
    assert.ok(
      contrast(s.hex, INK) >= 4.5,
      `${s.name} is only ${contrast(s.hex, INK).toFixed(2)}:1 on ink`,
    );
  });
});

/* This was a second copy of the assertion above, against the same stale
   constant. Removed rather than rewritten — one guard per rule. */

/* Hue distance, which is what "a distinct band" actually means. Two
   colours can look different, sit at different lightnesses and still be
   the SAME hue — which is what `blush` was. It shipped for months as the
   eighth band while being magenta 0.3 degrees away and merely lighter,
   and the only symptom anyone noticed was that it and magenta collapsed
   onto one value whenever something darkened them. */
const hue = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 0;
  const d = max - min;
  const h =
    max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};
const hueGap = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

test("every band is a genuinely distinct hue", () => {
  const MIN_SEPARATION = 20; // degrees
  const seen: { name: string; h: number }[] = [];
  for (const s of SPECTRUM) {
    const h = hue(s.hex);
    for (const other of seen) {
      assert.ok(
        hueGap(h, other.h) >= MIN_SEPARATION,
        `${s.name} (${h.toFixed(1)}deg) and ${other.name} (${other.h.toFixed(1)}deg) are ` +
          `${hueGap(h, other.h).toFixed(1)}deg apart — that is one hue with two names, ` +
          `which is what blush was before it was replaced`
      );
    }
    seen.push({ name: s.name, h });
  }
});

/* The set is walked BY POSITION, so its order is a visible property: the
   summits run west to east and the partner wall left to right. Hue order
   makes that walk move around the wheel instead of jumping. */
test("the bands are stored in hue order, starting at magenta", () => {
  const hues = SPECTRUM.map((s) => hue(s.hex));
  assert.equal(SPECTRUM[0].name, "magenta");
  /* Rotate so the walk starts where the wordmark's dominant band does,
     then it must ascend without wrapping more than once. */
  const rotated = hues.map((h) => (h - hues[0] + 360) % 360);
  for (let i = 1; i < rotated.length; i++) {
    assert.ok(
      rotated[i] > rotated[i - 1],
      `${SPECTRUM[i].name} breaks the hue walk — ${SPECTRUM[i - 1].name} is at ` +
        `${hues[i - 1].toFixed(0)}deg and it is at ${hues[i].toFixed(0)}deg`
    );
  }
});

/* The baked wordmark carries its own copy of the palette, because
   LOGO_CELLS indexes into it by position and that order comes from the
   artwork rather than from the spectrum. A permutation is fine; a
   DIFFERENT SET is a ninth palette hiding behind a "do not edit"
   generator header — which is exactly what it was until the bands moved
   and it silently kept the old ones. */
test("the baked wordmark uses the brand bands", async () => {
  const { LOGO_PALETTE } = await import("../lib/play/logoGrid.ts");
  const { PALETTES } = await import("../lib/play/palettes.ts");
  assert.deepEqual(
    [...LOGO_PALETTE].sort(),
    [...SPECTRUM_HEX].sort(),
    "LOGO_PALETTE has drifted from the spectrum"
  );
  const brand = PALETTES.find((p) => p.id === "logo");
  assert.deepEqual(
    [...(brand?.stops ?? [])],
    [...LOGO_PALETTE],
    "the toy's Monal palette must match the wordmark's exactly, order included"
  );
});

test("the wordmark's Julia constant is the one the painter uses", () => {
  assert.deepEqual([...LOGO_C], [-0.8, 0.156]);
  const painter = readFileSync(new URL("../components/FractalField.tsx", import.meta.url), "utf8");
  assert.ok(
    painter.includes("LOGO_C"),
    "FractalField should import the constant, not restate it",
  );
});

/* ------------------------------------------------------------------ *
 *  MOTIF TONE. The venture cards were drawing the light half of the
 *  spectrum at around 1.2:1 on their own card — sun worst at 1.15:1 —
 *  so half the row looked like artwork had failed to load. These pin the
 *  two properties that make the fix a RULE rather than a hand-tweak:
 *  every band clears the bar, and no band changes hue getting there.
 * ------------------------------------------------------------------ */

const composite = (fg: string, bg: string, alpha: number) => {
  const ch = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (
    "#" +
    ch(fg)
      .map((c, i) => Math.round(c * alpha + ch(bg)[i] * (1 - alpha)))
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
};

test("every band's motif tone is actually visible on the card", () => {
  for (const s of SPECTRUM) {
    const seen = composite(motifTone(s.hex), CARD_GROUND, MOTIF_ALPHA);
    const c = contrast(seen, CARD_GROUND);
    assert.ok(
      c >= MOTIF_MIN_CONTRAST - 0.01,
      `${s.name} renders at ${c.toFixed(2)}:1 on the card, under the ${MOTIF_MIN_CONTRAST}:1 ` +
        `floor — that is the invisible-motif bug coming back`,
    );
  }
});

/* The whole defence of motifTone is that it is not a recolour: a card
   still shows ITS band, only deeper. Scaling all three channels by one
   factor is what guarantees that, and this is what would catch someone
   "improving" it into a blend toward a fixed dark, which would drag every
   band toward one hue and undo the walk. */
test("a motif tone is the same hue as the band it came from", () => {
  for (const s of SPECTRUM) {
    const toned = motifTone(s.hex);
    if (toned === s.hex) continue;
    assert.ok(
      hueGap(hue(toned), hue(s.hex)) < 2,
      `${s.name} shifts hue when toned (${hue(s.hex).toFixed(1)}deg -> ` +
        `${hue(toned).toFixed(1)}deg) — the tone must move lightness only`,
    );
    assert.ok(lum(toned) < lum(s.hex), `${s.name}'s tone must be darker, not lighter`);
  }
});

/* Both constants are copies of a value that lives somewhere else — the
   card's ground is a CSS variable and the alpha is a Tailwind class — so
   each needs the same drift guard the spectrum gets. */
test("the motif's ground and alpha match what the card actually renders", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const mist = css.match(/--color-mist:\s*(#[0-9a-fA-F]{6})/)?.[1]?.toLowerCase();
  assert.equal(
    CARD_GROUND.toLowerCase(),
    mist,
    "CARD_GROUND has drifted from --color-mist, so the tone is tuned for a ground that no longer exists",
  );

  /* Read from CARD_TUNING, which is where the number actually lives now.
     It used to be a Tailwind class on the motif span, and the pattern for
     it had already slipped once onto a different element's opacity — a
     regex over JSX was never the right anchor for a value that has a
     name. */
  const services = readFileSync(new URL("../components/Services.tsx", import.meta.url), "utf8");
  const tuning = services.match(/export const CARD_TUNING: CardTuning = \{([\s\S]*?)\}/)?.[1];
  const opacity = tuning?.match(/opacity:\s*([0-9.]+)/)?.[1];
  assert.ok(opacity, "could not find CARD_TUNING.opacity in Services.tsx");
  assert.equal(
    Number(opacity),
    MOTIF_ALPHA,
    "the motif's resting opacity no longer matches MOTIF_ALPHA — the tone is being computed for the wrong blend",
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
  });
});
