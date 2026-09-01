"use client";

import { StarfieldCanvas } from "@/components/effects/StarfieldCanvas";
import { AlienCursor } from "@/components/effects/AlienCursor";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { KonamiEasterEgg } from "@/components/effects/KonamiEasterEgg";
import { CommandPalette } from "@/components/effects/CommandPalette";
import { BackToTop } from "@/components/effects/BackToTop";
import { SoundToggle } from "@/components/effects/SoundToggle";
import { SoundBindings } from "@/components/effects/SoundBindings";
import { ShortcutsHelp } from "@/components/effects/ShortcutsHelp";
import { SectionRail } from "@/components/effects/SectionRail";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Education } from "@/components/portfolio/Education";
import { Certificates } from "@/components/portfolio/Certificates";
import { Performance } from "@/components/portfolio/Performance";
import { Achievements } from "@/components/portfolio/Achievements";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { Goals } from "@/components/portfolio/Goals";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { ParallaxBreak } from "@/components/portfolio/ParallaxBreak";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--void)] text-foreground">
      {/* Global background layers */}
      <StarfieldCanvas density={1} />
      {/* Vignette overlay */}
      <div className="pointer-events-none fixed inset-0 -z-[8] vignette" />
      {/* Grid backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-[9] bg-grid opacity-20" />

      {/* Foreground UI */}
      <ScrollProgress />
      <AlienCursor />
      <Navbar />
      <SectionRail />
      <CommandPalette />
      <KonamiEasterEgg />
      <ShortcutsHelp />
      <BackToTop />
      <SoundToggle />
      <SoundBindings />

      <main className="relative z-10 flex-1">
        <Hero />
        <About />
        <ParallaxBreak
          image="/assets/alien-planet.png"
          title="ORIGIN · ASCENSION · STELLAR DOCK"
          subtitle="Each waypoint on the journey recalibrated the trajectory toward engineering."
        />
        <Education />
        <Certificates />
        <Performance />
        <Achievements />
        <ParallaxBreak
          image="/assets/alien-craft.png"
          title="THE ARSENAL THAT POWERS THE CRAFT"
          subtitle="Languages, frameworks and problem-solving cores loaded into the engineering bay."
        />
        <Skills />
        <Projects />
        <Testimonials />
        <Goals />
        <ParallaxBreak
          image="/assets/alien-glyphs.png"
          title="OPEN A CHANNEL · TRANSMIT YOUR SIGNAL"
          subtitle="Frequencies monitored around the clock. Encrypted transmissions welcome."
        />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
