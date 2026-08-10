import Link from "next/link";
import { ventures, type Venture } from "@/data/constants";
import { Eyebrow, ArrowUpRight } from "./Decor";
import FractalField, { type Variant } from "./FractalField";
import AipanMark from "./AipanMark";
import { SPECTRUM, SPECTRUM_HEX } from "@/lib/palette";

/* The partner wall used to trail this section; it is components/Partners
   now, and the mark-sizing table went with it. */

/* ------------------------------------------------------------------ *
 *  One motif per venture — chosen to match what that venture actually
 *  is, rather than applied uniformly:
 *
 *    Kids        pythagoras  a story tree — "where every story begins"
 *    AI          bifurcation one state becoming two becoming everything,
 *                            falling down the panel — a machine working
 *    Games       fern        branching choices — every play a new limb
 *                            off the same rule
 *    Preschool   seedhead    the golden angle every plant agrees on —
 *                            the one figure a child has already held
 *    Academy     sierpinski  structure taught level by level, with the
 *                            removed triangles drawn as well as the
 *                            surviving ones, and the construction
 *                            running as a pulse through the levels
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
   once you touch it is the wrong way round, and the cascade's motion —
   transients scattering in and settling — is a continuous state rather
   than a gesture with a beginning and an end. One always-on canvas is a
   cost worth naming; six would not be. Reduced-motion still overrides it. */
/* NO COLOUR IN THIS TABLE. The shape of a card's motif says something
   about that venture; its colour does not, and picking one by name here
   is how the page ended up with six unrelated hues that answered to no
   system. The band comes from the card's POSITION, exactly as the peaks
   and the partner wall take theirs — six cards drawing the first six of
   the wordmark's eight, in the wordmark's own order. */

/* THE MOTIF DRAWS THE LOGO'S OWN COLOURS, EXACTLY.
 *
 * Not a deepened version of them, and not a per-card hue: the eight
 * bands of the wordmark, as they are. Every painter colours by
 * RECURSION DEPTH — trunk band 0, its children band 1, and so on — so
 * handing over the whole set is what makes a fractal show its own
 * generations instead of coming back as one flat silhouette.
 *
 * THE FAINT VERSIONS ARE NOT SEPARATE COLOURS. Each painter already
 * ramps alpha by depth, and the whole layer sits at 30% behind the
 * copy, so what reaches the eye is these exact hues at low strength —
 * a tint of the real thing rather than a different colour that happens
 * to look similar. The breathing and lighting patterns then bring a
 * band up toward full and let it fall back, which is only possible
 * because the top of that range is the true colour.
 *
 * motifTone() is no longer used here. It existed to darken a band until
 * a SINGLE-colour motif survived a light card; with all eight present
 * and the layer behind the text, the honest thing is to show the
 * palette rather than a corrected one.
 */
const LOGO_BANDS = SPECTRUM_HEX;

/* ONE SPEED ACROSS THE ROW. These ran between 0.4 and 1, so a reader
   moving down the grid met six different tempos and the section felt
   restless. They now share a single gentle rate; where a motif genuinely
   needs to run slower than the others that belongs in the painter, not
   in six different numbers here.

   `drift` is off everywhere, including Games. Six always-on canvases is
   a cost the section should not pay for motion nobody asked to see, and
   uniform behaviour is the thing being asked for — every card is still
   until you touch it, then every card answers the same way. */
const SPEED = 0.45;

export const MOTIFS = [
  { motif: "pythagoras", depth: 9, scale: 1.22, speed: SPEED, drift: false },
  /* `depth` is a point population for this one, not a generation count —
     it needs no scale-down for the panel, since the cascade is drawn to
     fill whatever box it is given. */
  { motif: "bifurcation", depth: 1, scale: 1, speed: SPEED, drift: false },
  /* SWAPPED WITH ACADEMY. The whole tuned entry moves, not just the name:
     fern wants depth 30 and scale 0.96, sierpinski depth 6 and 0.82, and
     leaving the numbers behind would have drawn a fern at a sixth of its
     density — a few bare stalks — while the triangle overflowed its box. */
  { motif: "fern", depth: 30, scale: 0.96, speed: SPEED, drift: false },
  { motif: "seedhead", depth: 40, scale: 0.85, speed: SPEED, drift: false },
  { motif: "sierpinski", depth: 6, scale: 0.82, speed: SPEED, drift: false },
  /* Small at rest on purpose: this one opens out and turns under the
     pointer, so it needs room left over to open INTO. At 0.62 it already
     spanned its whole box, so the zoom had nowhere to go and only pushed
     the curve out of frame — a gesture you could measure but not see. */
  { motif: "dragon", depth: 12, scale: 0.33, speed: SPEED, drift: false },
] as const;

/* NO COLOUR IN THIS TABLE. The shape of a card's motif says something
   about that venture; its colour does not, and picking one by name here
   is how the page ended up with six unrelated hues that answered to no
   system. The band comes from the card's POSITION, exactly as the peaks
   and the partner wall take theirs — six cards drawing the first six of
   the wordmark's eight, in the wordmark's own order. */



/* The card's own numbers, in one place so the tuner at /lab/cards can
   drive them and hand back a block to paste straight back in here. */
