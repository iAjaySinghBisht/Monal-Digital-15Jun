import { team, type TeamMember } from "@/data/constants";
import { Eyebrow, ArrowUpRight } from "./Decor";
import { SPECTRUM } from "@/lib/palette";

/* The team is a SERIES, so it walks the wordmark's bands by position —
   the same rule the peaks, the partner wall and the venture cards follow.
   It used to cycle four hand-picked pastels, which meant member 1 and
   member 5 matched for no reason and the set had no relationship to the
   logo at all. */

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.3 18.3H5.7V9.7h2.6v8.6zM7 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM18.3 18.3h-2.6V14c0-1-.4-1.7-1.3-1.7-.7 0-1.1.5-1.3 1-.1.2-.1.4-.1.6v4.4h-2.6V9.7H13v1.1c.3-.5 1-1.3 2.4-1.3 1.7 0 3 1.1 3 3.5v5.3z" />
  </svg>
);

const TeamCard = ({ m, band }: { m: TeamMember; band: string }) => (
  <a
    href={m.linkedin}
    target="_blank"
    rel="noopener noreferrer"
    data-tilt="4"
    aria-label={`${m.name}, ${m.role}, on LinkedIn`}
    className="group card card-hover overflow-hidden p-3 block"
  >
    {/* Portrait on this member's band, laid thinly. `.band-plate` without
        the `--lift` modifier: no hover flood here, because the photo would
        hide it and it would show only for members still on the initials
        fallback. */}
    <div
      className="band-plate relative overflow-hidden rounded-[20px] aspect-square"
      style={{ ["--band" as string]: band }}
    >
      {m.img ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={m.img}
          alt={m.name}
          loading="lazy"
          /* Base zoom rides on a CSS var so the hover zoom can multiply it
             instead of being overridden by an inline transform. */
          style={
            {
              objectPosition: m.imgStyle?.objectPosition,
              "--zoom": m.imgStyle?.zoom ?? 1,
            } as React.CSSProperties
          }
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out scale-[var(--zoom)] group-hover:scale-[calc(var(--zoom)*1.06)]"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center font-display text-ink/70 text-[3.2rem] leading-none transition-transform duration-700 ease-out group-hover:scale-[1.06]">
          {m.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </span>
      )}
    </div>

    {/* Info */}
    <div className="px-3 pt-5 pb-2">
      {/* Role row — takes the accent's text form on hover */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" />
        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted transition-colors duration-300 group-hover:text-accent-ink">
          {m.role}
        </span>
      </div>

      <h3 className="font-display text-ink text-xl lg:text-2xl leading-tight">
        {m.name}
      </h3>

      <div className="h-px bg-line my-4" />

      {/* Footer — LinkedIn connect */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LinkedInIcon className="w-4 h-4 text-accent-ink" />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-ink">Connect</div>
            <div className="text-[11px] text-muted">on LinkedIn</div>
          </div>
        </div>
        <span className="shrink-0 grid place-items-center w-10 h-10 rounded-full border border-line text-ink transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:border-accent">
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  </a>
);

const Team = ({ showHeader = true }: { showHeader?: boolean }) => {
  return (
    <section id="team" className="relative bg-paper py-24 md:py-32 border-t border-line">
      <div className="relative max-w-325 mx-auto px-6 md:px-12">
        {showHeader && (
          <div className="flex flex-col items-center text-center gap-5 mb-14 md:mb-20">
            <div data-reveal="up">
              <Eyebrow>The Collective</Eyebrow>
            </div>
            <h2
              data-split
              className="font-display text-ink text-[clamp(2rem,6vw,4.5rem)] leading-[0.98] max-w-3xl"
            >
              Meet the <span className="mark">team</span>.
            </h2>
            <p
              data-reveal="up"
              data-reveal-delay="0.12"
              className="text-muted max-w-md leading-relaxed"
            >
              Artists, storytellers, strategists, and builders shaping the future
              of children&apos;s entertainment.
            </p>
          </div>
        )}

        <div data-reveal-group="up" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {team.map((m, i) => (
            <TeamCard key={i} m={m} band={SPECTRUM[i % SPECTRUM.length].hex} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
