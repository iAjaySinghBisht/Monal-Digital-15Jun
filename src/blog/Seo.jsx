import { useEffect } from "react";
import { SITE_NAME } from "./site";

// Imperatively upserts <title> and meta/link tags so client-side route changes
// keep the document head accurate. Social crawlers don't run JS — they read the
// per-route static tags injected by scripts/prerender.mjs at build time — so this
// component exists purely for the in-browser experience and for JS-capable bots.

const upsertMeta = (selector, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};

const upsertLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
};

export default function Seo({
  title,
  description,
  url,
  image,
  type = "website",
  publishedTime,
  author,
}) {
  useEffect(() => {
    if (title) document.title = title;

    if (description)
      upsertMeta('meta[name="description"]', {
        name: "description",
        content: description,
      });

    if (url) upsertLink("canonical", url);

    // Open Graph
    const og = {
      "og:site_name": SITE_NAME,
      "og:type": type,
      "og:title": title,
      "og:description": description,
      "og:url": url,
      "og:image": image,
    };
    Object.entries(og).forEach(([property, content]) => {
      if (content)
        upsertMeta(`meta[property="${property}"]`, { property, content });
    });

    // Twitter
    const tw = {
      "twitter:card": image ? "summary_large_image" : "summary",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": image,
    };
    Object.entries(tw).forEach(([name, content]) => {
      if (content) upsertMeta(`meta[name="${name}"]`, { name, content });
    });

    if (type === "article") {
      if (publishedTime)
        upsertMeta('meta[property="article:published_time"]', {
          property: "article:published_time",
          content: publishedTime,
        });
      if (author)
        upsertMeta('meta[property="article:author"]', {
          property: "article:author",
          content: author,
        });
    }
  }, [title, description, url, image, type, publishedTime, author]);

  return null;
}
