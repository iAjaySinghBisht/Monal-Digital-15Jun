/**
 * Post-build static prerender.
 *
 * The site ships as a Vite SPA, but crawlers (Google's first wave, Bing,
 * social link previews, AI bots) read the raw HTML — which for an SPA is an
 * empty <div id="root">. This script runs after `vite build` and, for every
 * route, loads the built app in a headless browser, lets React render, and
 * writes a real static HTML file with the fully-rendered body + correct
 * <head> metadata. Vercel serves these files to crawlers ahead of the SPA
 * catch-all; real users still get the live React app (createRoot replaces the
 * snapshot on load, so there are no hydration concerns).
 *
 * If Chromium can't launch (e.g. a constrained CI box), it falls back to
 * meta-only output so the build still succeeds and deploys.
 *
 * Output:
 *   dist/index.html                -> /            (home, with body)
 *   dist/about-us.html             -> /about-us
 *   dist/contact-us.html           -> /contact-us
 *   dist/career.html               -> /career
 *   dist/team.html                 -> /team
 *   dist/work.html                 -> /work
 *   dist/blog.html                 -> /blog
 *   dist/blog/<slug>.html          -> /blog/<slug>
 *   dist/services/<slug>.html      -> /services/<slug>
 *   dist/sitemap.xml
 *
 * Vercel's `cleanUrls` maps `foo.html` to the extensionless `/foo` path.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");
const contentDir = join(root, "content", "blog");

const SITE_URL = (process.env.VITE_SITE_URL || "https://www.monaldigital.com").replace(/\/$/, "");
const SITE_NAME = "Monal Digital";
const abs = (p = "/") => `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`;

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ---- read blog posts ----------------------------------------------------
// Only .mdx files are real posts — mirrors the app's import.meta.glob in
// src/blog/posts.js, so docs like README.md are never treated as a post.
const posts = readdirSync(contentDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((file) => {
    const { data } = matter(readFileSync(join(contentDir, file), "utf8"));
    return { ...data, slug: data.slug || file.replace(/\.mdx?$/, "") };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// ---- route table --------------------------------------------------------
// Static marketing pages (no per-page meta in the app, so we supply it here).
const staticRoutes = [
  {
    path: "/",
    file: "index.html",
    title: "Monal Digital — Creative Animation Studio",
    description:
      "Monal Digital — a premium animation studio crafting cinematic stories, original IPs and next-gen visual experiences for kids worldwide.",
  },
  {
    path: "/about-us",
    file: "about-us.html",
    title: "About Us — Monal Digital",
    description:
      "Meet Monal Digital — a creative studio building at the intersection of kids' education, entertainment, technology and imagination.",
  },
  {
    path: "/contact-us",
    file: "contact-us.html",
    title: "Contact Us — Monal Digital",
    description: "Get in touch with Monal Digital — let's build something worth watching together.",
  },
  {
    path: "/career",
    file: "career.html",
    title: "Careers — Monal Digital",
    description:
      "Join Monal Digital. Opportunities for artists, animators, storytellers, educators and technologists.",
  },
  {
    path: "/team",
    file: "team.html",
    title: "Our Team — Monal Digital",
    description: "The artists, storytellers, educators and technologists behind Monal Digital.",
  },
  {
    path: "/work",
    file: "work.html",
    title: "Our Work — Monal Digital",
    description:
      "Explore Monal Digital's portfolio of animated brands, original IPs and children's content enjoyed by families across the globe.",
  },
  {
    path: "/blog",
    file: "blog.html",
    title: `Blog — Stories, craft & studio notes | ${SITE_NAME}`,
    description:
      "Notes from the Monal Digital studio — original IP, animation craft, and what keeps young audiences watching.",
    image: posts[0]?.coverImage,
  },
];

// Service detail pages (slugs from src/data/constants.js services).
const serviceRoutes = [
  {
    path: "/services/pre-production",
    file: "services/pre-production.html",
    title: "Pre-Production Services — Monal Digital",
    description:
      "Story development, character design, concept art, scripts, storyboards, and visual development.",
  },
  {
    path: "/services/production",
    file: "services/production.html",
    title: "Production Services — Monal Digital",
    description:
      "End-to-end animation production — modeling, rigging, animation, lighting, and rendering.",
  },
  {
    path: "/services/distribution-growth",
    file: "services/distribution-growth.html",
    title: "Distribution & Growth — Monal Digital",
    description:
      "Publishing, distribution, audience strategy and channel growth backed by data and analytics.",
  },
];

// Blog post pages (meta from frontmatter).
const postRoutes = posts.map((post) => ({
  path: `/blog/${post.slug}`,
  file: join("blog", `${post.slug}.html`),
  title: post.seoTitle || `${post.title} | ${SITE_NAME}`,
  description: post.seoDescription || post.excerpt,
  image: post.coverImage,
  type: "article",
  date: post.date,
  author: post.author,
}));

const routes = [...staticRoutes, ...serviceRoutes, ...postRoutes];

// ---- head-injection helpers --------------------------------------------
const template = readFileSync(join(dist, "index.html"), "utf8");

function buildTags({ path, title, description, image, type = "website", date, author }) {
  const url = abs(path);
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

// Compose final HTML: template head + per-route meta + (optional) rendered body.
function renderPage(route, bodyHtml) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(route.title)}</title>`);
  if (/<meta\s+name="description"[^>]*>/i.test(html)) {
    html = html.replace(
      /<meta\s+name="description"[^>]*>/i,
      `<meta name="description" content="${esc(route.description)}" />`,
    );
  } else {
    html = html.replace(/<\/head>/i, `    <meta name="description" content="${esc(route.description)}" />\n  </head>`);
  }
  html = html.replace(/<\/head>/i, `${buildTags(route)}\n  </head>`);
  if (bodyHtml) {
    html = html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${bodyHtml}</div>`);
  }
  return html;
}

function write(file, html) {
  const out = join(dist, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}

// ---- static file server (serves dist/ with SPA fallback) ----------------
const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

function startServer() {
  const indexHtml = readFileSync(join(dist, "index.html"));
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const filePath = join(dist, urlPath);
    if (urlPath !== "/" && existsSync(filePath) && statSync(filePath).isFile()) {
      res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
      res.end(readFileSync(filePath));
    } else {
      // SPA fallback — let React Router handle the path
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(indexHtml);
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

// ---- snapshot bodies via Puppeteer (best effort) ------------------------
const bodyByPath = {};
try {
  const puppeteer = (await import("puppeteer")).default;
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const { server, port } = await startServer();
  const page = await browser.newPage();
  // Reduced motion => the app skips entry animations and leaves content
  // visible (no opacity:0), so the snapshot captures the final state.
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  // Don't let build-time renders pollute Google Analytics.
  await page.setRequestInterception(true);
  page.on("request", (r) => {
    const u = r.url();
    if (u.includes("googletagmanager.com") || u.includes("google-analytics.com")) r.abort();
    else r.continue();
  });

  for (const route of routes) {
    const url = `http://127.0.0.1:${port}${route.path}`;
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 }).catch(() => {});
    await page.waitForSelector("#root > *", { timeout: 15000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 500)); // let late content settle
    bodyByPath[route.path] = await page.$eval("#root", (el) => el.innerHTML).catch(() => "");
    process.stdout.write(`  ✓ rendered ${route.path}\n`);
  }

  await browser.close();
  server.close();
} catch (err) {
  console.warn(`⚠ Puppeteer snapshot skipped (${err.message}) — writing meta-only HTML.`);
}

// ---- write all route files ----------------------------------------------
for (const route of routes) {
  write(route.file, renderPage(route, bodyByPath[route.path]));
}

// ---- sitemap ------------------------------------------------------------
const urls = [
  ...staticRoutes.map((r) => ({ loc: abs(r.path), lastmod: r.path === "/blog" ? posts[0]?.date : undefined })),
  ...serviceRoutes.map((r) => ({ loc: abs(r.path) })),
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

const rendered = Object.values(bodyByPath).filter(Boolean).length;
console.log(
  `✓ Prerendered ${routes.length} route(s) [${rendered} with body] + sitemap (${urls.length} URLs) → dist/`,
);
