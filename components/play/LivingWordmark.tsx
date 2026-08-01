"use client";

import { useEffect, useRef, useState } from "react";
import { Advanced, Choice, ControlPanel, Knob, PaletteChoice, Readout, Switch } from "./Controls";
import ToyShell from "./ToyShell";
import { useBakedGrid, type PhaseParams } from "./useBakedGrid";
import { useJulia } from "./useJulia";
import { numParam, useInitialParams, useSyncParams } from "./usePlayLink";
import { LOGO_C, PALETTES, PINK_RGB, paletteById } from "@/lib/play/palettes";
import { savePng } from "@/lib/play/savePng";

const MASK = "/play/monal-letters-mask.svg";
const INK = "#16131c";

const MODES = [
  { value: "baked" as const, label: "Our logo" },
  { value: "live" as const, label: "Live fractal" },
];

type Mode = "baked" | "live";

export default function LivingWordmark({
  intro,
  aspect,
  embedded = false,
}: {
  intro: string;
  aspect: string;
  embedded?: boolean;
}) {
  const params = useInitialParams();

  const [mode, setMode] = useState<Mode>("baked");
  const [paletteId, setPaletteId] = useState("logo");
  const [speed, setSpeed] = useState(0.05);
  const [sweep, setSweep] = useState(0.45);
  const [swell, setSwell] = useState(0.35);
  const [morph, setMorph] = useState(0.0025);
  const [interior, setInterior] = useState(0.6);
  const [pixel, setPixel] = useState(true);
  const [playing, setPlaying] = useState(true);

  /* Hydrate from the shared link, once. */
  useEffect(() => {
    if (!params) return;
    const m = params.get("m");
    if (m === "live" || m === "baked") setMode(m);
    if (params.get("pal")) setPaletteId(params.get("pal")!);
    setSpeed(numParam(params, "sp", 0.05, 0, 0.25));
    setSweep(numParam(params, "sw", 0.45, 0, 1.5));
    setSwell(numParam(params, "sl", 0.35, 0, 1));
    setMorph(numParam(params, "mo", 0.0025, 0, 0.02));
    setInterior(numParam(params, "in", 0.6, 0, 1));
    if (params.get("px")) setPixel(params.get("px") === "1");
  }, [params]);

  useSyncParams(
    {
      m: mode === "baked" ? null : mode,
      pal: paletteId === "logo" ? null : paletteId,
      sp: speed, sw: sweep, sl: swell,
      mo: mode === "live" ? morph : null,
      in: mode === "live" ? interior : null,
      px: mode === "live" ? (pixel ? 1 : 0) : null,
    },
    !embedded,
  );

  const palette = paletteById(paletteId);

  /* Mode "baked": cycle the real artwork. Refs so slider drags never re-run
     the render loop. */
  const phase = useRef<PhaseParams>({ speed, sweep, swell });
  phase.current = { speed, sweep, swell };
  const baked = useBakedGrid({ palette, playing: playing && mode === "baked", params: phase });

  /* Mode "live": compute the Julia set per frame, inside the letters. */
  const live = useJulia({
    palette,
    playing: playing && mode === "live",
    step: (t, u) => {
      u.c = [
        LOGO_C[0] + morph * Math.cos(t * 0.3),
        LOGO_C[1] + morph * Math.sin(t * 0.3),
      ];
      u.span = 1.26;
      u.speed = speed;
      u.sweep = sweep;
      u.swell = swell;
      u.interior = interior;
      u.interiorBase = [...PINK_RGB];
      u.pixel = pixel ? 1 : 0;
      u.shadeMin = 0.55;
      u.shadeLo = 0;
      u.shadeHi = 6;
      u.iterations = 200;
    },
  });

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) { setReduced(true); setPlaying(false); }
  }, []);

  const resetToLogo = () => {
    setSpeed(0);
    setSweep(0);
    setSwell(0);
    setMorph(0);
    baked.resetClock();
  };

  const handleSave = async () => {
    const width = 2820;
    const height = Math.round((width * 170) / 705);
    if (mode === "baked") {
      const canvas = baked.canvasRef.current;
      if (!canvas) return;
      await savePng({
        source: canvas, width, height, pixelated: true,
        maskUrl: MASK, background: INK, filename: "monal-wordmark",
      });
    } else {
      const canvas = live.canvasRef.current;
      if (!canvas) return;
      await savePng({
        source: canvas, forceRender: live.draw, width, height,
        maskUrl: MASK, background: INK, filename: "monal-wordmark-live",
      });
    }
  };

  const screen = (
    <>
      <div className="absolute inset-0 mask-monal-letters">
        <canvas
          ref={baked.canvasRef}
          className={`h-full w-full pixel-canvas ${mode === "baked" ? "" : "hidden"}`}
          aria-label="The MONAL wordmark with its colours cycling"
        />
        <canvas
          ref={live.canvasRef}
          className={`h-full w-full ${mode === "live" ? "" : "hidden"}`}
          aria-label="A live Julia set rendered inside the MONAL letters"
        />
      </div>
      {live.supported === false && mode === "live" && (
        <p className="absolute inset-0 grid place-items-center p-8 text-center text-[14px] text-white/70">
          This browser can&apos;t run the live fractal. The logo mode above works everywhere.
        </p>
      )}
    </>
  );

  const controls = (
    <>
      <ControlPanel>
        <div className="grid gap-6">
          <Choice label="What to show" options={MODES} value={mode} onChange={setMode} />
          <Knob
            label="Colour speed" hint="How fast the colours travel"
            value={speed} min={0} max={0.25} step={0.005} onChange={setSpeed}
            format={(v) => (v > 0 ? `${(1 / v).toFixed(0)} s per loop` : "still")}
          />
          <Knob
            label="Wave" hint="Sends the colours across the word"
            value={sweep} min={0} max={1.5} step={0.01} onChange={setSweep}
            format={(v) => (v > 0 ? `${(1 / (v * 0.9)).toFixed(1)} s across` : "none")}
          />
          <Knob
            label="Swell" hint="Makes the bands breathe in and out"
            value={swell} min={0} max={1} step={0.01} onChange={setSwell}
            format={(v) => (v > 0 ? v.toFixed(2) : "off")}
          />
        </div>
        <div className="grid content-start gap-6">
          <PaletteChoice palettes={PALETTES} value={paletteId} onChange={setPaletteId} />
          <Switch
            label="Keep it moving" checked={playing} onChange={setPlaying}
            hint={reduced ? "Your device asked for less motion, so this starts off" : undefined}
          />
        </div>
      </ControlPanel>

      <Advanced>
        {mode === "live" ? (
          <>
            <Knob
              label="Morph radius" hint="How far c wanders from the logo's own value"
              value={morph} min={0} max={0.02} step={0.0005} onChange={setMorph}
              format={(v) => (v > 0 ? `r = ${v.toFixed(4)}` : "c frozen")}
            />
            <Knob
              label="Interior life" hint="Orbit-trap colour vs the logo's flat pink"
              value={interior} min={0} max={1} step={0.01} onChange={setInterior}
              format={(v) => (v === 0 ? "flat pink" : `${Math.round(v * 100)}%`)}
            />
            <Switch
              label="Snap to 3px cells" checked={pixel} onChange={setPixel}
              hint="Matches the chunky texture of the baked artwork"
            />
            <Readout label="c" value={`${LOGO_C[0]} + ${LOGO_C[1]}i`} />
            <Readout label="Iterations" value="200" />
          </>
        ) : (
          <>
            <Readout label="Grid" value="235 × 57 cells" />
            <Readout label="Colours in the artwork" value="8" />
            <Readout label="Fractal maths per frame" value="none — palette only" />
            <p className="text-[13px] leading-relaxed text-muted">
              Set colour speed, wave and swell to zero and this is the original SVG
              logo, pixel for pixel. That is what the button below does.
            </p>
          </>
        )}
      </Advanced>
    </>
  );

  if (embedded) return <div className="absolute inset-0">{screen}</div>;

  return (
    <ToyShell
      title="Living wordmark"
      intro={intro}
      slug="wordmark"
      aspect={aspect}
      screen={screen}
      onSave={handleSave}
      actions={
        <button
          type="button"
          onClick={resetToLogo}
          className="min-h-11 rounded-full border border-line bg-paper px-5 text-[14px] font-semibold text-ink transition-colors hover:border-ink/30"
        >
          Back to the real logo
        </button>
      }
    >
      {controls}
    </ToyShell>
  );
}
