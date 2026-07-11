import Link from "next/link";
import { Eyebrow, ArrowUpRight } from "./Decor";

const About = () => {
  return (
    <section id="about" className="relative bg-paper py-24 md:py-32 border-t border-line">
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-12 md:mb-16">
          <div data-reveal="up">
            <Eyebrow dot="bg-royal">About Monal</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] max-w-3xl"
          >
            Who <span className="mark-violet">we</span> are.
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

        {/* Studio card (full width) */}
        <div
          data-reveal-group="up"
          className="grid grid-cols-1 gap-4 md:gap-5 mb-4 md:mb-5"
        >
          <article
            data-tilt="3"
            className="group card card-hover bg-royal border-transparent p-8 md:p-11 flex flex-col justify-center"
          >
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-sun mb-5">
              The studio
            </span>
            <p className="text-white/90 leading-relaxed">
              We&apos;re a full-service 2D and 3D animation studio based in
              Haldwani, Uttarakhand, handling everything from concept and scripting
              to animation, voice, and post-production. Our team brings 10+ years of
              experience in kids&apos; animation, building original IPs watched by
              millions of families worldwide, from YouTube to Amazon Prime Video.
            </p>
          </article>
        </div>

        {/* Story + image */}
        <div
          data-reveal-group="up"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5"
        >
          {/* Himalayan Monal image (narrow) */}
          <article
            data-tilt="3"
            className="group card card-hover border-transparent lg:col-span-5 relative overflow-hidden p-0 min-h-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/projects/himalayan-monal.jpg"
              alt="The Himalayan Monal, the vibrant state bird of Uttarakhand"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
          </article>

          {/* Monal story (wide) */}
          <article
            data-tilt="3"
            className="group card card-hover bg-mist border-transparent lg:col-span-7 p-7 md:p-10 flex flex-col justify-center"
          >
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-royal mb-5">
              Stories worth building on
            </span>
            <p className="text-ink text-xl md:text-[1.6rem] leading-relaxed font-medium">
              Monal Digital takes its name from the Himalayan Monal, the vibrant
              state bird of Uttarakhand.
            </p>
            <p className="mt-5 text-muted leading-relaxed max-w-xl">
              Nestled in the foothills of the Himalayas, we grew up surrounded by
              mountain villages, forests, rivers, stories, traditions, and a deep
              connection to nature. These influences continue to shape everything
              we create.
            </p>
            <p className="mt-4 text-muted leading-relaxed max-w-xl">
              Today, that same spirit drives a full-service animation studio in
              Uttarakhand producing 2D and 3D kids&apos; content watched by families
              around the world: original characters, nursery rhymes, and
              story-driven series rooted in the place we call home.
            </p>
            <p className="mt-4 text-muted leading-relaxed max-w-xl">
              Like the Monal itself, we believe the best stories come from the
              mountains, and belong to the world.
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
