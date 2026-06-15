import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/* ------------------------------------------------------------------ *
 *  Central, data-attribute driven UI animation engine.
 *  Components stay clean — they only carry markup attributes:
 *
 *   data-reveal="up|down|left|right|zoom|fade"   single element reveal
 *   data-reveal-delay="0.2"                       optional delay (s)
 *   data-reveal-group="up|left|..."               stagger direct children
 *   data-split                                    word-by-word heading reveal
 *   data-split-chars                              char-by-char heading reveal
 *   data-parallax="80"                            scroll parallax (px)
 *   data-spin="0.4"                               scroll-linked rotation
 *   data-counter="10" data-counter-suffix="+"     count-up number
 *   data-magnetic="0.35"                          cursor-magnetic element
 *   data-tilt="6"                                 3D hover tilt
 *
 *  Honours prefers-reduced-motion — content always stays visible.
 * ------------------------------------------------------------------ */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const REVEAL_FROM = {
  up: { y: 64, opacity: 0 },
  down: { y: -64, opacity: 0 },
  left: { x: -90, opacity: 0 },
  right: { x: 90, opacity: 0 },
  zoom: { scale: 0.92, opacity: 0 },
  fade: { opacity: 0 },
};

const REVEAL_TO = {
  duration: 1.05,
  x: 0,
  y: 0,
  scale: 1,
  opacity: 1,
  ease: "power3.out",
};

export function useUiAnimations() {
  useGSAP(() => {
    const cleanups = [];
    const reduce = prefersReducedMotion();

    /* Defer all setup until the custom display font has loaded. SplitText
       measures character/word positions, so running before the font swaps in
       would split against the fallback face and reflow on swap. We wrap the
       work in a gsap.context so the hook's scoped cleanup still reverts it. */
    let ctx;
    const ready = document.fonts ? document.fonts.ready : Promise.resolve();
    ready.then(() => {
      ctx = gsap.context(setupAnimations);
    });
    cleanups.push(() => ctx && ctx.revert());

    function setupAnimations() {

    /* ---- Count-up numbers (base value is set even when reduced) ---- */
    gsap.utils.toArray("[data-counter]").forEach((el) => {
      const end = parseFloat(el.dataset.counter) || 0;
      const suffix = el.dataset.counterSuffix || "";
      const prefix = el.dataset.counterPrefix || "";
      if (reduce) {
        el.textContent = prefix + end + suffix;
        return;
      }
      el.textContent = prefix + "0" + suffix;
      const proxy = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () =>
          gsap.to(proxy, {
            v: end,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = prefix + Math.round(proxy.v) + suffix;
            },
          }),
      });
    });

    /* Reduced motion: leave everything visible, skip motion setup. */
    if (reduce) return;

    /* ---- Heading word reveals (SplitText) ---- */
    gsap.utils.toArray("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "words",
        mask: "words",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            yPercent: 118,
            opacity: 0,
            duration: 1.05,
            ease: "power4.out",
            stagger: 0.06,
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        },
      });
    });

    /* ---- Heading char reveals (SplitText) ---- */
    gsap.utils.toArray("[data-split-chars]").forEach((el) => {
      SplitText.create(el, {
        type: "chars",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.chars, {
            opacity: 0,
            yPercent: 60,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.022,
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        },
      });
    });

    /* ---- Single-element scroll reveals ---- */
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      const from = REVEAL_FROM[el.dataset.reveal] || REVEAL_FROM.up;
      const delay = parseFloat(el.dataset.revealDelay) || 0;
      gsap.set(el, from);
      gsap.to(el, {
        ...REVEAL_TO,
        delay,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    /* ---- Staggered group reveals ---- */
    gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
      const from = REVEAL_FROM[group.dataset.revealGroup] || REVEAL_FROM.up;
      const items = gsap.utils.toArray(group.children);
      if (!items.length) return;
      gsap.set(items, from);
      gsap.to(items, {
        ...REVEAL_TO,
        duration: 0.95,
        stagger: 0.12,
        scrollTrigger: { trigger: group, start: "top 88%", once: true },
      });
    });

    /* ---- Scroll parallax ---- */
    gsap.utils.toArray("[data-parallax]").forEach((el) => {
      const amount = parseFloat(el.dataset.parallax) || 60;
      gsap.fromTo(
        el,
        { y: -amount },
        {
          y: amount,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    /* ---- Scroll-linked rotation ---- */
    gsap.utils.toArray("[data-spin]").forEach((el) => {
      const turns = parseFloat(el.dataset.spin) || 0.5;
      gsap.to(el, {
        rotation: 360 * turns,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") || el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    /* ---- Magnetic elements (CTAs) ---- */
    gsap.utils.toArray("[data-magnetic]").forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.35;
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * strength);
        yTo((e.clientY - r.top - r.height / 2) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });

    /* ---- 3D tilt on hover (cards) ---- */
    gsap.utils.toArray("[data-tilt]").forEach((el) => {
      const max = parseFloat(el.dataset.tilt) || 6;
      gsap.set(el, { transformPerspective: 1000 });
      const rxTo = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
      const ryTo = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        ryTo(((e.clientX - r.left) / r.width - 0.5) * max * 2);
        rxTo(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
      };
      const onLeave = () => {
        rxTo(0);
        ryTo(0);
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });

      /* Re-measure once images / fonts have settled. */
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      cleanups.push(() => window.removeEventListener("load", onLoad));
      ScrollTrigger.refresh();
    }

    return () => cleanups.forEach((fn) => fn());
  });
}
