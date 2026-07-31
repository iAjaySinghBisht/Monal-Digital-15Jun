"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/useUiAnimations";

/* Minimalist cursor — a single ink dot that softly trails the pointer and
   blooms (to brand purple, via the .cursor-dot--hover CSS rule) over any
   interactive element. Colour is handled entirely in globals.css. */

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Skip entirely on touch / coarse-pointer devices and when the user
       has asked for reduced motion — fall back to the native cursor. */
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || prefersReducedMotion()) return;

    const dot = dotRef.current;
    if (!dot) return;
    document.body.classList.add("has-custom-cursor");

    /* Target = real mouse position. The dot lerps toward it for a soft trail. */
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let visible = false;
    let raf = 0;

    const handleMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible) {
        visible = true;
        dot.classList.add("is-visible");
      }

      const target = e.target as Element;
      /* The cursor's SHAPE reports whether a thing is open to you, which is
         the only distinction that matters on this page. Growing over
         anything clickable said "something is here" without saying what,
         so a venture you can visit and one that ships in 2027 looked
         identical until you clicked.

           filled + arrow  you can go here
           hollow ring     real, but not yet
           small dot       everything else

         `soon` is checked first: a not-yet venture is not a link, but if
         one ever became a card-shaped link it should still read as
         pending rather than as open. */
      const soon = target.closest('[data-cursor="soon"]');
      const interactive =
        !soon &&
        target.closest(
          'a, button, [role="button"], input, textarea, select, label, [data-cursor="grow"]'
        );
      /* Some targets are small drawings you aim INTO rather than buttons
         you land on. There the cursor has to get out of the way. */
      const fine = target.closest('[data-cursor="fine"]');

      dot.classList.toggle("cursor-dot--hover", Boolean(interactive && !fine));
      dot.classList.toggle("cursor-dot--soon", Boolean(soon && !fine));
      dot.classList.toggle("cursor-dot--fine", Boolean(fine));

      /* The ink dot vanishes against dark sections (footer, service page
         heroes). Over any .bg-ink surface, switch it to brand purple. */
      const onDark = target.closest(".bg-ink, .bg-black");
      dot.classList.toggle("cursor-dot--dark", Boolean(onDark));

      /* A purple cursor over a PURPLE button is invisible — the "Build
         With Monal" CTA swallowed it whole. Over any surface already
         carrying a brand fill, invert: white disc, brand-coloured arrow.
         Checked on the interactive element itself, since that is the
         thing whose background the cursor sits on. */
      const onBrand =
        interactive &&
        (interactive.closest(".btn-royal, .btn-sun, .bg-royal, .bg-sun") ||
          interactive.matches(".btn-royal, .btn-sun, .bg-royal, .bg-sun"));
      dot.classList.toggle("cursor-dot--invert", Boolean(onBrand));
    };

    const handleLeave = () => {
      visible = false;
      dot.classList.remove("is-visible");
    };

    const handleDown = () => dot.classList.add("cursor-dot--down");
    const handleUp = () => dot.classList.remove("cursor-dot--down");

    const render = () => {
      x += (mouseX - x) * 0.22;
      y += (mouseY - y) * 0.22;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
};

export default CustomCursor;
