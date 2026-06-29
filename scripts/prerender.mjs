/**
 * Post-build SEO prerender.
 *
 * The site ships as a Vite SPA, but social crawlers (Facebook, LinkedIn,
 * WhatsApp, X) don't execute JavaScript — they only read the static <head>.
 * This script runs after `vite build` and writes a real HTML file per blog
 * route, cloned from dist/index.html with route-specific <title>, description,
 * canonical, Open Graph and Twitter tags injected. The SPA still hydrates and
 * renders the page for humans; crawlers get correct metadata with zero JS.
 *
 * Output:
 *   dist/blog.html              -> served at /blog        (listing)
 *   dist/blog/<slug>.html       -> served at /blog/<slug> (each post)
 *   dist/sitemap.xml
 *
 * Vercel serves these static files ahead of the SPA catch-all rewrite, and
 * `cleanUrls` maps `foo.html` to the extensionless `/foo` path.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");
const contentDir = join(root, "content", "blog");

const SITE_URL = (process.env.VITE_SITE_URL || "https://monaldigital.com").replace(/\/$/, "");
const SITE_NAME = "Monal Digital";
const abs = (p = "/") => `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`;

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ---- read posts ---------------------------------------------------------
// Only .mdx files are real posts — mirrors the app's import.meta.glob in
// src/blog/posts.js, so docs like README.md are never treated as a post.
const posts = readdirSync(contentDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((file) => {
    const { data } = matter(readFileSync(join(contentDir, file), "utf8"));
    return { ...data, slug: data.slug || file.replace(/\.mdx?$/, "") };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// ---- head-injection helpers --------------------------------------------
const template = readFileSync(join(dist, "index.html"), "utf8");

function buildTags({ title, description, url, image, type = "website", date, author }) {
  const imageAbs = image ? abs(image) : "";
  const t = [
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:type" content="${esc(type)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
  ];
  if (imageAbs) {
    t.push(
      `<meta property="og:image" content="${esc(imageAbs)}" />`,
      `<meta property="og:image:alt" content="${esc(title)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:image" content="${esc(imageAbs)}" />`,
    );
  } else {
    t.push(`<meta name="twitter:card" content="summary" />`);
  }
  t.push(
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
  );
  if (type === "article") {
    if (date) t.push(`<meta property="article:published_time" content="${esc(date)}" />`);
    if (author) t.push(`<meta property="article:author" content="${esc(author)}" />`);
  }
  return t.map((line) => `    ${line}`).join("\n");
}

function renderPage(meta) {
  let html = template;
  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(meta.title)}</title>`);
  // Replace existing description meta (or inject if absent)
  if (/<meta\s+name="description"[^>]*>/i.test(html)) {
    html = html.replace(
      /<meta\s+name="description"[^>]*>/i,
      `<meta name="description" content="${esc(meta.description)}" />`,
    );
  } else {
    html = html.replace(/<\/head>/i, `    <meta name="description" content="${esc(meta.description)}" />\n  </head>`);
  }
  // Inject social + canonical tags before </head>
  html = html.replace(/<\/head>/i, `${buildTags(meta)}\n  </head>`);
  return html;
}

function write(file, html) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// ---- listing page -------------------------------------------------------
write(
  join(dist, "blog.html"),
  renderPage({
    title: `Blog — Stories, craft & studio notes | ${SITE_NAME}`,
    description:
      "Notes from the Monal Digital studio — original IP, animation craft, and what keeps young audiences watching.",
    url: abs("/blog"),
    image: posts[0]?.coverImage,
    type: "website",
  }),
);

// ---- per-post pages -----------------------------------------------------
for (const post of posts) {
  write(
    join(dist, "blog", `${post.slug}.html`),
    renderPage({
      title: post.seoTitle || `${post.title} | ${SITE_NAME}`,
      description: post.seoDescription || post.excerpt,
      url: abs(`/blog/${post.slug}`),
      image: post.coverImage,
      type: "article",
      date: post.date,
      author: post.author,
    }),
  );
}

// ---- sitemap ------------------------------------------------------------
const urls = [
  { loc: abs("/"), lastmod: posts[0]?.date },
  { loc: abs("/blog"), lastmod: posts[0]?.date },
  ...posts.map((p) => ({ loc: abs(`/blog/${p.slug}`), lastmod: p.date })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${esc(u.lastmod)}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);

console.log(
  `✓ Prerendered ${posts.length} post page(s) + listing + sitemap → dist/blog/`,
);
