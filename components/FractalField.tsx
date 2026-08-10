"use client";

import { useEffect, useRef } from "react";
import { LOGO_C, SPECTRUM_HEX } from "@/lib/palette";

/* ------------------------------------------------------------------ *
 *  FractalField — the site's backdrop system.
 *
 *  The logo is a Julia set quantised into eight colours and painted as
 *  a pixel mosaic. Rather than repeat that one texture everywhere, this
 *  renders a FAMILY of classical fractals — all sharing that palette and
 *  the same "recursion made visible" idea, but structurally distinct:
 *
 *    julia      escape-time pixel mosaic   (the logo's own construction)
 *    quadtree   recursive square subdivision
 *    sierpinski triangle gasket
 *    pythagoras branching square tree
 *    circles    recursive circle packing
 *    koch       snowflake line curve
 *    dragon     dragon-curve polyline
 *    hilbert    space-filling curve
 *
 *  Pixel/area variants (julia, quadtree, sierpinski) read as texture;
 *  line variants (koch, dragon, hilbert) read as drawing. Alternating
 *  the two down a page is what makes the design flow rather than tile.
 * ------------------------------------------------------------------ */

/* The eight quantised colours, in the wordmark's own band order. This
   component arrived from a project with an emerald palette, so its
   defaults used to be that set — which matched neither this site nor the
   logo. It now draws the brand spectrum defined in lib/palette.ts. */
export const BANDS = SPECTRUM_HEX;

export type Variant =
  | "julia"
  | "quadtree"
  | "sierpinski"
  | "pythagoras"
  | "circles"
  | "koch"
  | "dragon"
  | "hilbert"
  | "subdiv"
  | "fern"
  | "seedhead"
  | "bifurcation"
  | "htree";

/* Small deterministic PRNG so a given variant always draws the same
   shape — no hydration flicker, no re-randomising on resize. */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type PaintOpts = {
  bands: readonly string[];
  species: number;
  depth: number;
  cell: number;
  scale: number;
  seedIndex: number;
  t: number;
  /* Motion amplitude, 0..1. Every t-driven term is multiplied by it, so
     a field at amp 0 renders EXACTLY as it does standing still — which
     is what lets the hover animation damp itself out and stop rather
     than freezing mid-sway. */
  amp: number;
};

/* --------------------------- julia -------------------------------- */
/* Escape-time set, quantised to the bands and drawn as a mosaic with
   hairline gaps — exactly how the wordmark is built. */
const JULIA_SEEDS: [number, number][] = [
  [-0.7269, 0.1889],
  [...LOGO_C], // the wordmark's own constant — defined once, in lib/palette
  [0.285, 0.01],
  [-0.4, 0.6],
  [-0.70176, -0.3842],
];

function paintJulia(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  const [bx, by] = JULIA_SEEDS[o.seedIndex % JULIA_SEEDS.length];
  const jx = bx + Math.cos(o.t) * 0.045;
  const jy = by + Math.sin(o.t * 0.9) * 0.045;
  const cell = o.cell;
  const cols = Math.ceil(W / cell);
  const rows = Math.ceil(H / cell);
  const halfH = o.scale;
  const halfW = o.scale * (W / H || 1);
  const gap = cell > 4 ? 1 : 0;
  const iterations = o.depth;

  /* Batch every cell into one Path2D per colour band. Setting fillStyle
     and calling fillRect per cell costs tens of thousands of state
     changes a frame; this collapses the whole field to one fill() per
     band, which is what makes several of these affordable on a page. */
  const paths = o.bands.map(() => new Path2D());
  for (let gy = 0; gy < rows; gy++) {
    const zy0 = (((gy + 0.5) / rows) * 2 - 1) * halfH;
    for (let gx = 0; gx < cols; gx++) {
      const zx0 = (((gx + 0.5) / cols) * 2 - 1) * halfW;
      let zx = zx0;
      let zy = zy0;
      let i = 0;
      for (; i < iterations; i++) {
        const x2 = zx * zx;
        const y2 = zy * zy;
        if (x2 + y2 > 4) break;
        zy = 2 * zx * zy + jy;
        zx = x2 - y2 + jx;
      }
      if (i >= iterations) continue; // interior stays open
      paths[i % paths.length].rect(gx * cell, gy * cell, cell - gap, cell - gap);
    }
  }
  for (let b = 0; b < paths.length; b++) {
    ctx.fillStyle = o.bands[b];
    ctx.fill(paths[b]);
  }
}

/* -------------------------- quadtree ------------------------------ */
/* Recursive subdivision: each cell either splits into four or stops and
   fills. Reads as an ordered, architectural grid. */
function paintQuadtree(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  const rnd = mulberry32(1337 + o.seedIndex * 91);
  const gap = 2;

  const rec = (x: number, y: number, w: number, h: number, d: number) => {
    /* Never let a cell stop while it is still large — big flat blocks
       read as muddy colour fields rather than as structure. */
    const tooBig = w > 96 || h > 96;
    const stop =
      !tooBig && (d <= 0 || w < 16 || h < 16 || (d < o.depth && rnd() < 0.26));
    if (stop) {
      ctx.fillStyle = o.bands[Math.floor(rnd() * o.bands.length)];
      ctx.globalAlpha = 0.3 + (o.depth - d) * 0.06;
      ctx.fillRect(x + gap / 2, y + gap / 2, w - gap, h - gap);
      ctx.globalAlpha = 1;
      return;
    }
    if (d <= 0 || w < 16 || h < 16) return;
    const hw = w / 2;
    const hh = h / 2;
    rec(x, y, hw, hh, d - 1);
    rec(x + hw, y, hw, hh, d - 1);
    rec(x, y + hh, hw, hh, d - 1);
    rec(x + hw, y + hh, hw, hh, d - 1);
  };

  // Start from a grid of roughly square roots so the field stays even
  // across wide sections instead of stretching into slabs.
  const target = Math.max(140, Math.min(W, H) / 2);
  const cols = Math.max(1, Math.round(W / target));
  const rows = Math.max(1, Math.round(H / target));
  const rw = W / cols;
  const rh = H / rows;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) rec(c * rw, r * rh, rw, rh, o.depth);
}

