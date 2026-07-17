"use client";

import { useRef, useState } from "react";
import { Eyebrow } from "./Decor";
import { stats } from "@/data/constants";

const VIDEO_SRC = "/showreel/Showreel.mp4";
const VIDEO_POSTER = "/showreel/Showreel-poster.webp";

/* Proof of scale, stated before anything is asked of the visitor.
   Figures come from data/constants.ts; only the labels live here. */
const STATS: { n: string; suffix: string; label: string }[] = [
  { ...stats.views, label: "Views" },
  { ...stats.subscribers, label: "Subscribers" },
  { ...stats.channels, label: "YouTube Channels" },
  { ...stats.years, label: "Years in Kids' Media" },
];

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  return (
    <section
      id="home"
      className="relative bg-paper h-svh min-h-165 flex flex-col p-3 md:p-4"
    >
      {/* Big rounded video container — starts from the top of the screen */}
      <div className="relative flex-1 w-full overflow-hidden rounded-3xl md:rounded-[38px] bg-ink text-white border border-line shadow-[0_40px_90px_-55px_rgba(24,24,27,0.55)]">
        {/* Showreel video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={VIDEO_SRC}
          poster={VIDEO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />

        {/* Legibility overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent pointer-events-none" />

        {/* Mute / unmute (top-right — the bottom band now holds the stat strip,
            and this sits clear of the fixed nav so it stays clickable) */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="absolute top-24 right-5 md:top-28 md:right-7 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-white hover:bg-white hover:text-ink transition-colors"
        >
          {isMuted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>

        {/* Story block + proof strip, anchored to the bottom of the card */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-11 pb-6 md:pb-9">
          <div className="max-w-4xl pr-6">
            <div data-reveal="up" className="mb-4 md:mb-5">
              <Eyebrow tone="dark" dot="bg-sun">From the Himalayas. For the World.</Eyebrow>
            </div>
            <h1
              data-reveal="up"
              data-reveal-delay="0.08"
              className="font-display font-normal leading-none tracking-[-0.02em] text-[clamp(2rem,5vw,4.4rem)] drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            >
              Crafting Thoughtful Experiences for Kids.
            </h1>
            <p
              data-reveal="up"
              data-reveal-delay="0.16"
              className="mt-4 md:mt-5 text-white/80 text-base md:text-lg leading-relaxed max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
            >
              Through stories, characters, games, AI and learning experiences that
              spark curiosity, nurture creativity and inspire kindness.
            </p>
          </div>

          {/* Supporting evidence, not a second headline — kept well under the
              h1's weight so it reads as proof caught on the way past. */}
          <div
            data-reveal="up"
            data-reveal-delay="0.24"
            className="mt-6 md:mt-8 pt-4 md:pt-5 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-white/90 text-xl md:text-2xl leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                  <span data-counter={s.n} data-counter-suffix={s.suffix}>
                    {s.n}
                    {s.suffix}
                  </span>
                </div>
                <div className="mt-1.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
