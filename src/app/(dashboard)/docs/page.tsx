import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code2, Terminal } from "lucide-react";
import { CopyableSnippet } from "@/components/docs/copyable-snippet";

export const metadata = {
  title: "Documentation | PulseStat",
  description: "Learn how to integrate PulseStat into your application.",
};

export default function DocsPage() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Developer Documentation"
        description="Integrate PulseStat analytics into any framework in minutes."
      />

      <div className="grid gap-8 max-w-4xl">
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Installation Guide</h2>
            <p className="text-muted-foreground">
              PulseStat uses a lightweight (~2KB) script to track pageviews, visitors, and sessions without compromising performance or privacy.
            </p>
          </div>

          <div className="grid gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  HTML / Vanilla JS
                </CardTitle>
                <CardDescription>
                  Add this snippet to the &lt;head&gt; of your HTML document.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CopyableSnippet code={`<!-- PulseStat Analytics -->
<script 
  async 
  src="https://pulsestat.ramnivas.in/tracker.js" 
  data-site-id="YOUR_SITE_ID">
</script>`} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Next.js (App Router)
                </CardTitle>
                <CardDescription>
                  Import the Script component in your root layout.tsx file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CopyableSnippet code={`import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script 
          async 
          src="https://pulsestat.ramnivas.in/tracker.js" 
          data-site-id="YOUR_SITE_ID"
        />
      </body>
    </html>
  );
}`} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WordPress</CardTitle>
                <CardDescription>
                  Add the snippet via functions.php or a plugin like WPCode.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CopyableSnippet code={`function add_pulsestat_analytics() {
    ?>
    <script 
      async 
      src="https://pulsestat.ramnivas.in/tracker.js" 
      data-site-id="YOUR_SITE_ID">
    </script>
    <?php
}
add_action('wp_head', 'add_pulsestat_analytics');`} />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4 pt-8 border-t">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
            <p className="text-muted-foreground leading-relaxed">
              Once installed, the tracker automatically hooks into the browser&apos;s History API to capture client-side navigation (perfect for SPAs like Next.js or React). 
              It collects anonymous data including referring sites, screen resolution, browser type, and country.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Privacy First:</strong> PulseStat does not use cookies and does not collect personally identifiable information (PII). It uses a rotating hash for session tracking to remain GDPR compliant.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
