import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UiAnimations from "@/components/UiAnimations";
import { Eyebrow, ArrowGlyph, ArrowUpRight } from "@/components/Decor";
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
            <Eyebrow tone="dark" dot="bg-violet">The full catalog</Eyebrow>
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

      {/* Gallery */}
      <section className="relative bg-paper py-16 md:py-24">
        <div className="max-w-325 mx-auto px-6 md:px-12">
          <div
            data-reveal-group="up"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          >
            {projects.map((p, i) => (
              <article key={p.title} data-tilt="5" className="group cursor-pointer">
                <div className="relative aspect-2/3 rounded-[24px] overflow-hidden border border-line bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-transparent" />

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-paper text-ink flex items-center justify-center text-[10px] font-bold z-10">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-5 text-paper z-10 flex items-end justify-between gap-3">
                    <h3 className="font-display text-[clamp(1.5rem,4vw,2.6rem)] leading-[1.05] tracking-tight">
                      {p.title}
                    </h3>
                    <span className="shrink-0 w-9 h-9 grid place-items-center rounded-full bg-paper text-ink translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
