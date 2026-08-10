import Link from "next/link";
import { projects, type Project } from "@/data/constants";
import { Eyebrow, ArrowUpRight } from "./Decor";

/* ------------------------------------------------------------------ *
 *  THE SHAPE OF THIS SECTION COMES FROM THE ARTWORK.
 *
 *  The previous layout was six PORTRAIT posters in three staggered
 *  columns. Every piece of key art is now a 16:9 cast shot, and a
 *  landscape image in a 2:3 frame is not a smaller version of itself —
 *  `object-cover` was throwing away two thirds of each frame, which on a
 *  cast shot means cropping the cast. So the grid is rebuilt around the
 *  ratio the art actually has: every card here is 16:9 and nothing is
 *  cropped except the feature, which absorbs one gap (~2%).
 *
 *  SEVEN ITEMS, AND THE ARITHMETIC MATTERS. Seven is prime, so any even
 *  grid leaves an orphan on the last row — the single thing that makes a
 *  gallery look unfinished. The split is 1 + 2 + 4:
 *
 *      ┌───────────────┬───────┐
 *      │               │   1   │      feature  spans 8 of 12
 *      │       0       ├───────┤      1, 2     span 4, stacked beside it
 *      │               │   2   │      3..6     span 3, four across
 *      ├───┬───┬───┬───┴───────┤
 *      │ 3 │ 4 │ 5 │     6     │
 *      └───┴───┴───┴───────────┘
 *
 *  Two 4-wide 16:9 cards stacked are 492px against the feature's 484px at
 *  container width, so the feature is given `row-span-2` and stretched to
 *  fill rather than being handed its own aspect ratio. The rows align by
 *  construction instead of by a magic number that breaks at the next
 *  breakpoint.
 *
 *  It degrades by dropping columns, not by rearranging: four across
 *  becomes two on tablet, and everything becomes one column on phones,
 *  where the feature stops being a feature because there is nothing
 *  beside it for it to be bigger THAN.
 * ------------------------------------------------------------------ */

/* Widths the browser should assume before CSS has resolved, so it picks
   from the srcset correctly on the first pass rather than fetching the
   1600w file for a quarter-width card. */
const SIZES = {
  feature: "(min-width: 1024px) 66vw, 100vw",
  medium: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  small: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
} as const;

