import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UiAnimations from "@/components/UiAnimations";
import { Eyebrow, ArrowGlyph } from "@/components/Decor";
import WorkShowcase from "@/components/WorkShowcase";
import { projects } from "@/data/constants";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Explore Monal Digital's portfolio of animated brands, original IPs and children's content enjoyed by families across the globe.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Our Work | Monal Digital",
    description:
      "Explore Monal Digital's portfolio of animated brands, original IPs and children's content enjoyed by families across the globe.",
    url: "/work",
  },
};

export default function WorkPage() {
  return (
    <>
      <UiAnimations />
      <Header />

      {/* Hero */}
      <section className="relative bg-black text-paper overflow-hidden">
        <div className="absolute inset-0 bg-dots-light opacity-50 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

        <div className="absolute top-28 md:top-32 left-6 md:left-12 z-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors"
          >
            <ArrowGlyph className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
            Back home
          </Link>
        </div>

        <div className="relative max-w-325 mx-auto px-6 md:px-12 pt-40 md:pt-48 pb-16 md:pb-24 text-center">
          <div data-reveal="up" className="mb-6 flex justify-center">
            <Eyebrow tone="dark">The full catalog</Eyebrow>
          </div>
          <h1
            data-split
            className="font-display text-[clamp(2.8rem,11vw,8.5rem)] leading-[0.9] tracking-[-0.04em]"
          >
            Our Work.
          </h1>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="mt-7 text-white/60 text-lg leading-relaxed max-w-xl mx-auto"
          >
            Original IPs, co-productions, and series. Every story we&apos;ve had
            the privilege to bring to life.
          </p>
        </div>
      </section>

      {/* The catalogue, one title per full-bleed band. See the note at the
          top of components/WorkShowcase.tsx for why this is not a grid. */}
      <WorkShowcase projects={projects} />

      {/* The showcase runs straight into the footer, which carries the
          page's ask. The closing "Start a project" block that used to sit
          here has gone: it repeated the footer's own CTA a screen above
          it. */}
      <Footer />
    </>
  );
}
