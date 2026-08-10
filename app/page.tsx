import ReactDOM from "react-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ContentLibrary from "@/components/ContentLibrary";
import Services from "@/components/Services";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import UiAnimations from "@/components/UiAnimations";

export default function HomePage() {
  /* The hero poster is the LCP element — fetch it with high priority so it
     paints without waiting to be discovered in the markup. */
  ReactDOM.preload("/showreel/Showreel-poster.webp", {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <>
      <UiAnimations />
      <Header />

      <main id="main-content">
      {/* The ecosystem comes before the work: the six ventures frame what we
          are building, and the shows that follow are the proof they are real.
          The partner wall then answers "who with", which only means anything
          once you have seen the work it refers to. */}
      <Hero />
      <About />
      <Services />
      <ContentLibrary />
      <Partners />
      <Testimonials />
      </main>

      <Footer />
    </>
  );
}
