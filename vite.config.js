import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // MDX must run before the React plugin so .mdx is compiled to JSX first.
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          // Exposes YAML frontmatter as a named `frontmatter` export on each
          // compiled MDX module, so the blog pages can read post metadata.
          [remarkMdxFrontmatter, { name: "frontmatter" }],
        ],
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
});
