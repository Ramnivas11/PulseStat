import Link from "next/link";
import { Navbar } from "@/features/marketing/components/navbar";
import { Footer } from "@/features/marketing/components/footer";

export const metadata = {
  title: "Privacy Policy - PulseStat",
  description: "Privacy policy for PulseStat analytics platform.",
  keywords: "privacy policy, analytics privacy, data protection",
  openGraph: {
    title: "Privacy Policy - PulseStat",
    description: "Privacy policy for PulseStat analytics platform.",
    url: "https://pulse-stat.ramnivas.in/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4 uppercase text-white">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {"// LAST_UPDATED: MAY_14_2026"}
            </p>
          </div>

          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[01]</span>
                Information We Collect
              </h2>
              <h3 className="text-lg font-bold mb-2">Analytics Data</h3>
              <p className="text-muted-foreground mb-6 font-mono text-sm leading-relaxed">
                When you use PulseStat to track your website, we collect anonymous analytics data including page views, visitor information, and user behavior patterns.
              </p>
              <h3 className="text-lg font-bold mb-2">Account Information</h3>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                We collect your email address, name, and billing information when you create an account or subscribe to our service.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[02]</span>
                How We Use Your Information
              </h2>
              <ul className="list-none pl-0 space-y-3 font-mono text-sm text-muted-foreground">
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> To provide and maintain our analytics service</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> To process payments and manage subscriptions</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> To communicate with you about your account</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> To improve our service and develop new features</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[03]</span>
                Data Sharing
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
              </p>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                We may share anonymized analytics data for research and improvement purposes.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[04]</span>
                Cookies and Tracking
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                Our service uses cookies and similar technologies to track user behavior on websites that implement our analytics code.
              </p>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[05]</span>
                Data Security
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[06]</span>
                Data Retention
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                We retain analytics data for as long as your account is active. Account information is retained for as long as necessary to provide our service and comply with legal obligations.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[07]</span>
                Your Rights
              </h2>
              <p className="text-white mb-4 font-mono text-sm">You have the right to:</p>
              <ul className="list-none pl-0 space-y-3 font-mono text-sm text-muted-foreground">
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Access the personal information we hold about you</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Correct inaccurate information</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Request deletion of your data</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Object to or restrict processing of your data</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Data portability</li>
              </ul>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[08]</span>
                International Data Transfers
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[09]</span>
                Changes to This Policy
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[10]</span>
                Contact Us
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <Link href="mailto:privacy@pulsestat.com" className="text-primary hover:underline underline-offset-4">
                  privacy@pulsestat.com
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