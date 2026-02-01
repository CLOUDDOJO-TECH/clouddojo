import Footer from "@/components/footer";
import StatsSection from "@/components/landing/stats-section";
import ProvidersSection from "@/components/landing/features";
import FAQsFour from "@/components/landing/faqs-4";
import WallOfLoveSection from "@/components/testimonials";
import HeroSection from "@/components/hero-section";
import ContentSection from "@/components/landing/content-3";
import CallToAction from "@/components/landing/call-to-action";
import Pricing from "@/components/landing/pricing";
import LogoCloud from "@/components/logo-cloud";

// hooks

// currently rethinking the silk thing on the current background. this pr from jordan's pc tries to solve that.
export default function Home() {
  // const theme = useTheme();

  return (
    <div className="dark min-h-screen bg-background text-white mx-auto">
      <div className="font-main z-20 w-full">
        {/*<Navbar />*/}
        <main>
          <HeroSection />
          <LogoCloud />
          <StatsSection />
          <ProvidersSection />
          <ContentSection />

          {/*pricing section*/}
          <Pricing />
          {/*<FeaturesSection />*/}

          <WallOfLoveSection />
          <FAQsFour />
          <CallToAction />
          {/*<FaqSection />*/}
        </main>
        <Footer />
        {/*<Footer />*/}
      </div>
    </div>
  );
}
