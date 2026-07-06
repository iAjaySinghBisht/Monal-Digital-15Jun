import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UiAnimations from "@/components/UiAnimations";
import { Eyebrow, ArrowGlyph, ArrowUpRight } from "@/components/Decor";
import { services } from "@/data/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "End-to-end animation services from Monal Digital — pre-production, production, and distribution & growth.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Monal Digital",
    description:
      "End-to-end animation services from Monal Digital — pre-production, production, and distribution & growth.",
    url: "/services",
  },
};

/* Stable display order, matching the service detail pages. */
const ORDER = ["pre", "production", "distribution"] as const;

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
            <Eyebrow tone="dark" dot="bg-violet">What we do</Eyebrow>
          </div>
          <h1
            data-split
            className="font-display text-[clamp(2.8rem,11vw,8.5rem)] leading-[0.9] tracking-[-0.04em]"
          >
            Services.
          </h1>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="mt-7 text-white/60 text-lg leading-relaxed max-w-xl mx-auto"
          >
            From the first spark of an idea to a finished series reaching
            millions — end-to-end animation, handled under one roof.
          </p>
        </div>
      </section>

      {/* Service cards */}
      <section className="relative bg-paper py-16 md:py-24">
        <div className="max-w-325 mx-auto px-6 md:px-12">
          <div
            data-reveal-group="up"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
          >
            {ORDER.map((key) => {
              const s = services[key];
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  data-tilt="4"
                  className="group card card-hover flex flex-col p-7 md:p-8"
                >
                  <span className="grid place-items-center w-14 h-14 rounded-2xl font-display text-xl text-ink bg-lav transition-colors duration-300 group-hover:bg-royal group-hover:text-white">
                    {s.number}
                  </span>

                  <h2 className="mt-7 font-display text-ink text-2xl md:text-[1.7rem] leading-tight">
                    {s.title}
                  </h2>
                  <p className="mt-1.5 text-royal font-medium">{s.tagline}</p>
                  <p className="mt-4 text-muted leading-relaxed">{s.desc}</p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    Explore
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
