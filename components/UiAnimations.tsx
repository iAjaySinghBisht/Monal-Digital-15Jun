"use client";

import { useUiAnimations } from "@/hooks/useUiAnimations";

/* Mounts the data-attribute driven scroll/interaction engine (panel reveals,
   counters, magnetic CTAs, tilts) for the page it's dropped into. Renders
   nothing — it only scans the DOM for the animation data-attributes. */
export default function UiAnimations() {
  useUiAnimations();
  return null;
}
