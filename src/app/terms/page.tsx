import Link from "next/link";

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: May 14, 2026</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using PulseStat ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              PulseStat is a real-time web analytics platform that provides website traffic analysis, user behavior insights, and performance metrics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">
              You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Subscription and Billing</h2>
            <p className="mb-4">
              Subscription fees are billed in advance on a monthly basis. You agree to pay all charges associated with your account.
            </p>
            <p className="mb-4">
              We reserve the right to change pricing with 30 days notice. Price changes will not affect current billing cycles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the service for any illegal purposes</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the service's operation</li>
              <li>Use the service to track users without consent</li>
              <li>Exceed your plan's usage limits</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Privacy</h2>
            <p className="mb-4">
              We collect and process website analytics data in accordance with our Privacy Policy. You are responsible for complying with applicable data protection laws when using our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="mb-4">
              Either party may terminate this agreement at any time. Upon termination, your access to the service will cease immediately.
            </p>
            <p className="mb-4">
              Refunds are provided according to our refund policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              PulseStat shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <Link href="mailto:legal@pulsestat.com" className="text-primary hover:underline">
                legal@pulsestat.com
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