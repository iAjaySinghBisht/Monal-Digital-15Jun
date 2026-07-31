/* ------------------------------------------------------------------ *
 *  AipanBorder — the closing edge of the page, drawn in the grammar of
 *  Aipan.
 *
 *  Aipan is the folk art of Kumaon, in Uttarakhand: geometry laid down in
 *  rice paste on a red-ochre ground, built from a small vocabulary of
 *  repeated units — rows of dots (bindu), nested diamonds, chevron bands,
 *  combed hatching, and the eight-petalled lotus (ashtadal kamal).
 *  Repetition of one unit at several scales is exactly the logic the rest
 *  of this site is built on, which is why it belongs here rather than as
 *  decoration.
 *
 *  ON THE VOCABULARY
 *  An earlier version of this band ran all five units at once — comb,
 *  diamond, bindu, rules, and a centred lotus — and at 16px tall that read
 *  as a reproduction of an aipan rather than a nod to one. This is one
 *  unit only: the nested diamond, at two scales, repeating. No dot row, no
 *  combed edge, no ruled tramlines, no rosette.
 *
 *  The nesting is the whole point. A diamond containing a smaller diamond
 *  is the same figure at two scales — which is the site's own construction
 *  stated in Kumaoni, and it survives being small because there is nothing
 *  else competing for the 16px.
 *
 *  ON THE COLOUR
 *  The art is defined by two values: white paste on red earth. Drawing it
 *  in the site's own spectrum on a transparent ground made it a pattern
 *  borrowed from Aipan rather than Aipan. Taking the real ground means the
 *  band reads as a made object laid onto the page — and it can afford to,
 *  because it appears exactly once.
 *
 *  This remains a respectful nod, not a reproduction: it borrows the
 *  vocabulary rather than copying any specific ceremonial design.
 * ------------------------------------------------------------------ */

import { useId } from "react";

import { diamondPath, innerRadius } from "@/lib/aipan";

const UNIT = 34; // pitch of the repeat — one diamond per 34px
const H = 16;

/* Read off the reference photo rather than invented: brick red, not
   oxblood, and chalk white, not cream. */
const PASTE = "#f7f4ef";
const GROUND = "#a81f16";
const GROUND_DEEP = "#82130c";

export default function AipanBorder({ className = "" }: { className?: string }) {
  /* SVG ids are DOCUMENT-global, so two bands on one page would collide and
     the second would silently paint with the first's gradient. It renders
     once today, but it takes a `className` — which invites a second — and
     the failure is invisible rather than loud. `useId` costs nothing and
     removes the trap. */
  const uid = useId().replace(/:/g, "");
  const ground = `aipan-ground-${uid}`;
  const diamond = `aipan-diamond-${uid}`;

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height: H }}
    >
      {/* No viewBox: the pattern is in userSpaceOnUse units, so the
          diamonds stay square at any page width instead of stretching. */}
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          {/* The ground is painted, not filled: a flat swatch of red looks
              like a CSS colour, so it darkens at both edges the way pigment
              pools where the stroke ends. */}
          <linearGradient id={ground} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={GROUND_DEEP} />
            <stop offset="0.5" stopColor={GROUND} />
            <stop offset="1" stopColor={GROUND_DEEP} />
          </linearGradient>

          <pattern
            id={diamond}
            width={UNIT}
            height={H}
            patternUnits="userSpaceOnUse"
          >
            <g
              transform={`translate(${UNIT / 2} ${H / 2})`}
              stroke={PASTE}
              fill="none"
              strokeWidth="0.8"
              strokeLinejoin="round"
              opacity="0.85"
            >
              <path d={diamondPath(4)} />
              {/* Held back so the eye reads outer-then-inner, not two rings. */}
              <path d={diamondPath(innerRadius(4))} opacity="0.7" />
            </g>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${ground})`} />
        <rect width="100%" height="100%" fill={`url(#${diamond})`} />
      </svg>
    </div>
  );
}
