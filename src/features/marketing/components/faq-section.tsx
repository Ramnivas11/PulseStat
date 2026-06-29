"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need to show a cookie banner?",
    answer: "No. PulseStat is completely cookie-less and does not collect or store any personal data or persistent identifiers. You are fully compliant with GDPR, CCPA, and PECR out of the box."
  },
  {
    question: "Does it slow down my website?",
    answer: "Not at all. The tracker script is less than 2KB gzipped, loads asynchronously, and sends data using the browser's native sendBeacon API, which guarantees zero impact on your rendering or Core Web Vitals."
  },
  {
    question: "Does it work with React or Single Page Apps?",
    answer: "Yes! Our script automatically hooks into the browser's History API. It detects pushState and popState events, meaning route changes in Next.js, React, Vue, or Angular are tracked automatically without any extra code."
  },
  {
    question: "What happens if I exceed the free plan limits?",
    answer: "We will send you an email warning when you reach 80% and 100% of your usage. If you exceed the 10,000 events limit, tracking will temporarily pause until the next billing cycle unless you upgrade to the Pro plan."
  },
  {
    question: "How does the real-time analytics work?",
    answer: "Pro users get access to the Live Dashboard. We use high-performance Redis to aggregate active sessions within a rolling 5-minute window, giving you a live pulse of who is currently navigating your application."
  }
];

export function FaqSection() {
  return (
    <section className="py-24 md:py-32 bg-transparent border-t border-border">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4  text-white">
            Faq Matrix
          </h2>
          <p className="text-xs font-mono   text-muted-foreground">
            {"// Core technical questions regarding the telemetry tracker."}
          </p>
        </div>

        <div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border py-1">
                <AccordionTrigger className="text-left font-mono text-[11px]   hover:no-underline hover:text-foreground transition-colors py-4">
                  {`[0${index + 1}]`} {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground font-mono  leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
