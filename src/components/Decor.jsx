import React from "react";

/* ------------------------------------------------------------------ *
 *  Shared UI primitives — the minimalist "bento" visual language.
 * ------------------------------------------------------------------ */

/* Small inline arrow glyph */
export const ArrowGlyph = ({ className = "" }) => (
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
export const ArrowUpRight = ({ className = "" }) => (
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

/* Section eyebrow — a small rounded chip with a coloured dot.
   tone "light" sits on light backgrounds, "dark" on dark panels. */
export const Eyebrow = ({
  children,
  className = "",
  dot = "bg-royal",
  tone = "light",
}) => {
  const tones = {
    light: "bg-paper border-line text-ink/70",
    dark: "bg-white/10 border-white/20 text-white/80",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] ${tones[tone]} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {children}
    </span>
  );
};

/* Pill button. Variants: dark (filled), outline, sun (yellow), ghost (on dark).
   Magnetic by default (picked up by the data-attribute motion engine). */
export const Pill = ({
  as = "button",
  children,
  className = "",
  variant = "dark",
  magnetic = true,
  withArrow = true,
  ...rest
}) => {
  const Tag = as;
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
export const AvatarStack = ({ srcs = [], size = "w-9 h-9", className = "" }) => (
  <div className={`flex -space-x-2.5 ${className}`}>
    {srcs.map((src, i) => (
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
