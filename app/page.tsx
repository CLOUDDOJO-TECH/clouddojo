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

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white md:pt-8 pt-4 mx-auto">

      <Navbar />
      <main>
        <HeroSection />
        <PartnersSection />
        <FeatureCards />
        {/* <JourneySection /> */}
        {/* <HowItWorks /> */}
        {/* <Integration /> */}
        {/* <Testimonials /> */}
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}
