import React from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/constants";
import { Eyebrow, ArrowUpRight } from "./Decor";

/* 13 image slots cycle through the project artwork. */
const wall = Array.from({ length: 13 }, (_, i) => projects[i % projects.length]);

/* Seven equal-height columns — counts 2·3·1·1·1·3·2 — with small top
   offsets for the organic, curved silhouette. */
const COLS = [
  { mt: "xl:mt-10", imgs: wall.slice(0, 2) },
  { mt: "xl:mt-0", imgs: wall.slice(2, 5) },
  { mt: "xl:mt-20", imgs: wall.slice(5, 6) },
  { mt: "xl:mt-0", imgs: wall.slice(6, 7) },
  { mt: "xl:mt-20", imgs: wall.slice(7, 8) },
  { mt: "xl:mt-0", imgs: wall.slice(8, 11) },
  { mt: "xl:mt-10", imgs: wall.slice(11, 13) },
];

const Tile = ({ p, className = "" }) => (
  <Link to="/work" className={`group relative block ${className}`}>
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-line bg-cloud shadow-[0_30px_60px_-46px_rgba(24,24,27,0.45)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
      <img
        src={p.img}
        alt={p.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-between gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <h3 className="font-display text-white text-xs leading-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.6)]">
          {p.title}
        </h3>
        <span className="shrink-0 w-6 h-6 grid place-items-center rounded-full bg-paper text-ink">
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  </Link>
);

const ViewAllBtn = () => (
  <Link to="/work" data-magnetic="0.25" className="btn btn-dark group">
    View all work
    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </Link>
);

const ContentLibrary = () => {
  return (
    <section id="work" className="relative bg-paper py-24 md:py-32 border-t border-line overflow-hidden">
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-14 md:mb-20">
          <div data-reveal="up">
            <Eyebrow dot="bg-royal">Content Library</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2.2rem,6.5vw,5rem)] leading-none max-w-3xl"
          >
            Stories. Characters. <span className="mark-violet">Worlds</span>.
          </h2>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="text-muted max-w-xl leading-relaxed"
          >
            A growing portfolio of animated brands, original IPs, and
            children&apos;s content enjoyed by families across the globe.
          </p>
        </div>

        {/* Equal-height image columns (lg+) */}
        <div data-reveal-group="up" className="hidden lg:flex justify-center items-start gap-3 xl:gap-4">
          {COLS.map((col, ci) => (
            <div
              key={ci}
              data-tilt="5"
              className={`flex-1 max-w-42 h-104 xl:h-120 flex flex-col gap-3 xl:gap-4 ${col.mt}`}
            >
              {col.imgs.map((p, ii) => (
                <Tile key={ii} p={p} className="flex-1 min-h-0" />
              ))}
            </div>
          ))}
        </div>

        {/* Mobile / tablet — horizontal scroll gallery */}
        <div className="lg:hidden flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
          {projects.map((p) => (
            <div key={p.title} className="shrink-0 w-40 sm:w-44 h-56">
              <Tile p={p} className="h-full" />
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <ViewAllBtn />
        </div>
      </div>
    </section>
  );
};

export default ContentLibrary;
