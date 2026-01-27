import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";
import FeaturesSection from "@/components/landing/features-8";
import StatsSection from "@/components/landing/stats-section";
import ProvidersSection from "@/components/landing/providers";
import FAQsFour from "@/components/landing/faqs-4";
import WallOfLoveSection from "@/components/testimonials";
import LogoCloud from "@/components/logo-cloud";
import HeroSection from "@/components/hero-section";
import ContentSection from "@/components/landing/content-3";
import CallToAction from "@/components/landing/call-to-action";

// currently rethinking the silk thing on the current background. this pr from jordan's pc tries to solve that.
export default function Home() {
  return (
    <div className="min-h-screen  bg-[#FAFAF9] dark:bg-background text-white mx-auto">
      <div className=" font-main z-20 w-full">
        {/*<Navbar />*/}
        <main>
          <HeroSection />
          <LogoCloud />
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
