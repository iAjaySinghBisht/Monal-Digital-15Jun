import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Eyebrow, ArrowGlyph } from "../components/Decor";
import { useUiAnimations } from "../hooks/useUiAnimations";

const AboutUs = () => {
  useUiAnimations();

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative bg-black text-paper overflow-hidden">
        <div className="absolute inset-0 bg-dots-light opacity-50 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

        <div className="absolute top-28 md:top-32 left-6 md:left-12 z-10">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors"
          >
            <ArrowGlyph className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
            Back home
          </Link>
        </div>

        <div className="relative max-w-325 mx-auto px-6 md:px-12 pt-40 md:pt-48 pb-16 md:pb-24 text-center">
          <div data-reveal="up" className="mb-6 flex justify-center">
            <Eyebrow tone="dark" dot="bg-violet">About us</Eyebrow>
          </div>
          <h1
            data-split
            className="font-display text-[clamp(2.8rem,11vw,8.5rem)] leading-[0.9] tracking-[-0.04em]"
          >
            About Us.
          </h1>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="mt-7 text-white/60 text-lg leading-relaxed max-w-xl mx-auto"
          >
            A creative studio crafting animation, original IPs and the
            children&apos;s brands families watch around the world.
          </p>
        </div>
      </section>

      {/* Placeholder body — to be detailed later */}
      <section className="relative bg-paper py-16 md:py-24">
        <div className="max-w-325 mx-auto px-6 md:px-12 text-center text-muted">
          More about our story is coming soon.
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutUs;
