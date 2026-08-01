import type { Metadata } from "next";
import { Baloo_2, Onest } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollManager from "@/components/ScrollManager";
import Analytics from "@/components/Analytics";
import "./globals.css";

/* Self-hosted at build time via next/font — removes the render-blocking
   requests to fonts.googleapis.com / fonts.gstatic.com and the font-swap
   layout shift. Exposed as --font-onest, consumed by globals.css. */
/* Devanagari for the footer co-brand lockup. Onest carries no Devanagari,
   and the audience these channels actually serve reads Hindi — Baloo 2 has
   the script and a rounded, child-friendly register that sits with the
   rest of the type. */
const baloo = Baloo_2({
  subsets: ["devanagari", "latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-devanagari",
});

const onest = Onest({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-onest",
});

const DEFAULT_DESCRIPTION =
  "Monal Digital is a premium animation studio crafting cinematic stories, original IPs and next-gen visual experiences for kids worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Monal Digital | Creative Animation Studio",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  icons: {
    // Use the colourful Monal (MONAL) logo mark for the browser tab.
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: ["/favicon.png"],
    apple: [{ url: "/favicon.png" }],
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Monal Digital | Creative Animation Studio",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: "Monal Digital | Creative Animation Studio",
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${onest.variable} ${baloo.variable}`}>
      {/* `suppressHydrationWarning` because browser extensions stamp their
          own attributes onto <body> before React hydrates — ColorZilla adds
          `cz-shortcut-listen="true"`, Grammarly and password managers add
          theirs — and React reports the difference as a hydration mismatch
          the developer cannot fix from the source.

          It is scoped deliberately. The flag suppresses mismatches on THIS
          element's own attributes and text only; it does not reach the
          children, so a genuine hydration bug anywhere inside the tree
          still fails loudly. Putting it on <html> instead would be the
          careless version of this fix. */}
      <body
        suppressHydrationWarning
        className="min-h-screen bg-paper text-ink font-body overflow-x-clip antialiased"
      >
        <CustomCursor />
        <ScrollProgress />
        <ScrollManager />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
