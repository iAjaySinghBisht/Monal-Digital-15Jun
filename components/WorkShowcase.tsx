import { type Project, type Channel } from "@/data/constants";

/* ------------------------------------------------------------------ *
 *  THE SHOWCASE — one full-bleed band of key art per title, each
 *  followed by a light band naming it and the channels that carry it.
 *
 *  This replaces a 3-across card grid. A grid is a good way to let
 *  someone SCAN a catalogue and a bad way to make any single title feel
 *  like it matters; at 380px wide a cast of six characters is a smudge.
 *  Seven titles is few enough to give each the full width of the screen,
 *  which is the whole argument for the format.
 *
 *  HOW THE MOTION WORKS. Two effects, both already in this codebase's
 *  animation engine (see hooks/useUiAnimations.ts), so nothing new is
 *  loaded to do it:
 *
 *    `data-parallax`  scrubs the art's y-offset against scroll position,
 *                     so it drifts slower than the page. This is the
 *                     effect that makes a band read as a WINDOW onto the
 *                     art rather than a picture pasted at that spot.
 *    `data-reveal`    fades and lifts the naming band as it enters view,
 *                     so a title arrives just after its art has settled.
 *
 *  THE ART MUST OVERHANG THE BAND. Parallax moves the image inside a
 *  clipped frame, so an image exactly as tall as its band would drag a
 *  hard edge into view at one end of the scroll. `-inset-y-32` gives
 *  128px of overhang top and bottom against a ±90px travel, which is the
 *  margin that keeps the frame full at every scroll position.
 *
 *  Everything degrades without JavaScript, and `prefers-reduced-motion`
 *  is honoured by the engine: the parallax simply never starts and the
 *  bands sit at their natural positions, fully legible.
 * ------------------------------------------------------------------ */

/* Total travel is 2x this — the layer runs from -110 to +110 across the
   band's pass through the viewport. Raised from 90: at the old value the
   drift was easy to miss on a phone, where the whole band crosses the
   screen in far less scrolling than on a desktop. The overhang below is
   128px, which covers it; raise this past that and an edge shows. */
const PARALLAX = 110;
/* Deliberately a fraction of the art's travel, not a match — the gap
   between the two is the depth. It stays small so the mark never drifts
   out of its corner while the band is on screen. */
const LOGO_PARALLAX = 30;

const ArtBand = ({ p, index }: { p: Project; index: number }) => (
  <section
    aria-labelledby={`work-${index}`}
    /* A tall band on every screen, so the drift has room to read. Phones
       get 56vh rather than the desktop 86vh: enough height for the
       parallax to be worth having, while trimming less of a 16:9 frame
       than a full-height band would. */
    className="relative w-full overflow-hidden bg-ink h-[56vh] min-h-[340px] md:h-[86vh] md:min-h-[560px]"
  >
    {/* The overhang must cover the travel at BOTH ends or an edge drags
        into frame — 128px against PARALLAX's 110. Change one and check
        the other. */}
    <div data-parallax={PARALLAX} className="absolute -inset-y-32 inset-x-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.img}
        srcSet={`${p.small} 800w, ${p.img} 1600w`}
        sizes="100vw"
        alt={p.title}
        loading={index === 0 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : "auto"}
        className="h-full w-full object-cover"
      />
    </div>

    {/* A whisper of a scrim, top and bottom only. The band below carries
        the words, so this is not here to make text readable — it is here
        to stop bright key art butting straight into a white band, which
        reads as a seam rather than a transition. */}
    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink/25 via-transparent to-ink/25" />

    {/* A ground for the wordmark, same reasoning as the cards on the
        homepage: a logo cannot choose its backdrop. Zappy Zoo's is pale
        blue and white and would sit on open sky unaided. Unnoticeable
        behind a dark logo, load-bearing behind a light one. */}
    {p.logo ? (
      <div className="pointer-events-none absolute right-0 top-0 h-2/3 w-2/3 bg-[radial-gradient(ellipse_at_top_right,rgba(24,24,27,0.6),transparent_70%)]" />
    ) : null}

    {/* Corner, not centre. Centred over key art the wordmark competes with
        the cast for the middle of the frame — the art is the subject here
        and the logo is the label on it. Top-right also matches where the
        same wordmark sits on the homepage cards, so the two pages agree.
        `alt` is set rather than empty: unlike the cards, nothing else in
        this band names the show above the fold. */}
    {/* TWO SPEEDS MAKE DEPTH. The art drifts at 110 and the wordmark at
        30, so they separate as the band passes rather than sliding as one
        flat picture — the thing that turns a moving image into layers.
        The parallax lives on this wrapper because `data-reveal` on the
        image already owns its transform, and two GSAP tweens fighting
        over the same property is how one of them silently loses. */}
    {p.logo ? (
      <div
        data-parallax={LOGO_PARALLAX}
        className="pointer-events-none absolute right-5 top-8 md:right-10 md:top-12 z-10"
      >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-reveal="zoom"
        src={p.logo}
        alt={p.title}
        loading={index === 0 ? "eager" : "lazy"}
        /* Capped on BOTH axes, because the set spans 1.2:1 to 3.2:1:
           height alone leaves the near-square marks undersized against a
           full-bleed band, width alone inverts that. Whichever cap binds
           first, the marks stay comparable.

           `--ls` scales the caps per show (see `logoScale` in
           data/constants.ts) — the squarer wordmarks are height-bound and
           need a bigger box to carry the same weight. It multiplies the
           CAP rather than transforming the image, because `data-reveal`
           owns this element's transform. */
        style={{ ["--ls" as string]: p.logoScale ?? 1 }}
        className="w-auto object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)] max-h-[calc(4rem*var(--ls))] max-w-[calc(11rem*var(--ls))] md:max-h-[calc(8rem*var(--ls))] md:max-w-[calc(24rem*var(--ls))]"
      />
      </div>
    ) : null}
  </section>
);

