import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailBody from "@/components/ServiceDetailBody";
import UiAnimations from "@/components/UiAnimations";
import { services } from "@/data/constants";

/* Stable display order — drives the prev / next service navigation. */
const ORDER = ["pre", "production", "distribution"] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return ORDER.map((key) => ({ slug: services[key].slug }));
}

const keyForSlug = (slug: string) =>
  ORDER.find((k) => services[k].slug === slug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = keyForSlug(slug);
  if (!key) return {};
  const service = services[key];
  const url = `/services/${service.slug}`;

  return {
    title: service.title,
    description: service.desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${service.title} — Monal Digital`,
      description: service.desc,
      url,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const key = keyForSlug(slug);
  if (!key) notFound();

  const orderIndex = ORDER.indexOf(key);
  const prev = services[ORDER[(orderIndex - 1 + ORDER.length) % ORDER.length]];
  const next = services[ORDER[(orderIndex + 1) % ORDER.length]];

  return (
    <>
      <UiAnimations />
      <ServiceDetailBody service={services[key]} prev={prev} next={next} />
    </>
  );
}
