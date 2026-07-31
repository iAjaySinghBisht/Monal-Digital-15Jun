import Link from "next/link";
import { ventures, brands, type Venture } from "@/data/constants";
import { Eyebrow, ArrowUpRight } from "./Decor";
import FractalField, { FractalBackdrop } from "./FractalField";
import GrowingFrond from "./GrowingFrond";
import AipanMark from "./AipanMark";
import { SPECTRUM } from "@/lib/palette";

/* Each partner mark's aspect ratio, measured from the traced silhouette. A
   logo wall looks wrong when every mark is given the same box: an 8:1
   wordmark fills it while a 1.7:1 roundel shrinks to nothing. Sizing by
   height = K / sqrt(aspect) keeps the rendered AREA roughly equal, so a
   wide wordmark and a square badge carry the same visual weight. */
const MARK_ASPECT: Record<string, number> = {
  "adruto": 4.58,
  "freebird-animation": 2.33,
  "lenny-studio": 2.71,
  "lunar-x": 2.46,
  "shemaroo": 2.39,
  "tata-play": 8.47,
  "the-boldeye": 3.42,
  "vaibhav-studios": 1.72,
};
/* Tuned so even the widest mark (8.5:1) stays HEIGHT-bound inside the
   card's content box — once `contain` starts clipping on width instead,
   the equal-area maths stops holding and wide wordmarks shrink twice. */
const MARK_K = 74; // a 3:1 mark lands at ~43px tall

/* ------------------------------------------------------------------ *
 *  One motif per venture — chosen to match what that venture actually
 *  is, rather than applied uniformly:
 *
 *    Kids        pythagoras  a story tree — "where every story begins"
 *    AI          hilbert     a circuit trace — computation
 *    Games       sierpinski  board/puzzle geometry — play
 *    Preschool   fern        the one that says "inspired by nature"
 *    Academy     subdiv      recursive frames — storyboards, animation
 *    Consultancy dragon      one route folding out to reach everywhere
 *
 *  All six are fractals, so the section keeps a single logic while each
 *  card still says something specific about its venture.
 *
 *  Six of the wordmark's eight bands, one per venture, so no two cards
 *  repeat and the row walks the logo's own spectrum. Canvas needs real
 *  hex (see lib/palette.ts) — these are decorative fills behind copy,
 *  never text, which is why the raw band is right here and not its
 *  darker `ink` sibling.
 * ------------------------------------------------------------------ */
const MOTIFS = [
  { motif: "pythagoras", depth: 9, scale: 1, speed: 1 },
  /* The Hilbert traversal sweeps its whole curve in one pass, so at the
     shared rate it reads as a flicker rather than a line being drawn. */
  { motif: "hilbert", depth: 5, scale: 0.9, speed: 0.45 },
  { motif: "sierpinski", depth: 6, scale: 0.85, speed: 1 },
  { motif: "fern", depth: 30, scale: 0.95, speed: 1 },
  { motif: "subdiv", depth: 7, scale: 1, speed: 1 },
  { motif: "dragon", depth: 12, scale: 0.85, speed: 1 },
] as const;

/* NO COLOUR IN THIS TABLE. The shape of a card's motif says something
   about that venture; its colour does not, and picking one by name here
   is how the page ended up with six unrelated hues that answered to no
   system. The band comes from the card's POSITION, exactly as the peaks
   and the partner wall take theirs — six cards drawing the first six of
   the wordmark's eight, in the wordmark's own order. */

/* Tinted mist so the cards still read against the section's white canvas —
   the same treatment About gives its story card. */
