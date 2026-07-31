"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Shareable state for the toys.
 *
 * Read from window.location.search on mount rather than useSearchParams(), so
 * these pages need no Suspense boundary and stay statically renderable; the
 * toys are client-only anyway. Writes go through replaceState, so dragging a
 * slider never pushes history entries or re-runs the router.
 */

export function useInitialParams(): URLSearchParams | null {
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);
  return params;
}

export type ParamValues = Record<string, string | number | null | undefined>;

/** Mirror the given values into the URL, coalesced to one write per frame. */
export function useSyncParams(values: ParamValues, enabled = true) {
  const pending = useRef<number | null>(null);
  const latest = useRef(values);
  latest.current = values;

  useEffect(() => {
    if (!enabled) return;
    if (pending.current !== null) cancelAnimationFrame(pending.current);
    pending.current = requestAnimationFrame(() => {
      pending.current = null;
      const next = new URLSearchParams();
      for (const [k, v] of Object.entries(latest.current)) {
        if (v === null || v === undefined || v === "") continue;
        next.set(k, String(v));
      }
      const qs = next.toString();
      const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(null, "", url);
    });
    return () => {
      if (pending.current !== null) cancelAnimationFrame(pending.current);
      pending.current = null;
    };
  }, [values, enabled]);
}

/** Round-trip safe number parsing, clamped to the control's own range. */
export function numParam(
  params: URLSearchParams | null,
  key: string,
  fallback: number,
  min?: number,
  max?: number,
): number {
  const raw = params?.get(key);
  if (raw === null || raw === undefined) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  if (min !== undefined && n < min) return min;
  if (max !== undefined && n > max) return max;
  return n;
}

export function useCopy(resetAfter = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Clipboard is blocked in some embedded contexts; fall back to select-all.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetAfter);
    },
    [resetAfter],
  );

  return { copy, copied };
}

/** Absolute URL for the current view, for the Copy-link button. */
export const currentUrl = () =>
  typeof window === "undefined" ? "" : window.location.href;
