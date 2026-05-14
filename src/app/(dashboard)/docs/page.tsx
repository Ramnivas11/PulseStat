import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getWebsitesByUserId } from "@/features/websites/services/website.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code2, Terminal, Globe } from "lucide-react";
import { CopyableSnippet } from "@/components/docs/copyable-snippet";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Documentation",
  description: "Learn how to integrate PulseStat into your application.",
};

export default async function DocsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const websites = await getWebsitesByUserId(session.user.id);
  const firstSite = websites[0];
  const siteId = firstSite?.siteKey ?? "YOUR_SITE_ID";
  const trackerUrl = `${siteConfig.url}/tracker.js`;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Developer Documentation"
        description="Integrate PulseStat analytics into any framework in minutes."
      />

      {firstSite && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
          <p className="text-sm font-medium text-primary">
            Your site key is pre-filled below:{" "}
            <code className="font-mono text-xs bg-primary/10 px-1.5 py-0.5 rounded">
              {siteId}
            </code>
          </p>
        </div>
      )}

      <div className="grid gap-8 max-w-4xl">
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Installation Guide</h2>
            <p className="text-muted-foreground">
              PulseStat uses a lightweight (~2KB) script to track pageviews, visitors, and
              sessions without compromising performance or privacy.
            </p>
          </div>

          <div className="grid gap-6 mt-6">
            <Card className="glass border-white/20 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  HTML / Vanilla JS
                </CardTitle>
                <CardDescription>
                  Add this snippet to the &lt;head&gt; of your HTML document.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <CopyableSnippet
                  code={`<!-- PulseStat Analytics -->\n<script \n  async \n  src="${trackerUrl}" \n  data-site-id="${siteId}">\n</script>`}
                />
              </CardContent>
            </Card>

            <Card className="glass border-white/20 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  Next.js (App Router)
                </CardTitle>
                <CardDescription>
                  Import the Script component in your root layout.tsx file.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <CopyableSnippet
                  code={`import Script from "next/script";\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en">\n      <body>\n        {children}\n        <Script \n          async \n          src="${trackerUrl}" \n          data-site-id="${siteId}"\n        />\n      </body>\n    </html>\n  );\n}`}
                />
              </CardContent>
            </Card>

            <Card className="glass border-white/20 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  WordPress
                </CardTitle>
                <CardDescription>
                  Add the snippet via functions.php or a plugin like WPCode.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <CopyableSnippet
                  code={`function add_pulsestat_analytics() {\n    ?>\n    <script \n      async \n      src="${trackerUrl}" \n      data-site-id="${siteId}">\n    </script>\n    <?php\n}\nadd_action('wp_head', 'add_pulsestat_analytics');`}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4 pt-8 border-t">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
            <p className="text-muted-foreground leading-relaxed">
              Once installed, the tracker automatically hooks into the browser&apos;s
              History API to capture client-side navigation (perfect for SPAs like Next.js
              or React). It collects anonymous data including referring sites, screen
              resolution, browser type, and country.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Privacy First:</strong> PulseStat does not use cookies and does not
              collect personally identifiable information (PII). It uses a rotating hash
              for session tracking to remain GDPR compliant.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