const VentureCard = ({
  venture,
  num,
  band,
  motif,
}: {
  venture: Venture;
  num: string;
  /** This card's band from the wordmark's set, chosen by position. */
  band: string;
  motif: (typeof MOTIFS)[number];
}) => {
  const isExternal = venture.href?.startsWith("http");
  /* `relative overflow-hidden` so the motif can be absolutely placed and
     clipped to the card's rounded corners. */
  const surface =
    "group card card-hover bg-mist border-transparent flex flex-col p-7 md:p-8 relative overflow-hidden";

  const body = (
    <>
      {/* This venture's own motif, in its own tone — see MOTIFS above. The
          radial mask dissolves it into the card so the copy always wins. */}
      <span
        aria-hidden="true"
        /* 0.62 was tuned for Monal Test's dark cards, where the lines read as
           a faint watermark. On this light mist the same value crosses the
           body copy, so it sits lower here and only lifts on hover. The mask
           is also pulled tighter into the corner for the same reason. */
        className="pointer-events-none absolute -right-10 -bottom-8 h-60 w-60 opacity-[0.42] transition-opacity duration-500 group-hover:opacity-90"
        style={{
          maskImage: "radial-gradient(80% 80% at 74% 82%, #000 30%, transparent)",
          WebkitMaskImage: "radial-gradient(80% 80% at 74% 82%, #000 30%, transparent)",
        }}
      >
        <FractalField
          variant={motif.motif}
          palette={[band]}
          speed={motif.speed}
          depth={motif.depth}
          scale={motif.scale}
          activateOn=".group"
        />
      </span>

      {/* Aipan corner, top-left only — the fractal motif already owns the
          bottom-right, and the two would fight for the same corner. Kept
          at 5%: this mark repeats down the whole grid, and repetition is
          exactly what turned the dividers into wallpaper. Here it should
          register as texture on the card, never as an ornament on it. */}
      <AipanMark
        motif="corner"
        size={30}
        className="pointer-events-none absolute left-1.5 top-1.5 text-ink opacity-[0.05]"
      />

      <div className="relative flex items-start justify-between gap-3">
        {/* The plate is the card's OWN band laid thinly, and the same band
            at full strength on hover — so the number, the motif behind it
            and the card all say one colour. The old three-entry TINTS
            table cycled three arbitrary pastels across six cards, which
            meant card 1 and card 4 matched for no reason at all. */}
        <span
          className="venture-plate grid place-items-center w-14 h-14 rounded-2xl font-display text-xl text-ink transition-colors duration-300 group-hover:text-white"
          style={{ ["--band" as string]: band }}
        >
          {num}
        </span>
        {/* A venture is either not open yet, or somewhere you can go — never both.
            The status chip stays hidden until the card is hovered. */}
        {venture.status ? (
          <span className="mt-1 shrink-0 rounded-full border border-line bg-paper px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {venture.status}
          </span>
        ) : venture.href ? (
          <span
            aria-hidden="true"
            className="mt-1 shrink-0 grid place-items-center w-9 h-9 rounded-full bg-paper text-ink opacity-0 -translate-y-0.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
          >
            <ArrowUpRight className="w-4 h-4" />
          </span>
        ) : null}
      </div>

      <h3 className="relative mt-7 font-display text-ink text-2xl md:text-[1.7rem] leading-tight">
        {venture.title}
      </h3>
      <p className="relative mt-1.5 text-royal font-medium">{venture.tagline}</p>
      <p className="relative mt-4 text-muted leading-relaxed">{venture.desc}</p>
    </>
  );

  if (!venture.href) {
    /* Real, but not open yet — the cursor reads `soon` here and shows a
       hollow ring instead of the filled "you can go here" dot. */
    return (
      <div data-tilt="4" data-cursor="soon" className={surface}>
        {body}
      </div>
    );
  }

  if (isExternal) {
    return (
      <a
        data-tilt="4"
        className={surface}
        href={venture.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link data-tilt="4" className={surface} href={venture.href}>
      {body}
    </Link>
  );
};

const Services = ({
  showPartners = true,
  showHeader = true,
}: {
  showPartners?: boolean;
  showHeader?: boolean;
}) => {
  return (
    <section
      id="services"
      className="relative bg-paper py-24 md:py-32 border-t border-line overflow-hidden"
    >
      {/* Section-wide fern, rising from the bottom edge and fading out well
          before the copy — the quiet bed the six card motifs sit on. */}
      <FractalBackdrop
        variant="fern"
        opacity={0.14}
        mask="radial-gradient(95% 100% at 50% 100%, #000 0%, transparent 82%)"
      />
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {/* Header */}
        {showHeader && (
          <div className="flex flex-col items-center text-center gap-5 mb-14 md:mb-20">
            <div data-reveal="up">
              <Eyebrow>Our Ecosystem</Eyebrow>
            </div>
            <h2
              data-split
              className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[0.98] max-w-3xl"
            >
              What we&apos;re <span className="mark">building</span>.
            </h2>
            <p
              data-reveal="up"
              data-reveal-delay="0.12"
              className="text-muted max-w-lg leading-relaxed"
            >
              One world flowing naturally into the next. A character born in a
              story can become a friend in a game, a guide in learning, and a
              familiar face in the classroom.
            </p>
          </div>
        )}

        {/* Venture cards */}
        <div data-reveal-group="up" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {ventures.map((v, i) => (
            <VentureCard
              key={v.title}
              venture={v}
              num={String(i + 1).padStart(2, "0")}
              band={SPECTRUM[i % SPECTRUM.length].hex}
              motif={MOTIFS[i % MOTIFS.length]}
            />
          ))}
        </div>

        {/* Partners */}
        {showPartners && (
        <div className="relative mt-24 md:mt-32 pt-16 md:pt-20 border-t border-line">

          {/* THE FIELD. Circles packed inside circles, each generation
              smaller and fainter — many distinct things sharing one space
              without overlapping, which is the argument the section makes
              in words. Masked to fade out well before the logos so the wall
              stays the subject. */}
          <FractalBackdrop
            variant="circles"
            depth={4}
            opacity={0.1}
            mask="radial-gradient(70% 80% at 50% 45%, #000 0%, transparent 78%)"
          />

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
            {brands.map((b, i) => {
              /* Every partner is drawn as a flat silhouette in one of the
                 palette tones. The source files were a mess — four had a
                 baked-in white background, one a black one, three were
                 already transparent — so per-logo scale hacks and
                 brightness filters were being used to hide the difference
                 and the wall read as mixed shapes.

                 The `-mark` assets are alpha-only silhouettes traced from
                 each original, applied here as a CSS mask so the colour
                 comes from `background`, not from the file. That makes
                 every logo behave identically regardless of how it
                 arrived. Trade-off: partner brand colours are dropped in
                 favour of a consistent wall, which is the usual treatment
                 for a "trusted by" row. */
              const slug = b.logo
                .split("/")
                .pop()!
                .replace(/\.(png|jpg|jpeg|webp)$/i, "");
              const mark = `/assets/brands/${slug}-mark.png`;
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
                  <span
                    role="img"
                    aria-label={b.name}
                    className="v-mark block w-full transition-transform duration-500 group-hover:scale-105"
                    style={{
                      height: markH,
                      /* Eight partners, eight spectrum bands — the wall
                         walks the logo's set exactly once, so no two
                         marks share a colour. */
                      background: SPECTRUM[i % SPECTRUM.length].hex,
                      maskImage: `url(${mark})`,
                      WebkitMaskImage: `url(${mark})`,
                    }}
                  />
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
        )}
      </div>
    </section>
  );
};

export default Services;
