"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Advanced, ControlPanel, Knob, PaletteChoice, Readout, Switch } from "./Controls";
import ToyShell from "./ToyShell";
import { useJulia } from "./useJulia";
import { numParam, useInitialParams, useSyncParams } from "./usePlayLink";
import { INK_RGB, LOGO_C, PALETTES, paletteById } from "@/lib/play/palettes";
import { savePng, slugifyFilename } from "@/lib/play/savePng";

const INK = "#16131c";

const NAMES = ["Ziggy", "Momo", "Pip", "Nova", "Twirly", "Biscuit", "Echo", "Luna",
  "Fizz", "Doodle", "Sunny", "Koko"];
const EPITHETS = ["the Twirlwhisker", "the Spiralpuff", "the Starcurl", "the Wigglefin",
  "the Glowtail", "the Swooshwing", "the Fernfoot", "the Curlybean", "the Moonswirl",
  "the Zapdoodle"];

/** Same c always gives the same name, so a shared link keeps its creature. */
function creatureName(cr: number, ci: number) {
  const h = Math.abs(Math.round(cr * 1000) * 31 + Math.round(ci * 1000) * 17);
  return `${NAMES[h % NAMES.length]} ${EPITHETS[(h >> 4) % EPITHETS.length]}`;
}

/**
 * Maps the drag surface onto a scaled copy of the Mandelbrot set's main
 * cardioid, where Julia sets are richest: across spins the shape, up and down
 * slides from chunky (inside) to dusty (outside). Picking c from raw pointer
 * position instead would land on a dull dust cloud most of the time.
 */
function cFromWheel(theta: number, scale: number): [number, number] {
  return [
    scale * (Math.cos(theta) / 2 - Math.cos(2 * theta) / 4),
    scale * (Math.sin(theta) / 2 - Math.sin(2 * theta) / 4),
  ];
}