/* PLATFORM MARKS, in each platform's own colour.
 *
 *  DRAWN, NOT OFFICIAL. These are reconstructions: YouTube's play button
 *  and Spotify's three arcs are simple geometry and come out faithful,
 *  and Prime Video is its app tile — a rounded square, a play triangle
 *  and the smile beneath it — in Prime's blue. They read correctly at a
 *  glance, which is what a "streaming on" row needs, but they are not the
 *  files those companies publish. Before launch, replace each with the
 *  official SVG from that platform's brand or press kit: set `logo` on
 *  the channel in data/constants.ts and the drawn mark steps aside, which
 *  is exactly how Tata Play already works.
 *
 *  Colour is baked in rather than inherited, so these keep their brand
 *  identity instead of picking up the row's ink — which is the point of
 *  showing a mark rather than a name.
 */
const GLYPHS: Record<string, React.ReactNode> = {
  Spotify: (
    <svg viewBox="0 0 24 24" className="h-[1em] w-[1em] shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1DB954" />
      <g fill="none" stroke="#fff" strokeLinecap="round">
        <path d="M6.8 15.4c3.3-.8 6.3-.5 8.9 1.1" strokeWidth="1.5" />
        <path d="M6 12.2c4-1 7.7-.6 10.8 1.3" strokeWidth="1.7" />
        <path d="M5.4 8.8c4.7-1.2 9-.7 12.6 1.5" strokeWidth="1.9" />
      </g>
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" className="h-[1em] w-[1em] shrink-0" aria-hidden="true">
      <path
        fill="#FF0000"
        d="M23 12s0-3.4-.4-5.1a2.9 2.9 0 0 0-2-2C18.6 4.5 12 4.5 12 4.5s-6.6 0-8.5.4a2.9 2.9 0 0 0-2 2C1 8.6 1 12 1 12s0 3.4.4 5.1c.2 1 1 1.8 2 2 1.9.4 8.5.4 8.5.4s6.6 0 8.5-.4c1-.2 1.8-1 2-2 .4-1.7.4-5.1.4-5.1z"
      />
      <path fill="#fff" d="M9.9 15.4V8.6l5.6 3.4-5.6 3.4z" />
    </svg>
  ),
};

/* Amazon and Prime Video both take the PRIME VIDEO mark: the shows are on
   Prime Video, and Amazon's own smile-arrow would point at the shop
   rather than the place you watch. One drawing, registered under both
   names so either spelling in the data resolves to it. */
GLYPHS["Amazon Prime Video"] = GLYPHS.Amazon = (
  <svg viewBox="0 0 24 24" className="h-[1em] w-[1em] shrink-0" aria-hidden="true">
    <rect x="1" y="2.5" width="22" height="19" rx="4.5" fill="#00A8E1" />
    <path fill="#fff" d="M9.9 8.1 15.6 11.5 9.9 14.9z" />
    <path
      fill="none"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      d="M5.6 17.4c3.9 1.9 8.9 1.9 12.8 0"
    />
  </svg>
);

/* A platform in the "streaming on" list. MARK ONLY, and inert: this is a
   statement of where a show is distributed, not a set of places to go —
   the two buttons in the middle of the band are what you click.

   `title` rather than a visible label, so the name is still available on
   hover and to assistive tech without printing it. Where no mark exists
   the name is set instead: an icon-only row that silently drops the
   platforms we lack artwork for would understate the distribution, which
   is the one thing this row is for. */
