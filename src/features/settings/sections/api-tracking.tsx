"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ApiTrackingSection() {
  return (
    <Card className="relative hover:border-primary/50 transition-colors duration-200">
      <CardHeader className="border-b border-border bg-muted/10 pb-4">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase block">{"// api configuration"}</span>
          <span className="font-heading text-base font-semibold tracking-tight text-foreground block">API & Tracking Keys</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h4 className="font-mono text-xs uppercase text-foreground font-bold mb-1">Public API Key</h4>
            <p className="font-mono text-[10px] text-muted-foreground uppercase leading-relaxed">{"// Use this key to authenticate client-side tracking beacons."}</p>
            <div className="mt-3 font-mono text-xs text-primary bg-muted/20 border border-border p-3 select-all">
              pk_live_38d8ac8f97e20b3db9345719e712c9bf
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase text-foreground font-bold mb-1">Ingestion Endpoint</h4>
            <p className="font-mono text-[10px] text-muted-foreground uppercase leading-relaxed">{"// Target URL for forwarding custom telemetry payloads."}</p>
            <div className="mt-3 font-mono text-xs text-foreground bg-muted/20 border border-border p-3">
              https://api.pulsestat.com/v1/telemetry
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
