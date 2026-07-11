const STATS = [
  { n: "10", suffix: "+", label: "Years of Creative Excellence" },
  { n: "100", suffix: "M+", label: "Subscribers Across Our Network" },
  { n: "50", suffix: "B+", label: "Lifetime Views" },
  { n: "100", suffix: "+", label: "Channels & Projects Managed" },
];

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

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* Small caption pinned to the bottom of an image tile. */
const Caption = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
    <div className="absolute bottom-0 inset-x-0 p-5 md:p-6">
      <span className="inline-flex items-center gap-2 text-white font-display text-base md:text-lg drop-shadow-[0_4px_14px_rgba(0,0,0,0.6)]">
        <span className="w-1.5 h-1.5 rounded-full bg-sun" />
        {children}
      </span>
    </div>
  </>
);

const AboutStory = () => {
  return (
    <section className="relative bg-paper py-20 md:py-28 border-t border-line">
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {/* Intro — studio story, as bento cards */}
        <div
          data-reveal-group="up"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 mb-14 md:mb-20"
        >
          {/* Statement card */}
          <article
            data-tilt="3"
            className="group card card-hover bg-royal border-transparent lg:col-span-7 p-8 md:p-11 flex flex-col justify-center"
          >
            <h2
              data-split
              className="font-display text-white text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] text-balance"
            >
              Where characters become <span className="text-sun">childhood</span>.
            </h2>
            <p className="mt-6 text-white/80 text-lg leading-relaxed max-w-xl">
              Monal Digital is a creative animation studio building original
              characters, stories, and worlds for children everywhere.
            </p>
          </article>

          {/* Supporting card */}
          <article
            data-tilt="3"
            className="group card card-hover bg-mist border-transparent lg:col-span-5 p-8 md:p-11 flex flex-col justify-center"
          >
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-royal mb-5">
              A decade in
            </span>
            <p className="text-ink text-xl md:text-[1.5rem] leading-snug font-display">
              Craft, scaled by technology.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              For over a decade we&apos;ve produced kids&apos; entertainment that
              reaches audiences at global scale, pairing storytelling craft with
              technology, data, and a real understanding of how young viewers
              watch, learn, and grow.
            </p>
          </article>
        </div>

        {/* Bento — three studio photos woven with story cards */}
        <div
          data-reveal-group="up"
          className="grid grid-cols-1 lg:grid-cols-12 auto-rows-auto gap-4 md:gap-5"
        >
          {/* Wide studio shot */}
          <figure
            data-tilt="3"
            className="group relative lg:col-span-8 min-h-[320px] md:min-h-[440px] rounded-3xl overflow-hidden border border-line bg-ink"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/studio/studio-team.jpg"
              alt="The Monal Digital team inside the studio, beside their YouTube creator awards"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <Caption>Inside the studio</Caption>
          </figure>

          {/* Story card */}
          <article className="lg:col-span-4 card bg-mist border-transparent p-7 md:p-9 flex flex-col justify-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-royal mb-4">
              What we do
            </span>
            <p className="text-ink text-xl md:text-[1.5rem] leading-snug font-display">
              Original IP, made end to end.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              From concept art and scripts to animation, publishing, and audience
              growth, we build every stage in house. That control lets us create
              characters and worlds with the consistency to grow into lasting
              franchises.
            </p>
          </article>

          {/* Portrait — premiere */}
          <figure
            data-tilt="3"
            className="group relative lg:col-span-4 min-h-[420px] md:min-h-[560px] rounded-3xl overflow-hidden border border-line bg-ink"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/studio/studio-premiere.jpg"
              alt="The team at a cinema premiere, their animated film on the big screen"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <Caption>On the big screen</Caption>
          </figure>

          {/* Portrait — premiere day group */}
          <figure
            data-tilt="3"
            className="group relative lg:col-span-4 min-h-[420px] md:min-h-[560px] rounded-3xl overflow-hidden border border-line bg-ink"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/studio/studio-cinema.jpg"
              alt="The full Monal Digital team on premiere day"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <Caption>Premiere day</Caption>
          </figure>

          {/* Dark mission accent */}
          <article className="lg:col-span-4 min-h-[420px] md:min-h-[560px] rounded-3xl bg-ink text-paper p-8 md:p-10 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute inset-0 bg-dots-light opacity-30 pointer-events-none [mask-image:radial-gradient(70%_60%_at_80%_0%,#000,transparent)]" />
            <span className="relative text-[12px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Our Mission
            </span>
            <p className="relative font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1]">
              We create entertainment that helps children{" "}
              <span className="text-sun">learn, imagine, and grow</span>, with
              stories worth watching again and again.
            </p>
          </article>
        </div>

        {/* What sets us apart + Original IP */}
        <div
          data-reveal-group="up"
          className="mt-4 md:mt-5 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5"
        >
          {/* What sets us apart (wide) */}
          <article className="lg:col-span-7 card bg-mist border-transparent p-7 md:p-9 flex flex-col justify-center">
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

          {/* Original IPs kids fall for (narrow) */}
          <article className="group lg:col-span-5 card card-hover bg-mist border-transparent p-7 md:p-9 relative overflow-hidden flex flex-col min-h-80">
            <h3 className="font-display text-ink text-2xl md:text-[1.9rem] leading-tight max-w-56">
              Original IPs kids fall for
            </h3>
            <p className="mt-2 text-muted text-sm max-w-60">
              Characters and worlds built to last, and to be loved by millions.
            </p>

            <div className="relative mt-auto h-44">
              <div className="absolute right-3 bottom-0 w-44 h-40 rounded-3xl bg-lav" />
              <span className="absolute left-0 bottom-8 -rotate-6 rounded-2xl bg-sun text-ink font-display text-sm px-4 py-3 leading-none shadow-[0_14px_30px_-12px_rgba(250,204,21,0.9)] z-10">
                Original<br />IP
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/pearl.png"
                alt="Monal original character"
                loading="lazy"
                draggable="false"
                className="absolute right-2 -bottom-2 h-60 w-auto max-w-none object-contain z-20 drop-shadow-[0_30px_40px_rgba(24,24,27,0.32)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.04]"
              />
            </div>
          </article>
        </div>

        {/* Stats strip */}
        <div
          data-reveal-group="up"
          className="mt-16 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              data-tilt="6"
              className="group card card-hover bg-mist border-transparent p-6 md:p-7"
            >
              <div
                data-counter={s.n}
                data-counter-suffix={s.suffix}
                className="font-display text-ink text-[clamp(2.2rem,4.5vw,3.2rem)] leading-none group-hover:text-royal transition-colors duration-300"
              >
                {s.n}
                {s.suffix}
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

export default AboutStory;
