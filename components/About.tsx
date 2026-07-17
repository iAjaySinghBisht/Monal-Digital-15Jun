import Link from "next/link";
import { Eyebrow, ArrowUpRight } from "./Decor";

const About = () => {
  return (
    <section id="about" className="relative bg-paper py-24 md:py-32 border-t border-line">
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-12 md:mb-16">
          <div data-reveal="up">
            <Eyebrow dot="bg-royal">Who We Are</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] max-w-3xl"
          >
            Artists, storytellers, strategists &amp;{" "}
            <span className="mark-violet">builders</span>.
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

        {/* Three cards: the bird, the name it gave us, and the story. */}
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
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
            </article>

            <article className="card card-hover bg-royal border-transparent text-white p-7 md:p-8 flex-1 flex flex-col justify-center">
              <p className="text-lg md:text-xl leading-relaxed font-medium">
                Monal takes its name from the Himalayan Monal — the vibrant
                state bird of Uttarakhand and a symbol of beauty, resilience,
                and wonder.
              </p>
            </article>
          </div>

          {/* Right — the story */}
          <article className="group card bg-mist border-transparent lg:col-span-7 p-7 md:p-10 flex flex-col justify-center">
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
            {/* The closing beat — set apart so the last line lands. */}
            <p className="mt-6 text-ink text-lg md:text-xl leading-relaxed font-medium max-w-xl">
              Because we believe the best stories don&apos;t just entertain.
              <br />
              They shape childhood.
            </p>
            <Link
              href="/about-us"
              className="group/link mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink"
            >
              More about us
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
};

export default About;
