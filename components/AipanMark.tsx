/* ------------------------------------------------------------------ *
 *  AipanMark — the Aipan vocabulary, borrowed at small sizes.
 *
 *  The band at the foot of the page is the full statement. This is the
 *  same grammar reduced to marks that can sit inside other elements: the
 *  corner ornament, the ruled divider, and the eight-petalled lotus.
 *
 *  It exists as ONE component on purpose. Four placements drawn four times
 *  would drift into four slightly different dialects within a month; drawn
 *  once, a change to the vocabulary reaches all of them.
 *
 *  Everything here is stroke-only and takes `currentColor`, so a caller
 *  sets the colour and opacity from context — white on the ochre and the
 *  purple, ink on the pale cards. Nothing in this file is loud by itself.
 * ------------------------------------------------------------------ */

import { diamondPath, innerRadius } from "@/lib/aipan";

export type AipanMotif = "corner" | "rule" | "lotus";

export default function AipanMark({
  motif = "corner",
  size = 34,
  className = "",
  style,
}: {
  motif?: AipanMotif;
  /** Height for `rule`, edge length for `corner` and `lotus`. */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  if (motif === "corner") {
    /* A corner bud with dot trails running away down both edges — the
       figure a real aipan sets where two borders meet. Drawn for the
       top-left; rotate it for the other three. */
    return (
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className={className}
        style={style}
      >
        <g {...common} strokeWidth="1.1" transform="translate(11 11)">
          <path d={diamondPath(7)} />
          <path d={diamondPath(innerRadius(7))} opacity="0.7" />
        </g>
        <g fill="currentColor" stroke="none">
          <circle cx="24" cy="11" r="1.05" />
          <circle cx="29.5" cy="11" r="0.8" />
          <circle cx="34" cy="11" r="0.6" />
          <circle cx="11" cy="24" r="1.05" />
          <circle cx="11" cy="29.5" r="0.8" />
          <circle cx="11" cy="34" r="0.6" />
        </g>
        <g {...common} strokeWidth="0.85" opacity="0.6">
          <path d="M4,20 A16,16 0 0 0 20,4" />
        </g>
      </svg>
    );
  }

  if (motif === "rule") {
    /* A ruled divider with a diamond at its head and a dot trail behind —
       what an aipan band shrinks to when it only has to flank something. */
    return (
      <svg
        aria-hidden="true"
        width={size * 4}
        height={size}
        viewBox="0 0 80 20"
        className={className}
        style={style}
      >
        <g {...common} strokeWidth="1.1" transform="translate(69 10)">
          <path d={diamondPath(5.5)} />
          <path d={diamondPath(innerRadius(5.5))} opacity="0.7" />
        </g>
        <g fill="currentColor" stroke="none">
          <circle cx="56" cy="10" r="1" />
          <circle cx="50" cy="10" r="0.75" />
          <circle cx="45" cy="10" r="0.55" />
        </g>
        <g {...common} strokeWidth="0.9" opacity="0.55">
          <path d="M2,10 H38" />
        </g>
      </svg>
    );
  }

  /* Ashtadal kamal — eight petals rotated about one point. The whole
     figure is one unit repeated, which is why it belongs in a fractal set
     as much as in a folk one. */
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="-11 -11 22 22"
      className={className}
      style={style}
    >
      <g {...common} strokeWidth="0.9">
        <circle cx="0" cy="0" r="9.4" opacity="0.55" />
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-5"
            rx="2"
            ry="3.8"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>
      <circle cx="0" cy="0" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
