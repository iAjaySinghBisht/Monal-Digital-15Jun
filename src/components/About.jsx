import React from "react";
import { Eyebrow } from "./Decor";
import pearl from "../assets/Pearl.png";

const FEATURE_IMG =
"https://media.licdn.com/dms/image/v2/D5622AQFfhWcV7yzJ7Q/feedshare-shrink_800/feedshare-shrink_800/0/1731300142228?e=2147483647&v=beta&t=2V_murHaG1thG8vrdAnFxmEc0j6XYZ5DmU8VRdmiDc4";

const SPECIALTIES = ["Animation", "YouTube Growth", "Children's Entertainment"];

const FEATURES = [
  {
    title: "Original IP Development",
    desc: "Creating characters, stories, and worlds designed for long-term growth.",
  },
  {
    title: "End-to-End Production",
    desc: "From concept art and scripting to animation, publishing, and distribution.",
  },
  {
    title: "Audience-First Strategy",
    desc: "Creative decisions backed by data, analytics, and real audience behaviour.",
  },
];

const STATS = [
  { n: "10", suffix: "+", label: "Years of Creative Excellence" },
  { n: "100", suffix: "M+", label: "Subscribers Across Our Network" },
  { n: "50", suffix: "B+", label: "Lifetime Views" },
  { n: "100", suffix: "+", label: "Channels & Projects Managed" },
];

const CheckIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const About = () => {
  return (
    <section id="about" className="relative bg-paper py-24 md:py-32 border-t border-line">
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-12 md:mb-16">
          <div data-reveal="up">
            <Eyebrow dot="bg-sun">About Monal</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] max-w-3xl"
          >
            Who <span className="mark-sun">we</span> are.
          </h2>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="text-muted max-w-xl leading-relaxed"
          >
            Monal Digital is a creative company building at the intersection of
            kids&apos; education, entertainment, technology and imagination.
          </p>
        </div>

        {/* Bento — asymmetric 4-card grid */}
        <div data-reveal-group="up" className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          {/* Row 1 · Left — Monal story (wide) */}
          <article data-tilt="3" className="group card card-hover bg-mist border-transparent lg:col-span-7 p-7 md:p-10 flex flex-col justify-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-royal mb-5">
              Stories worth building on
            </span>
            <p className="text-ink text-xl md:text-[1.6rem] leading-relaxed font-medium">
              We help studios, creators, and brands transform ideas into
              characters, stories, and digital worlds that connect with
              audiences at scale.
            </p>
            <p className="mt-5 text-muted leading-relaxed max-w-xl">
              Over the last decade, our work has generated billions of views,
              built global audiences, and helped launch original intellectual
              properties enjoyed by children around the world.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-paper border border-line px-3.5 py-1.5 text-[12px] font-medium text-ink/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </article>

          {/* Row 1 · Right — image (narrow) */}
          <article data-tilt="3" className="group card card-hover border-transparent lg:col-span-5 relative overflow-hidden p-0 min-h-72">
            <img
              src={FEATURE_IMG}
              alt="Monal animation craft"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
          </article>

          {/* Row 2 · Left — Original IP / Pearl (narrow) */}
          <article data-tilt="3" className="group card card-hover bg-mist border-transparent lg:col-span-5 p-7 md:p-9 relative overflow-hidden flex flex-col min-h-72">
            <h3 className="font-display text-ink text-2xl md:text-[1.9rem] leading-tight max-w-[14rem]">
              Original IPs kids fall for
            </h3>
            <p className="mt-2 text-muted text-sm max-w-[15rem]">
              Characters and worlds built to last — and to be loved by millions.
            </p>

            <div className="relative mt-auto h-44">
              <div className="absolute right-3 bottom-0 w-44 h-40 rounded-3xl bg-lav" />
              <span className="absolute left-0 bottom-8 -rotate-6 rounded-2xl bg-sun text-ink font-display text-sm px-4 py-3 leading-none shadow-[0_14px_30px_-12px_rgba(250,204,21,0.9)] z-10">
                Original<br />IP
              </span>
              <img
                src={pearl}
                alt="Monal original character"
                loading="lazy"
                draggable="false"
                className="absolute right-2 -bottom-2 h-60 w-auto max-w-none object-contain z-20 drop-shadow-[0_30px_40px_rgba(24,24,27,0.32)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.04]"
              />
            </div>
          </article>

          {/* Row 2 · Right — feature points (wide) */}
          <article data-tilt="3" className="group card card-hover bg-mist border-transparent lg:col-span-7 p-7 md:p-9 flex flex-col justify-center">
            <h3 className="font-display text-ink text-2xl md:text-[1.7rem] leading-tight mb-6">
              What sets us apart
            </h3>
            <ul className="space-y-3">
              {FEATURES.map((f) => (
                <li
                  key={f.title}
                  className="group/item flex items-start gap-4 rounded-2xl bg-paper border border-line px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-royal/30 hover:shadow-[0_18px_40px_-30px_rgba(24,24,27,0.5)]"
                >
                  <span className="grid place-items-center w-9 h-9 rounded-xl bg-mint text-ink shrink-0 transition-colors duration-300 group-hover/item:bg-royal group-hover/item:text-white">
                    <CheckIcon className="w-4 h-4" />
                  </span>
                  <p className="leading-snug">
                    <span className="font-semibold text-ink">{f.title}</span>{" "}
                    <span className="text-muted">{f.desc}</span>
                  </p>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Stats strip */}
        <div data-reveal-group="up" className="mt-4 md:mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {STATS.map((s) => (
            <div key={s.label} data-tilt="6" className="group card card-hover bg-mist border-transparent p-6 md:p-7">
              <div
                data-counter={s.n}
                data-counter-suffix={s.suffix}
                className="font-display text-ink text-[clamp(2.2rem,4.5vw,3.2rem)] leading-none group-hover:text-royal transition-colors duration-300"
              >
                {s.n}{s.suffix}
              </div>
              <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
