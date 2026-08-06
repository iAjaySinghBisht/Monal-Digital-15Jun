import { Eyebrow } from "./Decor";
import AipanMark from "./AipanMark";

/* Partner testimonials. */
const TESTIMONIALS = [
  {
    name: "Tobias Hoss",
    role: "30 Dishes",
    img: "/assets/testimonials/tobias-hoss.jpg",
    quote:
      "Monal brings an unusual combination of depth, breadth, sincerity, and vision. They understand both the creative and commercial sides of the business, think long term, and approach every project with genuine care. Their ambition is big, but their way of working remains grounded and professional.",
  },
  {
    name: "Vaibhav Kumaresh",
    role: "Vaibhav Studios",
    img: "/assets/testimonials/vaibhav-kumaresh.jpg",
    quote:
      "In a short span, team Monal Kids has created a loveable little world dedicated to local audiences. Their commitment towards giving high quality content to its audiences is rare and commendable. We are glad to be a part of their journey and I wish them all the very best!",
  },
  {
    name: "Lucas Kollmann",
    role: "Lunar X",
    img: "/assets/testimonials/lucas-kollmann.jpg",
    quote:
      "Monal combines a deep understanding of kids’ content with expertise in YouTube analytics, retention, and production. They connect the dots quickly and turn early ideas into polished, engaging content. Sometimes, we wonder whether they already have access to AGI.",
  },
];

type Testimonial = (typeof TESTIMONIALS)[number];

/* A line lifted verbatim from the quote below it, set large. Carries the
   section's colour and gives the eye a way in before the dense quotes. */
