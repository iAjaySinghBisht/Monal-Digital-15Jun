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
  size = 10,
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

/* Which ink the eyebrow's diamond takes. Written as literal class names
   because Tailwind scans source text — a class assembled at runtime from
   the hue name would never be generated. On light grounds the spectrum's
   `-ink` variants carry a stroke this fine; the bright values are for the
   dark panels, where they have the contrast to spare. */
const DIAMOND_INK = {
  royal: { light: "text-royal", dark: "text-royal" },
  sun: { light: "text-sun-ink", dark: "text-sun" },
  violet: { light: "text-violet-ink", dark: "text-violet" },
} as const;

/* Section eyebrow — a small rounded chip with the nested diamond.
   tone "light" sits on light backgrounds, "dark" on dark panels. */
export const Eyebrow = ({
  children,
  className = "",
  dot = "royal",
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  /** Which spectrum hue the diamond takes. */
  dot?: keyof typeof DIAMOND_INK;
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
      {/* The same unit the closing band repeats, once, at 10px — which is
          the size the band draws it at, so this is literally that diamond
          rather than a smaller cousin of it. */}
      <Diamond className={DIAMOND_INK[dot][tone]} />
      {children}
    </span>
  );
};

type PillProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  variant?: "dark" | "outline" | "sun" | "royal" | "ghost";
  magnetic?: boolean;
  withArrow?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/* Pill button. Variants: dark (filled), outline, sun (yellow), ghost (on dark).
   Magnetic by default (picked up by the data-attribute motion engine). */
export const Pill = ({
  as: Tag = "button",
  children,
  className = "",
  variant = "dark",
  magnetic = true,
  withArrow = true,
  ...rest
}: PillProps) => {
  const variants = {
    dark: "btn btn-dark",
    outline: "btn btn-outline",
    sun: "btn btn-sun",
    royal: "btn btn-royal",
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

/* A row of stacked overlapping avatars (social proof). */
export const AvatarStack = ({
  srcs = [],
  size = "w-9 h-9",
  className = "",
}: {
  srcs?: string[];
  size?: string;
  className?: string;
}) => (
  <div className={`flex -space-x-2.5 ${className}`}>
    {srcs.map((src, i) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={i}
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        crossOrigin="anonymous"
        className={`${size} rounded-full object-cover border-2 border-paper`}
      />
    ))}
  </div>
);
