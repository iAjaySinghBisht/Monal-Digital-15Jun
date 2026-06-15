import React from "react";

/* ------------------------------------------------------------------ *
 *  Section — a plain, full-flow section wrapper. Each section sits in
 *  normal document flow (no stacking / clip tricks); the calm bento
 *  look comes from the cards inside and the on-scroll reveals. `bg`
 *  must be opaque. Kept named `Panel` so existing imports keep working.
 * ------------------------------------------------------------------ */
export const Panel = ({ id, children, className = "", bg = "bg-paper" }) => (
  <section
    id={id}
    className={`relative w-full ${bg} ${className}`}
  >
    {children}
  </section>
);

export default Panel;
