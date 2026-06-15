import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../blog/Seo";
import { Eyebrow, ArrowUpRight } from "../components/Decor";
import { posts, categories, formatDate } from "../blog/posts";
import { SITE_NAME, absoluteUrl } from "../blog/site";
import { useUiAnimations } from "../hooks/useUiAnimations";

const ALL = "All";

const Blog = () => {
  useUiAnimations();
  const [active, setActive] = useState(ALL);

  const visible =
    active === ALL ? posts : posts.filter((p) => p.category === active);

  const [featured, ...rest] = visible;

  return (
    <>
      <Seo
        title={`Blog — Stories, craft & studio notes | ${SITE_NAME}`}
        description="Notes from the Monal Digital studio — original IP, animation craft, and what keeps young audiences watching."
        url={absoluteUrl("/blog")}
        image={absoluteUrl("/blog/covers/animation-pipeline.webp")}
      />

      <Header />

      {/* Hero */}
      <section className="relative bg-black text-paper overflow-hidden">
        <div className="absolute inset-0 bg-dots-light opacity-50 pointer-events-none [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />

        <div className="absolute top-28 md:top-32 left-6 md:left-12 z-10">
          <Link
            to="/"
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
            The blog.
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

      {/* Posts */}
      <section className="relative bg-paper py-16 md:py-24">
        <div className="max-w-325 mx-auto px-6 md:px-12">
          {/* Category filter */}
          <div
            data-reveal="up"
            className="flex flex-wrap items-center justify-center gap-2.5 mb-12 md:mb-16"
          >
            {[ALL, ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold tracking-tight transition-all ${
                  active === cat
                    ? "bg-ink text-paper"
                    : "bg-mist text-ink/65 hover:bg-cloud hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {featured && (
            <div data-reveal-group="up" className="grid gap-5">
              {/* Featured (most recent) post */}
              <Link
                to={`/blog/${featured.slug}`}
                className="group card card-hover overflow-hidden grid md:grid-cols-2"
              >
                <div className="relative aspect-16/10 md:aspect-auto md:min-h-[340px] overflow-hidden bg-ink">
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-7 md:p-10 flex flex-col">
                  <div className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-royal mb-5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-lav px-3 py-1">
                      {featured.category}
                    </span>
                    <span className="text-muted normal-case tracking-normal font-medium">
                      {formatDate(featured.date)}
                    </span>
                  </div>
                  <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.05] tracking-tight text-ink">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-ink/65 leading-relaxed max-w-lg">
                    {featured.excerpt}
                  </p>
                  <div className="mt-auto pt-8 flex items-center justify-between">
                    <span className="text-sm font-medium text-muted">
                      {featured.author} · {featured.readingMinutes} min read
                    </span>
                    <span className="w-10 h-10 grid place-items-center rounded-full bg-ink text-paper transition-transform group-hover:translate-x-1">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* The rest */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {rest.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="group card card-hover overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-16/10 overflow-hidden bg-ink">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-paper/95 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="text-[12px] font-medium text-muted mb-3">
                          {formatDate(post.date)}
                        </div>
                        <h3 className="font-display text-[1.4rem] leading-[1.12] tracking-tight text-ink">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-sm text-ink/60 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-semibold text-ink">
                          Read article
                          <ArrowUpRight className="w-4 h-4 text-royal transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {!featured && (
            <p className="text-center text-muted py-20">
              No posts in this category yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Blog;
