import { Eyebrow } from "./Decor";

/* Partner testimonials. */
const TESTIMONIALS = [
  {
    name: "Lucas Kollmann",
    role: "Lunar-X",
    img: "/assets/testimonials/lucas-kollmann.jpg",
    quote:
      "Monal Digital has done a fantastic job on Lunar Kids. They took the series from rough concept to polished episodes at a scale we simply couldn't reach on our own, and the animation quality lifted the whole channel. Watch time and subscriber growth have climbed steadily ever since.",
  },
  {
    name: "Mohit Pachwari",
    role: "Adruto",
    img: "/assets/testimonials/mohit-pachwari.jpg",
    quote:
      "What impressed us most was the reliability. Monal handled scripting, animation, and delivery end to end, always on schedule and always on brief. They understood our young audience better than we did, and the engagement on every release proves it.",
  },
  {
    name: "Mayank Pachwari",
    role: "The Boldeye",
    img: "/assets/testimonials/mayank-pachwari.jpg",
    quote:
      "Monal didn't just produce content for us, they helped shape original characters and stories our viewers genuinely love. Their instinct for what keeps kids watching is rare, and partnering with them has been one of the best decisions we've made.",
  },
];

type Testimonial = (typeof TESTIMONIALS)[number];

/* A line lifted verbatim from the quote below it, set large. Carries the
   section's colour and gives the eye a way in before the dense quotes. */
const PullQuote = ({
  t,
  line,
  tone,
}: {
  t: Testimonial;
  line: string;
  tone: "royal" | "sun";
}) => {
  const skin =
    tone === "royal"
      ? { surface: "bg-royal text-white", role: "text-white/60", ring: "ring-white/30" }
      : { surface: "bg-sun text-ink", role: "text-ink/55", ring: "ring-ink/15" };
  return (
    <div
      data-tilt="5"
      className={`card card-hover border-transparent p-8 md:p-9 flex flex-col justify-between min-h-56 ${skin.surface}`}
    >
      <blockquote className="font-display text-[1.7rem] md:text-[2rem] leading-[1.12]">
        &ldquo;{line}&rdquo;
      </blockquote>
      <div className="mt-8 flex items-center gap-3">
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
    className={`group card card-hover p-7 md:p-8 flex flex-col ${className}`}
  >
    <span className="font-display text-royal text-5xl leading-none select-none mb-4" aria-hidden="true">
      &rdquo;
    </span>
    <p className="text-ink/80 leading-relaxed">{t.quote}</p>
    <div className="mt-auto pt-6 flex items-center gap-3 border-t border-line mt-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={t.img}
        alt={t.name}
        loading="lazy"
        className="w-11 h-11 rounded-full shrink-0 object-cover ring-2 ring-royal/15 transition-transform duration-300 group-hover:scale-110"
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
    <section id="testimonials" className="relative bg-mist py-24 md:py-32 border-t border-line">
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center gap-5 mb-14 md:mb-16">
          <div data-reveal="up">
            <Eyebrow dot="bg-royal">In their words</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[0.98] max-w-3xl"
          >
            More than a <span className="mark-violet">production line</span>.
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
            tone="royal"
            line="A scale we simply couldn’t reach on our own."
          />
          <QuoteCard t={TESTIMONIALS[1]} />
          <QuoteCard t={TESTIMONIALS[2]} />
          <QuoteCard t={TESTIMONIALS[0]} className="md:col-span-2" />
          <PullQuote
            t={TESTIMONIALS[1]}
            tone="sun"
            line="Always on schedule. Always on brief."
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
