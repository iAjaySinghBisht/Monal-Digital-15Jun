import type { ElementType, ReactNode } from "react";
import { diamondPath, innerRadius } from "@/lib/aipan";

/* ------------------------------------------------------------------ *
 *  Shared UI primitives — the minimalist "bento" visual language.
 * ------------------------------------------------------------------ */

/* Small inline arrow glyph */
export const ArrowGlyph = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

/* Diagonal up-right arrow — used on hover affordances. */
export const ArrowUpRight = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/* The Aipan band's nested diamond, at whatever size a caller needs.
   Stroke-only on `currentColor`, exactly as the band draws it, so the two
   are the same figure rather than two diamonds that resemble each other. */
export const Diamond = ({
  size = 12,
  className = "",
}: {
  size?: number;
  className?: string;
}) => {
  const r = 4;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="-5 -5 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <path d={diamondPath(r)} />
      {/* Held back so the eye reads outer-then-inner, not two rings. */}
      <path d={diamondPath(innerRadius(r))} opacity="0.7" />
    </svg>
  );
};

/* Section eyebrow — a small rounded chip with the nested diamond.
   tone "light" sits on light backgrounds, "dark" on dark panels.

   THE DIAMOND HAS NO COLOUR PROP. It used to take accent, sun or violet
   per call site, decided ad hoc — twenty-one eyebrows across the site and
   nothing saying which hue belonged to which section, so the mark meant
   something different every time you met it. An eyebrow is a singleton,
   not a series: there is no set for it to walk, so it takes the signature
   band and is the same mark everywhere.

   The band, not its `-ink` sibling. The siblings exist for one purpose —
   a hue that has to carry TEXT on a light surface — and this mark is
   aria-hidden decoration carrying no copy. `sun-ink` is #947200, an
   olive; next to the #ffd23f it is meant to be, it reads as dirty
   yellow. */
export const Eyebrow = ({
  children,
  className = "",
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) => {
  const tones = {
    light: "bg-paper border-line text-ink/70",
    dark: "bg-white/10 border-white/20 text-white/80",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] ${tones[tone]} ${className}`}
    >
      {/* The same unit the closing band repeats, once, at 12px — matched to
          the type rather than to the band. At 10px it read as undersized
          beside 12px caps; at 12 the diamond's width equals the cap height,
          so the mark and the letters share one measure. Same figure and
          same proportions as the band, drawn a little larger. */}
      <Diamond className="text-violet" />
      {children}
    </span>
  );
};

type PillProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  magnetic?: boolean;
  withArrow?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/* Pill button. See THE BUTTON CONVENTION in globals.css — three tiers and
   one filled colour: `primary` is the accent "do this", `outline` the
   quieter sibling, `ghost` the primary on a dark slab.
   Magnetic by default (picked up by the data-attribute motion engine). */
export const Pill = ({
  as: Tag = "button",
  children,
  className = "",
  variant = "primary",
  magnetic = true,
  withArrow = true,
  ...rest
}: PillProps) => {
  const variants = {
    primary: "btn btn-primary",
    outline: "btn btn-outline",
    ghost:
      "btn bg-transparent text-white border-[1.5px] border-white/35 hover:bg-white hover:text-ink hover:border-white",
  };
  return (
    <Tag
      {...(magnetic ? { "data-magnetic": "0.25" } : {})}
      className={`group ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
      {withArrow && (
        <ArrowGlyph className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Tag>
  );
};
