import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 *  Panel — a plain, full-flow section wrapper. Each section sits in
 *  normal document flow (no stacking / clip tricks); the calm bento
 *  look comes from the cards inside and the on-scroll reveals. `bg`
 *  must be opaque.
 * ------------------------------------------------------------------ */
export const Panel = ({
  id,
  children,
  className = "",
  bg = "bg-paper",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bg?: string;
}) => (
  <section id={id} className={`relative w-full ${bg} ${className}`}>
    {children}
  </section>
);

export default Panel;
