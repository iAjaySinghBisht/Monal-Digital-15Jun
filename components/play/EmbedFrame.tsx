"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Chromeless wrapper for /embed/<toy>.
 *
 * The root layout mounts the custom cursor and the scroll-progress bar for the
 * whole site; neither belongs inside someone else's iframe. Rather than
 * restructure the root layout (and touch every existing page), this tags the
 * body and globals.css hides them for that one class.
 */
export default function EmbedFrame({ children, credit }: { children: ReactNode; credit: string }) {
  useEffect(() => {
    document.body.classList.add("is-embed");
    return () => document.body.classList.remove("is-embed");
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {children}
      <a
        href={credit}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-3 bottom-3 z-10 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white/70 backdrop-blur-sm transition-colors hover:text-white"
      >
        Monal Digital
      </a>
    </div>
  );
}
