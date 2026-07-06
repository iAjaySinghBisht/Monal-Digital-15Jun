import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import UiAnimations from "@/components/UiAnimations";
import { Eyebrow, ArrowGlyph } from "@/components/Decor";

export const metadata: Metadata = {
  title: "Services",
  description:
    "End-to-end animation services from Monal Digital, covering pre-production, production, and distribution & growth.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Monal Digital",
    description:
      "End-to-end animation services from Monal Digital, covering pre-production, production, and distribution & growth.",
    url: "/services",
  },
};

export default function ServicesPage() {
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
            <Eyebrow tone="dark" dot="bg-violet">Services</Eyebrow>
          </div>
          <h1
            data-split
            className="font-display text-[clamp(2.8rem,11vw,8.5rem)] leading-[0.9] tracking-[-0.04em]"
          >
            What We Build.
          </h1>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="mt-7 text-white/60 text-lg leading-relaxed max-w-xl mx-auto"
          >
            Six ventures, one purpose: meaningful experiences that help children
            learn, imagine, and grow.
          </p>
        </div>
      </section>

      {/* Ventures (header lives in the hero above) */}
      <Services showPartners={false} showHeader={false} />

      <Footer />
    </>
  );
}
