import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EmbedFrame from "@/components/play/EmbedFrame";
import ToyBySlug from "@/components/play/ToyBySlug";
import { EMBEDDABLE_TOYS, toyBySlug } from "@/data/play";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return EMBEDDABLE_TOYS.map((t) => ({ toy: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ toy: string }>;
}): Promise<Metadata> {
  const { toy: slug } = await params;
  const toy = toyBySlug(slug);
  return {
    title: toy ? `${toy.name} (embed)` : "Embed",
    // The canonical version is the real page; embeds should not compete with it.
    robots: { index: false, follow: false },
    alternates: { canonical: toy ? `/play/${toy.slug}` : undefined },
  };
}

export default async function EmbedToyPage({ params }: { params: Promise<{ toy: string }> }) {
  const { toy: slug } = await params;
  const toy = toyBySlug(slug);
  if (!toy || !toy.embeddable) notFound();
  return (
    <EmbedFrame credit={absoluteUrl(`/play/${toy.slug}`)}>
      <ToyBySlug toy={toy} embedded />
    </EmbedFrame>
  );
}
