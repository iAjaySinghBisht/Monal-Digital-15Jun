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
      {/* The work comes before the ambition: the shows are the proof that the
          six ventures are real, so they argue for the ecosystem that follows. */}
      <Hero />
      <About />
      <ContentLibrary />
      <Services />
      <Testimonials />
      <Footer />
    </>
  );
}
