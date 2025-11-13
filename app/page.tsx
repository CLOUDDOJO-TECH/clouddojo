import Navbar from "@/components/navbar";
// import HeroSection from "@/components/landing/hero-section";
import FeatureCards from "@/components/feature-cards";

import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";
import { FeaturesBento } from "@/components/landing/wobble-section";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { ThreeStepFramework } from "@/components/landing/three-steps-section";
import { VendorCompanies } from "@/components/landing/vendor-section";
import { FounderTestimonial } from "@/components/landing/founder-testimonial";
import { Spotlight } from "@/components/spotlight";
import TestimonialsSection from "@/components/landing/testimonials";
import Silk from "@/components/backgrounds/Silk";
import ThemedBackground from "@/components/backgrounds/ThemedBackground";
import FeaturesSection from "@/components/landing/features-8";
import Features from "@/components/features-12";
import StatsSection from "@/components/stats-2";
import IntegrationsSection from "@/components/integrations-1";
import FAQsFour from "@/components/faqs-4";
import WallOfLoveSection from "@/components/testimonials";
import LogoCloud from "@/components/logo-cloud";
// import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";
import ContentSection from "@/components/content-3";
import CallToAction from "@/components/call-to-action";

// currently rethinking the silk thing on the current background. this pr from jordan's pc tries to solve that.
export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-[#FAFAF9] dark:bg-background text-white mx-auto">
      {/* Silk background with your specified configuration */}
      {/*<div className="pointer-events-none absolute z-[1] h-[169%] w-full lg:w-[100%]">
        <ThemedBackground />
      </div>*/}

      {/* <StickyBanner
        hideOnScroll={true}
        className="bg-gradient-to-b from-blue-500 to-blue-600"
      >
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          Join our growing community on whatsapp{" "}
          <a
            href="https://chat.whatsapp.com/Eta3HH4UbtV3CEAp4eOY0a"
            target="_blank"
            className="transition duration-200 hover:underline-offset-2 underline"
          >
            today!
          </a>
        </p>
      </StickyBanner> */}

      <div className=" font-main z-20 w-full">
        {/*<Navbar />*/}
        <main>
          {/*<HeroSection />*/}
          <HeroSection />
          <LogoCloud />
          <StatsSection />
          <ContentSection />
          <IntegrationsSection />
          <FeaturesSection />
          {/*<TestimonialsSection />*/}
          {/* <ThreeStepFramework ctaLink="/dashboard" showCta={false} /> */}
          {/* <VendorCompanies /> */}
          {/*<FounderTestimonial />*/}
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
