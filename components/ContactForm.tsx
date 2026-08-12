"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import { Eyebrow, ArrowGlyph } from "./Decor";
import FractalField, { type Variant } from "./FractalField";
import { SPECTRUM_HEX } from "@/lib/palette";
import { contact } from "@/data/constants";

// Google Apps Script web app endpoint (logs to "Monal Contact Submissions"
// and emails the team on each submission).
const FORM_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyHOBqaILxy5iCFOyPD0M4jzUfyDFLr_WqH9QvftAXfXqXY1bBHbX3r0iQ4vw05MLWx/exec";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,}$/;

const EMPTY = { name: "", phone: "", email: "", message: "", company: "" };

type FormState = typeof EMPTY;
type Errors = Partial<Record<keyof FormState, string>>;

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) => (
  <label className="block">
    <span className="block text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/60 mb-2">
      {label}
    </span>
    {children}
    {error && <span className="mt-1.5 block text-[13px] text-red-500">{error}</span>}
  </label>
);

const inputClass =
  "w-full rounded-2xl border border-line bg-paper px-4 py-3.5 text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent-ink/15";

/* One of the three details in the card above the form.

   The label is the same 12px uppercase micro-caps the form's own field
   labels use, so the card reads as the first row of the same document
   rather than as a separate widget that happens to sit above it.

   Email and contact are links and the address is not, and that
   difference is carried by more than colour: the two links take the
   accent on hover AND a 44px-tall press target (WCAG 2.5.8), the same
   floor the footer's links were raised to. The address stays plain text
   — we have no verified map URL for the studio, and a link that lands on
   the wrong pin is worse than an address you copy by hand. */
/* ------------------------------------------------------------------ *
 *  EACH DETAIL ANSWERS TO ITS OWN POINTER, and what answers is a
 *  fractal — the same device the venture cards use, called the same way.
 *
 *  The motif is CHOSEN, not decorative. Each figure says the thing its
 *  detail says:
 *
 *    email   hilbert  one unbroken line that reaches every cell, with a
 *                     signal that traverses it on hover — a message
 *                     going out and arriving.
 *    contact htree    the layout real antenna and clock networks use,
 *                     because every endpoint sits the same distance from
 *                     the source. Its pulse leaves the root and reaches
 *                     all four tips together: a call being picked up.
 *    studio  koch     the one closed, crystalline, fully symmetric
 *                     figure in the set — a fixed point rather than a
 *                     thing travelling. It is the map pin, drawn.
 *
 *  Sized to sit BEHIND THE ICON, not behind the words. The venture cards
 *  needed a scrim because their motif ran under a paragraph; this one is
 *  masked to a disc centred on the chip and has faded out well before it
 *  reaches the label, so the copy never competes with it and no scrim is
 *  needed. The card clips, so nothing escapes the rounded corner.
 * ------------------------------------------------------------------ */
const MOTIF_BOX = 150; // px, square — the motif's box, centred on the chip
const MOTIF_MASK = "radial-gradient(70% 70% at 50% 50%, #000 42%, transparent)";

/* Resting the drawing is dim and desaturated; the pointer brings it up
   to the wordmark's real colours. Both halves of that live in
   globals.css under `.venture-motif`, which is driven entirely by these
   custom properties — so this reuses that rule rather than restating it.
   Dimmer at rest than the venture cards (0.42), because those sit on
   `mist` and this sits on white, where the same ink reads louder. */
const MOTIF_TUNING = {
  ["--motif-o" as string]: 0.3,
  ["--motif-o-hover" as string]: 0.68,
  ["--motif-sat" as string]: 0.4,
};

const SPEED = 0.45; // the rate the venture row settled on

const Detail = ({
  label,
  icon,
  motif,
  children,
}: {
  label: string;
  icon: ReactNode;
  motif: { variant: Variant; depth: number; scale: number };
  children: ReactNode;
}) => (
  /* STACKED AND CENTRED, so the three read as a rank of medallions
     rather than as a left-aligned list that happens to sit in columns.
     Two details make it work:

     `mx-auto` on the chip is load-bearing — a grid box centres its
     CONTENTS, not itself, so `place-items-center` alone centres the icon
     inside a chip still sitting flush left under a centred label.

     Stacking also fixes an alignment problem the side-by-side version
     had: the address wraps to two lines, and with the icon inline that
     column's text started at a different x than its neighbours. On its
     own line the icon steals no width, so all three columns set full. */
  /* `group` sits HERE and not on the card, so the three answer
     independently — one on the card would light all three at once, and
     `.group:hover .venture-motif` matches from any group ancestor.
     FractalField's own `activateOn=".group"` resolves by `closest()`, so
     it finds this same element and the CSS and the canvas agree. */
  <div className="group relative text-center">
    <span
      aria-hidden="true"
      className="venture-motif pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: MOTIF_BOX,
        height: MOTIF_BOX,
        maskImage: MOTIF_MASK,
        WebkitMaskImage: MOTIF_MASK,
        ...MOTIF_TUNING,
      }}
    >
      <FractalField
        variant={motif.variant}
        /* The wordmark's own eight — the same set the venture motifs
           draw, so the two pages read as one system. */
        palette={SPECTRUM_HEX}
        depth={motif.depth}
        scale={motif.scale}
        speed={SPEED}
        activateOn=".group"
      />
    </span>

    {/* `relative` on everything from here down, so the copy sits above
        the drawing rather than under it. */}
    <span className="relative mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-teal-soft text-teal-deep transition-colors duration-300 group-hover:bg-accent group-hover:text-ink">
      {icon}
    </span>
    <span className="relative mt-5 block text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/60 mb-1.5">
      {label}
    </span>
    <div className="relative">{children}</div>
  </div>
);