export default function CreatureMaker({
  intro,
  aspect,
  embedded = false,
}: {
  intro: string;
  aspect: string;
  embedded?: boolean;
}) {
  const params = useInitialParams();
  const [target, setTarget] = useState<[number, number]>([LOGO_C[0], LOGO_C[1]]);
  const [paletteId, setPaletteId] = useState("logo");
  const [zoom, setZoom] = useState(2.9);
  const [detail, setDetail] = useState(160);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!params) return;
    const cr = params.get("cr");
    const ci = params.get("ci");
    if (cr !== null && ci !== null && Number.isFinite(+cr) && Number.isFinite(+ci)) {
      setTarget([+cr, +ci]);
    }
    if (params.get("pal")) setPaletteId(params.get("pal")!);
    setZoom(numParam(params, "z", 2.9, 0.8, 4.5));
    setDetail(numParam(params, "it", 160, 60, 300));
  }, [params]);

  useSyncParams(
    {
      cr: target[0].toFixed(4),
      ci: target[1].toFixed(4),
      pal: paletteId === "logo" ? null : paletteId,
      z: zoom.toFixed(2),
      it: detail === 160 ? null : detail,
    },
    !embedded,
  );

  const palette = paletteById(paletteId);
  const targetRef = useRef(target);
  targetRef.current = target;
  const currentRef = useRef<[number, number]>([...target]);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const detailRef = useRef(detail);
  detailRef.current = detail;

  const julia = useJulia({
    palette,
    playing,
    step: (_t, u) => {
      // Ease toward the target so dragging feels like the shape has weight.
      const [tr, ti] = targetRef.current;
      currentRef.current[0] += (tr - currentRef.current[0]) * 0.12;
      currentRef.current[1] += (ti - currentRef.current[1]) * 0.12;
      u.c = [...currentRef.current];
      u.span = zoomRef.current / 2;
      u.speed = 0;
      u.sweep = 0;
      u.swell = 0;
      u.interior = 0;
      u.interiorBase = [...INK_RGB];
      u.shadeMin = 0.1;
      u.shadeLo = 1.5;
      u.shadeHi = 9;
      u.iterations = detailRef.current;
    },
  });

  /* Snap the eased value when playback is off, so a paused canvas is not stuck
     halfway between two creatures. */
  useEffect(() => {
    if (playing) return;
    currentRef.current = [...target];
    julia.renderNow();
  }, [playing, target, julia]);

  const dragging = useRef(false);

  const pick = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const theta = ((e.clientX - r.left) / r.width) * Math.PI * 2;
    const scale = 0.8 + (1 - (e.clientY - r.top) / r.height) * 0.38;
    setTarget(cFromWheel(theta, scale));
  }, []);

  const surprise = () =>
    setTarget(cFromWheel(Math.random() * Math.PI * 2, 0.92 + Math.random() * 0.2));

  const name = creatureName(target[0], target[1]);

  const handleSave = async () => {
    const canvas = julia.canvasRef.current;
    if (!canvas) return;
    await savePng({
      source: canvas, forceRender: julia.draw,
      width: 2000, height: 1500, background: INK,
      filename: slugifyFilename(name),
    });
  };

  const screen = (
    <>
      <canvas
        ref={julia.canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-label={`A fractal creature called ${name}`}
      />
      <div
        className="absolute inset-0 touch-none"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          pick(e);
        }}
        onPointerMove={(e) => { if (dragging.current) pick(e); }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
        role="presentation"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 p-5 text-center sm:p-7">
        <p className="font-display text-[clamp(1.3rem,3.4vw,2rem)] leading-tight text-white drop-shadow-[0_2px_18px_rgba(22,19,28,0.9)]">
          {name}
        </p>
      </div>
      {julia.supported === false && (
        <p className="absolute inset-0 grid place-items-center p-8 text-center text-[14px] text-white/70">
          This browser can&apos;t run the fractal renderer.
        </p>
      )}
      <p className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-center text-[13px] text-white/55">
        Drag across for a different creature — up for dust, down for chunky
      </p>
    </>
  );

  if (embedded) return <div className="absolute inset-0">{screen}</div>;

  return (
    <ToyShell
      title="Creature maker"
      intro={intro}
      slug="creature"
      aspect={aspect}
      screen={screen}
      onSave={handleSave}
      saveLabel="Save my creature"
      actions={
        <button
          type="button"
          onClick={surprise}
          className="min-h-11 rounded-full bg-accent px-5 text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Surprise me
        </button>
      }
    >
      <ControlPanel>
        <div className="grid gap-6">
          <PaletteChoice palettes={PALETTES} value={paletteId} onChange={setPaletteId} />
          <Knob
            label="How close" hint="Step back to see the whole creature"
            value={zoom} min={0.8} max={4.5} step={0.05} onChange={setZoom}
            format={(v) => `${(2.9 / v).toFixed(1)}×`}
          />
        </div>
        <div className="grid content-start gap-6">
          <Knob
            label="Detail" hint="More detail finds thinner whiskers"
            value={detail} min={60} max={300} step={10} onChange={setDetail}
            format={(v) => `${v} steps`}
          />
          <Switch label="Keep it moving" checked={playing} onChange={setPlaying} />
        </div>
      </ControlPanel>

      <Advanced>
        <Readout
          label="c"
          value={`${target[0].toFixed(4)} ${target[1] < 0 ? "−" : "+"} ${Math.abs(target[1]).toFixed(4)}i`}
        />
        <Readout label="View half-width" value={(zoom / 2).toFixed(3)} />
        <Readout label="Iteration cap" value={String(detail)} />
        <p className="text-[13px] leading-relaxed text-muted">
          Each creature is the set of points that never fly away under
          z → z² + c. Our logo uses c = {LOGO_C[0]} + {LOGO_C[1]}i.
        </p>
      </Advanced>
    </ToyShell>
  );
}
