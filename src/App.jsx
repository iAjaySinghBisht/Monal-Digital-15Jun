import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ServiceDetail from "./pages/ServiceDetail";
import AllWork from "./pages/AllWork";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Career from "./pages/Career";
import TeamPage from "./pages/TeamPage";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import "./App.css";


function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      let cancelled = false;

      const anchor = () => {
        if (cancelled) return false;
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "instant", block: "start" });
          return true;
        }
        return false;
      };

      const timers = [0, 120, 300, 600].map((d) => setTimeout(anchor, d));
      window.addEventListener("load", anchor);

      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
        window.removeEventListener("load", anchor);
      };
    }
  
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <div className="min-h-screen bg-paper text-ink font-body overflow-x-clip antialiased">
      <CustomCursor />
      <ScrollProgress />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/career" element={<Career />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/work" element={<AllWork />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
      </Routes>
    </div>
  );
}

export default App;
