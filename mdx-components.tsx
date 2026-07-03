import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/mdx-styles";

// App Router convention: every imported .mdx module renders with these
// components merged in, so blog post bodies inherit the Monal design language.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}