const detailLink =
  "inline-flex min-h-11 items-center text-ink text-lg leading-snug hover:text-accent-ink transition-colors break-words";

/* Decoration for the brand half — rings, texture and floating shapes.
   IT IS TINTED BY POSITION, because the panel is no longer one ground.
   The ramp runs pale at the top-left to the full band at the bottom-right,
   so a single decoration colour is wrong at one end or the other: white
   line-work is invisible on the pale corner (1.15:1) and deep teal is
   nearly gone on the bright one (2.48:1). Each piece therefore takes the
   value its own corner can hold — deep teal up in the pale end, white down
   in the saturated end. This is why the shapes are placed here rather than
   passed in: the position and the tint are one decision. */
const Graphics = () => (
  <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* dotted texture — the INK dots, not the white ones. This is a light
        panel now, and bg-dots-light is white-on-dark by construction. */}
    <div className="absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(90%_80%_at_25%_15%,#000,transparent)]" />
    {/* soft glow, in the pale corner — saturation where the ramp has least */}
    <span className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-teal/60 blur-3xl" />
    {/* concentric rings, bottom-right, over the brightest part of the ramp */}
    <svg className="absolute -bottom-20 -right-20 w-80 h-80 text-white/45" viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="66" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1.5" />
    </svg>
    {/* floating shapes — deep teal high on the panel, white lower down */}
    <span className="absolute top-10 right-12 w-14 h-14 rounded-full bg-teal-deep shadow-[0_10px_30px_-8px_rgba(30,120,122,0.55)]" />
    <span className="absolute top-1/2 right-8 w-9 h-9 rounded-xl bg-paper rotate-12" />
    <span className="absolute bottom-14 left-10 w-10 h-10 rounded-full border-2 border-white/70" />
    {/* squiggle */}
    <svg className="absolute bottom-24 left-1/3 w-24 text-white/80" viewBox="0 0 120 24" fill="none">
      <path d="M2 12c8-12 16 12 24 0s16 12 24 0 16 12 24 0 16 12 24 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((er) => ({ ...er, [key]: undefined }));
    };

  const validate = () => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.phone.trim()) next.phone = "Please enter your phone number.";
    else if (!PHONE_RE.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        // text/plain avoids a CORS preflight against the Apps Script endpoint.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(form),
      });
      // Apps Script returns { ok: true }; if it can't be read, the row is
      // still written, so we only fail on an explicit ok:false.
      let ok = true;
      try {
        const data = await res.json();
        if (data && data.ok === false) ok = false;
      } catch {
        /* response not readable cross-origin — treat as success */
      }
      if (!ok) throw new Error("submission rejected");
      setStatus("success");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Header />


      <main id="main-content">
      {/* Hero */}
      <section className="relative bg-black text-paper overflow-hidden">
        <div className="absolute inset-0 bg-dots-light opacity-50 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

        <div className="absolute top-28 md:top-32 left-6 md:left-12 z-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors"
          >
            <ArrowGlyph className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
            Back home
          </Link>
        </div>

        <div className="relative max-w-325 mx-auto px-6 md:px-12 pt-40 md:pt-48 pb-16 md:pb-24 text-center">
          <div data-reveal="up" className="mb-6 flex justify-center">
            <Eyebrow tone="dark">Get in touch</Eyebrow>
          </div>
          <h1
            data-split
            className="font-display text-[clamp(2.8rem,11vw,8.5rem)] leading-[0.9] tracking-[-0.04em]"
          >
            Contact Us.
          </h1>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="mt-7 text-white/60 text-lg leading-relaxed max-w-xl mx-auto"
          >
            Have a question, an idea, or just want to say hello? We&apos;d love
            to hear from you.
          </p>
        </div>
      </section>

      {/* Big split card */}
      <section className="relative bg-paper py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-50 pointer-events-none [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]" />

        {/* Details card — the direct routes, above the form that is the
            slower one. It borrows the split card's radius, border and
            shadow so the two read as a stack of one thing; the shadow is
            shortened because this card is less tall and the deeper cast
            would pool under it. */}
        <div data-reveal="up" className="relative max-w-300 mx-auto px-6 md:px-12 mb-5">
          {/* `overflow-hidden` because the motifs are boxes centred on the
              chips and reach past the card's top padding — this clips
              them to the rounded corner instead of letting them spill. */}
          <div className="overflow-hidden rounded-[32px] border border-line bg-paper p-8 md:p-10 shadow-[0_30px_70px_-55px_rgba(24,24,27,0.4)]">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Detail
                label="Email"
                motif={{ variant: "hilbert", depth: 4, scale: 0.78 }}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
                    <path d="m3.5 7 7.35 5.15a2 2 0 0 0 2.3 0L20.5 7" />
                  </svg>
                }
              >
                <a href={`mailto:${contact.email}`} className={detailLink}>
                  {contact.email}
                </a>
              </Detail>

              <Detail
                label="Contact"
                motif={{ variant: "htree", depth: 6, scale: 0.9 }}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6 4z" />
                  </svg>
                }
              >
                <a href={`tel:${contact.tel}`} className={detailLink}>
                  {contact.phone}
                </a>
              </Detail>

              <Detail
                label="Headquarters"
                motif={{ variant: "koch", depth: 4, scale: 0.62 }}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
                    <circle cx="12" cy="10.5" r="2.5" />
                  </svg>
                }
              >
                {/* Not a link — see the note on Detail. */}
                <address className="not-italic text-muted text-[15px] leading-relaxed">
                  {contact.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </Detail>
            </div>
          </div>
        </div>

        <div data-reveal="up" className="relative max-w-300 mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-line bg-paper shadow-[0_40px_90px_-50px_rgba(24,24,27,0.4)]">
            {/* Left — brand half with graphics. A LIGHT PANEL, AND THE COPY
                IS WHAT MADE IT POSSIBLE. This was a dark slab for as long as
                it carried WHITE type, and that one decision set its floor:
                white needs 4.5:1, the brightest teal that gives it is
                `teal-deep` at 5.22:1, so every attempt to lighten the panel
                ran into type that could not follow. Turning the copy to INK
                inverts the constraint — ink is 8.41:1 on the raw band and
                15.41:1 on the pale plate, so the whole light half of the
                ramp opens up and the panel can finally be the brand's own
                bright teal instead of a darkened stand-in for it.

                It is the same move the primary button made, for the same
                reason: ink over colour, never colour over ink. Even the
                dimmed paragraph clears AA now at 5.08:1, where the white it
                replaces was 3.69:1 and under.

                Kept identical to the careers panel — the two are the same
                device on two pages. */}
            <div className="relative bg-linear-to-br from-teal-soft to-teal text-ink p-8 md:p-12 flex flex-col justify-between min-h-[340px] lg:min-h-[560px]">
              <Graphics />

              <div className="relative">
                <Eyebrow tone="light">Say hello</Eyebrow>
                <h2 className="mt-6 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.04] max-w-md">
                  Let&apos;s make something{" "}
                  {/* Was `text-teal`, which is now the panel itself. A word
                      set apart takes the site's one highlight — sun behind
                      ink, 12.12:1 — rather than a second tone of the ground
                      it is sitting on. */}
                  <span className="mark">great</span> together.
                </h2>
                <p className="mt-5 text-ink/75 leading-relaxed max-w-sm">
                  Whoever you are and whatever you&apos;re dreaming up, we&apos;re
                  here for it. Send us a message and a real person from our team
                  will get right back to you.
                </p>
              </div>

              <div className="relative mt-10 inline-flex items-center gap-2.5 self-start rounded-full bg-paper/70 border border-ink/10 px-4 py-2 text-sm text-ink/80">
                {/* The live dot was `mint`, a pale green that had a dark slab
                    to sit on. On a pale chip on a teal panel it disappears;
                    the signature's edge form is the value that reads on a
                    near-white ground. */}
                <span className="w-2 h-2 rounded-full bg-teal-deep animate-pulse-dot" />
                Typically replies within a business day
              </div>
            </div>

            {/* Right — form half */}
            <div className="p-6 md:p-12">
              {status === "success" ? (
                <div className="flex flex-col items-start gap-4 h-full justify-center py-8">
                  <span className="grid place-items-center w-12 h-12 rounded-full bg-mint text-ink">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <h2 className="font-display text-ink text-3xl leading-tight">
                    Thanks, we&apos;ll be in touch.
                  </h2>
                  <p className="text-muted leading-relaxed">
                    Your message has reached our team. We usually reply within a
                    business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-sm font-semibold text-accent-ink hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {/* Honeypot — hidden from users, catches bots */}
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={update("company")}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" error={errors.name}>
                      <input
                        type="text"
                        value={form.name}
                        onChange={update("name")}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Phone" error={errors.phone}>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={update("phone")}
                        placeholder="+91 …"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Email" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Message (optional)">
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={update("message")}
                      placeholder="Tell us a little more…"
                      className={`${inputClass} resize-y`}
                    />
                  </Field>

                  {status === "error" && (
                    <p className="text-[14px] text-red-500">
                      Something went wrong sending your message. Please try again,
                      or email us directly at hello@monaldigital.com.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink text-paper px-7 py-3.5 font-semibold transition-all hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                    {status !== "sending" && (
                      <ArrowGlyph className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </>
  );
}
