import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow, Pill } from "./Decor";
import { prefersReducedMotion } from "../hooks/useUiAnimations";
import baby from "../assets/BABY.png";
import bunty from "../assets/BUNTY.png";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const VIDEO_SRC = "/showreel/Showreel.mp4";
const VIDEO_POSTER = "/showreel/Showreel-poster.webp";

const Hero = () => {
  const rootRef = useRef(null);
  const slotRef = useRef(null); // in-flow placeholder that reserves the video's resting box
  const stageRef = useRef(null); // the actual video layer that expands to full-screen
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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

  /* The video layer (stageRef) is absolutely positioned inside the hero
     section and sits exactly over its in-flow placeholder (slotRef) at
     rest. On scroll the hero pins and a scrubbed timeline grows the layer
     from that resting box to cover the whole section (= full viewport),
     then releases so it scrolls away naturally. */
  useGSAP(
    () => {
      const root = rootRef.current;
      const slot = slotRef.current;
      const stage = stageRef.current;
      if (!root || !slot || !stage) return;

      /* Resting box of the video, measured relative to the section. */
      const restBox = () => {
        const s = root.getBoundingClientRect();
        const c = slot.getBoundingClientRect();
        return {
          top: c.top - s.top,
          left: c.left - s.left,
          width: c.width,
          height: c.height,
        };
      };

      const placeAtRest = () => {
        const r = restBox();
        gsap.set(stage, {
          position: "absolute",
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
          borderRadius: 28,
          autoAlpha: 1,
        });
      };

      placeAtRest();

      if (prefersReducedMotion()) {
        const onResize = () => placeAtRest();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=130%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        stage,
        {
          top: () => restBox().top,
          left: () => restBox().left,
          width: () => restBox().width,
          height: () => restBox().height,
          borderRadius: 28,
        },
        {
          top: 0,
          left: 0,
          width: () => root.offsetWidth,
          height: () => root.offsetHeight,
          borderRadius: 0,
          ease: "none",
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative bg-paper overflow-hidden min-h-svh flex flex-col pt-24 md:pt-28 pb-8 md:pb-12"
    >
      <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

      <div className="relative max-w-325 mx-auto px-6 md:px-12 w-full flex flex-col flex-1 justify-center">
        {/* Headline */}
        <div className="flex flex-col items-center text-center">
          <div data-reveal="up" className="mb-6">
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
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            <Pill as={Link} to="/#work" variant="dark">
              View our work
            </Pill>
            <Pill as={Link} to="/#services" variant="outline" withArrow={false}>
              Explore services
            </Pill>
          </div>
        </div>

        {/* Bento row — small square side boxes + the video placeholder.
            Reveal is applied to the side boxes only (not the group) so the
            video placeholder is never transformed — keeping the expanding
            video layer perfectly aligned to it. */}
        <div className="mt-12 md:mt-16 flex flex-col lg:flex-row gap-4 md:gap-5 lg:items-end">
          {/* Left — small square, lavender, Baby pops out of an inner card */}
          <div
            data-reveal="up"
            data-tilt="4"
            className="group card card-hover bg-sun-soft border-transparent relative overflow-visible shrink-0 hidden lg:block lg:w-[25vh] lg:h-[21vh] p-4"
          >
            <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] h-[72%] rounded-full bg-white blur-2xl opacity-0 transition-opacity duration-[800ms] ease-out group-hover:opacity-70" />
            <img
              src={baby}
              alt="Monal character"
              loading="lazy"
              draggable="false"
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-[155%] w-auto max-w-none object-contain z-10 drop-shadow-[0_24px_30px_rgba(24,24,27,0.28)] transition-[transform,filter] duration-[800ms] ease-out group-hover:-translate-y-2 group-hover:scale-[1.1] group-hover:drop-shadow-[0_44px_56px_rgba(24,24,27,0.4)]"
            />
          </div>

          {/* Center — in-flow placeholder reserving the video's resting box */}
          <div
            ref={slotRef}
            className="card flex-1 relative overflow-hidden min-h-72 lg:h-[40vh] lg:max-h-[27rem] bg-ink"
            aria-hidden="true"
          />

          {/* Right — small square, yellow, Bunty pops out of an inner card */}
          <div
            data-reveal="up"
            data-reveal-delay="0.1"
            data-tilt="4"
            className="group card card-hover bg-sky border-transparent relative overflow-visible shrink-0 hidden lg:block lg:w-[25vh] lg:h-[21vh] p-4"
          >
            <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] h-[72%] rounded-full bg-white blur-2xl opacity-0 transition-opacity duration-[800ms] ease-out group-hover:opacity-70" />
            <img
              src={bunty}
              alt="Monal character"
              loading="lazy"
              draggable="false"
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-[155%] w-auto max-w-none object-contain z-10 drop-shadow-[0_24px_30px_rgba(24,24,27,0.28)] transition-[transform,filter] duration-[800ms] ease-out group-hover:-translate-y-2 group-hover:scale-[1.1] group-hover:drop-shadow-[0_44px_56px_rgba(24,24,27,0.4)]"
            />
          </div>
        </div>
      </div>

      {/* Expanding video layer — overlays the placeholder, grows on scroll */}
      <div
        ref={stageRef}
        className="absolute z-50 overflow-hidden bg-ink opacity-0 shadow-[0_30px_60px_-44px_rgba(24,24,27,0.5)] will-change-[top,left,width,height]"
      >
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
    </section>
  );
};

export default Hero;
