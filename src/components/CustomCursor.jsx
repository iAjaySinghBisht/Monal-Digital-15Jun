import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../hooks/useUiAnimations";

/* Minimalist cursor — a single ink dot that softly trails the pointer and
   blooms (to brand purple, via the .cursor-dot--hover CSS rule) over any
   interactive element. Colour is handled entirely in index.css. */

const CustomCursor = () => {
  const dotRef = useRef(null);

  useEffect(() => {
    /* Skip entirely on touch / coarse-pointer devices and when the user
       has asked for reduced motion — fall back to the native cursor. */
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || prefersReducedMotion()) return;

    const dot = dotRef.current;
    document.body.classList.add("has-custom-cursor");

    /* Target = real mouse position. The dot lerps toward it for a soft trail. */
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let visible = false;
    let raf;

    const handleMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible) {
        visible = true;
        dot.classList.add("is-visible");
      }

      /* Grow the dot over clickable elements for an interactive feel. */
      const interactive = e.target.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor="grow"]'
      );
      dot.classList.toggle("cursor-dot--hover", Boolean(interactive));

      /* The ink dot vanishes against dark sections (footer, service page
         heroes). Over any .bg-ink surface, switch it to brand purple. */
      const onDark = e.target.closest(".bg-ink, .bg-black");
      dot.classList.toggle("cursor-dot--dark", Boolean(onDark));
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
