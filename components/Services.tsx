import Link from "next/link";
import { ventures, brands, type Venture } from "@/data/constants";
import { Eyebrow, ArrowUpRight } from "./Decor";

/* Per-card pastel tint + hover accent. */
const TINTS = [
  { plate: "bg-lav", hover: "group-hover:bg-royal" },
  { plate: "bg-sun-soft", hover: "group-hover:bg-sun" },
  { plate: "bg-mint", hover: "group-hover:bg-royal" },
];

/* Tinted mist so the cards still read against the section's white canvas —
   the same treatment About gives its story card. */
const VentureCard = ({
  venture,
  num,
  tint,
}: {
  venture: Venture;
  num: string;
  tint: { plate: string; hover: string };
}) => {
  const isExternal = venture.href?.startsWith("http");
  const surface =
    "group card card-hover bg-mist border-transparent flex flex-col p-7 md:p-8";

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={`grid place-items-center w-14 h-14 rounded-2xl font-display text-xl text-ink transition-colors duration-300 ${tint.plate} ${tint.hover} group-hover:text-white`}>
          {num}
        </span>
        {/* A venture is either not open yet, or somewhere you can go — never both. */}
        {venture.status ? (
          <span className="mt-1 shrink-0 rounded-full border border-line bg-paper px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
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

      <h3 className="mt-7 font-display text-ink text-2xl md:text-[1.7rem] leading-tight">
        {venture.title}
      </h3>
      <p className="mt-1.5 text-royal font-medium">{venture.tagline}</p>
      <p className="mt-4 text-muted leading-relaxed">{venture.desc}</p>
    </>
  );

  if (!venture.href) {
    return (
      <div data-tilt="4" className={surface}>
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
    <section id="services" className="relative bg-paper py-24 md:py-32 border-t border-line">
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {/* Header */}
        {showHeader && (
          <div className="flex flex-col items-center text-center gap-5 mb-14 md:mb-20">
            <div data-reveal="up">
              <Eyebrow dot="bg-sun">Our Ecosystem</Eyebrow>
            </div>
            <h2
              data-split
              className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[0.98] max-w-3xl"
            >
              What we&apos;re <span className="mark-sun">building</span>.
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
              tint={TINTS[i % TINTS.length]}
            />
          ))}
        </div>

        {/* Partners */}
        {showPartners && (
        <div className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-line">
          <div className="flex flex-col items-center text-center gap-5 mb-12 md:mb-16">
            <div data-reveal="up">
              <Eyebrow dot="bg-royal">Our Partners</Eyebrow>
            </div>
            <h2
              data-split
              className="font-display text-ink text-[clamp(1.8rem,5vw,3.6rem)] leading-[0.98] max-w-3xl"
            >
              Trusted by creators &amp; studios <span className="mark-violet">worldwide</span>.
            </h2>
          </div>

          <div
            data-reveal-group="up"
            className="flex flex-wrap justify-center gap-4 md:gap-5"
          >
            {brands.map((b, i) => {
              /* Per-logo scale: named tweaks first, then a slight shrink for
                 everything past the first row of three. */
              const scale =
                b.name === "Adruto"
                  ? "scale-[1.35] group-hover:scale-[1.45]"
                  : b.name === "Lunar-X" || b.name === "Tata Play"
                    ? "scale-[1.15] group-hover:scale-[1.22]"
                    : b.name === "Lenny's Studios"
                      ? "scale-[0.78] group-hover:scale-[0.83] rounded-xl"
                      : i >= 3
                        ? "scale-[0.9] group-hover:scale-[0.95]"
                        : "group-hover:scale-105";
              return (
                <div
                  key={b.name}
                  data-tilt="4"
                  className={`group card card-hover min-h-44 flex items-center justify-center w-full sm:w-[calc(33.333%-0.667rem)] md:w-[calc(33.333%-0.834rem)] ${
                    b.color ? "p-4" : "p-8"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.logo}
                    alt={b.name}
                    loading="lazy"
                    className={`w-auto object-contain transition-all duration-500 ${
                      b.color
                        ? "max-h-32 md:max-h-40 max-w-full"
                        : "max-h-14 md:max-h-16 max-w-[70%]"
                    } ${
                      b.color || b.noTint
                        ? ""
                        : "brightness-0 opacity-80 group-hover:opacity-100"
                    } ${scale}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export default Services;
