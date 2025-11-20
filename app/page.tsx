import FeatureCards from "@/features/marketing/components/feature-cards";

import FaqSection from "@/features/marketing/components/faq-section";
import { FeaturesBento } from "@/features/marketing/components/wobble-section";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { VendorCompanies } from "@/features/marketing/components/vendor-section";
import { FounderTestimonial } from "@/features/marketing/components/founder-testimonial";
import FeaturesSection from "@/features/marketing/components/features-section";
import ThemedBackground from "@/components/backgrounds/ThemedBackground";
import HeroSection from "@/features/marketing/components/hero-section";
import Navbar from "@/features/marketing/components/navbar";
import Footer from "@/features/marketing/components/footer";
import WallOfLoveSection from "@/features/marketing/components/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-[#FAFAF9] dark:bg-background text-white mx-auto">
      {/* Silk background with your specified configuration */}
      <div className="pointer-events-none absolute z-[1] h-[169%] w-full lg:w-[100%]">
        <ThemedBackground />
      </div>

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

      <div className="absolute font-main z-20">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <FeatureCards />
          <FeaturesBento />
          <WallOfLoveSection />
          {/* <ThreeStepFramework ctaLink="/dashboard" showCta={false} /> */}
          {/* <VendorCompanies /> */}
          <FounderTestimonial />
          <FaqSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
