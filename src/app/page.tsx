import { Builds } from '@/components/Builds';
import { Contact } from '@/components/Contact';
import { Credentials } from '@/components/Credentials';
import { DocumentFrame } from '@/components/DocumentFrame';
import { EasterEgg } from '@/components/EasterEgg';
import { FeaturedResearch } from '@/components/FeaturedResearch';
import { FieldRecord } from '@/components/FieldRecord';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Instrumentation } from '@/components/Instrumentation';
import { Nav } from '@/components/Nav';
import { Profile } from '@/components/Profile';
import { RevealObserver } from '@/components/RevealObserver';
import { StampIn } from '@/components/StampIn';
import { TelemetryStrip } from '@/components/TelemetryStrip';

export default function Page() {
  return (
    <>
      <StampIn />
      <DocumentFrame />

      <a
        href="#main"
        className="t-label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-3"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <TelemetryStrip />
        <Profile />
        <div className="shell">
          <hr className="rule" />
        </div>
        <FieldRecord />
        <FeaturedResearch />
        <Builds />
        <div className="shell">
          <hr className="rule" />
        </div>
        <Instrumentation />
        <div className="shell">
          <hr className="rule" />
        </div>
        <Credentials />
        <div className="shell">
          <hr className="rule" />
        </div>
        <Contact />
      </main>

      <Footer />
      <RevealObserver />
      <EasterEgg />
    </>
  );
}
