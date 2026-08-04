import Link from "next/link";
import { ventures, type Venture } from "@/data/constants";
import { Eyebrow, ArrowUpRight } from "./Decor";
import FractalField, { FractalBackdrop } from "./FractalField";
import AipanMark from "./AipanMark";
import { SPECTRUM, motifTone } from "@/lib/palette";

/* The partner wall used to trail this section; it is components/Partners
   now, and the mark-sizing table went with it. */

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
 *  never text.
 *
 *  The motif draws its band through motifTone(), which deepens it until
 *  it survives the mist card; the light half of the spectrum was landing
 *  near 1.2:1 and reading as an empty card. That is a uniform rule over
 *  all eight, not a per-card choice — see MOTIF TONE in lib/palette.ts.
 *  The number plate below still takes the RAW band, because a pale
 *  ground holding ink text is exactly what it is for.
 * ------------------------------------------------------------------ */
/* `drift` = animates on its own, rather than waiting for a pointer.
   Every card is still by default and wakes on hover, which is what keeps
   six canvases on one screen from costing anything while you are reading
   past them. Games is the exception: a card about play that only moves
   once you touch it is the wrong way round, and its gasket is the one
   motif whose motion is a continuous travelling wave rather than a
   gesture with a beginning and an end. One always-on canvas is a cost
   worth naming; six would not be. Reduced-motion still overrides it. */
const MOTIFS = [
  { motif: "pythagoras", depth: 9, scale: 1, speed: 1, drift: false },
  /* The Hilbert traversal sweeps its whole curve in one pass, so at the
     shared rate it reads as a flicker rather than a line being drawn. */
  { motif: "hilbert", depth: 5, scale: 0.9, speed: 0.45, drift: false },
  { motif: "sierpinski", depth: 6, scale: 0.85, speed: 0.55, drift: true },
  { motif: "fern", depth: 30, scale: 0.95, speed: 1, drift: false },
  { motif: "subdiv", depth: 7, scale: 1, speed: 1, drift: false },
  { motif: "dragon", depth: 12, scale: 0.85, speed: 1, drift: false },
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
          /* The band at a value that survives the mist card. The light
             half of the spectrum — sun above all, at 1.15:1 raw — drew a
             motif nobody could see. See MOTIF TONE in lib/palette.ts. */
          palette={[motifTone(band)]}
          speed={motif.speed}
          depth={motif.depth}
          scale={motif.scale}
          /* A drifting card still takes `activateOn`: hover cannot add
             amplitude it already has, but it still resolves one level
             deeper, so the card answers a pointer either way. */
          drift={motif.drift}
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
          className="band-plate band-plate--lift grid place-items-center w-14 h-14 rounded-2xl font-display text-xl text-ink transition-colors duration-300 group-hover:text-white"
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
      <p className="relative mt-1.5 text-accent-ink font-medium">{venture.tagline}</p>
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

const Services = ({ showHeader = true }: { showHeader?: boolean }) => {
  return (
    <section
      id="services"
      className="relative bg-mist py-24 md:py-32 border-t border-line overflow-hidden"
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
              <Eyebrow>What we&apos;re building</Eyebrow>
            </div>
            <h2
              data-split
              className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[0.98] max-w-3xl"
            >
              Our <span className="mark">Ecosystem</span>.
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

        {/* The section's only way out. Six ventures, three of them not open
            yet, and until now nothing to do about any of them — a reader
            crossed this section and the testimonials, roughly 3,500px and
            more than a third of the page, with no way to act between "View
            All Our Work" and the footer.

            Placed after the grid rather than before it: the ask only makes
            sense once you have seen what is being offered. The lead-in
            paragraph that used to sit above the button is gone; the button
            names its own destination, and the cards above have already
            made the case. */}
        <div className="mt-14 md:mt-16 flex justify-center">
          <Link href="/contact-us" data-magnetic="0.25" className="btn btn-primary group">
            Talk to us about a venture
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Services;
