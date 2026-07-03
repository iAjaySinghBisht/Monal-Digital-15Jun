import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const nextConfig: NextConfig = {
  // Let Next treat .mdx files (imported from /content) as first-class modules.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // Pin the file-tracing root to this project so a stray lockfile in a parent
  // directory doesn't confuse Next's workspace-root detection.
  outputFileTracingRoot: process.cwd(),
};

const withMDX = createMDX({
  options: {
    // remark-frontmatter strips the YAML block from the rendered body;
    // remark-mdx-frontmatter also exposes it as a `frontmatter` export.
    // (Post metadata for listings/SEO is read separately via gray-matter.)
    remarkPlugins: [remarkGfm, remarkFrontmatter, [remarkMdxFrontmatter, { name: "frontmatter" }]],
  },
});

export default withMDX(nextConfig);
