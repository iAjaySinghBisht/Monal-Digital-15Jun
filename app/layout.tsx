import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollManager from "@/components/ScrollManager";
import Analytics from "@/components/Analytics";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink font-body overflow-x-clip antialiased">
        <CustomCursor />
        <ScrollProgress />
        <ScrollManager />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
