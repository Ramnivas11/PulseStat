import Link from "next/link";
import { Navbar } from "@/features/marketing/components/navbar";
import { Footer } from "@/features/marketing/components/footer";

export const metadata = {
  title: "Refund Policy - PulseStat",
  description: "Refund policy for PulseStat subscriptions.",
  keywords: "refund policy, subscription refunds, billing policy",
  openGraph: {
    title: "Refund Policy - PulseStat",
    description: "Refund policy for PulseStat subscriptions.",
    url: "https://pulse-stat.ramnivas.in/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32, pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4 uppercase text-white">
              Refund Policy
            </h1>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {"// LAST_UPDATED: MAY_14_2026"}
            </p>
          </div>

          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[01]</span>
                Subscription Refunds
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                We offer a 30-day money-back guarantee for new Pro subscriptions. If you&apos;re not satisfied with our service within the first 30 days, you can request a full refund.
              </p>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                Refund requests must be made within 30 days of the initial subscription purchase.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[02]</span>
                How to Request a Refund
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                To request a refund, please contact our support team at{" "}
                <Link href="mailto:support@pulsestat.com" className="text-primary hover:underline underline-offset-4">
                  support@pulsestat.com
                </Link>{" "}
                with your account details and reason for the refund request.
              </p>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                We will process refund requests within 5-7 business days of approval.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[03]</span>
                Refund Processing
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                Approved refunds will be processed back to the original payment method used for the subscription.
              </p>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                Processing times vary by payment provider but typically take 3-5 business days to appear in your account.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[04]</span>
                Subscription Cancellation
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                You can cancel your subscription at any time from your account settings. Cancellations take effect at the end of the current billing period.
              </p>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                No refunds are provided for partial billing periods or unused service time.
              </p>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[05]</span>
                Exceptions
              </h2>
              <p className="text-white mb-4 font-mono text-sm">Refunds are not available for:</p>
              <ul className="list-none pl-0 space-y-3 font-mono text-sm text-muted-foreground">
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Subscriptions older than 30 days</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Renewal payments</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Accounts that violate our Terms of Service</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-1">{"->"}</span> Free plan usage</li>
              </ul>
            </section>

            <section className="mb-12 border-l border-primary/20 pl-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[06]</span>
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                For refund requests or questions about this policy, please contact us at{" "}
                <Link href="mailto:support@pulsestat.com" className="text-primary hover:underline underline-offset-4">
                  support@pulsestat.com
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
