# Blog content

Posts are plain **MDX** files in this folder. To publish a new post, add a
`.mdx` file here — the listing at `/blog` and the page at `/blog/<slug>` are
generated automatically at build time. No code changes needed.

## Frontmatter (all fields required)

```yaml
---
title: "Your headline"
slug: "url-safe-slug"            # the post lives at /blog/<slug>
excerpt: "1–2 sentence teaser shown on cards and as the article lead."
coverImage: "/blog/covers/your-image.webp"   # put the file in public/blog/covers/
author: "Author Name"
date: "2026-06-15"               # ISO date — newest posts sort to the top
category: "Studio Craft"         # becomes a filter chip on /blog
seoTitle: "Custom <title> for search/social | Monal Digital"
seoDescription: "150–160 char meta description for SEO + social cards."
---
```

Below the frontmatter, write the body in Markdown/MDX (`##` headings, lists,
`>` blockquotes, links, `**bold**`, etc.). Styling is applied automatically to
match the site — see `src/blog/mdxComponents.jsx`.

## Cover / Open Graph images

- Drop images in `public/blog/covers/` and reference them as
  `/blog/covers/<file>` in `coverImage`.
- The same image is used as the Open Graph / Twitter card image. Use a
  landscape image (≈1200×630) for best social previews.

## SEO / social sharing

`npm run build` runs `scripts/prerender.mjs`, which writes a static HTML file
per post (`dist/blog/<slug>.html`) with real `<title>`, description, canonical,
Open Graph and Twitter tags baked into `<head>` — so social crawlers (which
don't run JavaScript) get correct previews. It also generates `dist/sitemap.xml`.

Set the production domain once via a Vercel env var so absolute URLs are right:

```
VITE_SITE_URL=https://your-domain.com
```

(Defaults to `https://monaldigital.com`.)
