import { brands } from "@/data/constants";
import { Eyebrow } from "./Decor";
import GrowingFrond from "./GrowingFrond";

/* Each partner mark's aspect ratio, measured from the TRIMMED logo — the
   `-logo.png` files are cropped to their own artwork, so these are the
   real proportions rather than whatever padding the source shipped with.
   A logo wall looks wrong when every mark is given the same box: an 8:1
   wordmark fills it while a 1.7:1 roundel shrinks to nothing. Sizing by
   height = K / sqrt(aspect) keeps the rendered AREA roughly equal, so a
   wide wordmark and a square badge carry the same visual weight. */
const MARK_ASPECT: Record<string, number> = {
  "economics-explained": 2.29,
  "freebird-animation": 1.98,
  "hera": 3.41,
  "lenny-studio": 2.7,
  "lunar-x": 2.42,
  "tata-play": 8.47,
  "the-boldeye": 3.34,
  "vaibhav-studios": 1.73,
};
/* Tuned so even the widest mark (8.5:1) stays HEIGHT-bound inside the
   card's content box — once `contain` starts clipping on width instead,
   the equal-area maths stops holding and wide wordmarks shrink twice. */
const MARK_K = 74; // a 3:1 mark lands at ~43px tall

/* ADRUTO IS THE ONE RECOLOURED MARK, and deliberately so. Its source is
   white line-art — mean luminance 250 of 255, no dark parts anywhere — so
   on a white card it rendered as a ghost outline. It briefly sat on an
   ink plate to keep the artwork untouched, at the cost of one dark tile
   in a wall of white ones. Recolouring it to ink instead was the call:
   the shape and its anti-aliasing still come from adruto.png, only the
   RGB is replaced. Every other logo here is untouched brand colour. */

/* The wall stood for months as a trailing block inside the ecosystem
   section, sharing that section's heading and its scroll. It is its own
   argument — the ventures are what we are building, the partners are who
   we have built with — so it is its own section, and it follows the work
   rather than the ambition: you meet the shows first, then the people who
   made them with us. */
const Partners = () => {
  return (
    <section
      id="partners"
      className="relative bg-mist py-24 md:py-32 border-t border-line overflow-hidden"
    >
      {/* No field here. Circles packed inside circles used to sit behind
          this wall — many distinct things sharing one space without
          overlapping, which is the argument the section makes in words.
          It read as a smudge rather than as an argument at 10% and it sat
          under a grid of partner logos, several of which are themselves
          fine line art. The GrowingFrond below is this section's motif. */}

      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        <div className="relative flex flex-col items-center text-center gap-5 mb-12 md:mb-16">
          <div data-reveal="up">
            <Eyebrow>Our Partners</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(1.8rem,5vw,3.6rem)] leading-[0.98] max-w-3xl"
          >
            Trusted by creators &amp; studios <span className="mark">worldwide</span>.
          </h2>
        </div>

        <div
          data-reveal-group="up"
          /* THE REVEAL, in time rather than in ink. `bisect` orders the
             cards by recursive halving — the middle first, then the
             quarters, then the eighths — instead of left to right. The
             wall assembles by subdivision, which is the same construction
             as everything else on the page, and it adds nothing to look
             at. See hooks/useUiAnimations.ts. */
          data-reveal-order="bisect"
          className="relative flex flex-wrap justify-center gap-4 md:gap-5"
        >
          {brands.map((b) => {
            /* EACH PARTNER IN ITS OWN COLOURS. This wall used to draw
               every logo as a flat silhouette tinted from the spectrum —
               one band each, so the row walked the palette. It made a
               tidy wall out of a messy set of source files, but it threw
               away the thing a "trusted by" row is actually showing: a
               partner's mark is theirs, and recolouring it is the one
               edit not ours to make.

               The source files could not be used directly, which is what
               the silhouettes were working around — four carried a baked
               white background, Lenny's a black one (it is a JPEG, so it
               cannot hold transparency at all), and only three arrived
               with an alpha channel. The `-logo.png` assets are those
               originals with the background flood-filled away from the
               border, trimmed to their own artwork and scaled down. Full
               colour, genuine transparency, no plate behind them. */
            const slug = b.logo
              .split("/")
              .pop()!
              .replace(/\.(png|jpg|jpeg|webp)$/i, "");
            const logo = `/assets/brands/${slug}-logo.webp`;
            const aspect = MARK_ASPECT[slug] ?? 3;
            const markH = Math.round(MARK_K / Math.sqrt(aspect));
            return (
              <div
                key={b.name}
                data-tilt="4"
                /* Four across, because there are eight partners: three
                   columns left an orphan row of two hanging off centre. */
                className="group card card-hover min-h-32 flex items-center justify-center w-[calc(50%-0.5rem)] md:w-[calc(25%-0.94rem)] px-5 py-6"
              >
                <span className="flex items-center justify-center w-full transition-transform duration-500 group-hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt={`${b.name} logo`}
                    loading="lazy"
                    /* Height drives the equal-area sizing; width follows
                       the logo's own ratio. `object-contain` is belt and
                       braces — the assets are already trimmed, so there
                       is nothing to letterbox. */
                    style={{ height: markH }}
                    className="v-mark w-auto max-w-full object-contain"
                  />
                </span>
              </div>
            );
          })}
        </div>

        {/* The one thing on this page a child can actually do. Tapping
            adds a level of branching — the same small shape repeated
            inside itself, which is the idea the whole site is built on.
            It sits after the partner wall so the section ends on
            something to play with rather than on a list of names. */}
        <div
          data-reveal="up"
          data-reveal-delay="0.15"
          className="mt-16 md:mt-20 flex justify-center"
        >
          {/* Green, because it is a growing plant. */}
          <GrowingFrond tone="var(--color-leaf)" />
        </div>
      </div>
    </section>
  );
};

export default Partners;
