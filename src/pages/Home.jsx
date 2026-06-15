import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import ContentLibrary from "../components/ContentLibrary";
import Services from "../components/Services";
import Team from "../components/Team";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import { useUiAnimations } from "../hooks/useUiAnimations";

const Home = () => {
  /* Activates the data-attribute driven scroll/interaction engine
     (panel stacking, reveals, counters, magnetic CTAs) across the page. */
  useUiAnimations();

  return (
    <>
      <Header />
      {/* Stacked, overlapping panels — each rises and opens over the last. */}
      <Hero />
      <About />
      <ContentLibrary />
      <Services />
      <Team />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