/* ------------------------- sierpinski ----------------------------- */
/* The classic gasket — triangles all the way down, tinted by depth. */
function paintSierpinski(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  let n = 0;
  const tri = (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
    d: number,
  ) => {
    if (d <= 0) {
      const idx = n++;
      ctx.fillStyle = o.bands[idx % o.bands.length];
      const gx = (ax + bx + cx) / 3;
      const gy = (ay + by + cy) / 3;

      /* THE GASKET HAS TO MOVE, NOT JUST BLINK. Every other painter in
         this file animates its GEOMETRY — pythagoras sways, the dragon
         folds, hilbert draws itself in, the fern bends — and this one
         only pulsed its alpha, which on a pale card is indistinguishable
         from standing still.

         THE WAVE TRAVELS BY POSITION, NOT BY LEAF INDEX. Index order is
         depth-first through the recursion, so consecutive leaves land
         all over the frame and a phase keyed to `idx` scatters into
         noise — every triangle twinkling on its own, which reads as
         static rather than as movement. Keying off the centroid sends
         ONE ripple sweeping across the frieze. Slightly diagonal,
         because a purely horizontal sweep reads as a wipe. Normalised by
         W and H, so the wavelength is the same at any card size or DPR.

         The result is pieces lifting and settling across a board in
         sequence, which is the one thing a games card should look like —
         and the reason this venture was given the gasket in the first
         place. */
      /* The leaves hold still now — the motion moved to the holes, where
         it can say something about the construction instead of merely
         rippling across the frame. */
      ctx.globalAlpha = 0.82;
      const k = 1;

      ctx.beginPath();
      ctx.moveTo(gx + (ax - gx) * k, gy + (ay - gy) * k);
      ctx.lineTo(gx + (bx - gx) * k, gy + (by - gy) * k);
      ctx.lineTo(gx + (cx - gx) * k, gy + (cy - gy) * k);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      return;
    }
    const abx = (ax + bx) / 2;
    const aby = (ay + by) / 2;
    const bcx = (bx + cx) / 2;
    const bcy = (by + cy) / 2;
    const cax = (cx + ax) / 2;
    const cay = (cy + ay) / 2;

    /* DRAW THE HOLE, NOT JUST WHAT IS LEFT. A gasket is defined by the
       middle triangle being REMOVED at every level, and drawing only the
       surviving leaves throws that away — you get a texture of small
       triangles and none of the nesting that makes the figure worth
       looking at. Outlining each removed triangle, coloured by the level
       it was removed at, puts the construction back on the surface. */
    const lvl = o.depth - d;
    /* IT BUILDS ITSELF, LEVEL BY LEVEL.
       The old wave swept the frame by position, which said nothing about
       a gasket — any texture can ripple. This runs through the
       CONSTRUCTION instead: a pulse walks the levels from the first,
       largest removed triangle down to the smallest, so what you watch
       is the figure being subdivided, again and again. */
    const gens = o.depth + 2;
    const phase = (((o.t * 0.5) % gens) + gens) % gens;
    const pulse = o.amp * Math.max(0, 1 - Math.abs(phase - lvl)) ** 2;
    ctx.strokeStyle = o.bands[lvl % o.bands.length];
    ctx.globalAlpha = Math.min(1, (0.62 - lvl * 0.07) * (1 + pulse * 1.6));
    ctx.lineWidth = Math.max(0.6, 2.6 - lvl * 0.42) + pulse * 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(abx, aby);
    ctx.lineTo(bcx, bcy);
    ctx.lineTo(cax, cay);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;

    tri(ax, ay, abx, aby, cax, cay, d - 1);
    tri(abx, aby, bx, by, bcx, bcy, d - 1);
    tri(cax, cay, bcx, bcy, cx, cy, d - 1);
  };

  /* Size the gasket to the container HEIGHT and tile it across the width,
     so wide short sections get a clean frieze instead of one oversized
     triangle clipped at the edges. */
  const h = H * 0.98 * o.scale;
  const size = (h * 2) / Math.sqrt(3);
  const baseY = H;
  const count = Math.ceil(W / size) + 1;
  const offset = (W - count * size) / 2;
  for (let i = 0; i < count; i++) {
    const x = offset + i * size;
    tri(x, baseY, x + size, baseY, x + size / 2, baseY - h, o.depth);
  }
}

/* ------------------------- pythagoras ----------------------------- */
/* Branching square tree — growth made geometric. */
function paintPythagoras(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  /* A breath, not a wag. The sine is slowed to roughly an eight-second
     cycle (a resting human breath is four to six) and flattened by the
     0.75 power, so the tree DWELLS at the top and bottom of the stroke
     instead of sweeping through the extremes at full speed. The pause at
     the turn is most of what makes it read as breathing. */
  const sn = Math.sin(o.t * 0.5);
  const breath = Math.sign(sn) * Math.pow(Math.abs(sn), 0.75) * o.amp;

  /* What moves is the FOLD of the branching, and it has to be built
     differently to move symmetrically.

     In the classic construction the cap is a right triangle at angle a,
     which gives the two children lengths L·cos(a) and L·sin(a) — equal
     only at exactly 45 degrees. So animating a makes one branch longer
     than the other and the whole tree tilts, which is why it read as a
     sway. Instead the apex rides up and down the PERPENDICULAR BISECTOR
     of the square's top edge: both children keep the same length at
     every position, so the tree opens and closes about its own axis
     without leaning.

     `hRel` is the apex height as a fraction of that edge. At 0.5 it is
     the classic 45-degree tree exactly, which is why the card at rest is
     unchanged. */
  const hRel = 0.5 + breath * 0.075;
  const ratio = Math.hypot(0.5, hRel); // each child's length, relative to its parent

  /* Raising the apex lengthens every child, so the tree would grow and
     shrink bodily as it breathes. Scaling the trunk by (1 - ratio)
     holds the overall height roughly constant — the sum of a geometric
     series in `ratio` — so it folds in place. The trunk thins as the
     tree reaches up and thickens as it settles, which is the part that
     sells it. */
  const REST = Math.SQRT1_2; // the classic 0.7071 ratio, at hRel 0.5
  /* SIZED AGAINST BOTH EDGES, NOT THE SHORTER ONE.
     A Pythagoras tree stands about 3.4 base-lengths tall and spreads
     about 5.6 wide — it is half again wider than it is high. Sizing off
     min(W, H) means that on a landscape panel the height sets the size
     and the WIDTH is never consulted, so the same tree that sits neatly
     on a wide card grows straight through the sides of a narrow one.
     Each edge now gets its own budget and the tighter one wins, which
     keeps a margin at every card width. */
  const base =
    Math.min(H * 0.249, W * 0.152) * o.scale * ((1 - ratio) / (1 - REST));

  /* Each square is defined by its BASE segment A->B. The square is built
     on the left-normal of that segment, and the two children stand on the
     two faces of the triangle capping it. Working from the segment
     (rather than nested canvas transforms) keeps the geometry exact. */
  const tree = (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    d: number,
  ) => {
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy);
    if (d <= 0 || len < 1.5) return;

    // normal pointing "up" the tree (canvas y grows downward)
    const px = dy;
    const py = -dx;
    const cx = bx + px;
    const cy = by + py;
    const dxr = ax + px;
    const dyr = ay + py;

    const lvl = o.depth - d;
    ctx.fillStyle = o.bands[lvl % o.bands.length];
    /* THE TREE BREATHES THROUGH ITS COLOUR. The wave is keyed to the
       GENERATION, so brightness travels from trunk to canopy and back
       rather than the whole tree pulsing at once — a tree does not
       flash, it fills. Collapses to exactly the resting ramp at amp 0. */
    const breath = 1 + Math.sin(o.t * 0.85 - lvl * 0.55) * 0.38 * o.amp;
    ctx.globalAlpha = Math.min(1, (0.2 + lvl * 0.035) * breath);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.lineTo(dxr, dyr);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    /* Apex on the perpendicular bisector of the top edge D->C. (ey, -ex)
       is that edge rotated a quarter turn, and has the edge's length, so
       multiplying it by hRel puts the apex hRel of an edge-length clear
       of the square — on the outward side, since D->C runs parallel to
       A->B by construction. */
    const ex = cx - dxr;
    const ey = cy - dyr;
    const apexX = dxr + ex * 0.5 + ey * hRel;
    const apexY = dyr + ey * 0.5 - ex * hRel;

    tree(dxr, dyr, apexX, apexY, d - 1);
    tree(apexX, apexY, cx, cy, d - 1);
  };

  tree(W / 2 - base / 2, H * 0.98, W / 2 + base / 2, H * 0.98, o.depth);
}

