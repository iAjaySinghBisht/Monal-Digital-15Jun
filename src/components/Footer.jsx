import React from "react";
import { Link } from "react-router-dom";
import { Eyebrow, Pill } from "./Decor";
import logo from "../assets/Monal_Logo.png";

const SocialIcon = ({ children, href = "#", label }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="w-11 h-11 rounded-full border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-ink hover:border-white transition-all"
  >
    {children}
  </a>
);

const FooterLink = ({ href, children }) => (
  <li>
    <Link
      to={href}
      className="group inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
    >
      <span className="w-0 h-[1.5px] bg-violet transition-all duration-300 group-hover:w-4" />
      {children}
    </Link>
  </li>
);

const Footer = () => {
  return (
    <footer className="relative bg-black text-paper overflow-hidden">
      <div className="absolute inset-0 bg-dots-light opacity-50 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

      {/* Top — three cards */}
      <div className="relative max-w-325 mx-auto px-6 md:px-12 pt-24 md:pt-28 pb-12">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Ready to start / CTA card */}
          <div className="rounded-[28px] bg-white/[0.04] border border-white/10 p-8 flex flex-col justify-between gap-10">
            <div>
              <div className="mb-6">
                <Eyebrow tone="dark" dot="bg-violet">Ready to start</Eyebrow>
              </div>
              <h2 className="font-display text-white text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.04]">
                Join the studios building what&apos;s next
              </h2>
              <p className="mt-4 text-white/55 leading-relaxed max-w-sm">
                Whether it&apos;s a new series, a channel, or an original IP —
                let&apos;s build it together.
              </p>
            </div>
            <div>
              <Pill as={Link} to="/#contact" variant="royal">
                Start a conversation
              </Pill>
            </div>
          </div>

          {/* Get in touch */}
          <div
            id="contact"
            className="scroll-mt-28 rounded-[28px] bg-white/[0.04] border border-white/10 p-8 flex flex-col"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35 mb-5">
              Get in touch
            </div>
            <div className="space-y-2 mb-6">
              <a href="mailto:hello@monaldigital.com" className="block text-white/80 text-lg hover:text-violet transition-colors break-all">
                hello@monaldigital.com
              </a>
              <a href="tel:+917830314847" className="block text-white/80 text-lg hover:text-violet transition-colors">
                +91 78303 14847
              </a>
            </div>
            <p className="text-white/45 leading-relaxed mt-auto">
              Monal Digital, Karan Tower, Gas Godam Rd,
              <br />
              Haldwani, Uttarakhand, India 263139
            </p>
          </div>

          {/* Explore + Socials */}
          <div className="rounded-[28px] bg-white/[0.04] border border-white/10 p-8 flex flex-col">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35 mb-5">
              Explore
            </div>
            <ul className="space-y-3.5 text-base">
              <FooterLink href="/#work">Portfolio</FooterLink>
              <FooterLink href="/#about">Studio</FooterLink>
              <FooterLink href="/#services">Solutions</FooterLink>
              <FooterLink href="/#team">Team</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/#contact">Contact</FooterLink>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35 mb-4">
                Socials
              </div>
              <div className="flex flex-wrap gap-3">
                <SocialIcon href="https://www.linkedin.com/company/monaldigital" label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.3 18.3H5.7V9.7h2.6v8.6zM7 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM18.3 18.3h-2.6V14c0-1-.4-1.7-1.3-1.7-.7 0-1.1.5-1.3 1-.1.2-.1.4-.1.6v4.4h-2.6V9.7H13v1.1c.3-.5 1-1.3 2.4-1.3 1.7 0 3 1.1 3 3.5v5.3z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href="https://www.instagram.com/monaldigital" label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Giant white logo */}
      <div className="relative px-6 md:px-12 pt-8 md:pt-12 pb-10 md:pb-16 select-none">
        <img
          src={logo}
          alt="Monal Digital"
          loading="lazy"
          decoding="async"
          draggable="false"
          className="w-full max-w-[1100px] mx-auto h-auto brightness-0 invert"
        />
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-325 mx-auto px-6 md:px-12 py-7 flex items-center justify-center text-center">
          <span className="text-[12px] text-white/45">
            © 2026 Monal Digital · Haldwani
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