const Tile = ({
  p,
  sizes,
  fill = false,
  large = false,
  priority = false,
  tilt = true,
}: {
  p: Project;
  sizes: string;
  /** Stretch to the grid row, AT lg ONLY — see the className below. */
  fill?: boolean;
  large?: boolean;
  priority?: boolean;
  /** Cursor-following 3D tilt. Off for the feature — see its call site. */
  tilt?: boolean;
}) => (
  /* `fill` IS AN lg-ONLY INSTRUCTION, AND SAYING SO IS THE WHOLE FIX.
     This read `fill ? "h-full" : "aspect-video"`, and h-full is a
     PERCENTAGE height: it resolves only against a parent with a definite
     one. The feature's parent gets that from `lg:row-span-2`, so above
     1024px the card stretched to the two rows beside it exactly as
     intended — and below 1024px there was no row track, no definite
     height, and an <img> that is `absolute inset-0` and contributes none.
     The card collapsed to its own 2px of border on every phone and
     tablet: the largest thing in the section, and the only one anybody
     would call the flagship, rendered as a hairline.

     The header comment above already promised the right behaviour —
     the feature "stops being a feature" on phones because nothing sits
     beside it to be bigger than. Nothing implemented it. It now carries
     the same 16:9 box as its siblings and only takes the row stretch at
     the breakpoint where a row exists. `lg:aspect-auto` is load-bearing:
     without it the aspect ratio keeps winning and h-full never applies. */
  <Link
    href="/work"
    {...(tilt ? { "data-tilt": "4" } : {})}
    className={`group relative block overflow-hidden rounded-[26px] border border-line bg-ink shadow-[0_30px_60px_-46px_rgba(24,24,27,0.5)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_44px_80px_-44px_rgba(24,24,27,0.55)] ${
      fill ? "aspect-video lg:aspect-auto lg:h-full" : "aspect-video"
    }`}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      /* The CARD crop, not the band crop. These are drawn between 300 and
         860px wide, where the wide establishing shot /work uses leaves the
         cast too small to read. See Project in data/constants.ts. */
      src={p.card}
      srcSet={`${p.cardSmall} 800w, ${p.card} 1600w`}
      sizes={sizes}
      alt={p.title}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-900 ease-out group-hover:scale-[1.045]"
    />

    {/* The scrim is ALWAYS on, not a hover reveal. A title that only
        exists on hover does not exist on a phone, and it left the row
        reading as seven unlabelled pictures.

        It is a BOTTOM BAND rather than a full-card wash, and its height is
        a fraction of the card, so a small card gets proportionally more
        cover than the feature. Spanning the whole card at one opacity
        either greys out the art or leaves the small titles sitting on it
        — "Groovy The Martian" over pale green was illegible at the first
        pass. This keeps the top of every frame at full colour. */}
    <div
      className={`absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/95 via-ink/55 to-transparent transition-opacity duration-500 opacity-95 group-hover:opacity-100 ${
        large ? "h-1/2" : "h-2/3"
      }`}
    />

    {/* NO WORDMARK ON THESE CARDS. The show logos were drawn top-right
        here for a while, with a radial wash behind them so the pale ones
        stayed legible. They are gone: the card is small, the key art is
        already the show's identity, and the title sits bottom-left saying
        the same thing the logo did. `p.logo` is still set on every project
        and still drawn on the /work bands, where a full-bleed frame has
        the room for it. */}
    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 md:p-6">
      <h3
        className={`font-display leading-[1.08] tracking-tight text-balance text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)] ${
          large ? "text-[clamp(1.5rem,2.6vw,2.4rem)]" : "text-[clamp(0.95rem,1.35vw,1.2rem)]"
        }`}
      >
        {p.title}
      </h3>
      <span
        aria-hidden="true"
        className="grid shrink-0 place-items-center rounded-full bg-paper text-ink transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 w-9 h-9"
      >
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </div>
  </Link>
);

const ContentLibrary = () => {
  const [feature, ...rest] = projects;
  const beside = rest.slice(0, 2);
  const row = rest.slice(2);

  return (
    <section
      id="work"
      className="relative bg-paper py-24 md:py-32 border-t border-line overflow-hidden"
    >
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-14 md:mb-20">
          <div data-reveal="up">
            <Eyebrow>Our Worlds</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2.2rem,6.5vw,5rem)] leading-none max-w-3xl"
          >
            Characters kids <span className="mark">grow up</span> with.
          </h2>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="text-muted max-w-xl leading-relaxed"
          >
            A growing portfolio of animated brands, original IPs, and
            children&apos;s content enjoyed by families across the globe.
          </p>
        </div>

        <div data-reveal-group="up" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">
          {/* The feature. `lg:row-span-2` is what makes it align with the
              pair beside it without either being told a pixel height.

              NO TILT ON THIS ONE. The cursor-following tilt is a nice
              touch on a small card, where the whole thing turns as a unit.
              At this size the far corner travels a long way for the same
              few degrees, so the card reads as wobbling under the pointer
              rather than responding to it. The lift and the slow image
              scale still answer the hover. */}
          <div className="sm:col-span-2 lg:col-span-8 lg:row-span-2">
            <Tile p={feature} sizes={SIZES.feature} fill large priority tilt={false} />
          </div>

          {beside.map((p) => (
            <div key={p.title} className="sm:col-span-1 lg:col-span-4">
              <Tile p={p} sizes={SIZES.medium} />
            </div>
          ))}

          {row.map((p) => (
            <div key={p.title} className="sm:col-span-1 lg:col-span-3">
              <Tile p={p} sizes={SIZES.small} />
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
          <Link href="/work" data-magnetic="0.25" className="btn btn-primary group">
            View All Our Work
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContentLibrary;
