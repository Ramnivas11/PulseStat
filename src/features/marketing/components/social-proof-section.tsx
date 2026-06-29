"use client";

export function SocialProofSection() {
  return (
    <section className="py-10 border-b border-border bg-transparent">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <p className="font-mono text-[9px]  text-muted-foreground/50 ">
            {"// TRUSTED BY MODERN INFRASTRUCTURE TEAMS"}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full items-center justify-center font-mono text-[11px]   text-muted-foreground/60">
            <div className="flex items-center justify-center border border-border/40 py-2.5 bg-card hover:text-foreground transition-colors">
              <span>[ ACME_CORP ]</span>
            </div>
            <div className="flex items-center justify-center border border-border/40 py-2.5 bg-card hover:text-foreground transition-colors">
              <span>[ GLOBEX_SYS ]</span>
            </div>
            <div className="flex items-center justify-center border border-border/40 py-2.5 bg-card hover:text-foreground transition-colors">
              <span>[ SOYLENT_NET ]</span>
            </div>
            <div className="flex items-center justify-center border border-border/40 py-2.5 bg-card hover:text-foreground transition-colors">
              <span>[ INITECH_DEV ]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