const ChannelMark = ({ c }: { c: Channel }) => {
  const glyph = c.logo ? (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={c.logo}
      alt={c.name}
      title={c.name}
      loading="lazy"
      className="h-7 w-auto max-w-28 object-contain"
    />
  ) : (
    GLYPHS[c.name] ?? null
  );

  if (glyph) {
    return (
      <span
        title={c.name}
        aria-label={c.name}
        /* The glyphs are sized in `em`, so one font-size here scales every
           drawn mark at once and keeps them level with the image marks.

           These carry their own colour now, so the row cannot tint them —
           it lifts them out of a slight rest opacity instead. Muted at
           rest keeps seven bands of bright brand colour from shouting
           down the titles they sit beside; full strength on hover. */
        className="inline-flex items-center text-[26px] leading-none opacity-80 transition-opacity duration-500 ease-out group-hover/band:opacity-100"
      >
        {glyph}
      </span>
    );
  }
  return (
    <span className="text-[13px] font-semibold leading-none whitespace-nowrap text-ink/70">
      {c.name}
    </span>
  );
};

/* YouTube and Spotify — the only two marks in the row you can click, and
   the only two we hold real URLs for. Same size and baseline as the inert
   marks beside them so the row reads as one set; what separates them is
   that they answer the pointer, which is the honest signal for "this goes
   somewhere" when there is no label to say so. */
const WatchMark = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${label} — opens in a new tab`}
    title={label}
    /* A coloured mark cannot signal "clickable" by changing colour, so
       these answer the pointer with movement instead: they lift and grow
       while the inert marks beside them stay put. */
    className="inline-flex items-center text-[26px] leading-none opacity-80 transition-[opacity,transform] duration-300 ease-out hover:-translate-y-0.5 hover:scale-110 hover:opacity-100"
  >
    {children}
  </a>
);

const ChannelBand = ({ p, index }: { p: Project; index: number }) => {
  const channels = p.channels ?? [];
  return (
    <section className="group/band relative bg-paper border-t border-line">
      <div className="mx-auto max-w-325 px-6 md:px-12 py-14 md:py-20">
        {/* THE NUMBER IS GONE. An index told the reader which of seven
            this was, which is a thing the page already shows by being a
            list — and it sat where the eye lands first, above the title,
            so the loudest word in the band was a digit. The title leads
            now, and the platforms answer the question a portfolio band
            actually raises: where can I watch it. */}
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between md:gap-12">
          {/* The title takes the accent when the band is hovered — the
              `group` is the whole band, so it lights up together with the
              chips rather than needing the pointer on the words
              themselves, which on a heading this wide is a small target
              for something that is not a link. */}
          <h2
            id={`work-${index}`}
            data-reveal="up"
            className="min-w-0 font-display text-ink text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.02] tracking-tight transition-colors duration-500 ease-out group-hover/band:text-accent-ink"
          >
            {p.title}
          </h2>

          {/* Only when there is something true to show — an empty
              "Streaming on" heading reads as a page that failed to load. */}
          {(channels.length > 0 || p.links?.youtube || p.links?.spotify) && (
            /* RIGHT: label and marks on ONE line, divided by a rule. The
               divider is a 1px element rather than a typed "|" so it keeps
               its weight at any font size and never inherits the label's
               letter-spacing. */
            <div
              data-reveal="up"
              data-reveal-delay="0.14"
              className="flex flex-wrap items-center gap-x-4 gap-y-3 md:shrink-0 md:justify-end"
            >
              <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-muted whitespace-nowrap transition-colors duration-500 ease-out group-hover/band:text-ink">
                Streaming on
              </span>
              <span aria-hidden="true" className="h-6 w-px shrink-0 bg-line" />
              <div
                data-reveal-group="up"
                className="flex flex-wrap items-center gap-x-5 gap-y-3"
              >
                {/* The two clickable ones lead, because they are where a
                    visitor can actually go. YouTube is not repeated in
                    `channels` — it comes from `links` for every show, so
                    listing it in both would print it twice. */}
                {p.links?.youtube && (
                  <WatchMark href={p.links.youtube} label="YouTube">
                    {GLYPHS.YouTube}
                  </WatchMark>
                )}
                {p.links?.spotify && (
                  <WatchMark href={p.links.spotify} label="Spotify">
                    {GLYPHS.Spotify}
                  </WatchMark>
                )}
                {channels.map((c) => (
                  <ChannelMark key={c.name} c={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const WorkShowcase = ({ projects }: { projects: Project[] }) => (
  <>
    {projects.map((p, i) => (
      <div key={p.title}>
        <ArtBand p={p} index={i} />
        <ChannelBand p={p} index={i} />
      </div>
    ))}
  </>
);

export default WorkShowcase;
