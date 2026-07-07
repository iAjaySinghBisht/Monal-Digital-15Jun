import Link from "next/link";
import { Eyebrow, Pill } from "./Decor";

/* Partner testimonials. */
const TESTIMONIALS = [
  {
    name: "Lucas Kollmann",
    role: "Lunar-X",
    quote:
      "Monal Digital has done a fantastic job on Lunar Kids. They took the series from rough concept to polished episodes at a scale we simply couldn't reach on our own, and the animation quality lifted the whole channel. Watch time and subscriber growth have climbed steadily ever since.",
  },
  {
    name: "Mohit Pachwari",
    role: "Adruto",
    quote:
      "What impressed us most was the reliability. Monal handled scripting, animation, and delivery end to end, always on schedule and always on brief. They understood our young audience better than we did, and the engagement on every release proves it.",
  },
  {
    name: "Mayank Pachwari",
    role: "The Boldeye",
    quote:
      "Monal didn't just produce content for us, they helped shape original characters and stories our viewers genuinely love. Their instinct for what keeps kids watching is rare, and partnering with them has been one of the best decisions we've made.",
  },
];

type Testimonial = (typeof TESTIMONIALS)[number];

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
      <span className="grid place-items-center w-11 h-11 rounded-full bg-royal text-white shrink-0 font-display text-base transition-transform duration-300 group-hover:scale-110">
        {t.role.charAt(0)}
      </span>
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
            <Eyebrow dot="bg-royal">Testimonials</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[0.98] max-w-3xl"
          >
            Loved by <span className="mark-violet">partners</span>.
          </h2>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="text-muted max-w-md leading-relaxed"
          >
            What studios, creators, and brands say about working with Monal.
          </p>
        </div>

        {/* Bento */}
        <div data-reveal-group="up" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Big rating tile */}
          <div
            data-tilt="5"
            className="card card-hover bg-royal border-transparent p-8 md:p-9 flex flex-col justify-between text-white min-h-56"
          >
            {/* 5-star rating, filled to 4.9 / 5 (98%) */}
            <div
              className="relative inline-block w-max text-2xl leading-none tracking-[0.15em] select-none"
              role="img"
              aria-label="Rated 4.9 out of 5"
            >
              <div className="text-white/25" aria-hidden="true">★★★★★</div>
              <div
                className="absolute inset-0 overflow-hidden whitespace-nowrap text-sun"
                style={{ width: "98%" }}
                aria-hidden="true"
              >
                ★★★★★
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[3.4rem] leading-none">4.9</span>
                <span className="font-display text-xl text-white/45">/ 5</span>
              </div>
              <p className="mt-2 text-white/70 text-sm">Average partner rating</p>
            </div>
          </div>

          <QuoteCard t={TESTIMONIALS[0]} />
          <QuoteCard t={TESTIMONIALS[1]} />
          <QuoteCard t={TESTIMONIALS[2]} className="md:col-span-2" />

          {/* Yellow CTA tile */}
          <div
            data-tilt="5"
            className="card card-hover bg-sun border-transparent p-8 md:p-9 flex flex-col justify-between min-h-56"
          >
            <span className="font-display text-ink text-2xl leading-tight">
              Build the next children&apos;s brand with us.
            </span>
            <div className="mt-6">
              <Pill as={Link} href="/contact-us" variant="dark">
                Get started
              </Pill>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
