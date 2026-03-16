import { Hero } from "./components/Hero";
import { ProblemSection } from "./components/ProblemSection";
import { SolutionSection } from "./components/SolutionSection";
import { DemoSection } from "./components/DemoSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <DemoSection />
      <CTASection />
      <Footer />
    </div>
  );
}
