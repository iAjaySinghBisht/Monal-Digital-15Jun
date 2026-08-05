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
    name: "Mohit Pachwari",
    role: "Adruto",
    img: "/assets/testimonials/mohit-pachwari.jpg",
    quote:
      "What impressed us most was the reliability. Monal handled scripting, animation, and delivery end to end, always on schedule and always on brief. They understood our young audience better than we did, and the engagement on every release proves it.",
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
     button. Both pull quotes take the signature band. */
  const skin = { surface: "bg-teal text-ink", role: "text-ink/55", ring: "ring-ink/15" };
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
    <span className="relative font-display text-accent-ink text-5xl leading-none select-none mb-4" aria-hidden="true">
      &rdquo;
    </span>
    <p className="text-ink/80 leading-relaxed">{t.quote}</p>
    <div className="mt-auto pt-6 flex items-center gap-3 border-t border-line mt-6">
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
            the page's single ask lives in the footer. */}
        <div data-reveal-group="up" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <PullQuote
            t={TESTIMONIALS[0]}
            /* Lifted verbatim from the quote below it — the old line came
               from the Lunar-X testimonial this replaced, so it had to
               move with it or the callout would quote words that are no
               longer on the page. */
            line="An unusual combination of depth, breadth, sincerity, and vision."
          />
          <QuoteCard t={TESTIMONIALS[1]} />
          <QuoteCard t={TESTIMONIALS[2]} />
          <QuoteCard t={TESTIMONIALS[0]} className="md:col-span-2" />
          {/* [2], not [1] — the line is Lucas's and the card prints the
              speaker beneath it, so pointing this at Mohit would have put
              his name and photo under someone else's words.

              He gives up the callout rather than sharing it: two pull
              quotes, three testimonials. His words still run in full in
              the QuoteCard above. */}
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
