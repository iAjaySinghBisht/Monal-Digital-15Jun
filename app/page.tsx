import ReactDOM from "react-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ContentLibrary from "@/components/ContentLibrary";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import UiAnimations from "@/components/UiAnimations";
import AipanBorder from "@/components/AipanBorder";

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
      {/* The work comes before the ambition: the shows are the proof that the
          six ventures are real, so they argue for the ecosystem that follows. */}
      <Hero />
      <About />
      <ContentLibrary />
      <Services />
      <Testimonials />
      <Footer />
      {/* The Aipan band, once, as the last thing on the page. Aipan is laid
          at the threshold you are about to cross — the doorstep, not the
          wall — so the closing edge of the page is where it belongs. It
          also needs something dark to sit against: between two pale
          sections the ochre read as a stripe interrupting the page rather
          than a seal closing it. */}
      <AipanBorder />
    </>
  );
}
