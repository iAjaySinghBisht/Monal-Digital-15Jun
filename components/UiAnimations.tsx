"use client";

import { useEffect } from "react";
import { useUiAnimations } from "@/hooks/useUiAnimations";
import { LOGO_C } from "@/lib/palette";

/* A note for whoever opens the console. The wordmark is a real Julia set,
   and this is the constant it is drawn from — the same value the fractals
   on this page use. Printed once, costs nothing, changes no pixels. */
const SIGNATURE = `
   Monal Digital — the wordmark is a Julia set.

        z ← z² + c        c = ${LOGO_C[0]} ${LOGO_C[1] < 0 ? "-" : "+"} ${Math.abs(LOGO_C[1])}i

              ▲
             ▲ ▲
            ▲▲ ▲▲
           ▲ ▲ ▲ ▲
          ▲▲ ▲▲▲ ▲▲

   Same shape, every scale. Hover a venture card.
`;

export default function UiAnimations() {
  useUiAnimations();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as { __monalSigned?: boolean };
    if (w.__monalSigned) return; // survive a fast-refresh remount
    w.__monalSigned = true;
    // eslint-disable-next-line no-console
    console.log(SIGNATURE);
  }, []);

  return null;
}
