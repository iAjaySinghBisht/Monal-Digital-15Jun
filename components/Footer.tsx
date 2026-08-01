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
import AipanBorder from "./AipanBorder";

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
      {/* The growing rule marks a link, so it takes the accent — violet is
          an identity band and may not carry meaning. */}
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
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr_1fr]">
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
              <a href="tel:+917017820679" className="flex min-h-11 items-center text-white/80 text-lg hover:text-accent transition-colors">
                +91 70178 20679
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
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35 mb-5">
                  Explore
                </div>
                <ul className="space-y-1 text-base">
                  <FooterLink href="/work">Portfolio</FooterLink>
                  <FooterLink href="/services">Services</FooterLink>
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

            Reading up the frame: deep-purple foothills, accent, violet, and
            snow furthest back. Distance drains colour, which is why the far
            range is the pale one — it is the only one above the snowline.

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
            /* Deliberately NOT a spectrum band: this range is above the
               snowline, and snow is the absence of hue. A pale neutral
               with a trace of the violet in it. */
            fill="#eaecf7"
            /* 0.45 was tuned against a near-black GREEN canvas. Over this
               footer's true black the same value reads as a grey haze
               rather than a snowline, so it sits lower here. */
            fillOpacity="0.3"
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
          {/* Azure — the range below the snowline. Furthest of the two, so
              it takes the bluer band: distance drains warmth. */}
          <path
            d={ridgePath(
              [...KUMAON_SKYLINE.slice(2), ...KUMAON_SKYLINE.slice(0, 2)],
              1440,
              520,
              232,
              0.48,
            )}
            style={{ fill: "var(--color-azure)" }}
            fillOpacity="0.16"
          />
          {/* Violet — nearer still, sitting just above the foothills. */}
          <path
            d={ridgePath(
              [...KUMAON_SKYLINE.slice(4), ...KUMAON_SKYLINE.slice(0, 4)],
              1440,
              520,
              312,
              0.62,
            )}
            style={{ fill: "var(--color-violet)" }}
            fillOpacity="0.2"
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
              same profile flattened right down and shifted again. */}
          <path
            d={ridgePath(
              [...KUMAON_SKYLINE.slice(5), ...KUMAON_SKYLINE.slice(0, 5)],
              1440,
              520,
              392,
              0.75,
            )}
            /* The darkest range, so the violet band taken most of the way
               down to black rather than an unrelated navy. */
            style={{ fill: "color-mix(in srgb, var(--color-violet) 42%, #06060b)" }}
            fillOpacity="1"
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

          The margin is doing real work. The foreground range ends in a
          hard, fully-saturated edge, and with the band flush against it
          the purple and the ochre read as one two-tone stripe rather than
          as a landscape above a threshold. The gap is the night between
          them — it is what the removed co-brand block used to provide
          incidentally, now stated on purpose. */}
      <AipanBorder className="mt-9 md:mt-11" />

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
