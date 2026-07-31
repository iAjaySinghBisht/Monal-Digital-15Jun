"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Thin accent bar that tracks page scroll progress. */
const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });
  });

  return (
    <div
      data-scroll-progress
      className="fixed top-0 left-0 right-0 h-[3px] z-70 pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-linear-to-r from-ink via-royal to-sun"
        /* The Cantor set — remove the middle third, then the middle third
           of what is left — is the canonical fractal of one dimension, and
           a 3px progress bar has exactly one dimension to be fractal in.
           Two iterations, laid over the whole width.

           The removed thirds are dimmed rather than cut: a bar with a
           literal third missing reads as broken rather than as a
           construction, so what survives is a self-similar banding you
           only notice once you know it is there. */
        style={{
          maskImage:
            "linear-gradient(to right, #000 0 11.11%, #0000006e 11.11% 22.22%, #000 22.22% 33.33%, #000000a8 33.33% 66.66%, #000 66.66% 77.77%, #0000006e 77.77% 88.88%, #000 88.88% 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, #000 0 11.11%, #0000006e 11.11% 22.22%, #000 22.22% 33.33%, #000000a8 33.33% 66.66%, #000 66.66% 77.77%, #0000006e 77.77% 88.88%, #000 88.88% 100%)",
        }}
      />
    </div>
  );
};

export default ScrollProgress;
