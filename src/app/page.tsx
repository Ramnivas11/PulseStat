import { Navbar } from "@/features/marketing/components/navbar";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { SocialProofSection } from "@/features/marketing/components/social-proof-section";
import { FeaturesSection } from "@/features/marketing/components/features-section";
import { HowItWorksSection } from "@/features/marketing/components/how-it-works-section";
import { DeveloperExperienceSection } from "@/features/marketing/components/developer-experience-section";
import { PricingSection } from "@/features/marketing/components/pricing-section";
import { FaqSection } from "@/features/marketing/components/faq-section";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { Footer } from "@/features/marketing/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SocialProofSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DeveloperExperienceSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
