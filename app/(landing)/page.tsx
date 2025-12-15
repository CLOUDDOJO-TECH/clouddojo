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
          <div className="w-full flex justify-between px-4 sm:px-6 lg:px-14 py-8">
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
          </div>
          {/*<LogoCloud />*/}
          <section id="features">
            <FeatureSection />
          </section>
          <div className="w-full flex justify-between px-4 sm:px-6 lg:px-14 py-8">
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
          </div>
          <section id="platform">
            <FeaturesGrid />
          </section>
          <div className="w-full flex justify-between px-4 sm:px-6 lg:px-14 py-8">
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
          </div>
          {/*<StatsSection />*/}

          {/*<ContentSection />*/}
          <section id="ai">
            <AISection />
          </section>
          <div className="w-full flex justify-between px-4 sm:px-6 lg:px-14 py-8">
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
          </div>
          <section id="providers">
            <ProvidersSection />
          </section>
          <div className="w-full flex justify-between px-4 sm:px-6 lg:px-14 py-8">
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
          </div>
          {/*<FeaturesSection />*/}

          <section id="testimonials">
            <WallOfLoveSection />
          </section>
          <div className="w-full flex justify-between px-4 sm:px-6 lg:px-14 py-8">
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
          </div>
          <section id="pricing">
            <Pricing />
          </section>
          <div className="w-full flex justify-between px-4 sm:px-6 lg:px-14 py-8">
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
          </div>
          <section id="comparison">
            <ComparisonSection />
          </section>
          <div className="w-full flex justify-between px-4 sm:px-6 lg:px-14 py-8">
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
          </div>
          <section id="cta">
            <CallToAction />
          </section>
          <div className="w-full flex justify-between px-4 sm:px-6 lg:px-14 py-8">
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
            <div className="border-l-2 border-dotted border-border/50 h-16"></div>
          </div>
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
