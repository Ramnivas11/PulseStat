import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-black">
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground uppercase">
              © 2026 PulseStat // all rights reserved.
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              pricing
            </Link>
            <Link
              href="/terms"
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              terms
            </Link>
            <Link
              href="/privacy"
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              privacy
            </Link>
            <Link
              href="/refund-policy"
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              refunds
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}