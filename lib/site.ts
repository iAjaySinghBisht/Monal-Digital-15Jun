// Canonical site origin, used to build absolute URLs for SEO canonical tags
// and Open Graph / Twitter image links (social crawlers require absolute URLs).
// Override per-environment on Vercel with NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.monaldigital.com"
).replace(/\/$/, "");

export const SITE_NAME = "Monal Digital";

/** Join the site origin with a path, returning an absolute URL. */
export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

// Google Search Console ownership token (the `content` value from the
// "HTML tag" verification method). Hard-coded rather than env-driven on
// purpose: it is public by design, and Search Console re-checks it long
// after verification — a missing env var on a future deploy would silently
// un-verify the property. Empty string renders no tag at all.
export const GOOGLE_SITE_VERIFICATION =
  "Xn1FpVHUpnYWcC0DrNEkgSUawPtrOoJL3hi8O0bEnMk";
