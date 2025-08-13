import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import FeatureCards from "@/components/feature-cards";

import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";
import { FeaturesBento } from "@/components/landing/wobble-section";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { ThreeStepFramework } from "@/components/landing/three-steps-section";
import { VendorCompanies } from "@/components/landing/vendor-section";
import { FounderTestimonial } from "@/components/landing/founder-testimonial";
import { Spotlight } from "@/components/spotlight";
import FeaturesSection from "@/components/landing/features-section";
import TestimonialsSection from "@/components/landing/testimonials";
import Silk from "@/components/backgrounds/Silk";
import ThemedBackground from "@/components/backgrounds/ThemedBackground";

export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-[#FAFAF9] dark:bg-background text-white mx-auto">
      {/* Silk background with your specified configuration */}
      <div className="pointer-events-none absolute z-[1] h-[169%] w-full lg:w-[100%]">
        <ThemedBackground />
      </div>

      {/* Uncomment the StickyBanner if you want to show it */}
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

      {/* <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      /> */}
      <div className="absolute z-20">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <FeatureCards />
          <FeaturesBento />
          <TestimonialsSection />
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
