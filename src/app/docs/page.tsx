import { Navbar } from "@/features/marketing/components/navbar";
import { Footer } from "@/features/marketing/components/footer";
import Link from "next/link";
import { ArrowRight, Code, Terminal, BookOpen, Zap } from "lucide-react";

export const metadata = {
  title: "Documentation - PulseStat",
  description: "Learn how to integrate and use PulseStat for your web analytics.",
};

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-32">
                <div className="mb-8">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-white mb-4">{"// Getting Started"}</h3>
                  <ul className="space-y-3 font-mono text-[11px] uppercase">
                    <li><Link href="#introduction" className="text-primary hover:text-white transition-colors">Introduction</Link></li>
                    <li><Link href="#quickstart" className="text-muted-foreground hover:text-white transition-colors">Quickstart</Link></li>
                    <li><Link href="#installation" className="text-muted-foreground hover:text-white transition-colors">Installation</Link></li>
                  </ul>
                </div>
                <div className="mb-8">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-white mb-4">{"// Core Concepts"}</h3>
                  <ul className="space-y-3 font-mono text-[11px] uppercase">
                    <li><Link href="#tracking" className="text-muted-foreground hover:text-white transition-colors">Tracking</Link></li>
                    <li><Link href="#events" className="text-muted-foreground hover:text-white transition-colors">Custom Events</Link></li>
                    <li><Link href="#identifying" className="text-muted-foreground hover:text-white transition-colors">Identifying Users</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-white mb-4">{"// Integrations"}</h3>
                  <ul className="space-y-3 font-mono text-[11px] uppercase">
                    <li><Link href="#nextjs" className="text-muted-foreground hover:text-white transition-colors">Next.js</Link></li>
                    <li><Link href="#react" className="text-muted-foreground hover:text-white transition-colors">React</Link></li>
                    <li><Link href="#html" className="text-muted-foreground hover:text-white transition-colors">Vanilla HTML</Link></li>
                  </ul>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 max-w-3xl">
              <div className="mb-16">
                <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4 uppercase text-white">
                  Documentation
                </h1>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                  Everything you need to know about integrating PulseStat into your application.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                <div className="border border-border bg-muted/5 p-6 hover:border-primary/50 transition-colors group cursor-pointer">
                  <Terminal className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-heading font-bold text-lg text-white mb-2 uppercase">Quickstart</h3>
                  <p className="text-muted-foreground font-mono text-xs mb-4">Get up and running in less than 5 minutes.</p>
                  <span className="font-mono text-[10px] text-primary uppercase flex items-center gap-1 group-hover:gap-2 transition-all">Read Guide <ArrowRight className="h-3 w-3" /></span>
                </div>
                <div className="border border-border bg-muted/5 p-6 hover:border-primary/50 transition-colors group cursor-pointer">
                  <Code className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-heading font-bold text-lg text-white mb-2 uppercase">API Reference</h3>
                  <p className="text-muted-foreground font-mono text-xs mb-4">Detailed documentation of all PulseStat methods.</p>
                  <span className="font-mono text-[10px] text-primary uppercase flex items-center gap-1 group-hover:gap-2 transition-all">View API <ArrowRight className="h-3 w-3" /></span>
                </div>
                <div className="border border-border bg-muted/5 p-6 hover:border-primary/50 transition-colors group cursor-pointer">
                  <BookOpen className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-heading font-bold text-lg text-white mb-2 uppercase">Frameworks</h3>
                  <p className="text-muted-foreground font-mono text-xs mb-4">Specific guides for Next.js, React, Vue, and more.</p>
                  <span className="font-mono text-[10px] text-primary uppercase flex items-center gap-1 group-hover:gap-2 transition-all">Browse Guides <ArrowRight className="h-3 w-3" /></span>
                </div>
                <div className="border border-border bg-muted/5 p-6 hover:border-primary/50 transition-colors group cursor-pointer">
                  <Zap className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-heading font-bold text-lg text-white mb-2 uppercase">Custom Events</h3>
                  <p className="text-muted-foreground font-mono text-xs mb-4">Learn how to track custom user interactions.</p>
                  <span className="font-mono text-[10px] text-primary uppercase flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <ArrowRight className="h-3 w-3" /></span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-pre:bg-muted/10 prose-pre:border prose-pre:border-border prose-pre:rounded-none">
                <h2 id="introduction" className="text-2xl font-black mb-6 flex items-center gap-4 border-b border-border pb-4">
                  <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[01]</span>
                  Introduction
                </h2>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-6">
                  PulseStat is a lightweight, privacy-focused analytics platform. Our script is less than 1KB gzipped and doesn&apos;t use cookies, making it fully compliant with GDPR, CCPA, and PECR without needing a consent banner.
                </p>

                <h2 id="quickstart" className="text-2xl font-black mb-6 flex items-center gap-4 border-b border-border pb-4 mt-16">
                  <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[02]</span>
                  Quickstart
                </h2>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-4">
                  The easiest way to get started is by adding our snippet to the <code>&lt;head&gt;</code> of your website.
                </p>
                <div className="relative group mb-8">
                  <pre className="p-4 text-xs font-mono overflow-x-auto"><code className="text-gray-300">&lt;script defer data-website-id="your-website-id" src="https://pulse-stat.ramnivas.in/script.js"&gt;&lt;/script&gt;</code></pre>
                  <button className="absolute top-2 right-2 p-1.5 bg-muted/20 hover:bg-primary/20 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30 transition-colors font-mono text-[10px] uppercase">
                    Copy
                  </button>
                </div>

                <h2 id="nextjs" className="text-2xl font-black mb-6 flex items-center gap-4 border-b border-border pb-4 mt-16">
                  <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1">[03]</span>
                  Next.js App Router
                </h2>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-4">
                  If you are using Next.js App Router, you can create a dedicated component to load the script.
                </p>
                <div className="relative group mb-8">
                  <pre className="p-4 text-xs font-mono overflow-x-auto"><code className="text-gray-300">{`import Script from 'next/script';

export function Analytics() {
  return (
    <Script
      defer
      data-website-id="your-website-id"
      src="https://pulse-stat.ramnivas.in/script.js"
    />
  );
}`}</code></pre>
                </div>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-4">
                  Then include it in your <code>app/layout.tsx</code> file:
                </p>
                <div className="relative group mb-8">
                  <pre className="p-4 text-xs font-mono overflow-x-auto"><code className="text-gray-300">{`import { Analytics } from '@/components/Analytics';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
