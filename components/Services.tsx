import { ventures, brands, type Venture } from "@/data/constants";
import { Eyebrow } from "./Decor";

/* Per-card pastel tint + hover accent. */
const TINTS = [
  { plate: "bg-lav", hover: "group-hover:bg-royal" },
  { plate: "bg-sun-soft", hover: "group-hover:bg-sun" },
  { plate: "bg-mint", hover: "group-hover:bg-royal" },
];

const VentureCard = ({
  venture,
  num,
  tint,
}: {
  venture: Venture;
  num: string;
  tint: { plate: string; hover: string };
}) => (
  <div data-tilt="4" className="group card card-hover flex flex-col p-7 md:p-8">
    <span className={`grid place-items-center w-14 h-14 rounded-2xl font-display text-xl text-ink transition-colors duration-300 ${tint.plate} ${tint.hover} group-hover:text-white`}>
      {num}
    </span>

    <h3 className="mt-7 font-display text-ink text-2xl md:text-[1.7rem] leading-tight">
      {venture.title}
    </h3>
    <p className="mt-1.5 text-royal font-medium">{venture.tagline}</p>
    <p className="mt-4 text-muted leading-relaxed">{venture.desc}</p>
  </div>
);

const Services = ({
  showPartners = true,
  showHeader = true,
}: {
  showPartners?: boolean;
  showHeader?: boolean;
}) => {
  return (
    <section id="services" className="relative bg-mist py-24 md:py-32 border-t border-line">
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
              A growing world of Monal, an ecosystem built around how children
              learn, imagine, and grow.
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
            {brands.map((b) => (
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
                  className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
                    b.color
                      ? "max-h-32 md:max-h-40 max-w-full"
                      : "max-h-14 md:max-h-16 max-w-[70%] brightness-0 opacity-80 group-hover:opacity-100"
                  } ${b.name === "Adruto" ? "scale-150 group-hover:scale-[1.6]" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export default Services;
