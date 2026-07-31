import type { Metadata } from "next";
import Link from "next/link";
import { ArrowGlyph, Eyebrow } from "@/components/Decor";
import LivingWordmark from "@/components/play/LivingWordmark";
import { PLAY_DESCRIPTION, PLAY_TAGLINE, TOYS } from "@/data/play";

export const metadata: Metadata = {
  title: "Play with our logo",
  description: PLAY_DESCRIPTION,
  alternates: { canonical: "/play" },
  openGraph: {
    title: "Play with our logo | Monal Digital",
    description: PLAY_DESCRIPTION,
    url: "/play",
  },
};

export default function PlayHubPage() {
  const [hero, ...rest] = TOYS;

  return (
    <div className="grid gap-14 md:gap-20">
      <section>
        <Eyebrow>Fractal playground</Eyebrow>
        <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.95] tracking-[-0.04em]">
          {PLAY_TAGLINE}
        </h1>
        <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-muted md:text-lg">
          {PLAY_DESCRIPTION}
        </p>

        {/* The wordmark itself, alive, as the hero. */}
        <div
          className="relative mt-12 overflow-hidden rounded-[28px] bg-black"
          style={{ aspectRatio: hero.aspect }}
        >
          <LivingWordmark intro={hero.intro} aspect={hero.aspect} embedded />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link href={`/play/${hero.slug}`} className="btn btn-primary">
            Play with the wordmark
            <ArrowGlyph className="h-4 w-4" />
          </Link>
          <p className="text-[14px] text-muted">
            No sign-up, nothing to install. It runs on a phone.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-[clamp(1.7rem,3.6vw,2.6rem)] tracking-[-0.03em]">
          Four more things to try.
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {rest.map((toy) => (
            <Link
              key={toy.slug}
              href={`/play/${toy.slug}`}
              className="card card-hover group flex flex-col justify-between gap-8 p-7 md:p-8"
            >
              <div>
                <span
                  className={`inline-flex rounded-full ${toy.tint} px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.1em] uppercase text-ink/70`}
                >
                  {toy.slug}
                </span>
                <h3 className="mt-5 font-display text-[clamp(1.4rem,2.6vw,1.9rem)] tracking-[-0.025em]">
                  {toy.name}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{toy.blurb}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
                Open
                <ArrowGlyph className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="card bg-mist p-7 md:p-10">
        <h2 className="max-w-2xl font-display text-[clamp(1.5rem,3.2vw,2.2rem)] leading-tight tracking-[-0.03em]">
          Why a studio for children has a fractal for a logo.
        </h2>
        <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-muted">
          The MONAL wordmark is one frozen frame of z → z² + c, the same short
          formula that draws coastlines, ferns and frost. Nothing in it was drawn by
          hand: every colour inside those letters is the answer to a question about
          how long a point takes to escape. We like that our name is made of the same
          stuff as the natural world our films are set in — and that a ten-year-old
          can push it around until it becomes their own.
        </p>
      </section>
    </div>
  );
}
