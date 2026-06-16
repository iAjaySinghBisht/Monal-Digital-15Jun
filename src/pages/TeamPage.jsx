import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Team from "../components/Team";
import { useUiAnimations } from "../hooks/useUiAnimations";

const TeamPage = () => {
  useUiAnimations();

  return (
    <>
      <Header />
      {/* Spacer so the team section clears the fixed header */}
      <div className="pt-20 md:pt-24 bg-paper" />
      <Team />
      <Footer />
    </>
  );
};

export default TeamPage;
