import Link from "next/link";
import { Navbar } from "@/features/marketing/components/navbar";
import { Footer } from "@/features/marketing/components/footer";

export const metadata = {
  title: "Terms of Service - PulseStat",
  description: "Terms of service and usage agreement for PulseStat analytics platform.",
  keywords: "terms of service, analytics terms, SaaS terms",
  openGraph: {
    title: "Terms of Service - PulseStat",
    description: "Terms of service and usage agreement for PulseStat analytics platform.",
    url: "https://pulse-stat.ramnivas.in/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4 uppercase text-white">
              Terms of Service
            </h1>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {"// LAST_UPDATED: MAY_14_2026"}
            </p>
          </div>

          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[01]</span>
                Acceptance of Terms
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                By accessing and using PulseStat (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[02]</span>
                Description of Service
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                PulseStat is a real-time web analytics platform that provides website traffic analysis, user behavior insights, and performance metrics.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[03]</span>
                User Accounts
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[04]</span>
                Subscription and Billing
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                Subscription fees are billed in advance on a monthly basis. You agree to pay all charges associated with your account.
              </p>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                We reserve the right to change pricing with 30 days notice. Price changes will not affect current billing cycles.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[05]</span>
                Acceptable Use
              </h2>
              <p className="text-white mb-4 font-mono text-sm">You agree not to:</p>
              <ul className="list-none pl-0 space-y-3 font-mono text-sm text-muted-foreground">
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Use the service for any illegal purposes</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Attempt to gain unauthorized access to our systems</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Interfere with the service&apos;s operation</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Use the service to track users without consent</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Exceed your plan&apos;s usage limits</li>
              </ul>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[06]</span>
                Data Privacy
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                We collect and process website analytics data in accordance with our Privacy Policy. You are responsible for complying with applicable data protection laws when using our service.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[07]</span>
                Termination
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                Either party may terminate this agreement at any time. Upon termination, your access to the service will cease immediately.
              </p>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                Refunds are provided according to our refund policy.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[08]</span>
                Limitation of Liability
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                PulseStat shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[09]</span>
                Changes to Terms
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[10]</span>
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <Link href="mailto:legal@pulsestat.com" className="text-primary hover:underline underline-offset-4">
                  legal@pulsestat.com
                </Link>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
