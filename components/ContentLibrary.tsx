import Link from "next/link";
import { projects, type Project } from "@/data/constants";
import { Eyebrow, ArrowUpRight } from "./Decor";

/* Three columns, each pairing two posters, with a gentle staggered arc.
   Cards take each image's natural aspect ratio so nothing is ever cropped. */
const COLS = [
  { mt: "lg:mt-12", cards: [projects[0], projects[1]] },
  { mt: "lg:mt-0", cards: [projects[2], projects[3]] },
  { mt: "lg:mt-12", cards: [projects[4], projects[5]] },
];

const Tile = ({ p }: { p: Project }) => (
  <Link href="/work" data-tilt="5" className="group relative block">
    <div className="relative aspect-1587/2245 w-full rounded-2xl overflow-hidden border border-line bg-cloud shadow-[0_30px_60px_-46px_rgba(24,24,27,0.45)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.img}
        alt={p.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
  <Link href="/work" data-magnetic="0.25" className="btn btn-dark group">
    View All Our Work
    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </Link>
);

const ContentLibrary = () => {
  return (
    <section id="work" className="relative bg-mist py-24 md:py-32 border-t border-line overflow-hidden">
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-14 md:mb-20">
          <div data-reveal="up">
            <Eyebrow dot="bg-sun">Our Worlds</Eyebrow>
          </div>
          <h2
            data-split
            className="font-display text-ink text-[clamp(2.2rem,6.5vw,5rem)] leading-none max-w-3xl"
          >
            Characters kids <span className="mark-sun">grow up</span> with.
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

        {/* Desktop — three columns of posters at their natural ratio */}
        <div
          data-reveal-group="up"
          className="hidden lg:flex justify-center items-start gap-5 xl:gap-6"
        >
          {COLS.map((col, ci) => (
            <div key={ci} className={`flex-1 max-w-64 flex flex-col gap-5 xl:gap-6 ${col.mt}`}>
              {col.cards.map((p, ii) => (
                <Tile key={ii} p={p} />
              ))}
            </div>
          ))}
        </div>

        {/* Mobile / tablet — two-column grid at natural ratio */}
        <div data-reveal-group="up" className="lg:hidden grid grid-cols-2 items-start gap-4">
          {projects.map((p, i) => (
            <Tile key={i} p={p} />
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
