import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../hooks/useUiAnimations";
import { Pill, ArrowGlyph } from "./Decor";
import logo from "../assets/Monal_Logo.png";

const NAV = [
  ["Home", "/#home"],
  ["About", "/#about"],
  ["Portfolio", "/#work"],
  ["Solutions", "/#services"],
  ["Team", "/#team"],
  ["Blog", "/blog"],
];

const NavLink = ({ href, children }) => (
  <Link
    to={href}
    className="group relative text-[15px] font-medium text-ink/70 hover:text-ink transition-colors"
  >
    {children}
    <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-ink rounded-full transition-all duration-300 group-hover:w-full" />
  </Link>
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Hide the navbar once the contact section scrolls into view. */
  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtFooter(entry.isIntersecting),
      { rootMargin: "0px 0px -35% 0px" },
    );
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-header-item]", {
        y: -24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.2,
      });
    },
    { scope: rootRef },
  );

  return (
    <header
      ref={rootRef}
      className={`fixed top-0 left-0 w-full z-100 px-4 pt-4 md:pt-5 transition-all duration-500 ease-out ${
        atFooter
          ? "-translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div
        className={`max-w-300 mx-auto flex justify-between items-center gap-4 rounded-full border bg-paper pl-5 pr-2.5 py-2.5 transition-all duration-500 ${
          isScrolled
            ? "border-line shadow-[0_22px_55px_-30px_rgba(24,24,27,0.4)]"
            : "border-transparent shadow-[0_14px_40px_-32px_rgba(24,24,27,0.28)]"
        }`}
      >
        {/* Logo */}
        <Link
          to="/#home"
          data-header-item
          className="flex items-center gap-2.5 shrink-0"
        >
          <img
            src={logo}
            alt="Monal Digital"
            width="600"
            height="127"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-7 md:h-8 w-auto"
          />
        </Link>

        {/* Center nav */}
        <nav
          data-header-item
          className="hidden lg:flex items-center gap-9 absolute left-1/2 -translate-x-1/2"
        >
          {NAV.map(([label, href]) => (
            <NavLink key={href} href={href}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div data-header-item className="flex items-center gap-3">
          <div className="hidden lg:block">
            <Pill as={Link} to="/contact-us" variant="dark" magnetic={false} withArrow={false}>
              Get in touch
            </Pill>
          </div>

          <button
            className="lg:hidden w-11 h-11 grid place-items-center rounded-full border border-line text-ink"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden max-w-300 mx-auto mt-3 rounded-3xl bg-ink text-paper p-7 flex flex-col gap-1 animate-fade-in">
          {NAV.map(([label, href]) => (
            <Link
              key={href}
              to={href}
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between py-3 border-b border-white/10 last:border-0"
            >
              <span className="font-display text-3xl leading-none">{label}</span>
              <ArrowGlyph className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
            </Link>
          ))}
          <Pill
            as={Link}
            to="/contact-us"
            variant="royal"
            magnetic={false}
            withArrow={false}
            onClick={() => setOpen(false)}
            className="mt-5 justify-center"
          >
            Get in touch
          </Pill>
        </div>
      )}
    </header>
  );
};

export default Header;
