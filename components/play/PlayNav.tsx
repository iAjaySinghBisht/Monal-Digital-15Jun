"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOYS } from "@/data/play";

/** Sub-nav for the section. Scrolls sideways on a phone rather than wrapping,
 *  so the toy strip stays one predictable line. */
export default function PlayNav() {
  const pathname = usePathname();

  const item = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={`shrink-0 rounded-full border px-4 py-2.5 text-[14px] font-medium transition-colors ${
          active
            ? "border-ink bg-ink text-white"
            : "border-line bg-paper text-ink hover:border-ink/30"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav aria-label="Fractal toys" className="no-scrollbar -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
      <div className="flex gap-2.5">
        {item("/play", "All toys")}
        {TOYS.map((t) => item(`/play/${t.slug}`, t.name))}
      </div>
    </nav>
  );
}
