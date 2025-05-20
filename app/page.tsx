import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import PartnersSection from "@/components/partners-section"
import FeatureCards from "@/components/feature-cards"
import JourneySection from "@/components/journey-section"
import HowItWorks from "@/components/how-it-works"
import Integration from "@/components/integration"
import Testimonials from "@/components/testimonials"
import FaqSection from "@/components/faq-section"
import Footer from "@/components/footer"
import { FeaturesBento } from "@/components/landing/wobble-section"
import { StickyBanner } from "@/components/ui/sticky-banner"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white mx-auto">
      <StickyBanner hideOnScroll={true} className="bg-gradient-to-b from-blue-500 to-blue-600">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          Join our growing community on whatsapp {" "}
          <a href="https://chat.whatsapp.com/Eta3HH4UbtV3CEAp4eOY0a" target="_blank" className="transition duration-200 hover:underline-offset-2 underline">
           today!
          </a>
        </p>
      </StickyBanner>
      <Navbar />
      <main>
        <HeroSection />
        <FeatureCards />
        <FeaturesBento />
        <PartnersSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}