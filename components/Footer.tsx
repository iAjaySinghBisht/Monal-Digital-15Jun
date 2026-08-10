import Link from "next/link";
import type { ReactNode } from "react";
import { Eyebrow, Pill } from "./Decor";
import {
  KUMAON_SKYLINE,
  peakLabel,
  ridgeCrests,
  ridgePath,
  ridgePoints,
} from "@/lib/himalaya";
import { SPECTRUM } from "@/lib/palette";
import { services } from "@/data/constants";
import AipanBorder from "./AipanBorder";

/* ------------------------------------------------------------------ *
 *  THE RANGES ARE ONE RAMP, not four colours that happen to sit near
 *  each other. Every range is the SAME teal band, mixed further toward
 *  the footer's own black the further back it sits, until the last is
 *  barely a shade above the page. Depth is carried by value alone — one
 *  hue, four distances.
 *
 *  NOTHING HERE REACHES THE RAW BAND. The nearest ridge briefly did, and
 *  full-strength teal is too much colour for a shape this size: it is the
 *  widest object in the footer, it renders OVER the wordmark, and at 100%
 *  it stopped being a landscape behind the logo and became a teal bar
 *  across it. The ramp now starts at 60% — a deep teal that still reads
 *  as the brand rather than as a dark neutral, with the band itself left
 *  to the things that are meant to be pressed.
 *
 *  IT USED TO RUN THE OTHER WAY, and that is the change worth naming.
 *  The old ramp was atmospheric perspective out of landscape painting:
 *  the near range darkest and near-black, the far ones lighter and
 *  hazier, because distance scatters light and drains contrast. This
 *  reverses it — the near range is the brightest thing in the footer and
 *  the distance falls away into black. It is the less literal of the two
 *  and the more legible on a black page: haze needs a bright sky behind
 *  it to read as haze, and this footer has none, so the pale far ranges
 *  were reading as grey fog rather than as distance.
 *
 *  THE STEPS HALVE — 60, 30, 15 — because equal steps do not look equal.
 *  Value is perceived closer to logarithmically than linearly, so a
 *  linear 60/40/20 ramp reads as two dark ranges and one lighter one.
 *  Halving keeps each gap looking like the same gap, and it is why
 *  lowering the front of the ramp meant moving all three rather than
 *  darkening one range and leaving a hole behind it.
 *
 *  Mixed toward #000 exactly, not a near-black: the footer is bg-black,
 *  so the far end of the ramp resolves to the ground it sits on and the
 *  last range dissolves rather than silhouetting against it. */
const rangeFill = (strength: number) =>
  `color-mix(in srgb, var(--color-teal) ${strength}%, #000)`;

const SocialIcon = ({
  children,
  href = "#",
  label,
}: {
  children: ReactNode;
  href?: string;
  label: string;
}) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="w-11 h-11 rounded-full border border-accent/40 text-accent flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all"
  >
    {children}
  </a>
);

/* `min-h-11` = 44px, the smallest target a thumb reliably hits (WCAG 2.5.8
   and the iOS/Android guidelines agree on it). These were 24px tall — the
   text's own line box — because an inline-flex link is only as tall as its
   content. The padding is vertical only, so the row rhythm is unchanged;
   what grows is the part you can actually press. */
const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <li>
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-2 py-1 text-white/60 hover:text-white transition-colors"
    >
      {/* The growing rule marks a link, so it takes the ACCENT token and
          not `teal`, even though the two resolve to the same hex. The
          distinction is the whole tier system: this one means "you can act
          on this", and if the accent ever moves off the band this rule
          follows it. An identity band would not. */}
      <span className="w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-4" />
      {children}
    </Link>
  </li>
);

