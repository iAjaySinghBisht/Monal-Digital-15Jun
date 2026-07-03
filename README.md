# Monal Digital

Marketing site for Monal Digital — a creative animation studio. Built with
**Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**, with GSAP-driven
motion and an MDX blog. Every route is statically prerendered for SEO.

## Stack

- **Next.js 15** App Router (static generation / SSG) — real HTML per route
- **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **GSAP** (`@gsap/react`, ScrollTrigger, SplitText) — data-attribute motion engine
- **MDX** blog (`@next/mdx`) with frontmatter parsed by `gray-matter`

## Scripts

```bash
npm run dev     # start the dev server (http://localhost:3000)
npm run build   # production build (static export of every route)
npm run start   # serve the production build
npm run lint    # ESLint (next/core-web-vitals + next/typescript)
```

## Environment

Copy `.env.example` to `.env` and set:

- `NEXT_PUBLIC_SITE_URL` — canonical origin (used for canonical + Open Graph URLs)
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID (optional)

## Project layout

```
app/                 App Router routes + layout, sitemap.ts, robots.ts
  blog/[slug]/       Dynamic blog post pages (generateStaticParams)
  services/[slug]/   Dynamic service detail pages
components/          UI components (client + server)
content/blog/        MDX blog posts (frontmatter-driven)
data/constants.ts    Static site data (projects, services, team, ventures)
hooks/               useUiAnimations — the GSAP motion engine
lib/                 posts (server), blog-types (client-safe), site config
public/assets/       Images (referenced by URL-safe path)
mdx-components.tsx    MDX component styling map (App Router convention)
```

## SEO

- Per-route metadata via the Next.js Metadata API (`generateMetadata`)
- `app/sitemap.ts` → `/sitemap.xml`, `app/robots.ts` → `/robots.txt`
- Open Graph + Twitter tags; article tags on blog posts
- All pages prerendered as static HTML — no client-side-only content for crawlers

## Deployment (Vercel)

The project deploys as a standard Next.js app — use the default settings:

- **Framework Preset:** Next.js
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

Set these environment variables in the Vercel project (they are not committed,
since `.env` is git-ignored):

- `NEXT_PUBLIC_SITE_URL` — e.g. `https://www.monaldigital.com`
- `NEXT_PUBLIC_GA_ID` — GA4 measurement ID (optional)

After deploying, resubmit the sitemap (`/sitemap.xml`) in Google Search Console.
