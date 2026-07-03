"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import { Eyebrow, Pill, ArrowGlyph } from "./Decor";
import type { Service, ServiceDetailItem } from "@/data/constants";

/* A single expandable discipline row. Uses the CSS grid-rows
   0fr → 1fr trick for a smooth, height-agnostic open/close. */
const DisciplineRow = ({
  index,
  item,
  isOpen,
  onToggle,
}: {
  index: number;
  item: ServiceDetailItem;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div
    data-reveal="up"
    className={`group border-b border-line transition-colors duration-300 ${
      isOpen ? "bg-mist" : "hover:bg-mist/60"
    }`}
  >
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center gap-5 md:gap-8 text-left py-6 md:py-8 px-4 md:px-7"
    >
      <span
        className={`font-display text-xl md:text-2xl tabular-nums shrink-0 transition-colors duration-300 ${
          isOpen ? "text-royal" : "text-muted group-hover:text-ink"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3
        className={`flex-1 font-display tracking-tight leading-none text-2xl md:text-[2.2rem] transition-colors duration-300 ${
          isOpen ? "text-ink" : "text-ink/80 group-hover:text-ink"
        }`}
      >
        {item.name}
      </h3>

      <span
        className={`shrink-0 grid place-items-center w-11 h-11 md:w-12 md:h-12 rounded-full border transition-all duration-300 ${
          isOpen
            ? "bg-sun border-sun text-ink rotate-45"
            : "border-line text-ink group-hover:border-ink"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4 md:w-5 md:h-5">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
    </button>

    <div
      className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.65,0,.2,1)] ${
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <p className="text-muted text-base md:text-lg leading-relaxed pb-8 pl-[3.4rem] md:pl-[5.3rem] pr-4 md:pr-20 max-w-3xl">
          {item.desc}
        </p>
      </div>
    </div>
  </div>
);

export default function ServiceDetailBody({
  service,
  prev,
  next,
}: {
  service: Service;
  prev: Service;
  next: Service;
}) {
  const [open, setOpen] = useState(0);

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative bg-black text-paper overflow-hidden">
        <div className="absolute inset-0 bg-dots-light opacity-50 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

        <div className="absolute top-28 md:top-32 left-6 md:left-12 z-10">
          <Link
            href="/#services"
            className="group inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors"
          >
            <ArrowGlyph className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
            All Services
          </Link>
        </div>

        <div className="relative max-w-325 mx-auto px-6 md:px-12 pt-40 md:pt-48 pb-16 md:pb-24 text-center">
          <div data-reveal="up" className="mb-6 flex justify-center">
            <Eyebrow tone="dark" dot="bg-sun">
              {service.number} · {service.eyebrow}
            </Eyebrow>
          </div>

          <h1
            data-split
            className="font-display text-[clamp(2.4rem,8vw,6rem)] leading-[0.92] tracking-[-0.04em] mx-auto max-w-4xl"
          >
            {service.title}
          </h1>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="mt-6 text-white/55 text-lg leading-relaxed max-w-xl mx-auto"
          >
            {service.tagline}
          </p>
        </div>
      </section>

      {/* Disciplines accordion */}
      <section className="relative bg-paper py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p
            data-reveal="up"
            className="text-center text-muted text-lg md:text-xl leading-relaxed mb-12 md:mb-16"
          >
            {service.intro}
          </p>

          <div className="border-t border-line">
            {service.detail.map((item, i) => (
              <DisciplineRow
                key={item.name}
                index={i}
                item={item}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>

          <div data-reveal="up" className="mt-14 flex justify-center">
            <Pill as={Link} href="/#contact" variant="dark">
              Discuss a project
            </Pill>
          </div>
        </div>
      </section>

      {/* Prev / Next */}
      <section className="relative bg-ink text-paper">
        <div className="grid sm:grid-cols-2">
          <Link
            href={`/services/${prev.slug}`}
            className="group relative overflow-hidden flex flex-col justify-center gap-4 px-6 md:px-12 py-12 md:py-16 border-b sm:border-b-0 sm:border-r border-white/10 transition-colors hover:bg-white/[0.03]"
          >
            <span className="relative flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45 group-hover:text-sun transition-colors">
              <ArrowGlyph className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1.5" />
              Previous
            </span>
            <span className="relative flex items-baseline gap-4">
              <span className="font-display text-xl md:text-2xl tabular-nums text-white/25">
                {prev.number}
              </span>
              <span className="font-display text-3xl md:text-[2.4rem] leading-none tracking-tight group-hover:text-sun transition-colors">
                {prev.eyebrow}
              </span>
            </span>
          </Link>

          <Link
            href={`/services/${next.slug}`}
            className="group relative overflow-hidden flex flex-col justify-center items-end text-right gap-4 px-6 md:px-12 py-12 md:py-16 transition-colors hover:bg-white/[0.03]"
          >
            <span className="relative flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45 group-hover:text-sun transition-colors">
              Next
              <ArrowGlyph className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </span>
            <span className="relative flex items-baseline gap-4">
              <span className="font-display text-3xl md:text-[2.4rem] leading-none tracking-tight group-hover:text-sun transition-colors">
                {next.eyebrow}
              </span>
              <span className="font-display text-xl md:text-2xl tabular-nums text-white/25">
                {next.number}
              </span>
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
