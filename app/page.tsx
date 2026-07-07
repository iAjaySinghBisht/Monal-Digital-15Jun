import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ContentLibrary from "@/components/ContentLibrary";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import UiAnimations from "@/components/UiAnimations";

export default function HomePage() {
  return (
    <>
      <UiAnimations />
      <Header />
      {/* Stacked, overlapping panels — each rises and opens over the last. */}
      <Hero />
      <About />
      <Services />
      <ContentLibrary />
      <Testimonials />
      <Footer />
    </>
  );
}