export type CardTuning = {
  /** The motif's resting opacity — mirrored by MOTIF_ALPHA. */
  opacity: number;
  /** Opacity once the card is hovered. */
  hoverOpacity: number;
  /** Resting saturation, 0..1. Below 1 the drawing is muted and the
      pointer brings the real palette back. */
  sat: number;
  /** The motif box, as a % of card WIDTH. It is square, so this also
      sets its height. */
  size: number;
  /** How far the box hangs off the corner, px. A little bleed stops it
      reading as a sticker; a lot of it just crops the drawing. */
  bleed: number;
  /** Feather on the box's own vignette, %. */
  maskInner: number;
  /** Multiplier on every motif's own scale. */
  scaleMul: number;
};

export const CARD_TUNING: CardTuning = {
  opacity: 0.42,
  hoverOpacity: 0.72,
  sat: 0.45,
  size: 58,
  bleed: 14,
  maskInner: 58,
  scaleMul: 0.95,
};

/** What a card needs to draw one motif — loose enough for the tuner to
    hand it any variant, satisfied by the MOTIFS table as written. */
export type MotifSpec = {
  motif: Variant;
  depth: number;
  scale: number;
  speed: number;
  drift: boolean;
};

/* Tinted mist so the cards still read against the section's white canvas —
   the same treatment About gives its story card. */
export const VentureCard = ({
  venture,
  num,
  band,
  motif,
  tuning = CARD_TUNING,
}: {
  venture: Venture;
  num: string;
  /** This card's band from the wordmark's set, chosen by position. */
  band: string;
  motif: MotifSpec;
  tuning?: CardTuning;
}) => {
  const isExternal = venture.href?.startsWith("http");
  /* `relative overflow-hidden` so the motif can be absolutely placed and
     clipped to the card's rounded corners. */
  const surface =
    "group card card-hover bg-mist border-transparent flex flex-col p-7 md:p-8 relative overflow-hidden";
  const mask = `radial-gradient(78% 78% at 52% 52%, #000 ${tuning.maskInner}%, transparent)`;

  const body = (
    <>
      {/* THE MOTIF SITS IN A CORNER, NOT ACROSS THE CARD.
          A square box in the bottom-right, hanging just far enough off
          the edge to look like it continues past it rather than like a
          sticker placed on it. The whole figure is inside the box, so
          nothing important is lost to the crop — the earlier full-bleed
          version put the busiest part of every drawing directly under a
          line of text.

          Resting it is desaturated; a pointer brings it up to the
          wordmark's real colours. Both values are custom properties
          because the hover half lives in globals.css — see
          .venture-motif there. */}
      <span
        aria-hidden="true"
        className="venture-motif pointer-events-none absolute"
        style={{
          right: -tuning.bleed,
          bottom: -tuning.bleed,
          width: `${tuning.size}%`,
          aspectRatio: "1 / 1",
          ["--motif-o" as string]: tuning.opacity,
          ["--motif-o-hover" as string]: tuning.hoverOpacity,
          ["--motif-sat" as string]: tuning.sat,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        <FractalField
          variant={motif.motif}
          /* The wordmark's own eight, exactly — see LOGO_BANDS above. */
          palette={LOGO_BANDS}
          speed={motif.speed}
          depth={motif.depth}
          scale={motif.scale * tuning.scaleMul}
          drift={motif.drift}
          activateOn=".group"
        />
      </span>

      {/* A light scrim across the copy. The motif is out of the way of
          the first three lines now, but the description still runs into
          its corner, and hover brightens the drawing underneath it. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, var(--color-mist) 26%, color-mix(in srgb, var(--color-mist) 70%, transparent) 62%, transparent 88%)",
        }}
      />

      {/* Aipan corner — texture on the card, never an ornament on it. */}
      <AipanMark
        motif="corner"
        size={30}
        className="pointer-events-none absolute left-1.5 top-1.5 text-ink opacity-[0.06]"
      />

      <div className="relative flex items-start justify-between gap-3">
        {/* The plate is the card's OWN band laid thinly, and the same band
            at full strength on hover — so the number and the card agree. */}
        <span
          className="band-plate band-plate--lift grid place-items-center w-14 h-14 rounded-2xl font-display text-xl text-ink transition-colors duration-300 group-hover:text-white"
          style={{ ["--band" as string]: band }}
        >
          {num}
        </span>
        {venture.status ? (
          <span className="mt-1 shrink-0 rounded-full border border-line bg-paper/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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

      {/* TEXT COLOURS. The title stays full ink and the tagline stays the
          accent — both already clear the ground with room to spare. The
          description was `muted`, which is tuned for flat mist; over a
          drawing it is the one line that gets into trouble, so it moves
          to ink at 78%, which is darker than muted was and reads as the
          same grey. */}
      <h3 className="relative mt-7 font-display text-ink text-2xl md:text-[1.7rem] leading-tight">
        {venture.title}
      </h3>
      {/* Four percent off the accent. Over plain mist `accent-ink` is
          fine, but over the busiest ground the fractal can make it
          measured 4.41:1 — under the floor for text this size. This is
          the lightest step that clears it, so the tagline still reads as
          the accent rather than as a different colour. */}
      <p className="relative mt-1.5 text-accent-ink font-medium">{venture.tagline}</p>
      <p className="relative mt-4 text-ink/[0.78] leading-relaxed">{venture.desc}</p>
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
      {/* No section-wide fern. It rose from the bottom edge as "the quiet
          bed the six card motifs sit on", but each venture card already
          carries its own fractal, so the bed competed with the things it
          was meant to support — two layers of the same idea at two
          opacities. The cards keep theirs; the section ground stays plain. */}
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
