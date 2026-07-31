import Link from "next/link";
import { Eyebrow, ArrowUpRight } from "./Decor";
import { FractalBackdrop } from "./FractalField";
import AipanMark from "./AipanMark";

const About = () => {
  return (
    <section
      id="about"
      className="relative bg-paper py-24 md:py-32 border-t border-line overflow-hidden"
    >
      {/* A fern rising from the bottom edge — the section is about where the
          company comes from, so the motif is the one that says "nature". */}
      <FractalBackdrop
        variant="fern"
        opacity={0.15}
        cell={8}
        mask="radial-gradient(95% 100% at 50% 100%, #000 0%, transparent 82%)"
      />
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-12 md:mb-16">
          <div data-reveal="up">
            <Eyebrow>Who We Are</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] max-w-3xl"
          >
            Artists, storytellers, strategists &amp;{" "}
            <span className="mark">builders</span>.
          </h2>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="text-muted max-w-2xl leading-relaxed text-balance"
          >
            Monal Digital is a creative company building at the intersection of
            kids&apos; education, entertainment, technology and imagination.
          </p>
        </div>

        {/* Four cards: the bird, the name it gave us, the story, and the
            closing belief — which earns its own card so the last line
            lands instead of trailing off the bottom of the story. */}
        <div
          data-reveal-group="up"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5"
        >
          {/* Left column — photo above, namesake card below */}
          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-5">
            <article className="group card border-transparent relative overflow-hidden p-0 h-64 md:h-72 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/projects/himalayan-monal.webp"
                alt="The Himalayan Monal, the vibrant state bird of Uttarakhand"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                /* The bird sits right of centre with empty bokeh to its
                   left, so a plain centre crop wastes a third of this
                   wide, short card on background. */
                style={{ objectPosition: "62% 45%" }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
            </article>

            {/* This is the one card on the site whose copy is ABOUT
                Uttarakhand, and Aipan is Uttarakhand's folk art — so the
                corner marks belong here rather than being decoration. The
                card keeps its brand purple; only the ornament is borrowed,
                at an opacity where you notice it second, after the words. */}
            <article className="card card-hover bg-accent border-transparent text-ink p-7 md:p-8 flex-1 flex flex-col justify-center relative overflow-hidden">
              <AipanMark
                motif="corner"
                size={38}
                className="pointer-events-none absolute left-2 top-2 text-ink opacity-[0.16]"
              />
              <AipanMark
                motif="corner"
                size={38}
                className="pointer-events-none absolute right-2 bottom-2 rotate-180 text-ink opacity-[0.16]"
              />
              <p className="relative text-lg md:text-xl leading-relaxed font-medium">
                Monal takes its name from the Himalayan Monal — the vibrant
                state bird of Uttarakhand and a symbol of beauty, resilience,
                and wonder.
              </p>
            </article>
          </div>

          {/* Right column — the story above, the closing belief below */}
          <div className="lg:col-span-7 flex flex-col gap-4 md:gap-5">
            <article className="group card card-hover bg-mist border-transparent p-7 md:p-10 flex-1 flex flex-col justify-center">
              <p className="text-muted leading-relaxed max-w-xl">
                Our story began in the foothills of the Himalayas, where childhood
                meant forests, rivers, mountain villages, and endless curiosity.
                Nature wasn&apos;t just part of the landscape — it shaped how we saw
                the world.
              </p>
              <p className="mt-4 text-muted leading-relaxed max-w-xl">
                Those experiences taught us that childhood is built on simple
                things: imagination, kindness, exploration, and the joy of
                discovering something new.
              </p>
              <p className="mt-4 text-muted leading-relaxed max-w-xl">
                Today, those same values guide everything we make. The tools have
                changed — the questions we ask about childhood haven&apos;t.
              </p>
            </article>

            <article className="group card card-hover border-transparent p-7 md:p-9 shrink-0 flex flex-col justify-center">
              <p className="text-ink text-lg md:text-xl leading-relaxed font-medium max-w-xl">
                Because we believe the best stories don&apos;t just entertain.
                <br />
                They shape childhood.
              </p>
              <Link
                href="/about-us"
                className="group/link mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink"
              >
                More about us
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
