import { Suspense, lazy } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";

const ProblemSection = lazy(() =>
  import("./components/ProblemSection").then((m) => ({ default: m.ProblemSection }))
);
const SolutionSection = lazy(() =>
  import("./components/SolutionSection").then((m) => ({ default: m.SolutionSection }))
);
const DemoSection = lazy(() =>
  import("./components/DemoSection").then((m) => ({ default: m.DemoSection }))
);
const CTASection = lazy(() =>
  import("./components/CTASection").then((m) => ({ default: m.CTASection }))
);
const Footer = lazy(() =>
  import("./components/Footer").then((m) => ({ default: m.Footer }))
);

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header />
      <Hero />
      <Suspense fallback={<div className="h-24" />}>
        <ProblemSection />
      </Suspense>
      <Suspense fallback={<div className="h-24" />}>
        <SolutionSection />
      </Suspense>
      <Suspense fallback={<div className="h-24" />}>
        <DemoSection />
      </Suspense>
      <Suspense fallback={<div className="h-24" />}>
        <CTASection />
      </Suspense>
      <Suspense fallback={<div className="h-24" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
