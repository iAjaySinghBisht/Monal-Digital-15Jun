// Reads every MDX post from /content/blog on the server (build time) and exposes
// a sorted, metadata-rich list to the blog pages. Frontmatter is parsed with
// gray-matter — this module is server-only (uses node:fs) and must never be
// imported into a Client Component. Client-safe types/helpers live in
// ./blog-types.
import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { PostMeta } from "./blog-types";

export type { PostMeta } from "./blog-types";
export { formatDate } from "./blog-types";

const contentDir = join(process.cwd(), "content", "blog");

/** Rough reading-time estimate from a text length. */
const readingTime = (text = "") => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/** All posts, most recent first. */
export const getPosts = (): PostMeta[] =>
  readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const { data } = matter(readFileSync(join(contentDir, file), "utf8"));
      const slug = (data.slug as string) || file.replace(/\.mdx?$/, "");
      return {
        ...(data as Omit<PostMeta, "slug" | "readingMinutes">),
        slug,
        readingMinutes: readingTime(data.excerpt) + 3,
      } as PostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getPostBySlug = (slug: string): PostMeta | undefined =>
  getPosts().find((p) => p.slug === slug);

/** Unique category list, in order of first (most recent) appearance. */
export const getCategories = (): string[] => [
  ...new Set(getPosts().map((p) => p.category).filter(Boolean)),
];
