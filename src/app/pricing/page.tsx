import { Navbar } from "@/features/marketing/components/navbar";
import { PricingSection } from "@/features/marketing/components/pricing-section";
import { FaqSection } from "@/features/marketing/components/faq-section";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { Footer } from "@/features/marketing/components/footer";

export const metadata = {
  title: "Pricing - PulseStat",
  description: "Choose the perfect plan for your analytics needs. Start free, upgrade as you grow.",
  keywords: "analytics pricing, website analytics plans, real-time analytics subscription",
  openGraph: {
    title: "Pricing - PulseStat",
    description: "Choose the perfect plan for your analytics needs. Start free, upgrade as you grow.",
    url: "https://pulse-stat.ramnivas.in/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - PulseStat",
    description: "Choose the perfect plan for your analytics needs. Start free, upgrade as you grow.",
  },
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <main className="flex-1 pt-24">
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}