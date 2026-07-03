import type { Metadata } from "next";
import CareerForm from "@/components/CareerForm";
import UiAnimations from "@/components/UiAnimations";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Monal Digital. Opportunities for artists, animators, storytellers, educators and technologists.",
  alternates: { canonical: "/career" },
  openGraph: {
    title: "Careers — Monal Digital",
    description:
      "Join Monal Digital. Opportunities for artists, animators, storytellers, educators and technologists.",
    url: "/career",
  },
};

export default function CareerPage() {
  return (
    <>
      <UiAnimations />
      <CareerForm />
    </>
  );
}
