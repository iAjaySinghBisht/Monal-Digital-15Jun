"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* On client-side navigation, jump to the top of a new page — or, when the URL
   carries a #hash, scroll to that section. Sections reveal/animate in, so the
   anchor is retried a few times until the target element exists and settles. */
export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    const hash =
      typeof window !== "undefined" ? window.location.hash : "";

    if (hash) {
      const id = hash.slice(1);
      let cancelled = false;

      const anchor = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
      };

      const timers = [0, 120, 300, 600].map((d) => setTimeout(anchor, d));
      window.addEventListener("load", anchor);

      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
        window.removeEventListener("load", anchor);
      };
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
