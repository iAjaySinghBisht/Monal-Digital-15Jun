import { Eyebrow } from "./Decor";

const STATS = [
  { n: "10", suffix: "+", label: "Years of Creative Excellence" },
  { n: "100", suffix: "M+", label: "Subscribers Across Our Network" },
  { n: "50", suffix: "B+", label: "Lifetime Views" },
  { n: "100", suffix: "+", label: "Channels & Projects Managed" },
];

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
        {/* Intro — studio story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end mb-14 md:mb-20">
          <div className="lg:col-span-7">
            <div data-reveal="up" className="mb-6">
              <Eyebrow dot="bg-royal">Who We Are</Eyebrow>
            </div>
            <h2
              data-split
              className="font-display text-ink text-[clamp(2rem,5.5vw,4.2rem)] leading-[1.02]"
            >
              Where characters become <span className="mark-violet">childhood</span>.
            </h2>
          </div>
          <div className="lg:col-span-5 space-y-5">
            <p data-reveal="up" className="text-ink text-lg leading-relaxed font-medium">
              Monal Digital is a creative animation studio building original
              characters, stories, and worlds for children everywhere.
            </p>
            <p data-reveal="up" data-reveal-delay="0.1" className="text-muted leading-relaxed">
              For over a decade we&apos;ve produced kids&apos; entertainment that
              reaches audiences at global scale, pairing storytelling craft with
              technology, data, and a real understanding of how young viewers
              watch, learn, and grow.
            </p>
          </div>
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
