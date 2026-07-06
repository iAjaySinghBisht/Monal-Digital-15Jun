import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UiAnimations from "@/components/UiAnimations";
import BlogIndex from "@/components/BlogIndex";
import { Eyebrow } from "@/components/Decor";
import { getPosts, getCategories } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";

const DESCRIPTION =
  "Notes from the Monal Digital studio on original IP, animation craft, and what keeps young audiences watching.";

export const metadata: Metadata = {
  title: "Blog: Stories, craft & studio notes",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog: Stories, craft & studio notes | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/blog",
    images: ["/blog/covers/animation-pipeline.webp"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/blog/covers/animation-pipeline.webp"],
  },
};

export default function BlogPage() {
  const posts = getPosts();
  const categories = getCategories();

  return (
    <>
      <UiAnimations />
      <Header />

      {/* Hero */}
      <section className="relative bg-black text-paper overflow-hidden">
        <div className="absolute inset-0 bg-dots-light opacity-50 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

        <div className="absolute top-28 md:top-32 left-6 md:left-12 z-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors"
          >
            <span className="inline-block rotate-180 transition-transform group-hover:-translate-x-1">→</span>
            Back home
          </Link>
        </div>

        <div className="relative max-w-325 mx-auto px-6 md:px-12 pt-40 md:pt-48 pb-16 md:pb-24 text-center">
          <div data-reveal="up" className="mb-6 flex justify-center">
            <Eyebrow tone="dark" dot="bg-violet">From the studio</Eyebrow>
          </div>
          <h1
            data-reveal="up"
            className="font-display text-[clamp(2.8rem,11vw,8.5rem)] leading-[0.9] tracking-[-0.04em]"
          >
            The Blog.
          </h1>
          <p
            data-reveal="up"
            data-reveal-delay="0.12"
            className="mt-7 text-white/60 text-lg leading-relaxed max-w-xl mx-auto"
          >
            Craft notes, IP thinking, and lessons from making things kids
            actually want to watch.
          </p>
        </div>
      </section>

      <BlogIndex posts={posts} categories={categories} />

      <Footer />
    </>
  );
}
