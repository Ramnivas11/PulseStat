import Link from "next/link";

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: May 14, 2026</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-2">Analytics Data</h3>
            <p className="mb-4">
              When you use PulseStat to track your website, we collect anonymous analytics data including page views, visitor information, and user behavior patterns.
            </p>
            <h3 className="text-xl font-medium mb-2">Account Information</h3>
            <p className="mb-4">
              We collect your email address, name, and billing information when you create an account or subscribe to our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and maintain our analytics service</li>
              <li>To process payments and manage subscriptions</li>
              <li>To communicate with you about your account</li>
              <li>To improve our service and develop new features</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
            <p className="mb-4">
              We may share anonymized analytics data for research and improvement purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking</h2>
            <p className="mb-4">
              Our service uses cookies and similar technologies to track user behavior on websites that implement our analytics code.
            </p>
            <p className="mb-4">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="mb-4">
              We retain analytics data for as long as your account is active. Account information is retained for as long as necessary to provide our service and comply with legal obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
            <p className="mb-4">
              Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <Link href="mailto:privacy@pulsestat.com" className="text-primary hover:underline">
                privacy@pulsestat.com
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