/* --------------------------- circles ------------------------------ */
/* Recursive packing — soft, organic counterweight to the angular sets. */
function paintCircles(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  const rnd = mulberry32(97 + o.seedIndex * 31);
  ctx.lineWidth = 1.6;

  const rec = (cx: number, cy: number, r: number, d: number) => {
    if (d <= 0 || r < 3) return;
    ctx.strokeStyle = o.bands[(o.depth - d) % o.bands.length];
    ctx.globalAlpha = 0.32 + (o.depth - d) * 0.1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const kids = 3 + Math.floor(rnd() * 2);
    const off = rnd() * Math.PI * 2;
    for (let i = 0; i < kids; i++) {
      const a = off + (i / kids) * Math.PI * 2;
      const nr = r * 0.42;
      rec(cx + Math.cos(a) * (r - nr * 0.7), cy + Math.sin(a) * (r - nr * 0.7), nr, d - 1);
    }
  };

  const r0 = Math.min(W, H) * 0.34 * o.scale;
  rec(W * 0.5, H * 0.5, r0, o.depth);
  rec(W * 0.16, H * 0.28, r0 * 0.55, o.depth - 1);
  rec(W * 0.86, H * 0.72, r0 * 0.5, o.depth - 1);
}

/* ---------------------------- koch -------------------------------- */
/* Snowflake curve — crystalline line work. */
function kochPoints(depth: number, cx: number, cy: number, r: number) {
  let pts: [number, number][] = [];
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  pts.push(pts[0]);

  for (let d = 0; d < depth; d++) {
    const next: [number, number][] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      const dx = (x2 - x1) / 3;
      const dy = (y2 - y1) / 3;
      const ax = x1 + dx;
      const ay = y1 + dy;
      const bx = x1 + 2 * dx;
      const by = y1 + 2 * dy;
      // apex of the outward bump
      const px = ax + (bx - ax) * 0.5 - (by - ay) * (Math.sqrt(3) / 2);
      const py = ay + (by - ay) * 0.5 + (bx - ax) * (Math.sqrt(3) / 2);
      next.push([x1, y1], [ax, ay], [px, py], [bx, by]);
    }
    next.push(pts[pts.length - 1]);
    pts = next;
  }
  return pts;
}

