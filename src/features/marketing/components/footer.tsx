import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-b border-border/40 bg-background py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-8 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2 flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="border border-foreground p-1.5 rounded-[var(--radius-marketing)] text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                <Activity className="h-4 w-4" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-foreground">PulseStat</span>
            </Link>
            <p className="text-muted-foreground text-xs font-mono max-w-xs leading-relaxed ">
              {"// Simple, privacy-friendly, and lightweight analytics for modern product teams."}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-mono text-xs  text-foreground  mb-4">{"// product"}</h4>
            <ul className="space-y-3 font-mono text-[11px] text-muted-foreground ">
              <li><Link href="#features" className="hover:text-foreground transition-colors">features</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground transition-colors">pricing</Link></li>
              <li><Link href="/docs" className="hover:text-foreground transition-colors">documentation</Link></li>
              <li><Link href="/changelog" className="hover:text-foreground transition-colors">changelog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-mono text-xs  text-foreground  mb-4">{"// legal"}</h4>
            <ul className="space-y-3 font-mono text-[11px] text-muted-foreground ">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">privacy policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">terms of service</Link></li>
              <li><Link href="/dpa" className="hover:text-foreground transition-colors">data processing</Link></li>
            </ul>
          </div>

          {/* Compare */}
          <div>
            <h4 className="font-mono text-xs  text-foreground  mb-4">{"// compare"}</h4>
            <ul className="space-y-3 font-mono text-[11px] text-muted-foreground ">
              <li><Link href="/compare/google-analytics" className="hover:text-foreground transition-colors">vs google analytics</Link></li>
              <li><Link href="/compare/plausible" className="hover:text-foreground transition-colors">vs plausible</Link></li>
              <li><Link href="/compare/fathom" className="hover:text-foreground transition-colors">vs fathom</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px]  text-muted-foreground">
            &copy; {new Date().getFullYear()} PulseStat Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-mono text-[10px]  text-muted-foreground">
            <span className="flex h-2 w-2 rounded-[var(--radius-marketing)] bg-foreground"></span>
            SYS.ALL_SYSTEMS_OPERATIONAL
          </div>
        </div>
      </div>
    </footer>
  );
}
