import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UiAnimations from "@/components/UiAnimations";
import { Eyebrow, ArrowGlyph, ArrowUpRight } from "@/components/Decor";
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

      {/* The way out. The showcase ends on a light band, so this closes on
          the same surface rather than starting a new one. */}
      <section className="relative bg-paper border-t border-line py-16 md:py-24">
        <div className="mx-auto max-w-325 px-6 md:px-12 flex flex-col items-center gap-5 text-center">
          <p data-reveal="up" className="text-muted max-w-lg leading-relaxed">
            Building something for kids — a show, a game, a learning tool? We
            would like to hear about it.
          </p>
          <Link
            href="/contact-us"
            data-magnetic="0.25"
            data-reveal="up"
            data-reveal-delay="0.1"
            className="btn btn-primary group"
          >
            Start a project
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
