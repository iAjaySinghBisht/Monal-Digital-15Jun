"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 *  GrowingFrond — tap to grow.
 *
 *  A recursive frond that adds one more level of branching every time a
 *  child taps it, up to a limit, then resets. It is the one thing on the
 *  page a child can actually do, and what it teaches is the idea the
 *  whole site is built on: the same small shape, repeated inside itself.
 *
 *  Drawn as SVG (not canvas) so each branch is a real element that can
 *  be transitioned, and so the whole thing stays crisp at any size.
 * ------------------------------------------------------------------ */

import type { CSSProperties } from "react";
import {
  BASE_Y,
  type Branch,
  grow,
  H,
  MAX_DEPTH,
  MIN_DEPTH,
  W,
} from "@/lib/frond";

/* Die-back timing. Shared by the keyframe call site and the timeout that
   swaps the plant back, so the two can never drift apart. */
const WITHER_MS = 430;
const WITHER_STAGGER = 24;

/* Both sway groups pivot at the foot of the trunk, in the SVG's own
   coordinates — `fill-box` would measure the group's bounding box instead
   and swing the plant about its middle. */
const pivot = (animation: string): CSSProperties => ({
  transformBox: "view-box",
  transformOrigin: `${W / 2}px ${BASE_Y}px`,
  animation: `${animation} ease-in-out infinite`,
});


