"use client";

import { useCallback, useEffect, useRef } from "react";
import { GRID_H, GRID_W, LOGO_CELLS } from "@/lib/play/logoGrid";
import { LUT_SIZE, buildLut, type Palette } from "@/lib/play/palettes";

const TAU = Math.PI * 2;

export type PhaseParams = { speed: number; sweep: number; swell: number };

/**
 * Cycles the baked wordmark's palette on a 235 x 57 canvas.
 *
 * No fractal maths runs here. Each cell of the original artwork carries a
 * colour index; that index becomes a palette phase, and animating the phase
 * makes the colours flow. Because the ramp puts stop b exactly at
 * t = (b + 0.5)/N, phase 0 redraws the original SVG colour for colour.
 *
 * Kept in step with the shader in juliaShader.ts: the phase expression below is
 * the same one, so switching modes never jumps.
 */
export function useBakedGrid({
  palette,
  playing,
  params,
}: {
  palette: Palette;
  playing: boolean;
  params: React.RefObject<PhaseParams>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clock = useRef(0);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  /* Per-cell base phase: (colourIndex + 0.5) / paletteLength. */
  const cellT = useRef<Float32Array | null>(null);
  const n = palette.stops.length;
  useEffect(() => {
    const t = new Float32Array(GRID_W * GRID_H);
    for (let i = 0; i < t.length; i++) {
      t[i] = (Number(LOGO_CELLS[i]) + 0.5) / n;
    }
    cellT.current = t;
  }, [n]);

  const lut = useRef<Uint8Array>(buildLut(palette));
  useEffect(() => { lut.current = buildLut(palette); }, [palette]);

  const image = useRef<ImageData | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const t0s = cellT.current;
    if (!canvas || !t0s) return;
    if (canvas.width !== GRID_W || canvas.height !== GRID_H) {
      canvas.width = GRID_W;
      canvas.height = GRID_H;
      image.current = null;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!image.current) {
      image.current = ctx.createImageData(GRID_W, GRID_H);
      const d = image.current.data;
      for (let i = 3; i < d.length; i += 4) d[i] = 255;
    }

    const { speed, sweep, swell } = params.current ?? { speed: 0, sweep: 0, swell: 0 };
    const t = clock.current;
    const table = lut.current;
    const d = image.current.data;

    for (let y = 0, i = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++, i++) {
        const t0 = t0s[i];
        const u = (x + 0.5) / GRID_W;
        const phase =
          speed * t +
          sweep * (u - 0.5) +
          swell * 0.5 * Math.sin(TAU * (u * 1.8 - t * 0.22) + t0 * TAU);
        let f = (t0 + phase) % 1;
        if (f < 0) f += 1;
        const li = ((f * LUT_SIZE) | 0) * 3;
        const o = i * 4;
        d[o] = table[li];
        d[o + 1] = table[li + 1];
        d[o + 2] = table[li + 2];
      }
    }
    ctx.putImageData(image.current, 0, 0);
  }, [params]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (playingRef.current) {
        clock.current += dt;
        draw();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  /* Redraw on pause and on palette change so the canvas never shows stale colours. */
  useEffect(() => { draw(); }, [draw, playing, palette]);

  const resetClock = useCallback(() => { clock.current = 0; draw(); }, [draw]);

  return { canvasRef, draw, resetClock };
}
