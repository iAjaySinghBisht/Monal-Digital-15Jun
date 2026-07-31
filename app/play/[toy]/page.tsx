import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToyBySlug from "@/components/play/ToyBySlug";
import { TOYS, toyBySlug } from "@/data/play";

/** Only the registered toys exist; anything else is a 404 rather than a
 *  render-time crash. */
export const dynamicParams = false;

export function generateStaticParams() {
  return TOYS.map((t) => ({ toy: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ toy: string }>;
}): Promise<Metadata> {
  const { toy: slug } = await params;
  const toy = toyBySlug(slug);
  if (!toy) return {};
  return {
    title: toy.name,
    description: toy.blurb,
    alternates: { canonical: `/play/${toy.slug}` },
    openGraph: {
      title: `${toy.name} | Play | Monal Digital`,
      description: toy.blurb,
      url: `/play/${toy.slug}`,
    },
  };
}

export default async function ToyPage({ params }: { params: Promise<{ toy: string }> }) {
  const { toy: slug } = await params;
  const toy = toyBySlug(slug);
  if (!toy) notFound();
  return <ToyBySlug toy={toy} />;
}
