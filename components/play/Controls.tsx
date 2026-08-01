"use client";

import { useId, type ReactNode } from "react";

/* Controls for the play toys.
 *
 * Sized for children and for thumbs: 44px targets, one idea per control, a word
 * instead of a number wherever a word will do. Anything that needs real
 * vocabulary (c, iteration count, palette phase) lives behind <Advanced>.
 */

export function Knob({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  format,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  /** Turns the raw number into something readable, e.g. "20 s per loop". */
  format?: (v: number) => string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-2">
      <label htmlFor={id} className="text-[15px] font-medium text-ink">
        {label}
        {hint && <span className="block text-[12.5px] font-normal text-muted">{hint}</span>}
      </label>
      <span className="text-[13px] font-semibold tabular-nums text-accent-ink">
        {format ? format(value) : value.toFixed(2)}
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="col-span-2 h-11 w-full cursor-pointer accent-accent"
      />
    </div>
  );
}

export function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2.5 text-[15px] font-medium text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`min-h-11 rounded-full border px-4 text-[14px] font-medium transition-colors ${
                active
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-paper text-ink hover:border-ink/30"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Palette picker that shows the actual ramp rather than naming colours. */
export function PaletteChoice({
  palettes,
  value,
  onChange,
}: {
  palettes: readonly { id: string; name: string; stops: readonly string[] }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[15px] font-medium text-ink">Colours</legend>
      <div className="flex flex-wrap gap-2.5">
        {palettes.map((p) => {
          const active = p.id === value;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={active}
              aria-label={p.name}
              title={p.name}
              onClick={() => onChange(p.id)}
              className={`flex h-11 items-center gap-2 rounded-full border pr-4 pl-1.5 transition-colors ${
                active ? "border-accent bg-lav" : "border-line bg-paper hover:border-ink/30"
              }`}
            >
              <span className="flex h-8 w-8 overflow-hidden rounded-full">
                {p.stops.map((c) => (
                  <span key={c} className="h-full flex-1" style={{ background: c }} />
                ))}
              </span>
              <span className="text-[14px] font-medium text-ink">{p.name}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Switch({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-11 w-full items-center justify-between gap-4 text-left"
    >
      <span>
        <span className="text-[15px] font-medium text-ink">{label}</span>
        {hint && <span className="block text-[12.5px] text-muted">{hint}</span>}
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-cloud"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

/** The drawer that holds the real parameters. Closed by default. */
export function Advanced({ children }: { children: ReactNode }) {
  return (
    <details className="group mt-2 rounded-2xl border border-line bg-mist px-5 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-semibold text-ink marker:hidden">
        For the curious
        <span className="text-muted transition-transform group-open:rotate-45" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="mt-4 grid gap-5">{children}</div>
    </details>
  );
}

/** Row of numbers in the advanced drawer, e.g. the current c value. */
export function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2 last:border-0">
      <span className="text-[13px] text-muted">{label}</span>
      <code className="text-[13px] tabular-nums text-ink">{value}</code>
    </div>
  );
}

/** Groups controls into the light panel under a toy's screen. */
export function ControlPanel({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-10">{children}</div>
  );
}
