import Link from "next/link";
import type { ReactNode } from "react";
import { Eyebrow, Pill } from "./Decor";

const SocialIcon = ({
  children,
  href = "#",
  label,
}: {
  children: ReactNode;
  href?: string;
  label: string;
}) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="w-11 h-11 rounded-full border border-royal/40 text-royal flex items-center justify-center hover:bg-royal hover:text-white hover:border-royal transition-all"
  >
    {children}
  </a>
);

const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <li>
    <Link
      href={href}
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
                <Eyebrow tone="dark" dot="bg-violet">Let&apos;s build together</Eyebrow>
              </div>
              <h2 className="font-display text-white text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.04]">
                Building the Future of Childhood?
              </h2>
              <p className="mt-4 text-white/55 leading-relaxed max-w-md">
                Whether you&apos;re creating a new character, an original IP, an
                animated series, a game, or an AI-powered learning experience,
                we&apos;d love to help bring your vision to life.
              </p>
            </div>
            <div>
              <Pill as={Link} href="/contact-us" variant="royal">
                Build With Monal
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
              <a href="tel:+917017820679" className="block text-white/80 text-lg hover:text-violet transition-colors">
                +91 70178 20679
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
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35 mb-5">
                  Explore
                </div>
                <ul className="space-y-3.5 text-base">
                  <FooterLink href="/work">Portfolio</FooterLink>
                  <FooterLink href="/services">Services</FooterLink>
                  <FooterLink href="/team">Team</FooterLink>
                  <FooterLink href="/blog">Blog</FooterLink>
                </ul>
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35 mb-5">
                  Company
                </div>
                <ul className="space-y-3.5 text-base">
                  <FooterLink href="/about-us">About</FooterLink>
                  <FooterLink href="/contact-us">Contact</FooterLink>
                  <FooterLink href="/career">Careers</FooterLink>
                </ul>
              </div>
            </div>

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

      {/* Giant logo over a layered mountain range (brand shades).
          The id is the cue the header uses to hide itself. */}
      <div
        id="footer-logo"
        className="relative px-6 md:px-12 pt-8 md:pt-12 pb-10 md:pb-16 select-none"
      >
        {/* Mountain pattern — overlapping translucent peaks in brand purples.
            Stretches full width and fades into the black footer at the top.
            The two larger ranges sit BEHIND the logo. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-[140%] [mask-image:linear-gradient(to_top,#000_55%,transparent)]"
        >
          {/* Extra light — distant range, tallest with a dominant peak */}
          <path
            d="M0,520 V400 L240,300 L380,360 L660,110 L840,320 L1080,210 L1260,330 L1440,250 V520 Z"
            fill="#8b7cff"
            fillOpacity="0.12"
          />
          {/* Light — mid range */}
          <path
            d="M0,520 V440 L200,360 L440,430 L720,250 L960,410 L1200,310 L1440,400 V520 Z"
            fill="#6c4df6"
            fillOpacity="0.22"
          />
        </svg>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/monal-logo.png"
          alt="Monal Digital"
          loading="lazy"
          decoding="async"
          draggable="false"
          className="relative w-full max-w-[1100px] mx-auto h-auto"
        />

        {/* Small foreground range — rendered AFTER the logo so it sits ABOVE it */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-[140%] [mask-image:linear-gradient(to_top,#000_55%,transparent)]"
        >
          {/* Dark — nearest range, lower foothills, solid */}
          <path
            d="M0,520 V475 L260,410 L520,478 L780,390 L1040,475 L1300,420 L1440,465 V520 Z"
            fill="#322B80"
            fillOpacity="1"
          />
        </svg>
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
