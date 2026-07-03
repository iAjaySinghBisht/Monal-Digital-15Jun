import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Team from "@/components/Team";
import UiAnimations from "@/components/UiAnimations";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "The artists, storytellers, educators and technologists behind Monal Digital.",
  alternates: { canonical: "/team" },
  openGraph: {
    title: "Our Team — Monal Digital",
    description:
      "The artists, storytellers, educators and technologists behind Monal Digital.",
    url: "/team",
  },
};

export default function TeamPage() {
  return (
    <>
      <UiAnimations />
      <Header />
      {/* Spacer so the team section clears the fixed header */}
      <div className="pt-20 md:pt-24 bg-paper" />
      <Team />
      <Footer />
    </>
  );
}
