import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Eyebrow, Pill } from "./Decor";
import { prefersReducedMotion } from "../hooks/useUiAnimations";
import baby from "../assets/BABY.png";
import bunty from "../assets/BUNTY.png";

gsap.registerPlugin(useGSAP);

const VIDEO_SRC = "/showreel/Showreel.mp4";
const VIDEO_POSTER = "/showreel/Showreel-poster.webp";

const Hero = () => {
  const videoRef = useRef(null);
  const distantRangeRef = useRef(null);
  const midRangeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  /* On load the two back ranges rise up out of the front foothills into
     their resting positions, as if emerging from behind the front mountain. */
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(midRangeRef.current, {
      y: 230,
      autoAlpha: 0,
      duration: 1.1,
      ease: "power3.out",
      delay: 0.15,
    });
    gsap.from(distantRangeRef.current, {
      y: 340,
      autoAlpha: 0,
      duration: 1.3,
      ease: "power3.out",
      delay: 0.3,
    });
  }, []);

  React.useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else videoRef.current?.requestFullscreen?.();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  return (
    <>
      {/* Hero — heading, description and buttons only */}
      <section
        id="home"
        className="relative bg-paper overflow-hidden min-h-svh flex flex-col items-center justify-center text-center pt-24 md:pt-28 pb-8 md:pb-12"
      >
        <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

        {/* Layered mountain range at the bottom — overlapping brand-purple peaks,
            fading up into the paper background (mirrors the footer). */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-[62%] [mask-image:linear-gradient(to_top,#000_60%,transparent)]"
        >
          {/* Extra light — distant range, tallest peaks */}
          <path
            ref={distantRangeRef}
            d="M0,520 L0,340 L240,180 L480,300 L720,100 L960,280 L1200,160 L1440,300 L1440,520 Z"
            fill="#8b7cff"
            fillOpacity="0.14"
          />
          {/* Light — mid range, peaks offset to sit in the valleys above */}
          <path
            ref={midRangeRef}
            d="M0,520 L0,400 L360,260 L720,380 L1080,240 L1440,380 L1440,520 Z"
            fill="#6c4df6"
            fillOpacity="0.2"
          />
          {/* Dark — nearest range, lowest foothills */}
          <path
            d="M0,520 L0,460 L300,400 L600,470 L900,400 L1200,470 L1440,420 L1440,520 Z"
            fill="#322B80"
            fillOpacity="0.92"
          />
        </svg>

        <div className="relative max-w-325 mx-auto px-6 md:px-12 w-full flex flex-col items-center text-center">
          <div data-reveal="up" className="mb-8 md:mb-9">
            <Eyebrow dot="bg-royal">From Uttarakhand. For the World.</Eyebrow>
          </div>

          <h1
            data-reveal="up"
            data-reveal-delay="0.08"
            className="font-display font-normal text-ink leading-[1.04] tracking-[-0.02em] text-[clamp(2.2rem,6.2vw,4.6rem)] max-w-4xl"
          >
            Crafting Thoughtful Experiences for <span className="mark-violet">Kids</span>.
          </h1>

          <p
            data-reveal="up"
            data-reveal-delay="0.16"
            className="mt-5 text-muted text-base md:text-lg leading-relaxed max-w-xl"
          >
            A creative studio crafting animation, original IPs and the children&apos;s brands families watch around the world.
          </p>

          <div
            data-reveal="up"
            data-reveal-delay="0.24"
            className="mt-9 md:mt-11 flex flex-wrap items-center justify-center gap-3"
          >
            <Pill as={Link} to="/#work" variant="dark">
              View our work
            </Pill>
            <Pill as={Link} to="/#services" variant="outline" withArrow={false}>
              Explore services
            </Pill>
          </div>
        </div>
      </section>

      {/* Showreel — large video card with the two characters poking out of its corners */}
      <section className="relative bg-paper overflow-hidden min-h-svh flex flex-col justify-center py-12 md:py-20">
        <div className="relative max-w-325 mx-auto px-6 md:px-12 w-full">
          {/* Section header — eyebrow, heading and intro above the video card */}
          <div className="mb-10 md:mb-14 flex flex-col items-center text-center">
            <div data-reveal="up">
              <Eyebrow dot="bg-sun">Watch</Eyebrow>
            </div>
            <h2
              data-split
              data-reveal-delay="0.08"
              className="mt-6 font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[0.98] max-w-3xl"
            >
              Our <span className="mark-sun">Showreel</span>.
            </h2>
            <p
              data-reveal="up"
              data-reveal-delay="0.16"
              className="mt-5 text-muted text-base md:text-lg leading-relaxed max-w-xl"
            >
              A peek at the worlds, characters and stories we bring to life for kids everywhere.
            </p>
          </div>

          {/* Wrapper is the positioning context for the corner characters and the video.
              overflow-visible lets the characters spill past the card edges. */}
          <div className="relative overflow-visible">
            {/* Characters poking out of the corners */}
            <div className="pointer-events-none">
              <img
                src={baby}
                alt="Monal character"
                loading="lazy"
                draggable="false"
                className="absolute z-[60] -top-12 -left-4 md:-top-20 md:-left-10 h-[18vh] md:h-[26vh] w-auto max-w-none object-contain drop-shadow-[0_28px_36px_rgba(24,24,27,0.34)]"
              />
              <img
                src={bunty}
                alt="Monal character"
                loading="lazy"
                draggable="false"
                className="absolute z-[60] -bottom-12 -right-4 md:-bottom-20 md:-right-10 h-[18vh] md:h-[26vh] w-auto max-w-none object-contain drop-shadow-[0_28px_36px_rgba(24,24,27,0.34)]"
              />
            </div>

            {/* Video card — fixed resting size, no scroll expansion */}
            <div className="card relative overflow-hidden w-full h-[52vh] md:h-[64vh] lg:max-h-[42rem] bg-ink shadow-[0_30px_60px_-44px_rgba(24,24,27,0.5)]">
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
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />

              <div className="absolute top-5 left-5 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 border border-white/20 backdrop-blur-md text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-royal animate-pulse-dot" />
                Showreel
              </div>

              <div className="absolute bottom-0 inset-x-0 px-5 md:px-7 py-5 flex items-end justify-between gap-3 bg-linear-to-t from-black/70 to-transparent">
                <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-white/90 hover:bg-white hover:text-ink transition-colors"
            >
              {isMuted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-white/90 hover:bg-white hover:text-ink transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" />
              </svg>
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
