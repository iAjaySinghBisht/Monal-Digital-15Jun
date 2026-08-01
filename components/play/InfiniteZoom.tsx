"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Advanced, ControlPanel, Knob, PaletteChoice, Readout, Switch } from "./Controls";
import ToyShell from "./ToyShell";
import { useJulia } from "./useJulia";
import { numParam, useInitialParams, useSyncParams } from "./usePlayLink";
import { INK_RGB, LOGO_C, PALETTES, paletteById } from "@/lib/play/palettes";
import { savePng } from "@/lib/play/savePng";

const INK = "#16131c";

/**
 * The loop is seamless because the Julia set is self-similar about its repelling
 * fixed point p, where z² + c has multiplier λ = 2p. Zooming in by |λ| and
 * rotating by −arg(λ) maps the set exactly onto itself, and escape times shift
 * by precisely one iteration — which the palette phase term below cancels.
 * Get any one of those three wrong and the loop visibly jumps.
 */
function selfSimilarity(cr: number, ci: number) {
  // p = (1 + sqrt(1 - 4c)) / 2, via the principal complex square root.
  const wr = 1 - 4 * cr;
  const wi = -4 * ci;
  const mag = Math.hypot(wr, wi);
  const arg = Math.atan2(wi, wr);
  const sr = Math.sqrt(mag) * Math.cos(arg / 2);
  const si = Math.sqrt(mag) * Math.sin(arg / 2);
  const px = (1 + sr) / 2;
  const py = si / 2;
  return {
    fixed: [px, py] as [number, number],
    lambdaMag: 2 * Math.hypot(px, py),
    lambdaArg: Math.atan2(py, px),
  };
}

/** One iteration of escape time is 1/31.25 of a palette cycle (mu × 0.032). */
const MU_TO_PHASE = 0.032;

export default function InfiniteZoom({
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
  const [period, setPeriod] = useState(7);
  const [detail, setDetail] = useState(200);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!params) return;
    if (params.get("pal")) setPaletteId(params.get("pal")!);
    setPeriod(numParam(params, "t", 7, 3, 20));
    setDetail(numParam(params, "it", 200, 80, 300));
  }, [params]);

  useSyncParams(
    {
      pal: paletteId === "logo" ? null : paletteId,
      t: period === 7 ? null : period,
      it: detail === 200 ? null : detail,
    },
    !embedded,
  );

  const palette = paletteById(paletteId);
  const geom = useMemo(() => selfSimilarity(LOGO_C[0], LOGO_C[1]), []);
  const periodRef = useRef(period);
  periodRef.current = period;
  const detailRef = useRef(detail);
  detailRef.current = detail;

  const julia = useJulia({
    palette,
    playing,
    step: (t, u) => {
      const T = periodRef.current;
      const s = (t % T) / T;                       // one loop, 0 -> 1
      const zoom = 0.9 * Math.pow(geom.lambdaMag, -s);
      const phi = -geom.lambdaArg * s;
      const cos = Math.cos(phi), sin = Math.sin(phi);
      const ox = -0.28, oy = 0.02;                 // offset so the frame lands on detail
      u.c = [LOGO_C[0], LOGO_C[1]];
      u.center = [
        geom.fixed[0] + (ox * cos - oy * sin) * zoom,
        geom.fixed[1] + (ox * sin + oy * cos) * zoom,
      ];
      u.span = zoom;
      u.rot = phi;
      // Cancel the one-iteration escape-time shift accumulated over the loop.
      u.speed = -MU_TO_PHASE / T;
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

  const handleSave = async () => {
    const canvas = julia.canvasRef.current;
    if (!canvas) return;
    await savePng({
      source: canvas, forceRender: julia.draw,
      width: 2400, height: 1350, background: INK,
      filename: "monal-infinite-zoom",
    });
  };

  const screen = (
    <>
      <canvas
        ref={julia.canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-label="A seamless infinite zoom into the Monal logo's fractal"
      />
      {julia.supported === false && (
        <p className="absolute inset-0 grid place-items-center p-8 text-center text-[14px] text-white/70">
          This browser can&apos;t run the fractal renderer.
        </p>
      )}
    </>
  );

  if (embedded) return <div className="absolute inset-0">{screen}</div>;

  return (
    <ToyShell
      title="All the way down"
      intro={intro}
      slug="zoom"
      aspect={aspect}
      screen={screen}
      onSave={handleSave}
    >
      <ControlPanel>
        <div className="grid gap-6">
          <PaletteChoice palettes={PALETTES} value={paletteId} onChange={setPaletteId} />
          <Switch label="Keep falling" checked={playing} onChange={setPlaying} />
        </div>
        <div className="grid content-start gap-6">
          <Knob
            label="Speed of the fall" hint="How long one full loop takes"
            value={period} min={3} max={20} step={0.5} onChange={setPeriod}
            format={(v) => `${v.toFixed(1)} s`}
          />
          <Knob
            label="Detail" hint="Deeper zooms need more of it"
            value={detail} min={80} max={300} step={10} onChange={setDetail}
            format={(v) => `${v} steps`}
          />
        </div>
      </ControlPanel>

      <Advanced>
        <Readout
          label="Repelling fixed point"
          value={`${geom.fixed[0].toFixed(5)} + ${geom.fixed[1].toFixed(5)}i`}
        />
        <Readout label="Multiplier |λ|" value={geom.lambdaMag.toFixed(5)} />
        <Readout label="Rotation per loop" value={`${((-geom.lambdaArg * 180) / Math.PI).toFixed(2)}°`} />
        <Readout label="Zoom per loop" value={`${geom.lambdaMag.toFixed(3)}×`} />
        <p className="text-[13px] leading-relaxed text-muted">
          Every loop scales the view by |λ| and turns it by arg λ. That is exactly
          the transformation the set is invariant under, so the last frame and the
          first frame are the same picture.
        </p>
      </Advanced>
    </ToyShell>
  );
}