const Footer = () => {
  return (
    <footer className="relative bg-black text-paper overflow-hidden">
      <div className="absolute inset-0 bg-dots-light opacity-50 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

      {/* Top — three cards */}
      <div className="relative max-w-325 mx-auto px-6 md:px-12 pt-24 md:pt-28 pb-12">
        {/* The link card carries three columns now, not two, so it takes
            width from the other two: at the old 1.4/1/1 each link column
            was 82px and "Pre-Production" broke mid-word. At 1.1/0.9/1.4
            they land near 128px, which clears it at the current text size.
            The CTA card lost the most because it is the one holding plain
            prose, which reflows; a link label cannot. */}
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr_1.4fr]">
          {/* Ready to start / CTA card */}
          <div className="rounded-[28px] bg-white/[0.04] border border-white/10 p-8 flex flex-col justify-between gap-10">
            <div>
              <div className="mb-6">
                <Eyebrow tone="dark">Let&apos;s build together</Eyebrow>
              </div>
              <h2 className="font-display text-white text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.04]">
                Building the Future of Childhood?
              </h2>
              <p className="mt-4 text-white/55 leading-relaxed max-w-md">
                Whether you&apos;re creating a new character, an original IP, an
                animated series, a game, or an AI-powered learning experience,
                we&apos;d love to help bring your vision to life.
              </p>
            </div>
            <div>
              <Pill as={Link} href="/contact-us" variant="primary">
                Build With Monal
              </Pill>
            </div>
          </div>

          {/* Get in touch */}
          <div
            id="contact"
            className="scroll-mt-28 rounded-[28px] bg-white/[0.04] border border-white/10 p-8 flex flex-col"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35 mb-5">
              Get in touch
            </div>
            <div className="space-y-2 mb-6">
              <a href="mailto:hello@monaldigital.com" className="flex min-h-11 items-center text-white/80 text-lg hover:text-accent transition-colors break-all">
                hello@monaldigital.com
              </a>
              <a href="tel:+918200696551" className="flex min-h-11 items-center text-white/80 text-lg hover:text-accent transition-colors">
                +91 82006 96551
              </a>
            </div>
            <p className="text-white/45 leading-relaxed mt-auto">
              Monal Digital, Karan Tower, Gas Godam Road,
              <br />
              Haldwani, Uttarakhand, India 263139
            </p>
          </div>

          {/* Explore + Socials */}
          <div className="rounded-[28px] bg-white/[0.04] border border-white/10 p-8 flex flex-col">
            {/* Three across. `gap-x-4` rather than 6: the two saved pixels
                per gap go to the labels, which is where they are needed —
                nothing here is close to touching its neighbour. */}
            <div className="grid grid-cols-3 gap-x-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35 mb-5">
                  Explore
                </div>
                <ul className="space-y-1 text-base">
                  <FooterLink href="/work">Portfolio</FooterLink>
                  <FooterLink href="/play">Play</FooterLink>
                  <FooterLink href="/team">Team</FooterLink>
                  <FooterLink href="/blog">Blog</FooterLink>
                </ul>
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35 mb-5">
                  Company
                </div>
                <ul className="space-y-1 text-base">
                  <FooterLink href="/about-us">About</FooterLink>
                  <FooterLink href="/contact-us">Contact</FooterLink>
                  <FooterLink href="/career">Careers</FooterLink>
                </ul>
              </div>

              {/* Driven from the `services` data rather than typed out, so
                  a renamed service or a changed slug cannot leave a dead
                  link here. `eyebrow` is the short label — `title` reads
                  "Pre-Production Services", which would stutter under a
                  heading already saying Services. */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35 mb-5">
                  Services
                </div>
                <ul className="space-y-1 text-base">
                  {Object.values(services).map((s) => (
                    <FooterLink key={s.slug} href={`/services/${s.slug}`}>
                      {s.eyebrow}
                    </FooterLink>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35 mb-4">
                Socials
              </div>
              <div className="flex flex-wrap gap-3">
                <SocialIcon href="https://www.linkedin.com/company/monaldigital" label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.3 18.3H5.7V9.7h2.6v8.6zM7 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM18.3 18.3h-2.6V14c0-1-.4-1.7-1.3-1.7-.7 0-1.1.5-1.3 1-.1.2-.1.4-.1.6v4.4h-2.6V9.7H13v1.1c.3-.5 1-1.3 2.4-1.3 1.7 0 3 1.1 3 3.5v5.3z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href="https://www.instagram.com/monaldigital" label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </SocialIcon>
                {/* Monal Kids Hindi — the channel the shows actually live on,
                    so this is the one social link that leads to the work. */}
                <SocialIcon href="https://www.youtube.com/@MonalKidsHindi" label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 12s0-3.4-.4-5.1a2.9 2.9 0 0 0-2-2C18.6 4.5 12 4.5 12 4.5s-6.6 0-8.5.4a2.9 2.9 0 0 0-2 2C1 8.6 1 12 1 12s0 3.4.4 5.1c.2 1 1 1.8 2 2 1.9.4 8.5.4 8.5.4s6.6 0 8.5-.4c1-.2 1.8-1 2-2 .4-1.7.4-5.1.4-5.1zM9.9 15.4V8.6l5.6 3.4-5.6 3.4z" />
                  </svg>
                </SocialIcon>
                {/* Monal Kids on Spotify — the same catalogue as the YouTube
                    channel beside it, which is why they sit together.

                    ONE PATH, not a disc with the arcs stroked over it: the
                    arcs are counters in the same fill, so they knock out and
                    the mark inherits `currentColor` like its neighbours —
                    accent at rest, white on the accent fill at hover. A
                    stroked version would need to know the background colour
                    and would break the moment that changed. */}
                <SocialIcon
                  href="https://open.spotify.com/artist/2oEWxoTZOcDMxF2Dhwpuwk"
                  label="Spotify"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.59 14.42a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.57-1.04 8.5-.59 11.66 1.34.35.22.46.68.25 1.03zm1.23-2.75a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.56-11.96-1.4a.94.94 0 1 1-.55-1.79c4.35-1.32 9.77-.68 13.48 1.6.44.27.58.85.32 1.28zm.11-2.86C14.05 8.51 7.9 8.3 4.2 9.43a1.12 1.12 0 1 1-.65-2.15C7.8 5.99 14.6 6.23 18.99 8.84a1.12 1.12 0 1 1-1.15 1.93z" />
                  </svg>
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Giant logo over a layered mountain range (brand shades).
          The id is the cue the header uses to hide itself. */}
      <div
        id="footer-logo"
        /* The ranges are anchored to the bottom of this box, so trading
           bottom padding for top padding sinks the wordmark into them —
           the letters read as resting on the ridge rather than floating
           above it. */
        className="relative px-6 md:px-12 pt-11 md:pt-18 pb-6 md:pb-10 select-none"
      >
        {/* Four ranges receding into the distance. Each is the real Kumaon
            skyline (see lib/himalaya.ts, so Nanda Devi genuinely dominates)
            rotated by a different number of peaks so no two ridgelines ever
            trace each other, and given a deeper `drop` the nearer it is —
            close valleys read as cut, far ones as hazed over.

            Reading up the frame: a deep teal at your feet, then the same
            band at half and a quarter of that as the ranges recede, then the
            snow. Depth is one hue at four values — see `rangeFill` above for
            why it runs bright-to-black rather than the other way, why
            nothing reaches the raw band, and why the steps halve instead of
            stepping evenly.

            The snow range's mask runs the OPPOSITE way to the others. They
            fade out towards the top so their peaks dissolve into the footer;
            that would make the summits the faintest part of this range,
            which is backwards — snow sits ON the peaks. This one is opaque
            at the top and fades out below, so what survives is the cap and
            the rock beneath it recedes behind the range in front. That fade
            IS the snowline.

            Because it stays opaque upwards it cannot overshoot the box the
            way a faded range harmlessly can: the container's top edge is
            viewBox y=148, so 150 is as tall as this range can be and still
            end inside its own frame. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-[140%] [mask-image:linear-gradient(to_top,transparent_30%,#000_58%)]"
        >
          <path
            d={ridgePath(KUMAON_SKYLINE, 1440, 520, 150, 0.34)}
            /* THE ONE RANGE OUTSIDE THE RAMP, and the only reason it is
               allowed to be is that it is not a distance — it is an
               ALTITUDE. Everything below is the same teal at four depths;
               this sits above the snowline, where the rule stops being
               "further away" and becomes "high enough to be white". Snow is
               the absence of hue, so it stays a pale neutral carrying only a
               trace of the range beneath it. */
            fill="#e3f0f2"
            /* DROPPED FROM 0.3 TO 0.14 when the ramp inverted. The old
               scheme got lighter with distance, so a pale cap at the back
               was the end of a progression and belonged there. Now the
               distance falls away to black and this is the only bright
               thing behind the ridges — at 0.3 it stopped reading as a
               snowline and started reading as the ramp failing at the last
               step. Faint enough to be a gleam on the far summits, which is
               all it was ever meant to be. */
            fillOpacity="0.14"
          />
        </svg>


        {/* Stretches full width and fades into the footer at the top.
            Both of these sit BEHIND the logo. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-[140%] [mask-image:linear-gradient(to_top,#000_55%,transparent)]"
        >
          {/* THE FAR RANGE — third step of the ramp, and the last one with
              any colour left in it. This was azure, the one range that took
              a different band on the argument that distance drains warmth.
              A second hue cannot survive a ramp built on value: at 15% it
              would be a blue-black next to a teal-black, which reads as a
              printing error rather than as depth. One hue, four distances.

              PAINTED OPAQUE NOW, where these two were 0.16 and 0.2. Low
              alpha was how the old atmospheric version worked — ranges
              showing THROUGH each other like haze. A value ramp wants the
              opposite: each ridge occludes the one behind it, so the
              silhouettes stay crisp and the depth comes from the steps. */}
          <path
            d={ridgePath(
              [...KUMAON_SKYLINE.slice(2), ...KUMAON_SKYLINE.slice(0, 2)],
              1440,
              520,
              232,
              0.48,
            )}
            style={{ fill: rangeFill(15) }}
          />
          {/* The middle step — nearer still, sitting just above the
              foothills, at a little under half the strength of the ridge in
              front of it. */}
          <path
            d={ridgePath(
              [...KUMAON_SKYLINE.slice(4), ...KUMAON_SKYLINE.slice(0, 4)],
              1440,
              520,
              312,
              0.62,
            )}
            style={{ fill: rangeFill(30) }}
          />
        </svg>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/monal-logo.png"
          alt="Monal Digital"
          loading="lazy"
          decoding="async"
          draggable="false"
          className="relative w-full max-w-[1100px] mx-auto h-auto"
        />

        {/* Small foreground range — rendered AFTER the logo so it sits ABOVE it */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-[140%] [mask-image:linear-gradient(to_top,#000_55%,transparent)]"
        >
          {/* Nearest range — the foothills you actually stand on, so the
              same profile flattened right down and shifted again.

              THE TOP OF THE RAMP, but not the raw band — 60%, a deep teal.
              It reached 100% for one pass and was too much: this shape is
              the widest thing in the footer and it renders OVER the
              wordmark, so at full strength it read as a teal bar across the
              logo rather than as ground in front of it. 60% keeps it
              obviously teal while leaving the band itself to the accent.

              It was the DARKEST range before the ramp inverted — teal taken
              58% of the way to black — so near enough this same value,
              arrived at from the opposite direction. The layer's own mask
              still fades it out towards the top, so even 60% is only
              reached along the very bottom edge of the page. */}
          <path
            d={ridgePath(
              [...KUMAON_SKYLINE.slice(5), ...KUMAON_SKYLINE.slice(0, 5)],
              1440,
              520,
              392,
              0.75,
            )}
            style={{ fill: rangeFill(60) }}
          />
        </svg>

        {/* The summits are real, so they are worth naming.

            LAST, and above the wordmark. On the first attempt this layer
            sat before the <img>, which is `relative` and therefore paints
            over it — five of the eight peaks were behind the letters and
            swallowed the hover, so most of the labels were unreachable.

            The cue is the SKYLINE ITSELF: a short stretch of ridge either
            side of each summit, drawn slightly brighter. No new shape is
            added, so it cannot clutter a range made of nothing but edges,
            and there is nothing to misalign — the crest is the same
            geometry as the range beneath it, from the same function.

            It has to carry the affordance alone: `.has-custom-cursor *`
            forces `cursor: none` site-wide for the dot cursor, so a
            `cursor: help` hint could never show.

            Placed from the same elevation mapping as the ridge, so neither
            crest nor label can drift off the summit it belongs to. The snow
            range is the one labelled: it is the only one drawn in true
            west-to-east order, the ranges in front are rotations. */}
        {/* `pointer-events-none` on the LAYER, `auto` on the pins. This box
            is h-[140%] anchored to the bottom, so it reaches 40% of its own
            height ABOVE this section — straight over the socials row and
            the foot of the link columns sitting above it. At z-10, and
            transparent, it was still an event target across that whole
            area: every social icon and several footer links were
            unclickable, with nothing visible to explain why. Only the 56px
            pins need to be hit. */}
        <div className="peak-layer pointer-events-none absolute inset-x-0 bottom-0 z-10 w-full h-[140%]">
          {/* Same viewBox and preserveAspectRatio as the ranges, so the lit
              crest inherits the identical stretch and lies exactly on the
              ridge rather than beside it. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 520"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            {/* Eight summits, eight bands of the wordmark — the ranges get
                to walk the brand spectrum exactly once, west to east, so
                each peak is identifiable by colour before you read it. */}
            {ridgeCrests(KUMAON_SKYLINE, 1440, 520, 150, 0.34).map(({ peak, d }, i) => (
              <path
                key={peak.name}
                className="peak-crest"
                d={d}
                fill="none"
                stroke={SPECTRUM[i % SPECTRUM.length].hex}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {ridgePoints(KUMAON_SKYLINE, 1440, 520, 150).map(({ peak, x, y }, i, all) => {
            /* The outermost summits sit ON the frame edges, so a label
               centred on them is half off-screen — the first version lost
               "Chaukham" and showed "ba · 7,138 m". These anchor their
               labels inward instead. Set from the index rather than
               :first-child, which never matched: the first child of the
               layer is the crest <svg>, not a pin. */
            const edge =
              i === 0 ? " peak-pin--start" : i === all.length - 1 ? " peak-pin--end" : "";
            return (
              <span
                key={peak.name}
                aria-label={peakLabel(peak)}
                role="img"
                className={`peak-pin${edge}`}
                /* Percentages against the same box the ranges are drawn in,
                   so a pin lands on its summit at every viewport width. The
                   ranges use preserveAspectRatio="none", which maps the
                   viewBox linearly onto this box — so x/1440 and y/520 are
                   exactly the ridge's own coordinates.

                   This is HTML rather than another <circle> for a reason:
                   inside that stretched viewBox a circle renders as an
                   ELLIPSE, because the 1440x520 box is squashed to a wide,
                   short one. The first version was visibly oval and sat 14
                   units below the summit it named. */
                style={{
                  left: `${(x / 1440) * 100}%`,
                  top: `${(y / 520) * 100}%`,
                  ["--peak" as string]: SPECTRUM[i % SPECTRUM.length].hex,
                }}
              >
                {/* Real markup rather than a ::before, so the name and the
                    elevation can be weighted differently — the name is what
                    you are reading, the height is a footnote to it. */}
                <span className="peak-label">
                  <span className="peak-name">{peak.name}</span>
                  <span className="peak-alt">{peak.m.toLocaleString("en-IN")} m</span>
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* The Aipan band, as the last thing before the page signs off.
          Aipan is laid at the threshold you are about to cross — the
          doorstep, not the wall — so it belongs at the closing edge, and
          it needs something dark to sit against, which the footer gives
          it. It carries the separation the copyright bar used to draw
          with a hairline, so that rule is gone: two edges 16px apart
          read as a mistake.

          FLUSH, ON PURPOSE. There used to be a margin here, argued for on
          the grounds that the ridge's hard saturated edge and the band's
          ochre would otherwise read as one two-tone stripe rather than as
          a landscape above a threshold. In practice the gap read as a
          strip of dead page between two finished things — and aipan is
          laid ON the threshold, touching it, not hovering above it.
          Flush is also the truer nod: the paste meets the earth. */}
      <AipanBorder />

      {/* Bottom bar */}
      <div className="relative">
        <div className="max-w-325 mx-auto px-6 md:px-12 py-7 flex items-center justify-center text-center">
          <span className="text-[12px] text-white/45">
            © 2026 Monal Digital · Haldwani
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
