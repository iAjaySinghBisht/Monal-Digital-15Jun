// Canonical site origin, used to build absolute URLs for SEO canonical tags
// and Open Graph / Twitter image links (social crawlers require absolute URLs).
// Override at build time on Vercel with an env var:  VITE_SITE_URL=https://your-domain
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://monaldigital.com"
).replace(/\/$/, "");

export const SITE_NAME = "Monal Digital";

/** Join the site origin with a path, returning an absolute URL. */
export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
