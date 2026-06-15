// Loads every MDX post from /content/blog at build time and exposes a sorted,
// metadata-rich list to the blog pages. Frontmatter is surfaced as a named
// `frontmatter` export by remark-mdx-frontmatter (see vite.config.js).

const modules = import.meta.glob("/content/blog/*.mdx", { eager: true });

/** Rough reading-time estimate from rendered text length. */
const readingTime = (text = "") => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

export const posts = Object.entries(modules)
  .map(([path, mod]) => {
    const fm = mod.frontmatter || {};
    const slug = fm.slug || path.split("/").pop().replace(/\.mdx?$/, "");
    return {
      ...fm,
      slug,
      // The compiled MDX component (the post body).
      Component: mod.default,
      readingMinutes: readingTime(fm.excerpt) + 3,
    };
  })
  // Latest first.
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export const getPostBySlug = (slug) => posts.find((p) => p.slug === slug);

/** Unique category list, in order of first (most recent) appearance. */
export const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];

/** Human-friendly date, e.g. "13 Jun 2026". */
export const formatDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
