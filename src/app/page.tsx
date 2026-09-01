import SmoothScroll from "@/components/portfolio/SmoothScroll";
import CustomCursor from "@/components/portfolio/CustomCursor";
import Preloader from "@/components/portfolio/Preloader";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Education from "@/components/portfolio/Education";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Guestbook from "@/components/portfolio/Guestbook";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground selection:bg-fuchsia-500/40">
      {/* Ambient film grain over the whole experience */}
      <div className="noise-overlay" aria-hidden="true" />

      <SmoothScroll />
      <CustomCursor />
      <Preloader />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Projects />
        <Guestbook />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
