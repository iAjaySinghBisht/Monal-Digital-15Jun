import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import UiAnimations from "@/components/UiAnimations";
import PlayNav from "@/components/play/PlayNav";
import { PLAY_DESCRIPTION } from "@/data/play";

export const metadata: Metadata = {
  title: { default: "Play", template: "%s | Play | Monal Digital" },
  description: PLAY_DESCRIPTION,
};

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UiAnimations />
      <Header />
      <main className="mx-auto max-w-325 px-6 pt-32 pb-24 md:px-12 md:pt-40">
        <PlayNav />
        <div className="mt-10 md:mt-14">{children}</div>
      </main>
      <Footer />
    </>
  );
}
