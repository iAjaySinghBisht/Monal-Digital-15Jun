"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Advanced, ControlPanel, PaletteChoice, Readout, Switch } from "./Controls";
import ToyShell from "./ToyShell";
import { useJulia } from "./useJulia";
import { useInitialParams, useSyncParams } from "./usePlayLink";
import { INK_RGB, LOGO_C, PALETTES, PINK_RGB, paletteById } from "@/lib/play/palettes";

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

/* Timing, in seconds, ported from the studio's 8-second intro sting.
   The numbers are deliberate: the spiral lands on the logo's own constant at
   4.6s, the letters have finished forming by 6.2s, and the last 1.8s is hold. */
const T_FADE_IN = 1.1;
const T_SETTLE = 4.6;
const T_LETTERS = 1.6;
const T_TOTAL = 9;

export default function RevealSting({
  intro,
  aspect,
  embedded = false,
}: {
  intro: string;
  aspect: string;
  embedded?: boolean;
}) {
  const params = useInitialParams();
  const [paletteId, setPaletteId] = useState("logo");
  const [loop, setLoop] = useState(true);

  useEffect(() => {
    if (params?.get("pal")) setPaletteId(params.get("pal")!);
    if (params?.get("loop")) setLoop(params.get("loop") === "1");
  }, [params]);

  useSyncParams(
    { pal: paletteId === "logo" ? null : paletteId, loop: loop ? null : 0 },
    !embedded,
  );

  const palette = paletteById(paletteId);
  const loopRef = useRef(loop);
  loopRef.current = loop;

  /* Two layers: the full-frame spiral, and the settled wordmark cut to the
     letterforms. The sting is a crossfade between them, driven per frame from
     the animation clock rather than from React state. */
  const spiralLayer = useRef<HTMLDivElement | null>(null);
  const lettersLayer = useRef<HTMLDivElement | null>(null);

  const phase = (t: number) => (loopRef.current ? t % T_TOTAL : Math.min(t, T_TOTAL));

  const spiral = useJulia({
    palette,
    step: (raw, u) => {
      const t = phase(raw);
      const angle0 = Math.atan2(LOGO_C[1], LOGO_C[0]);
      const radius0 = Math.hypot(LOGO_C[0], LOGO_C[1]);
      const e = 1 - Math.pow(1 - clamp01(t / T_SETTLE), 3);
      const angle = angle0 + (1 - e) * 5.2;
      const radius = 0.93 + (radius0 - 0.93) * e;
      const drift = t >= T_SETTLE ? 0.0016 : 0;
      const settleT = t - T_SETTLE;

      u.c = [
        radius * Math.cos(angle) + drift * Math.cos(settleT * 0.7),
        radius * Math.sin(angle) + drift * Math.sin(settleT * 0.53),
      ];

      const letters = smoothstep((t - T_SETTLE) / T_LETTERS);
      const zoomIn = smoothstep(t / 5.2);
      let span = (3.5 + (2.15 - 3.5) * zoomIn) / 2;
      span += (3.3 / 2 - span) * letters;
      u.span = span;
      u.center = [0, -0.58 * letters];
      u.speed = 0.02;
      u.sweep = 0;
      u.swell = 0;
      u.interior = 0;
      u.interiorBase = [...INK_RGB];
      u.shadeMin = 0.1;
      u.shadeLo = 1.5;
      u.shadeHi = 9;
      u.iterations = 180;
      u.fade = clamp01(t / T_FADE_IN);

      if (spiralLayer.current) spiralLayer.current.style.opacity = String(1 - letters);
      if (lettersLayer.current) lettersLayer.current.style.opacity = String(letters);
    },
  });

  const letters = useJulia({
    palette,
    step: (raw, u) => {
      const t = phase(raw);
      u.c = [LOGO_C[0], LOGO_C[1]];
      u.span = 1.26;
      u.speed = 0.03;
      u.sweep = 0.2;
      u.swell = 0.2;
      u.interior = 0.6;
      u.interiorBase = [...PINK_RGB];
      u.pixel = 1;
      u.shadeMin = 0.55;
      u.shadeLo = 0;
      u.shadeHi = 6;
      u.iterations = 200;
      u.fade = smoothstep((t - T_SETTLE) / T_LETTERS) > 0 ? 1 : 0;
    },
  });

  const replay = useCallback(() => {
    spiral.resetClock();
    letters.resetClock();
    spiral.renderNow();
    letters.renderNow();
  }, [spiral, letters]);

  const screen = (
    <>
      <div ref={spiralLayer} className="absolute inset-0" style={{ opacity: 1 }}>
        <canvas
          ref={spiral.canvasRef}
          className="h-full w-full"
          aria-label="A fractal spiralling inward until it settles on the Monal logo"
        />
      </div>
      <div
        ref={lettersLayer}
        className="absolute inset-0 grid place-items-center"
        style={{ opacity: 0 }}
      >
        <div className="w-[78%] mask-monal-letters" style={{ aspectRatio: "705 / 170" }}>
          <canvas ref={letters.canvasRef} className="h-full w-full" aria-hidden="true" />
        </div>
      </div>
      {spiral.supported === false && (
        <p className="absolute inset-0 grid place-items-center p-8 text-center text-[14px] text-white/70">
          This browser can&apos;t run the fractal renderer.
        </p>
      )}
    </>
  );

  if (embedded) return <div className="absolute inset-0">{screen}</div>;

  return (
    <ToyShell
      title="The reveal"
      intro={intro}
      slug="reveal"
      aspect={aspect}
      screen={screen}
      actions={
        <button
          type="button"
          onClick={replay}
          className="min-h-11 rounded-full bg-teal px-5 text-[14px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          Play it again
        </button>
      }
    >
      <ControlPanel>
        <PaletteChoice palettes={PALETTES} value={paletteId} onChange={setPaletteId} />
        <div className="grid content-start gap-6">
          <Switch
            label="Loop for ever" checked={loop} onChange={setLoop}
            hint="Off means it plays once and holds on the logo"
          />
        </div>
      </ControlPanel>

      <Advanced>
        <Readout label="Length" value={`${T_TOTAL} s`} />
        <Readout label="Lands on the logo at" value={`${T_SETTLE} s`} />
        <Readout label="Letters formed by" value={`${(T_SETTLE + T_LETTERS).toFixed(1)} s`} />
        <Readout label="Final c" value={`${LOGO_C[0]} + ${LOGO_C[1]}i`} />
        <p className="text-[13px] leading-relaxed text-muted">
          c spirals in from a radius of 0.93 with an eased 5.2-radian turn, so the
          shape churns early and decelerates onto the logo&apos;s constant exactly as the
          letterforms finish closing.
        </p>
      </Advanced>
    </ToyShell>
  );
}
