"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WebsiteCardProps {
  name: string;
  domain: string;
  siteKey: string;
}

export function WebsiteCard({
  name,
  domain,
  siteKey,
}: WebsiteCardProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const snippet = `<script async src="https://pulsestat.ramnivas.in/tracker.js" data-site-id="${siteKey}"></script>`;

  const copyToClipboard = async (text: string, type: "key" | "script") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "key") {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
        toast.success("Site Key copied to clipboard");
      } else {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
        toast.success("Tracking script copied to clipboard");
      }
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Card className="flex flex-col bg-black border-sharp hover:border-primary/50 transition-colors duration-200 rounded-none relative">
      <div className="absolute top-0 left-0 h-full w-[2px] bg-primary/20"></div>
      
      <CardHeader className="border-b border-border bg-muted/5 pb-4">
        <CardTitle className="text-xl font-heading font-black tracking-tight text-white uppercase">{name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 pt-6 pl-6">
        <div>
          <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-2">{"// Domain"}</p>
          <p className="text-xs font-mono text-primary truncate">{domain}</p>
        </div>

        <div className="space-y-2">
          <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground">{"// Site Key"}</p>
          <div className="group relative flex items-center gap-0 border border-border bg-muted/5">
            <code className="flex-1 px-4 py-2.5 text-xs font-mono text-white overflow-hidden text-ellipsis whitespace-nowrap">
              {siteKey}
            </code>
            <button
              onClick={() => copyToClipboard(siteKey, "key")}
              className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border-l border-border h-full"
              title="Copy Site Key"
            >
              {copiedKey ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground">{"// Tracking Script"}</p>
          <div className="group relative flex items-center gap-0 border border-border bg-muted/5">
            <code className="flex-1 px-4 py-2.5 text-[10px] font-mono text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
              {snippet}
            </code>
            <button
              onClick={() => copyToClipboard(snippet, "script")}
              className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border-l border-border h-full"
              title="Copy Script"
            >
              {copiedScript ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
