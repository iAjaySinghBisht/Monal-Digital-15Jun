import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPosts } from "@/lib/posts";
import { services } from "@/data/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "/",
    "/about-us",
    "/contact-us",
    "/career",
    "/team",
    "/work",
    "/services",
    "/blog",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const serviceRoutes = Object.values(services).map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: now,
  }));

  const postRoutes = getPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
