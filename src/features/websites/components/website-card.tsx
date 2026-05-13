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
    } catch (_err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Card className="flex flex-col glass border-white/20 shadow-xl transition-all hover:shadow-blue-500/10">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-xl font-black tracking-tight">{name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 pt-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Domain</p>
          <p className="text-sm font-semibold text-primary/80 truncate">{domain}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Site Key</p>
          <div className="group relative flex items-center gap-2">
            <code className="flex-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 px-4 py-2.5 text-xs font-mono overflow-hidden text-ellipsis whitespace-nowrap">
              {siteKey}
            </code>
            <button
              onClick={() => copyToClipboard(siteKey, "key")}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
              title="Copy Site Key"
            >
              {copiedKey ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Tracking Script</p>
          <div className="group relative flex items-center gap-2">
            <code className="flex-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 px-4 py-2.5 text-xs font-mono overflow-hidden text-ellipsis whitespace-nowrap">
              {snippet}
            </code>
            <button
              onClick={() => copyToClipboard(snippet, "script")}
              className="p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 rounded-xl transition-all"
              title="Copy Script"
            >
              {copiedScript ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}