export default function GrowingFrond({
  tone = "var(--color-leaf)",
  className = "",
}: {
  tone?: string;
  className?: string;
}) {
  const [depth, setDepth] = useState(MIN_DEPTH);
  const [branches, setBranches] = useState<Branch[]>(() => grow(MIN_DEPTH));
  /* Set for one beat when the plant wraps, so the reset can be a wither
     rather than a cut. */
  const [withering, setWithering] = useState(false);
  const liveRef = useRef<HTMLParagraphElement | null>(null);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heldRef = useRef(false);

  useEffect(() => {
    setBranches(grow(depth));
  }, [depth]);

  const atFull = depth >= MAX_DEPTH;

  /* Growing is one step; wrapping is not. Going from a full plume straight
     back to a sapling in a single frame read as a glitch, so the wrap
     withers first and regrows from the stump a beat later. */
  const advance = () => {
    setDepth((d) => {
      if (d < MAX_DEPTH) return d + 1;
      setWithering(true);
      /* Must outlast the whole die-back, or the plant is swapped out
         mid-retraction and the wither is never seen. The longest branch
         waits WITHER_STAGGER * MAX_DEPTH before it starts, then runs for
         WITHER_MS — an earlier 260ms cut the trunk off before it had
         begun. */
      window.setTimeout(() => {
        setWithering(false);
        setDepth(MIN_DEPTH);
      }, WITHER_MS + WITHER_STAGGER * MAX_DEPTH + 40);
      return d;
    });
  };

  /* Hold to keep growing. Tapping is the obvious gesture for one more
     level, but "keep going" is a hold — so a press that lingers past the
     first beat keeps advancing on its own. */
  const startHold = () => {
    heldRef.current = false;
    holdRef.current = setInterval(() => {
      heldRef.current = true;
      setDepth((d) => (d < MAX_DEPTH ? d + 1 : d));
    }, 420);
  };
  const endHold = () => {
    if (holdRef.current) clearInterval(holdRef.current);
    holdRef.current = null;
  };
  useEffect(() => endHold, []);

  /* A hold ends with a click event too; without this the release would
     add one more level on top of the ones the hold already added. */
  const onClick = () => {
    if (heldRef.current) {
      heldRef.current = false;
      return;
    }
    advance();
  };

  return (
    <div className={`flex flex-col items-center gap-5 ${className}`}>
      <button
        type="button"
        onClick={onClick}
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        onPointerCancel={endHold}
        aria-label={
          atFull
            ? "The frond is fully grown. Tap to start again."
            : `Grow the frond. Level ${depth} of ${MAX_DEPTH}.`
        }
        /* `fine`: the cursor shrinks to a small ring here instead of the
           38px disc, which otherwise sits on top of the plant you are
           growing and hides the very thing that changes. */
        data-cursor="fine"
        className="group relative grid place-items-center rounded-[32px] border transition-transform duration-300 hover:-translate-y-1 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{
          borderColor: "var(--color-line)",
          background: "var(--color-mist)",
          width: W,
          height: H,
          outlineColor: tone,
        }}
      >
        {/* WIND.
            Rotating each branch about its own base cannot work: the
            branches are a flat list of siblings, so a child never inherits
            its parent's turn and the plant comes apart instead of bending.
            And the amplitude that looked safe on paper — under a degree —
            moved an 8px twig by a TENTH OF A PIXEL. It was not subtle, it
            was absent.

            So the sway lives on two nested groups, both pivoting at the
            foot of the trunk. The outer one leans the whole plant; the
            inner one carries everything above the first fork and adds its
            own, slower turn on top. Nested transforms compound, so the
            crown travels about twice as far as the stem — which is what a
            plant in light wind actually does. */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <g style={pivot("frond-sway-stem 7.5s")}>
            <g style={pivot("frond-sway-crown 10.5s")}>
          {branches.map((b, i) => {
            const len = Math.hypot(b.x2 - b.x1, b.y2 - b.y1);
            /* Age reads as colour, and the range now starts DARK. The first
               generation is old wood — the tone taken most of the way to its
               deep sibling — and each generation out is mixed further toward
               a young, light green. Previously the trunk was already the
               light leaf tone, so there was nowhere left to lighten to. */
            const age = b.d / MAX_DEPTH;
            const stroke = `color-mix(in srgb, ${tone} ${18 + age * 62}%, color-mix(in srgb, #14532d ${Math.round((1 - age) * 100)}%, white))`;

            return (
              <line
                key={`${depth}-${i}`}
                x1={b.x1}
                y1={b.y1}
                x2={b.x2}
                y2={b.y2}
                stroke={stroke}
                strokeWidth={Math.max(1.2, 4.2 - b.d * 0.58)}
                strokeLinecap="round"
                style={{
                  ["--len" as string]: len.toFixed(2),
                  /* Younger growth is lighter, so it gives way further. */
                  ["--droop" as string]: `${(2 + age * 7).toFixed(1)}px`,
                  strokeDasharray: withering ? len.toFixed(2) : undefined,
                  animation: withering
                    ? /* retract into the parent, youngest first */
                      `frond-wither ${WITHER_MS}ms cubic-bezier(.33,0,.32,1) ${(MAX_DEPTH - b.d) * WITHER_STAGGER}ms both`
                    : b.d === depth
                      ? `frond-in 420ms ease-out ${b.d * 70}ms both, frond-breathe 3.4s ease-in-out ${420 + b.d * 70}ms infinite`
                      : `frond-in 420ms ease-out ${b.d * 70}ms both`,
                }}
              />
            );
          })}
            </g>
          </g>
        </svg>

        <span
          className="absolute bottom-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--color-muted)" }}
        >
          {atFull ? "Tap to start again" : "Tap to grow"}
        </span>
      </button>

      {/* Announced for screen readers, since the change is purely visual. */}
      <p ref={liveRef} aria-live="polite" className="sr-only">
        {atFull
          ? `Fully grown. ${MAX_DEPTH} levels of branching.`
          : `Level ${depth} of ${MAX_DEPTH}.`}
      </p>

      <div className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: MAX_DEPTH - MIN_DEPTH + 1 }, (_, i) => (
          <span
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i <= depth - MIN_DEPTH ? 20 : 7,
              background: i <= depth - MIN_DEPTH ? tone : "var(--color-line)",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes frond-in {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: none; }
        }
        /* The wrap. A plant does not blink out — it dies back, tips first,
           each branch drawing in toward the one that carries it. So this
           RETRACTS: the dash offset walks the stroke back into its own root
           while the branch SINKS under its own weight. The caller inverts
           the delay by depth, so the youngest growth goes first.

           Two earlier passes were wrong. The first faded everything at
           once, which read as a layer being switched off. The second
           added a 5deg rotation, which threw the branches sideways — a
           wilting plant gives way DOWNWARD, it does not swing. The droop
           distance is per-branch and scales with age, because the lighter
           young growth is what falls furthest. */
        @keyframes frond-wither {
          0%   { stroke-dashoffset: 0; opacity: 1; translate: 0 0; }
          60%  { opacity: 0.75; }
          100% { stroke-dashoffset: calc(var(--len) * 1px); opacity: 0; translate: 0 var(--droop); }
        }
        /* Only the outermost generation breathes, and barely — enough to
           read as alive from the corner of the eye, not enough to pull
           attention off the copy beside it. */
        @keyframes frond-breathe {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.62; }
        }
        /* Wind. Uses the rotate property rather than transform, so it
           composes with the scale in frond-in instead of overwriting it.
           Amplitude comes from --sway, set per branch and scaled by
           generation, so the crown stirs while the trunk barely moves. */
        @keyframes frond-sway-stem {
          0%, 100% { rotate: -0.7deg; }
          50%      { rotate: 0.7deg; }
        }
        @keyframes frond-sway-crown {
          0%, 100% { rotate: 0.75deg; }
          50%      { rotate: -0.75deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes frond-in { from { opacity: 1 } to { opacity: 1 } }
          @keyframes frond-wither { from { opacity: 1 } to { opacity: 1 } }
          @keyframes frond-breathe { from { opacity: 1 } to { opacity: 1 } }
          @keyframes frond-sway-stem { from { rotate: 0deg } to { rotate: 0deg } }
          @keyframes frond-sway-crown { from { rotate: 0deg } to { rotate: 0deg } }
        }
      `}</style>
    </div>
  );
}
