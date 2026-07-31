"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Advanced, PaletteChoice, Readout } from "./Controls";
import ToyShell from "./ToyShell";
import { useJulia } from "./useJulia";
import { useInitialParams, useSyncParams } from "./usePlayLink";
import { INK_RGB, PALETTES, paletteById, type Palette } from "@/lib/play/palettes";

/* The same eight constants as the original family sheet, so the sub-brand marks
   stay recognisable across the studio's decks and this page. */
export const FAMILY = [
  { name: "The swirl", note: "our logo", cr: -0.8, ci: 0.156 },
  { name: "The rabbit", note: "Douady's rabbit", cr: -0.123, ci: 0.745 },
  { name: "The bowtie", note: "on the real axis", cr: -1.0, ci: 0.0 },
  { name: "The lightning", note: "dendrite", cr: 0.0, ci: 1.0 },
  { name: "The blossom", note: "near the cardioid", cr: 0.285, ci: 0.535 },
  { name: "The whirlpool", note: "just inside", cr: 0.285, ci: 0.01 },
  { name: "The dragon", note: "off the swirl", cr: -0.835, ci: -0.2321 },
  { name: "The snowflake", note: "Siegel disc", cr: -0.70176, ci: -0.3842 },
] as const;

function FamilyTile({
  member,
  palette,
}: {
  member: (typeof FAMILY)[number];
  palette: Palette;
}) {
  /* Tiles are small and there are eight of them, so each runs at a lower
     iteration cap and device-pixel-ratio than a full toy. They also idle while
     scrolled out of view (useJulia's default). */
  const julia = useJulia({
    palette,
    maxDpr: 1.5,
    step: (_t, u) => {
      u.c = [member.cr, member.ci];
      u.span = 1.55;
      u.speed = 0.04;
      u.interior = 0;
      u.interiorBase = [...INK_RGB];
      u.shadeMin = 0.12;
      u.iterations = 120;
    },
  });

  return (
    <Link
      href={`/play/creature?cr=${member.cr}&ci=${member.ci}`}
      className="group relative block overflow-hidden rounded-2xl bg-black focus-visible:ring-2 focus-visible:ring-royal focus-visible:ring-offset-2"
      style={{ aspectRatio: "1 / 1" }}
    >
      <canvas
        ref={julia.canvasRef}
        className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
        aria-hidden="true"
      />
      <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent p-3.5 pt-8">
        <span className="block text-[14px] font-semibold text-white">{member.name}</span>
        <span className="block text-[12px] text-white/60">{member.note}</span>
      </span>
    </Link>
  );
}

export default function LogoFamily({ intro, aspect }: { intro: string; aspect: string }) {
  const params = useInitialParams();
  const [paletteId, setPaletteId] = useState("logo");

  useEffect(() => {
    if (params?.get("pal")) setPaletteId(params.get("pal")!);
  }, [params]);

  useSyncParams({ pal: paletteId === "logo" ? null : paletteId });
  const palette = paletteById(paletteId);

  return (
    <ToyShell
      title="The family"
      intro={intro}
      slug="family"
      aspect={aspect}
      embeddable={false}
      screen={
        <div className="absolute inset-0 grid grid-cols-2 gap-2.5 p-2.5 sm:grid-cols-4 sm:gap-3 sm:p-3">
          {FAMILY.map((m) => (
            <FamilyTile key={m.name} member={m} palette={palette} />
          ))}
        </div>
      }
    >
      <PaletteChoice palettes={PALETTES} value={paletteId} onChange={setPaletteId} />
      <p className="mt-5 text-[15px] leading-relaxed text-muted">
        Tap any of the eight to open it in the creature maker, where you can keep
        changing it and save the result.
      </p>

      <Advanced>
        {FAMILY.map((m) => (
          <Readout
            key={m.name}
            label={m.name}
            value={`c = ${m.cr} ${m.ci < 0 ? "−" : "+"} ${Math.abs(m.ci)}i`}
          />
        ))}
      </Advanced>
    </ToyShell>
  );
}
