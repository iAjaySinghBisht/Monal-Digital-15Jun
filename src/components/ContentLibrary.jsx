import React from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/constants";
import { Eyebrow, ArrowUpRight } from "./Decor";

/* Six cards mixing 3:4 portraits and 1:1 squares for an editorial rhythm.
   Each desktop column pairs one portrait with one square (alternating which
   sits on top), so column heights stay balanced while the silhouette zigzags. */
const items = [
  { p: projects[0], ratio: "aspect-3/4" },
  { p: projects[1], ratio: "aspect-square" },
  { p: projects[2], ratio: "aspect-square" },
  { p: projects[3], ratio: "aspect-3/4" },
  { p: projects[4], ratio: "aspect-3/4" },
  { p: projects[5], ratio: "aspect-square" },
];

/* Desktop columns + gentle upward arc (edges nudged down). */
const COLS = [
  { mt: "lg:mt-12", cards: [items[0], items[1]] },
  { mt: "lg:mt-0", cards: [items[2], items[3]] },
  { mt: "lg:mt-12", cards: [items[4], items[5]] },
];

const Tile = ({ p, ratio }) => (
  <Link to="/work" data-tilt="5" className="group relative block">
    <div
      className={`relative ${ratio} w-full rounded-2xl overflow-hidden border border-line bg-cloud shadow-[0_30px_60px_-46px_rgba(24,24,27,0.45)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5`}
    >
      <img
        src={p.img}
        alt={p.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <h3 className="font-display text-white text-sm leading-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.6)]">
          {p.title}
        </h3>
        <span className="shrink-0 w-7 h-7 grid place-items-center rounded-full bg-paper text-ink">
          <ArrowUpRight className="w-3.5 h-3.5" />
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
            <Eyebrow dot="bg-sun">Content Library</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2.2rem,6.5vw,5rem)] leading-none max-w-3xl"
          >
            Stories. Characters. <span className="mark-sun">Worlds</span>.
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

        {/* Desktop — three balanced columns of mixed 3:4 / 1:1 cards */}
        <div
          data-reveal-group="up"
          className="hidden lg:flex justify-center items-start gap-5 xl:gap-6"
        >
          {COLS.map((col, ci) => (
            <div key={ci} className={`flex-1 max-w-64 flex flex-col gap-5 xl:gap-6 ${col.mt}`}>
              {col.cards.map((c, ii) => (
                <Tile key={ii} p={c.p} ratio={c.ratio} />
              ))}
            </div>
          ))}
        </div>

        {/* Mobile / tablet — uniform 1:1 thumbnails in a two-column grid */}
        <div data-reveal-group="up" className="lg:hidden grid grid-cols-2 gap-4">
          {items.map((c, i) => (
            <Tile key={i} p={c.p} ratio="aspect-square" />
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
