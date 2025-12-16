import CallToAction from "@/features/marketing/components/call-to-action";
import FAQsFour from "@/features/marketing/components/faqs-4";
import { FeatureSection } from "@/features/marketing/components/features/index";
import { FeaturesGrid } from "@/features/marketing/components/features-grid/index";
import { AISection } from "@/features/marketing/components/ai-section/index";
import { ComparisonSection } from "@/features/marketing/components/comparison-section/index";
import { Pricing } from "@/features/marketing/components/pricing/Pricing";
import Footer from "@/features/marketing/components/footer";
import HeroSection from "@/features/marketing/components/hero-section";
import ProvidersSection from "@/features/marketing/components/providers";
import StatsSection from "@/features/marketing/components/stats-section";
import WallOfLoveSection from "@/features/marketing/components/testimonials";

// currently rethinking the silk thing on the current background. this pr from jordan's pc tries to solve that.
export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-background text-white mx-auto scroll-smooth">
      <div className=" font-main z-20 w-full">
        {/*<Navbar />*/}
        <main>
          <section id="home">
            <HeroSection />
          </section>

          {/*<LogoCloud />*/}
          <section id="features">
            <FeatureSection />
          </section>

          <section id="platform">
            <FeaturesGrid />
          </section>
          {/*<StatsSection />*/}

          {/*<ContentSection />*/}
          <section id="ai">
            <AISection />
          </section>
          <section id="providers">
            <ProvidersSection />
          </section>
          {/*<FeaturesSection />*/}

          <section id="testimonials">
            <WallOfLoveSection />
          </section>
          <section id="pricing">
            <Pricing />
          </section>
          <section id="comparison">
            <ComparisonSection />
          </section>
          <section id="cta">
            <CallToAction />
          </section>
          <section id="faq">
            <FAQsFour />
          </section>
          {/*<FaqSection />*/}
        </main>
        <Footer />
        {/*<Footer />*/}
      </div>
    </div>
  );
}
