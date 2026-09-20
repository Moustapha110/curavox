import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollBackground } from "@/components/ScrollBackground";
import { Sidebar } from "@/components/Sidebar";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { PhoneStage } from "@/components/landing/PhoneStage";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { PhysicianCTA } from "@/components/landing/PhysicianCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <ScrollBackground />
      <Sidebar />
      <main data-landing className="relative z-[1] sidebar-offset pt-14 md:pt-0">
        <Hero />
        <ProblemSection />
        <PhoneStage />
        <FeaturesGrid />
        <PhysicianCTA />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
