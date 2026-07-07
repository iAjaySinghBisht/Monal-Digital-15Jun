"use client";

import { useRef, useState } from "react";
import { Eyebrow } from "./Decor";

const VIDEO_SRC = "/showreel/Showreel.mp4";
const VIDEO_POSTER = "/showreel/Showreel-poster.webp";

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
      className="relative bg-paper h-svh min-h-150 flex flex-col p-3 md:p-4"
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

        {/* Mute / unmute (top-right — offset down on mobile to clear the nav) */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="absolute top-20 right-5 md:top-7 md:right-7 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-white hover:bg-white hover:text-ink transition-colors"
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

        {/* Headline (bottom-left corner) */}
        <div className="absolute bottom-7 left-6 md:bottom-11 md:left-11 z-10 max-w-4xl pr-6">
          <div data-reveal="up" className="mb-4 md:mb-5">
            <Eyebrow tone="dark" dot="bg-sun">From Uttarakhand. For the World.</Eyebrow>
          </div>
          <h1
            data-reveal="up"
            data-reveal-delay="0.08"
            className="font-display font-normal leading-none tracking-[-0.02em] text-[clamp(2rem,5vw,4.4rem)] drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          >
            Crafting Thoughtful Experiences For Kids.
          </h1>
          <p
            data-reveal="up"
            data-reveal-delay="0.16"
            className="mt-4 md:mt-5 text-white/80 text-base md:text-lg leading-relaxed md:whitespace-nowrap drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
          >
            Monal builds worlds for kids: videos, games, learning &amp; friendly AI.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
