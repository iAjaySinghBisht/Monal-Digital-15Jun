import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UiAnimations from "@/components/UiAnimations";
import { Eyebrow, ArrowUpRight } from "@/components/Decor";
import { getPosts, getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/blog-types";
import { SITE_NAME } from "@/lib/site";

// Only build the known post slugs; unknown ones 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const title = post.seoTitle || `${post.title} | ${SITE_NAME}`;
  const description = post.seoDescription || post.excerpt;
  const url = `/blog/${post.slug}`;

  return {
    // `title` already carries the brand suffix — use `absolute` so the root
    // layout's "%s | Monal Digital" template doesn't double it up.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [post.coverImage],
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Load the compiled MDX body. remark-frontmatter strips the YAML block; the
  // root mdx-components.tsx applies the Monal design language automatically.
  const { default: PostBody } = await import(`../../../content/blog/${slug}.mdx`);

  // Up to three more recent reads, excluding the current post.
  const more = getPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <UiAnimations />
      <Header />

      {/* Article hero */}
      <section className="relative bg-black text-paper overflow-hidden">
        <div className="absolute inset-0 bg-dots-light opacity-50 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

        <div className="absolute top-28 md:top-32 left-6 md:left-12 z-10">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors"
          >
            <span className="inline-block rotate-180 transition-transform group-hover:-translate-x-1">→</span>
            All posts
          </Link>
        </div>

        <div className="relative max-w-3xl mx-auto px-6 md:px-12 pt-40 md:pt-48 pb-14 md:pb-20 text-center">
          <div data-reveal="up" className="mb-6 flex justify-center">
            <Eyebrow tone="dark" dot="bg-sun">{post.category}</Eyebrow>
          </div>
          <h1
            data-reveal="up"
            className="font-display text-[clamp(2rem,6vw,4rem)] leading-[1.02] tracking-[-0.03em]"
          >
            {post.title}
          </h1>
          <div
            data-reveal="up"
            data-reveal-delay="0.1"
            className="mt-7 flex items-center justify-center gap-3 text-white/55 text-sm font-medium"
          >
            <span>{post.author}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>{formatDate(post.date)}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>{post.readingMinutes} min read</span>
          </div>
        </div>
      </section>

      {/* Cover image — overlaps the dark hero into the white body */}
      <div className="relative bg-paper">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div
            data-reveal="up"
            className="-mt-10 md:-mt-16 rounded-[28px] overflow-hidden border border-line bg-ink shadow-[0_44px_80px_-40px_rgba(24,24,27,0.4)] aspect-16/9"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="relative bg-paper pt-12 md:pt-16 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="font-display text-[clamp(1.2rem,2.4vw,1.55rem)] leading-snug tracking-tight text-ink/90 mb-2">
            {post.excerpt}
          </p>
          <hr className="rule-fade my-10" />

          <div className="blog-prose">
            <PostBody />
          </div>

          {/* Share / back */}
          <hr className="rule-fade my-12" />
          <div className="flex items-center justify-between gap-4">
            <Link href="/blog" className="btn btn-outline">
              <span className="inline-block rotate-180">→</span>
              More articles
            </Link>
            <Link href="/#contact" className="btn btn-dark">
              Work with us
            </Link>
          </div>
        </div>
      </article>

      {/* More reads */}
      {more.length > 0 && (
        <section className="relative bg-mist py-16 md:py-24">
          <div className="max-w-325 mx-auto px-6 md:px-12">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-display text-[clamp(1.6rem,4vw,2.6rem)] tracking-tight text-ink">
                Keep reading
              </h2>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-royal transition-colors"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {more.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group card card-hover overflow-hidden flex flex-col bg-paper"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-ink">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-paper/95 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-[12px] font-medium text-muted mb-3">
                      {formatDate(p.date)}
                    </div>
                    <h3 className="font-display text-[1.3rem] leading-[1.12] tracking-tight text-ink">
                      {p.title}
                    </h3>
                    <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-semibold text-ink">
                      Read article
                      <ArrowUpRight className="w-4 h-4 text-royal transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
