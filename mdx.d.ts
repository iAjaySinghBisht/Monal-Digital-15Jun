// Allow importing compiled .mdx modules (blog post bodies) with a typed default
// export and the `frontmatter` named export surfaced by remark-mdx-frontmatter.
declare module "*.mdx" {
  import type { ComponentType } from "react";
  export const frontmatter: Record<string, unknown>;
  const MDXComponent: ComponentType<{ components?: Record<string, unknown> }>;
  export default MDXComponent;
}