const PullQuote = ({
  t,
  line,
}: {
  t: Testimonial;
  line: string;
}) => {
  /* One skin, not two. These were a accent card and a sun card sitting
     side by side, which put the ACTION colour on something you cannot
     act on — accent now means "you can press this" and a quote is not a
     button. Both pull quotes take the signature band.

     THE ROLE LINE IS FULL INK, not a dimmed one. Ink on violet is
     4.74:1 — it clears AA with nothing to spare, so ANY opacity below
     100% drops it under (ink/55 lands at 2.45:1). It was already under
     on the teal this replaced, at 3.15:1; violet just makes a failure
     that was already there impossible to ignore. Hierarchy comes from
     the size, weight and tracking instead, which were doing most of the
     work anyway. */
  const skin = { surface: "bg-violet text-ink", role: "text-ink", ring: "ring-ink/15" };
  return (
    <div
      data-tilt="5"
      className={`card card-hover border-transparent p-8 md:p-9 flex flex-col justify-between min-h-56 relative overflow-hidden ${skin.surface}`}
    >
      {/* Corner marks, the pair, as on the namesake card in About. This is
          the other place on the page that carries a full-bleed brand colour
          rather than a white card, and the ornament needs a field to sit in
          — on the pale cards there is nothing for it to be an ornament ON,
          which is why those take a single corner at 4.5% instead.

          `text-ink` rather than white: this band is a light one and the
          card already sets ink for its copy, so the mark belongs to the
          same value. 0.16 matches About — enough to notice second, after
          the words, never first. */}
      <AipanMark
        motif="corner"
        size={38}
        className="pointer-events-none absolute left-2 top-2 text-ink opacity-[0.16]"
      />
      <AipanMark
        motif="corner"
        size={38}
        className="pointer-events-none absolute right-2 bottom-2 rotate-180 text-ink opacity-[0.16]"
      />
      <blockquote className="relative font-display text-[1.7rem] md:text-[2rem] leading-[1.12]">
        &ldquo;{line}&rdquo;
      </blockquote>
      <div className="relative mt-8 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.img}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={`w-9 h-9 rounded-full shrink-0 object-cover ring-2 ${skin.ring}`}
        />
        <div className="leading-tight">
          <div className="font-semibold text-sm">{t.name}</div>
          <div className={`text-[10px] font-semibold uppercase tracking-[0.14em] mt-0.5 ${skin.role}`}>
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuoteCard = ({ t, className = "" }: { t: Testimonial; className?: string }) => (
  <article
    data-tilt="4"
    className={`group card card-hover p-7 md:p-8 flex flex-col relative overflow-hidden ${className}`}
  >
    {/* Same corner as the venture cards, same reasoning: texture, not
        ornament. These quotes are the page's quietest surface, so the mark
        sits lower still. */}
    <AipanMark
      motif="corner"
      size={28}
      className="pointer-events-none absolute left-1.5 top-1.5 text-ink opacity-[0.045]"
    />
    {/* THE MARGIN HERE IS NEGATIVE, AND IT HAS TO BE. A &rdquo; is a
        high mark: measured against this font at 48px its ink runs from
        36px down to 25px above the baseline, so more than half the glyph's
        own advance is empty space underneath it. At `leading-none` with
        `mb-4` that stacked into a 52px hole between the mark and the first
        line of the quote, and the card opened on a band of nothing.

        Two levers, because one is not enough. `leading-[0.45]` sizes the
        line box to the ink instead of the em, and the negative margin
        absorbs the dead space below the ink that shrinking the box cannot
        reach — the baseline rises with the box, so the gap only closes by
        half otherwise. Net result is ~19px of real space. */}
    <span
      className="relative block font-display text-accent-ink text-5xl leading-[0.45] select-none -mb-1"
      aria-hidden="true"
    >
      &rdquo;
    </span>
    {/* The rule's breathing room lives HERE, not on the footer. The footer
        needs `mt-auto` to sit at the bottom of a stretched card, and an
        auto margin cannot also be a fixed one — the `mt-6` that used to
        sit beside it computed to 0 and the divider hugged the last line of
        text. Spacing the paragraph instead gives 24px above the rule to
        match the 24px `pt-6` below it. */}
    <p className="text-ink/80 leading-relaxed mb-6">{t.quote}</p>
    <div className="mt-auto pt-6 flex items-center gap-3 border-t border-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={t.img}
        alt={t.name}
        loading="lazy"
        className="w-11 h-11 rounded-full shrink-0 object-cover ring-2 ring-accent-ink/15 transition-transform duration-300 group-hover:scale-110"
      />
      <div className="leading-tight">
        <div className="font-display text-ink">{t.name}</div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted mt-1">
          {t.role}
        </div>
      </div>
    </div>
  </article>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative bg-paper py-24 md:py-32 border-t border-line">
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center gap-5 mb-14 md:mb-16">
          <div data-reveal="up">
            <Eyebrow>In their words</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[0.98] max-w-3xl"
          >
            More than a <span className="mark">production line</span>.
          </h2>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="text-muted max-w-md leading-relaxed"
          >
            What studios, creators, and brands say about working with Monal.
          </p>
        </div>

        {/* Each pull-quote sits directly above the full quote it's lifted
            from, so it reads as a callout into the detail. No CTA here —
            the page's single ask lives in the footer.

            Every `line` is lifted verbatim from the quote it points at —
            the card prints the speaker beneath the callout, so a line that
            drifts from its source puts words in someone's mouth. */}
        <div data-reveal-group="up" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <PullQuote
            t={TESTIMONIALS[0]}
            line="An unusual combination of depth, breadth, sincerity, and vision."
          />
          <QuoteCard t={TESTIMONIALS[1]} />
          <QuoteCard t={TESTIMONIALS[2]} />
          <QuoteCard t={TESTIMONIALS[0]} className="md:col-span-2" />
          {/* [2], not [1] — the line is Lucas's and the card prints the
              speaker beneath it, so pointing this at Vaibhav would have put
              his name and photo under someone else's words.

              He gives up the callout rather than sharing it: two pull
              quotes, three testimonials. His words still run in full in the
              QuoteCard above. */}
          <PullQuote
            t={TESTIMONIALS[2]}
            line="Sometimes, we wonder whether they already have access to AGI."
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
