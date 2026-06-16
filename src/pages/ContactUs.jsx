import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Eyebrow, ArrowGlyph } from "../components/Decor";
import { useUiAnimations } from "../hooks/useUiAnimations";

// Google Apps Script web app endpoint (logs to "Monal Contact Submissions"
// and emails the team on each submission).
const FORM_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyHOBqaILxy5iCFOyPD0M4jzUfyDFLr_WqH9QvftAXfXqXY1bBHbX3r0iQ4vw05MLWx/exec";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,}$/;

const EMPTY = { name: "", phone: "", email: "", message: "", company: "" };

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="block text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/60 mb-2">
      {label}
    </span>
    {children}
    {error && <span className="mt-1.5 block text-[13px] text-red-500">{error}</span>}
  </label>
);

const inputClass =
  "w-full rounded-2xl border border-line bg-paper px-4 py-3.5 text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-royal focus:ring-2 focus:ring-royal/15";

// Decorative graphics for the blue half — rings, pattern, and pastel shapes.
const Graphics = () => (
  <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* dotted texture */}
    <div className="absolute inset-0 bg-dots-light opacity-40 [mask-image:radial-gradient(90%_80%_at_25%_15%,#000,transparent)]" />
    {/* soft glow */}
    <span className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-violet/45 blur-3xl" />
    {/* concentric rings, bottom-right */}
    <svg className="absolute -bottom-20 -right-20 w-80 h-80 text-white/12" viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="66" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1.5" />
    </svg>
    {/* floating pastel shapes */}
    <span className="absolute top-10 right-12 w-14 h-14 rounded-full bg-sun shadow-[0_10px_30px_-8px_rgba(250,204,21,0.7)]" />
    <span className="absolute top-1/2 right-8 w-9 h-9 rounded-xl bg-mint rotate-12" />
    <span className="absolute bottom-14 left-10 w-10 h-10 rounded-full border-2 border-white/35" />
    {/* squiggle */}
    <svg className="absolute bottom-24 left-1/3 w-24 text-sun/70" viewBox="0 0 120 24" fill="none">
      <path d="M2 12c8-12 16 12 24 0s16 12 24 0 16 12 24 0 16 12 24 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

const ContactUs = () => {
  useUiAnimations();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.phone.trim()) next.phone = "Please enter your phone number.";
    else if (!PHONE_RE.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
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

      {/* Hero */}
      <section className="relative bg-black text-paper overflow-hidden">
        <div className="absolute inset-0 bg-dots-light opacity-50 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

        <div className="absolute top-28 md:top-32 left-6 md:left-12 z-10">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors"
          >
            <ArrowGlyph className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
            Back home
          </Link>
        </div>

        <div className="relative max-w-325 mx-auto px-6 md:px-12 pt-40 md:pt-48 pb-16 md:pb-24 text-center">
          <div data-reveal="up" className="mb-6 flex justify-center">
            <Eyebrow tone="dark" dot="bg-violet">Get in touch</Eyebrow>
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

        <div
          data-reveal="up"
          className="relative max-w-300 mx-auto px-6 md:px-12"
        >
          <div className="grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-line bg-paper shadow-[0_40px_90px_-50px_rgba(24,24,27,0.4)]">
            {/* Left — blue half with graphics */}
            <div className="relative bg-linear-to-br from-royal to-violet text-white p-8 md:p-12 flex flex-col justify-between min-h-[340px] lg:min-h-[560px]">
              <Graphics />

              <div className="relative">
                <Eyebrow tone="dark" dot="bg-sun">Say hello</Eyebrow>
                <h2 className="mt-6 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.04] max-w-md">
                  Let&apos;s make something{" "}
                  <span className="text-sun">great</span> together.
                </h2>
                <p className="mt-5 text-white/75 leading-relaxed max-w-sm">
                  Whoever you are and whatever you&apos;re dreaming up, we&apos;re
                  here for it. Send us a message and a real person from our team
                  will get right back to you.
                </p>
              </div>

              <div className="relative mt-10 inline-flex items-center gap-2.5 self-start rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-white/85">
                <span className="w-2 h-2 rounded-full bg-mint animate-pulse-dot" />
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
                    Thanks — we&apos;ll be in touch.
                  </h2>
                  <p className="text-muted leading-relaxed">
                    Your message has reached our team. We usually reply within a
                    business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-sm font-semibold text-royal hover:underline"
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
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink text-paper px-7 py-3.5 font-semibold transition-all hover:bg-royal disabled:opacity-60 disabled:cursor-not-allowed"
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

      <Footer />
    </>
  );
};

export default ContactUs;
