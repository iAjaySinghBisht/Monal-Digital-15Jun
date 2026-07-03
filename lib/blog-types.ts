// Client-safe blog types + helpers (no node:fs), so Client Components can
// import them without pulling the server-only filesystem loader into the bundle.

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  date: string;
  category: string;
  seoTitle?: string;
  seoDescription?: string;
  readingMinutes: number;
};

/** Human-friendly date, e.g. "13 Jun 2026". */
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
