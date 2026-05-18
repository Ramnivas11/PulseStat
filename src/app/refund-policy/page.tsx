import Link from "next/link";

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Refund Policy</h1>
          <p className="text-muted-foreground">Last updated: May 14, 2026</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Subscription Refunds</h2>
            <p className="mb-4">
              We offer a 30-day money-back guarantee for new Pro subscriptions. If you&apos;re not satisfied with our service within the first 30 days, you can request a full refund.
            </p>
            <p className="mb-4">
              Refund requests must be made within 30 days of the initial subscription purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How to Request a Refund</h2>
            <p className="mb-4">
              To request a refund, please contact our support team at{" "}
              <Link href="mailto:support@pulsestat.com" className="text-primary hover:underline">
                support@pulsestat.com
              </Link>{" "}
              with your account details and reason for the refund request.
            </p>
            <p className="mb-4">
              We will process refund requests within 5-7 business days of approval.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Refund Processing</h2>
            <p className="mb-4">
              Approved refunds will be processed back to the original payment method used for the subscription.
            </p>
            <p className="mb-4">
              Processing times vary by payment provider but typically take 3-5 business days to appear in your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Subscription Cancellation</h2>
            <p className="mb-4">
              You can cancel your subscription at any time from your account settings. Cancellations take effect at the end of the current billing period.
            </p>
            <p className="mb-4">
              No refunds are provided for partial billing periods or unused service time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Exceptions</h2>
            <p className="mb-4">
              Refunds are not available for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Subscriptions older than 30 days</li>
              <li>Renewal payments</li>
              <li>Accounts that violate our Terms of Service</li>
              <li>Free plan usage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
            <p className="mb-4">
              For refund requests or questions about this policy, please contact us at{" "}
              <Link href="mailto:support@pulsestat.com" className="text-primary hover:underline">
                support@pulsestat.com
              </Link>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 PulseStat. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}