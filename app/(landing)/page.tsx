import LogoCloud from "@/components/logo-cloud";
import CallToAction from "@/features/marketing/components/call-to-action";
import ContentSection from "@/features/marketing/components/content-3";
import FAQsFour from "@/features/marketing/components/faqs-4";
import { FeatureSection } from "@/features/marketing/components/features/index";
import Footer from "@/features/marketing/components/footer";
import HeroSection from "@/features/marketing/components/hero-section";
import ProvidersSection from "@/features/marketing/components/providers";
import StatsSection from "@/features/marketing/components/stats-section";
import WallOfLoveSection from "@/features/marketing/components/testimonials";

// currently rethinking the silk thing on the current background. this pr from jordan's pc tries to solve that.
export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-[#FAFAF9] dark:bg-background text-white mx-auto">
      <div className=" font-main z-20 w-full">
        {/*<Navbar />*/}
        <main>
          <HeroSection />
          {/*<LogoCloud />*/}
          <FeatureSection />
          <StatsSection />

          <ContentSection />
          <ProvidersSection />
          {/*<FeaturesSection />*/}

          <WallOfLoveSection />
          <CallToAction />
          <FAQsFour />
          {/*<FaqSection />*/}
        </main>
        <Footer />
        {/*<Footer />*/}
      </div>
    </div>
  );
}