function strokeBanded(
  ctx: CanvasRenderingContext2D,
  bands: readonly string[],
  pts: [number, number][],
  alpha: number,
  width: number,
) {
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const seg = Math.max(1, Math.floor(pts.length / bands.length));
  for (let b = 0; b < bands.length; b++) {
    const start = b * seg;
    const end = b === bands.length - 1 ? pts.length : (b + 1) * seg + 1;
    if (start >= pts.length - 1) break;
    ctx.strokeStyle = bands[b];
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(pts[start][0], pts[start][1]);
    for (let i = start + 1; i < end && i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function paintKoch(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  /* Two concentric flakes — a large one that reaches the edges and a
     smaller counter-rotated echo, so it reads as a crystal field rather
     than one lonely motif. */
  const r = Math.min(W, H) * 0.62 * o.scale;
  const cx = W / 2;
  const cy = H / 2 + r * 0.16;
  strokeBanded(ctx, o.bands, kochPoints(o.depth, cx, cy, r), 0.55, 1.7);
  strokeBanded(ctx, o.bands, kochPoints(Math.max(1, o.depth - 1), cx, cy, r * 0.5), 0.4, 1.4);
}

/* --------------------------- dragon ------------------------------- */
/* Dragon curve — a single folded ribbon, all flow and no symmetry. */
function paintDragon(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  // build turn sequence
  let turns: number[] = [];
  for (let i = 0; i < o.depth; i++) {
    const rev = turns.slice().reverse().map((t) => -t);
    turns = [...turns, 1, ...rev];
  }
  const step = (Math.min(W, H) / Math.pow(2, o.depth / 2)) * 1.6 * o.scale;

  /* Walk the turn sequence with every corner opened to `fold` of a right
     angle. At fold 1 this is the finished dragon; below it the ribbon is
     caught part-way through the paper-folding that generates it. */
  const walk = (fold: number) => {
    let dir = 0;
    let x = 0;
    let y = 0;
    const pts: [number, number][] = [[0, 0]];
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;
    for (let i = 0; i <= turns.length; i++) {
      x += Math.cos(dir) * step;
      y += Math.sin(dir) * step;
      pts.push([x, y]);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      dir += (turns[i] || 0) * (Math.PI / 2) * fold;
    }
    return { pts, minX, maxX, minY, maxY };
  };

  /* The motion is the fold itself — the one thing a dragon curve
     uniquely does, and what this card already claims in words: one route
     folding out to reach everywhere. It starts at 1 so the resting card
     is the finished curve, and only ever opens from there.

     0.05 takes the corners to about 84 degrees at full stretch. This is
     the number to turn if it wants to be calmer or bolder — a dragon
     curve is very sensitive to it, and past roughly 0.09 it stops
     reading as the same figure loosening and starts reading as a
     different one. */
  /* THE UNFOLDING IS OFF WHILE IT MOVES. A dragon curve is violently
     sensitive to its corner angle — that term was re-folding the whole
     ribbon at the same time as it grew and turned, and three motions at
     once is what read as thrashing. The curve now holds its finished
     shape and does exactly two things: it opens out, and it turns. */
  const fold = 1;
  const cur = walk(fold);

  /* Opening the corners spreads the ribbon over more ground. Normalising
     against the finished curve's extent is what makes it read as
     unfolding IN PLACE rather than as the whole thing swelling and
     shrinking. At fold 1 the ratio is exactly 1, so the resting frame is
     untouched and the card comes back to precisely where it started. */
  let k = 1;
  if (fold < 1) {
    const ref = walk(1);
    const refSpan = Math.max(ref.maxX - ref.minX, ref.maxY - ref.minY);
    const curSpan = Math.max(cur.maxX - cur.minX, cur.maxY - cur.minY);
    if (curSpan > 0) k = refSpan / curSpan;
  }

  // centre it
  const cx = (cur.minX + cur.maxX) / 2;
  const cy = (cur.minY + cur.maxY) / 2;

  /* IT OPENS WHEN YOU TOUCH IT. At rest the curve sits small and square
     in the middle of the panel, leaving the card its space; a pointer
     grows it and starts it turning about its own centre. Both terms are
     multiplied by amp, so the resting frame is byte-identical to the
     still one and the whole gesture damps back out on leave. */
  /* SMOOTHSTEP, NOT RAW AMP.
     `amp` eases in exponentially, which starts at full speed and only
     then slows — so the curve leapt on the first frame and settled
     after, which is exactly the spring that reads as jarring.
     Smoothstep has zero slope at BOTH ends: the zoom starts from
     nothing, gets going, and arrives without a bump. The travel is
     small too — a slight zoom is what this is meant to be, so 0.26 came
     down to 0.09, with a slow breath on top of it rather than a jump. */
  const e = o.amp * o.amp * (3 - 2 * o.amp);

  /* THE ANGLE IS DRIVEN BY THE EASE, NOT BY THE CLOCK.
     `amp * o.t` was the whole problem. `o.t` accumulates for as long as
     the field has ever run, so the moment amp lifted off zero the
     product jumped to whatever the elapsed time happened to imply —
     tens of radians — and the curve snapped to a new orientation in one
     frame. No amount of smoothing on amp fixes that, because the large
     number is the other factor.
     Tying the turn to `e` instead means the rotation IS the gesture: it
     travels from 0 to about 17 degrees as the ease comes in, holds
     there, and unwinds the same way on leave. The clock only supplies a
     small drift on top, bounded so it can never jump. */
  const grow = 1 + e * 0.1 + e * 0.03 * (1 - Math.cos(o.t * 0.35));
  const spin = e * 0.3 + e * 0.05 * Math.sin(o.t * 0.3);
  const cs = Math.cos(spin);
  const sn = Math.sin(spin);

  strokeBanded(
    ctx,
    o.bands,
    cur.pts.map(([px, py]) => {
      const X = (px - cx) * k * grow;
      const Y = (py - cy) * k * grow;
      return [W / 2 + X * cs - Y * sn, H / 2 + X * sn + Y * cs] as [number, number];
    }),
    0.55,
    1.8,
  );
}

/* --------------------------- hilbert ------------------------------ */
/* Space-filling curve — dense, woven, quietly mathematical. */
function paintHilbert(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  const order = Math.max(2, Math.min(6, o.depth));
  const n = Math.pow(2, order);
  const total = n * n;
  const size = Math.min(W, H) * 0.92 * o.scale;
  const cellW = size / n;
  const ox = (W - size) / 2 + cellW / 2;
  const oy = (H - size) / 2 + cellW / 2;

  const d2xy = (d: number) => {
    let rx = 0;
    let ry = 0;
    let t = d;
    let x = 0;
    let y = 0;
    for (let s = 1; s < n; s *= 2) {
      rx = 1 & (t / 2);
      ry = 1 & (t ^ rx);
      // rotate
      if (ry === 0) {
        if (rx === 1) {
          x = s - 1 - x;
          y = s - 1 - y;
        }
        const tmp = x;
        x = y;
        y = tmp;
      }
      x += s * rx;
      y += s * ry;
      t = Math.floor(t / 4);
    }
    return [x, y];
  };

  const pts: [number, number][] = [];
  for (let d = 0; d < total; d++) {
    const [gx, gy] = d2xy(d);
    pts.push([ox + gx * cellW, oy + gy * cellW]);
  }
  strokeBanded(ctx, o.bands, pts, 0.5, 1.5);

  /* The whole point of a space-filling curve is that ONE unbroken line
     reaches every cell. So the motion is a signal travelling it in path
     order — the trace works through the space methodically, corner by
     corner, which is the thing this card is claiming.

     It has to be drawn segment by segment rather than as a banded alpha
     sweep: these cards pass a single-colour palette, and anything keyed
     to the band index collapses into one flat flash. */
  if (o.amp > 0.002) {
    /* A snake, not a spark. One traverse of the whole curve takes about
       ten seconds, and the body GROWS as it goes — a short nub at the
       start, a long trail by the time it reaches the end, then it wraps
       and starts small again. Growth is what gives the loop a shape;
       a fixed-length pulse just circulates. */
    /* Raw position, then eased. 0.055 sent the head round the curve fast
       enough to read as a flicker rather than a traversal; at 0.019 one
       lap takes about half a minute. The ease is a gentle sine
       reshaping of the SAME 0..1 lap — it slows through the start and
       end of each pass and drifts through the middle, so the wrap is a
       glide rather than a jump back to the beginning. */
    const raw = ((((o.t * 0.019) % 1) + 1) % 1);
    const p = raw - Math.sin(raw * Math.PI * 2) * 0.06;
    const head = Math.floor(p * total);
    const len = Math.round(14 + total * 0.34 * p);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let k = 0; k < len; k++) {
      const i = head - k; // walk BACK from the head, so the body trails it
      if (i < 0 || i + 1 >= total) continue; // no wrapping across the ends
      /* Brightest and thickest at the leading edge, trailing off behind.
         A symmetric pulse is bright in the middle and looks the same
         coming as going, so you cannot tell which way it is heading. */
      const f = 1 - k / len; // 1 at the head, 0 at the tail
      ctx.strokeStyle = o.bands[Math.floor((i / total) * o.bands.length) % o.bands.length];
      ctx.globalAlpha = o.amp * 0.95 * f * f;
      ctx.lineWidth = 1.4 + f * 1.8;
      ctx.beginPath();
      ctx.moveTo(pts[i][0], pts[i][1]);
      ctx.lineTo(pts[i + 1][0], pts[i + 1][1]);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

/* --------------------------- subdiv ------------------------------- */
/* Recursive subdivision that keeps its nesting VISIBLE — each level is
   drawn as an outline inset inside its parent, so the eye falls inward.
   Distinct from `quadtree`, which fills flat leaf cells. */
function paintSubdiv(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  const rnd = mulberry32(613 + o.seedIndex * 17);
  ctx.lineWidth = 1.2;

  const rec = (x: number, y: number, w: number, h: number, d: number) => {
    if (d <= 0 || w < 8 || h < 8) return;
    const band = o.bands[(o.depth - d) % o.bands.length];
    ctx.strokeStyle = band;
    ctx.globalAlpha = 0.25 + (o.depth - d) * 0.09;
    ctx.strokeRect(x, y, w, h);
    ctx.globalAlpha = 1;

    // inset toward a drifting focal point so it reads as falling inward
    const f = 0.32 + rnd() * 0.12;
    const nx = x + w * f * (0.5 + Math.sin(o.t + d) * 0.06 * o.amp);
    const ny = y + h * f * (0.5 + Math.cos(o.t + d) * 0.06 * o.amp);
    rec(nx, ny, w * (1 - f), h * (1 - f), d - 1);

    // occasional sibling so it isn't a single tunnel
    if (d > 2 && rnd() < 0.5) {
      rec(x + w * 0.06, y + h * 0.06, w * 0.3, h * 0.3, d - 2);
    }
  };

  const cols = Math.max(1, Math.round(W / Math.max(220, H * 0.7)));
  const cw = W / cols;
  for (let i = 0; i < cols; i++) rec(i * cw, 0, cw, H, o.depth);
}

/* ---------------------------- fern -------------------------------- */
/* Barnsley-family ferns — the chaos-game IFS. Points are plotted by
   repeatedly applying one of four affine maps chosen by weighted chance.
   Each map is [a, b, c, d, e, f] with its probability.
 *
 *  Changing the coefficients changes the SPECIES, not just the density —
 *  which is the point: six cards get six genuinely different plants
 *  rather than one plant drawn six times. The first four are the
 *  published sets; the last two are mirrored/steepened variants so the
 *  set reads as a family without repeating a silhouette.
 */
type Affine = [number, number, number, number, number, number];
type Species = { maps: Affine[]; probs: number[]; span: number };

const FERN_SPECIES: Species[] = [
  /* 0 — Barnsley (classic) */
  {
    maps: [
      [0, 0, 0, 0.16, 0, 0],
      [0.85, 0.04, -0.04, 0.85, 0, 1.6],
      [0.2, -0.26, 0.23, 0.22, 0, 1.6],
      [-0.15, 0.28, 0.26, 0.24, 0, 0.44],
    ],
    probs: [0.01, 0.86, 0.93, 1],
    span: 10,
  },
  /* 1 — Cyclosorus: narrow, upright, long taper */
  {
    maps: [
      [0, 0, 0, 0.25, 0, -0.4],
      [0.95, 0.005, -0.005, 0.93, -0.002, 0.5],
      [0.035, -0.2, 0.16, 0.04, -0.09, 0.02],
      [-0.04, 0.2, 0.16, 0.04, 0.083, 0.12],
    ],
    probs: [0.02, 0.86, 0.93, 1],
    span: 10.5,
  },
  /* 2 — Culcita: broad, open, rounded crown */
  {
    maps: [
      [0, 0, 0, 0.25, 0, -0.14],
      [0.85, 0.02, -0.02, 0.83, 0, 1],
      [0.09, -0.28, 0.3, 0.11, 0, 0.6],
      [-0.09, 0.28, 0.3, 0.09, 0, 0.7],
    ],
    probs: [0.02, 0.86, 0.93, 1],
    span: 7.5,
  },
  /* 3 — Fishbone: sparse, strongly horizontal pinnae */
  {
    maps: [
      [0, 0, 0, 0.25, 0, -0.4],
      [0.95, 0.002, -0.002, 0.93, -0.002, 0.5],
      [0.035, -0.11, 0.27, 0.01, -0.05, 0.005],
      [-0.04, 0.11, 0.27, 0.01, 0.047, 0.06],
    ],
    probs: [0.02, 0.86, 0.93, 1],
    span: 10.5,
  },
  /* 4 — mirrored Barnsley: leans the other way */
  {
    maps: [
      [0, 0, 0, 0.16, 0, 0],
      [0.85, -0.04, 0.04, 0.85, 0, 1.6],
      [-0.2, 0.26, -0.23, 0.22, 0, 1.6],
      [0.15, -0.28, -0.26, 0.24, 0, 0.44],
    ],
    probs: [0.01, 0.86, 0.93, 1],
    span: 10,
  },
  /* 5 — steepened: tighter angle, more vertical plume */
  {
    maps: [
      [0, 0, 0, 0.2, 0, 0],
      [0.8, 0.06, -0.06, 0.87, 0, 1.5],
      [0.24, -0.22, 0.19, 0.26, 0, 1.2],
      [-0.18, 0.24, 0.22, 0.2, 0, 0.5],
    ],
    probs: [0.01, 0.85, 0.93, 1],
    span: 9,
  },
];
function paintFern(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  const rnd = mulberry32(2029 + o.seedIndex * 7);
  const points = Math.min(60000, o.depth * 1200);
  /* WHICH LEAFLET, NOT WHICH HEIGHT. Banding by y sliced the plant into
     horizontal strips, so a single frond was cut through the middle by a
     colour change — the one thing a leaf never does.
     In the chaos game the 85% map walks UP the stem and maps 2 and 3
     throw a leaflet off it, so the number of stem steps taken since the
     last throw identifies which leaflet you are standing in. Holding
     that index colours each mini leaf whole. */
  let sinceLeaf = 0;
  let leafBand = 0;
  /* Two incommensurate frequencies rather than one. A single sine is a
     metronome — it repeats exactly, and the eye reads the repeat as a
     mechanism. Summing 0.9 and 1.63 gives a beat that effectively never
     comes back round, so the plant looks like it is moving in air. */
  const sway =
    (Math.sin(o.t * 0.9) * 0.034 + Math.sin(o.t * 1.63 + 1.1) * 0.017) * o.amp;
  /* The leaflets get their own, gentler and out of phase with the stem,
     so the frond is not one rigid shape pivoting about its base. */
  const leaflet = Math.sin(o.t * 1.21 + 2.2) * 0.02 * o.amp;
  const sp = FERN_SPECIES[o.species % FERN_SPECIES.length];

  /* Same batching as julia — one Path2D per band, filled once. */
  const fernPaths = o.bands.map(() => new Path2D());
  let x = 0;
  let y = 0;
  const s = (H * 0.94 * o.scale) / sp.span;
  const ox = W / 2;
  const oy = H;

  for (let i = 0; i < points; i++) {
    const r = rnd();
    let k = 0;
    while (k < sp.probs.length - 1 && r >= sp.probs[k]) k++;
    /* THE INDEX IS THE LIVE COUNT, NOT A SNAPSHOT OF IT.
       Applying the 85% map carries the point one leaflet FURTHER UP the
       stem, so the leaflet you are standing in is the number of
       consecutive stem steps since the last throw — read now, not
       captured when the throw happened. Freezing it at the throw meant
       the band stopped advancing while the point kept climbing, so one
       frond ended up wearing every shade at once. */
    if (k === 1) sinceLeaf++;
    else if (k >= 2) sinceLeaf = 0;
    leafBand = sinceLeaf % fernPaths.length;
    const [a, b, c, d, e, f] = sp.maps[k];
    /* Only the `b` shear is touched, and the stem far more than the
       leaflets, so the plant bends rather than deforming — it still
       reads as itself while it moves. */
    const bb = k === 1 ? b + sway : k >= 2 ? b + leaflet : b;
    const nx = a * x + bb * y + e;
    const ny = c * x + d * y + f;
    x = nx;
    y = ny;
    if (i < 24) continue; // let the attractor settle

    const px = ox + x * s;
    const py = oy - y * s;
    fernPaths[leafBand].rect(px, py, 1.4, 1.4);
  }
  ctx.globalAlpha = 0.72;
  for (let b = 0; b < fernPaths.length; b++) {
    ctx.fillStyle = o.bands[b];
    ctx.fill(fernPaths[b]);
  }
  ctx.globalAlpha = 1;
}

/* ---------------------------- htree ------------------------------- */
/* The H-tree: draw an H, then a perpendicular H at each of its four
   tips, at 1/√2 scale so the area halves each generation.
 *
 * This is the layout real clock and antenna networks are built on,
 * because every endpoint ends up the same distance from the source —
 * which is the distribution promise stated as geometry rather than as a
 * claim. The motion is a pulse leaving the root and arriving at every
 * tip together, for the same reason.
 */
function paintHtree(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  const maxGen = Math.max(1, Math.min(9, o.depth));
  const segs: [number, number, number, number, number][] = [];

  const build = (x: number, y: number, len: number, d: number, vert: boolean) => {
    if (d <= 0 || len < 1.5) return;
    const half = len / 2;
    const gen = maxGen - d;
    if (vert) {
      segs.push([x, y - half, x, y + half, gen]);
      build(x, y - half, len / Math.SQRT2, d - 1, false);
      build(x, y + half, len / Math.SQRT2, d - 1, false);
    } else {
      segs.push([x - half, y, x + half, y, gen]);
      build(x - half, y, len / Math.SQRT2, d - 1, true);
      build(x + half, y, len / Math.SQRT2, d - 1, true);
    }
  };
  build(W / 2, H / 2, Math.min(W, H) * 0.62 * o.scale, maxGen, false);

  /* Butt caps, not round: a trace on a board has square ends, and the
     rounded version read as calligraphy. */
  ctx.lineCap = "butt";
  for (const [x1, y1, x2, y2, gen] of segs) {
    /* The generation index IS the distance from the source, so one term
       sends the pulse outward correctly. Cubed, so it reads as a signal
       passing rather than the whole tree brightening. */
    const pulse = o.amp * Math.max(0, Math.sin(o.t * 1.5 - gen * 0.9)) ** 3;
    ctx.strokeStyle = o.bands[gen % o.bands.length];
    ctx.globalAlpha = 0.3 + (gen / maxGen) * 0.34 + pulse * 0.55;
    ctx.lineWidth = Math.max(0.7, (maxGen - gen) * 0.42 + 0.7 + pulse * 1.6);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    /* A pad at each junction. This is the whole difference between "a
       branching diagram" and "a board": real traces terminate in
       something, and the eye reads the squares as contacts. Only while
       they are big enough to be square rather than a speck. */
    const pad = Math.max(0, 3.4 - gen * 0.42);
    if (pad > 0.9) {
      ctx.fillStyle = o.bands[gen % o.bands.length];
      ctx.globalAlpha = 0.5 + (gen / maxGen) * 0.3 + pulse * 0.5;
      ctx.fillRect(x1 - pad / 2, y1 - pad / 2, pad, pad);
      ctx.fillRect(x2 - pad / 2, y2 - pad / 2, pad, pad);
    }
  }
  ctx.globalAlpha = 1;
}

/* --------------------------- seedhead ----------------------------- */
/* Vogel's spiral. Each seed is placed one GOLDEN ANGLE (137.507°) round
   from the last, and that single number is the whole reason the arms
   appear — no spiral is drawn, only points, and the eye assembles the
   rest.
 *
 * Honest note: this is a growth pattern, not a self-similar set. It sits
 * beside the fractals because it is the same argument — a simple rule
 * repeated produces structure nobody designed — and because it is the
 * one figure here that a four-year-old has already held in their hand.
 */
function paintSeedhead(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  const N = Math.max(120, Math.min(2400, o.depth * 40));
  const GOLD = Math.PI * (3 - Math.sqrt(5));
  /* Nudge the angle by a fraction of a degree and the arms reorganise
     completely — the most persuasive thing this figure can do, and it
     collapses to exactly the golden angle at rest. */
  /* A SEED HEAD BREATHES; IT DOES NOT RESHUFFLE. Sweeping the divergence
     angle is the most dramatic thing this figure can do — every arm
     reorganises — and at any visible amplitude it reads as agitation,
     which is the opposite of what this card is for. The angle now moves
     by about a quarter of what it did, and the motion you actually see
     is the head swelling and settling on a slow, even cycle: roughly
     twenty seconds in and twenty back out. */
  /* TEMPO, MEASURED. The clock advances t by 0.0016 * speed per ms, so
     at the shared speed of 0.45 it gains about 0.72 a second. A cycle of
     sin(t * k) therefore lasts 2π / (0.72k) seconds — at k = 0.11 that
     is seventy-nine seconds, which is not a slow breath, it is a still
     image. k ≈ 0.95 gives a nine-second cycle: in, and out, at about the
     rate you would breathe deliberately. */
  const ang = GOLD + o.amp * Math.sin(o.t * 0.78) * 0.0006;
  const breath = 1 + o.amp * Math.sin(o.t * 0.95) * 0.045;
  const R = Math.min(W, H) * 0.46 * o.scale * breath;
  const k = R / Math.sqrt(N);
  const ox = W / 2;
  const oy = H / 2;

  /* One Path2D per band, filled once — same batching as julia and fern. */
  const paths = o.bands.map(() => new Path2D());
  for (let n = 1; n <= N; n++) {
    const r = k * Math.sqrt(n);
    const a = n * ang;
    const px = ox + Math.cos(a) * r;
    const py = oy + Math.sin(a) * r;
    /* Seeds grow toward the rim, exactly as a real head packs. */
    const dot = Math.max(1.3, k * 0.66 * (0.5 + 0.5 * (n / N)));
    const p = paths[Math.floor((r / R) * o.bands.length) % o.bands.length];
    p.moveTo(px + dot, py);
    p.arc(px, py, dot, 0, Math.PI * 2);
  }
  ctx.globalAlpha = 0.7;
  for (let b = 0; b < paths.length; b++) {
    ctx.fillStyle = o.bands[b];
    ctx.fill(paths[b]);
  }
  ctx.globalAlpha = 1;
}

/* ------------------------- bifurcation ---------------------------- */
/* The logistic map's period-doubling cascade: one stable state forking
   into two, then four, then everything. The self-similarity is exact —
   every fork contains the whole diagram again.
 *
 * DRAWN DOWNWARD, not left to right. The textbook orientation puts the
 * control parameter on the x-axis, but on a wide card that reads as a
 * chart. Turned a quarter, the single line enters at the top and splits
 * as it falls, which is how anyone would actually draw "one thing
 * becoming many" — and it fills a landscape panel instead of stretching
 * across it.
 */
function paintBifurcation(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: PaintOpts,
) {
  /* BLOCKS, NOT DOTS. At a 2px cell this drew as a fine spray, which is
     a chart. Snapped to a coarse grid with a gap between cells it reads
     as stacked pieces falling and settling — which is what the card is
     for. `cell` is the block size; nothing else about the maths moves. */
  const cell = Math.max(3, Math.round(Math.min(W, H) / 42));
  const gap = 1;
  /* Lifted four cells, with four more rows generated to refill the
     bottom — the densest rows of the cascade were sitting inside the
     panel's vignette and fading out just where there is most to see. */
  const lift = cell * 4;
  const rows = Math.ceil((H + lift) / cell);
  const cols = Math.max(1, Math.floor(W / cell));
  const rMin = 2.42;
  const rMax = 3.99;
  const plots = 90;
  /* At rest the attractor is fully settled. As motion rises the warm-up
     is cut, so transients scatter in and resolve — the system finding
     its rhythm, which is the thing this card is claiming. */
  /* Both terms slowed and shortened. Cutting 305 steps of warm-up threw
     the whole diagram into transient every cycle, which is a seizure,
     not a breath; 110 lets the lower rows soften and re-settle while the
     structure stays where it is. */
  const warm = Math.round(320 - o.amp * (1 - Math.cos(o.t * 0.55)) * 0.5 * 110);
  const span = W * 0.94 * o.scale;
  const ox = W / 2 - span / 2;
  /* The attractor never uses the whole 0..1 interval — it lives roughly
     between 0.22 and 0.95 — so mapping x straight onto the panel leaves
     a third of it empty and shoves the stem off to one side. Normalising
     against the range actually occupied is what centres the stem and
     lets the cascade fill the width it is given. */
  const X0 = 0.22;
  const X1 = 0.95;
  const norm = (x: number) => (x - X0) / (X1 - X0);

  const paths = o.bands.map(() => new Path2D());
  /* THE COLOUR FALLS, THE BLOCKS DO NOT.
     Nothing here actually moves down the panel — the cascade is fixed by
     the maths. What travels is the colour banding: the stripe a row is
     assigned slides one step per tick, so a given hue appears further
     down each frame and the eye reads the whole field as descending.
     Cheap, and steadier than moving geometry. Zero at rest, so the still
     frame keeps the plain banding. */
  const L = o.bands.length;
  /* One band roughly every two seconds — a drift, not a scroll. */
  const fall = Math.floor(o.amp * o.t * 0.6);
  const bandFor = (row: number) => (((row >> 2) - fall) % L + L) % L;

  /* One flag per grid cell, so a column hit forty times is still one
     block — otherwise the dense lower rows overdraw into a solid slab. */
  const seen = new Uint8Array(cols * rows);
  const inset = (W - cols * cell) / 2;
  for (let row = 0; row < rows; row++) {
    /* r grows DOWN the panel, so the cascade opens toward the copy. */
    const r = rMin + ((rMax - rMin) * row) / rows;
    let x = 0.5;
    for (let i = 0; i < warm; i++) x = r * x * (1 - x);
    for (let i = 0; i < plots; i++) {
      x = r * x * (1 - x);
      const col = Math.floor(norm(x) * span / cell + (ox - inset) / cell);
      if (col < 0 || col >= cols) continue;
      const idx = row * cols + col;
      if (seen[idx]) continue;
      seen[idx] = 1;
      /* Banded by depth down the cascade, so each doubling arrives in a
         new colour rather than the whole figure being one hue. */
      paths[bandFor(row)].rect(
        inset + col * cell,
        row * cell - lift,
        cell - gap,
        cell - gap,
      );
    }
  }
  ctx.globalAlpha = 0.8;
  for (let b = 0; b < paths.length; b++) {
    ctx.fillStyle = o.bands[b];
    ctx.fill(paths[b]);
  }
  ctx.globalAlpha = 1;
}

const PAINTERS: Record<
  Variant,
  (ctx: CanvasRenderingContext2D, W: number, H: number, o: PaintOpts) => void
> = {
  subdiv: paintSubdiv,
  fern: paintFern,
  seedhead: paintSeedhead,
  bifurcation: paintBifurcation,
  htree: paintHtree,
  julia: paintJulia,
  quadtree: paintQuadtree,
  sierpinski: paintSierpinski,
  pythagoras: paintPythagoras,
  circles: paintCircles,
  koch: paintKoch,
  dragon: paintDragon,
  hilbert: paintHilbert,
};

/* Every variant, at runtime — the `Variant` union is compile-time only,
   and the card tuner needs a list it can put in a <select>. */
export const VARIANTS = Object.keys(PAINTERS) as Variant[];

/* Sensible per-variant defaults so call sites stay short. */
const DEFAULTS: Record<Variant, { depth: number; scale: number; cell: number }> = {
  julia: { depth: 48, scale: 1.35, cell: 7 },
  quadtree: { depth: 5, scale: 1, cell: 0 },
  sierpinski: { depth: 6, scale: 1, cell: 0 },
  pythagoras: { depth: 9, scale: 1, cell: 0 },
  circles: { depth: 4, scale: 1, cell: 0 },
  koch: { depth: 4, scale: 1, cell: 0 },
  dragon: { depth: 12, scale: 1, cell: 0 },
  hilbert: { depth: 5, scale: 1, cell: 0 },
  subdiv: { depth: 7, scale: 1, cell: 0 },
  fern: { depth: 40, scale: 1, cell: 0 },
  seedhead: { depth: 40, scale: 1, cell: 0 },
  /* `depth` is a point population here, not a generation count. */
  bifurcation: { depth: 1, scale: 1, cell: 0 },
  htree: { depth: 7, scale: 1, cell: 0 },
};

type Props = {
  variant?: Variant;
  /** Override the eight colour bands — each theme passes its own. */
  palette?: readonly string[];
  /**
   * Multiplier on this field's clock. Some variants read much faster than
   * others at the same rate — the Hilbert traversal in particular covers
   * its whole curve in one sweep, so it needs slowing well below the
   * ambient drift of the area variants.
   */
  speed?: number;
  /** Which fern species to draw (see FERN_SPECIES). Ignored by other variants. */
  species?: number;
  depth?: number;
  scale?: number;
  cell?: number;
  seedIndex?: number;
  opacity?: number;
  drift?: boolean;
  /* CSS selector for an ancestor to animate with, e.g. ".group". While
     the pointer is over it the field's clock runs; on leave the motion
     damps to nothing and the loop stops. Watching the ancestor from
     inside means no React state and no re-render per frame — the parent
     can stay a server component. */
  activateOn?: string;
  className?: string;
};

export default function FractalField({
  variant = "julia",
  palette,
  speed = 1,
  species = 0,
  depth,
  scale,
  cell,
  seedIndex = 0,
  opacity = 1,
  drift = false,
  activateOn,
  className = "",
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const base = DEFAULTS[variant];
    let raf = 0;
    let t = 0;
    /* Still by default; only a hover (or `drift`) gives it amplitude. */
    let amp = drift || !activateOn ? 1 : 0;
    let ampTarget = amp;
    let last = 0;
    let W = 0;
    let H = 0;
    /* One extra generation while the host is hovered. A fractal is the
       thing that keeps going when you look closer, so the motif answering
       a hover by resolving one level further is the idea itself rather
       than a decoration of it. Line variants get the bump; the pixel/area
       ones (julia, quadtree) are already at texture density, where another
       level costs a lot of work and shows almost nothing. */
    const canDeepen = !["julia", "quadtree", "seedhead", "bifurcation"].includes(variant);
    let deeper = 0;
    let hovered = false;

    const paint = () => {
      const rest = palette && palette.length ? palette : BANDS;
      /* Hover deepens by drawing one more generation, not by changing
         colour. There was a `paletteHover` prop for a second palette; its
         only caller passed the band's `-ink` sibling, and when those were
         removed the prop had no correct value left to take. */
      const hot = rest;
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      PAINTERS[variant](ctx, W, H, {
        bands: hovered ? hot : rest,
        species,
        depth: (depth ?? base.depth) + deeper,
        scale: scale ?? base.scale,
        cell: cell ?? base.cell,
        seedIndex,
        t,
        amp,
      });
      ctx.restore();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    };

    /* The ambient loop, for a field that animates without being touched.
       Delta-timed and speed-aware exactly like the hover loop below, so a
       drifting field and a hovered one move at a comparable rate and
       `speed` means the same thing in both. What this replaces advanced a
       flat `t += 0.0015` PER FRAME, which ran at double rate on a 120Hz
       display and ignored `speed` altogether. Nothing was passing `drift`
       when this changed, so the fix could not disturb anything. */
    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      t += dt * 0.0016 * speed;
      paint();
      raf = requestAnimationFrame(loop);
    };

    /* Hover loop. Distinct from `drift`: it eases amplitude in and out
       and, once the motion has damped, stops requesting frames entirely
       — six of these sit on one screen and none should cost anything
       while the pointer is elsewhere. */
    const frame = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      /* 180ms put the entire onset inside a fifth of a second, which is
         why every hover read as a snap however gently the painter itself
         was written — the gesture was over before the eye had followed
         it. 420 spreads it across about half a second, in and out, which
         is the difference between a card reacting and a card being
         startled. */
      amp += (ampTarget - amp) * (1 - Math.exp(-dt / 420));
      /* An exponential never actually reaches zero, so it needs a cutoff.
         0.02 of an already-subtle motion is sub-pixel — but leaving it
         lower just spends another ~300ms nudging antialiasing around. */
      if (ampTarget === 0 && amp < 0.02) {
        amp = 0;
        raf = 0;
        paint(); // settles on the exact static frame
        return;
      }
      /* The clock slows as the motion fades, so it eases to rest rather
         than being cut off at speed. */
      t += dt * 0.0016 * speed * Math.max(amp, 0.15);
      paint();
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const onEnter = () => {
      ampTarget = 1;
      hovered = true;
      if (canDeepen && !reduced) deeper = 1;
      paint(); // repaint immediately, even if no clock is running
      kick();
    };
    const onLeave = () => {
      ampTarget = 0;
      hovered = false;
      deeper = 0;
      paint();
      kick();
    };

    const host = activateOn && !reduced ? canvas.closest(activateOn) : null;
    host?.addEventListener("pointerenter", onEnter);
    host?.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (drift && !reduced) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }

    return () => {
      ro.disconnect();
      host?.removeEventListener("pointerenter", onEnter);
      host?.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [variant, palette, speed, species, depth, scale, cell, seedIndex, drift, activateOn]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ opacity, display: "block", width: "100%", height: "100%" }}
    />
  );
}

/* FractalBackdrop LIVED HERE. It wrapped the field as a section-wide
   backdrop — absolutely positioned, radially masked, dimmed so foreground
   text won — and About, Services and Partners each ran one at 10-15%.
   All three were removed: at that opacity it read as a smudge behind the
   copy rather than as geometry, and in Services it competed with the six
   per-card motifs that are the same idea rendered properly.

   Deleted rather than left in place. An exported component with no
   callers is an invitation to reach for it again without knowing why it
   went. If a section wants a fractal ground, the honest version is a
   FractalField with its own mask at the call site, where the opacity is
   visible to whoever is tuning it. */
