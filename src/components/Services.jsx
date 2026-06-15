import React from "react";
import { Link } from "react-router-dom";
import { services, brands } from "../data/constants";
import { Eyebrow, ArrowUpRight } from "./Decor";

/* Per-card pastel tint + hover accent. */
const TINTS = [
  { plate: "bg-lav", hover: "group-hover:bg-royal" },
  { plate: "bg-sun-soft", hover: "group-hover:bg-sun" },
  { plate: "bg-mint", hover: "group-hover:bg-royal" },
];

const ServiceCard = ({ service, num, tint }) => (
  <Link
    to={`/services/${service.slug}`}
    data-tilt="4"
    className="group card card-hover flex flex-col p-7 md:p-8"
  >
    <div className="flex items-start justify-between">
      <span className={`grid place-items-center w-14 h-14 rounded-2xl font-display text-xl text-ink transition-colors duration-300 ${tint.plate} ${tint.hover} group-hover:text-white`}>
        {num}
      </span>
      <span className="shrink-0 w-11 h-11 rounded-full border border-line grid place-items-center text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-white group-hover:border-ink">
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </div>

    <h3 className="mt-7 font-display text-ink text-2xl md:text-[1.7rem] leading-tight">
      {service.eyebrow}
    </h3>
    <p className="mt-1.5 text-royal font-medium">{service.tagline}</p>
    <p className="mt-4 text-muted leading-relaxed">{service.desc}</p>

    <div className="mt-auto pt-7 flex flex-wrap gap-2">
      {service.features.slice(0, 4).map((f) => (
        <span
          key={f}
          className="rounded-full bg-mist border border-line px-3 py-1.5 text-[12px] font-medium text-ink/70 transition-colors duration-300 group-hover:border-ink/15"
        >
          {f}
        </span>
      ))}
    </div>
  </Link>
);

const Services = () => {
  const keys = Object.keys(services);

  return (
    <section id="services" className="relative bg-mist py-24 md:py-32 border-t border-line">
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-14 md:mb-20">
          <div data-reveal="up">
            <Eyebrow dot="bg-sun">Services</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[0.98] max-w-3xl"
          >
            What we <span className="mark-sun">create</span>.
          </h2>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="text-muted max-w-md leading-relaxed"
          >
            From concept to audience, all within one integrated creative and
            distribution pipeline.
          </p>
        </div>

        {/* Service cards */}
        <div data-reveal-group="up" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {keys.map((k, i) => (
            <ServiceCard
              key={k}
              service={services[k]}
              num={String(i + 1).padStart(2, "0")}
              tint={TINTS[i % TINTS.length]}
            />
          ))}
        </div>

        {/* Partners */}
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

          <div data-reveal-group="up" className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            {brands.map((b) => (
              <div
                key={b.name}
                data-tilt="4"
                className="group card card-hover min-h-44 p-8 flex items-center justify-center"
              >
                <img
                  src={b.logo}
                  alt={b.name}
                  loading="lazy"
                  className={`max-h-14 md:max-h-16 max-w-[70%] w-auto object-contain brightness-0 opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105 ${
                    b.name === "Adruto" ? "scale-150 group-hover:scale-[1.6]" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
