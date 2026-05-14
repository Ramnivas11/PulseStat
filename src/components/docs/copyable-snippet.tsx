"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyableSnippetProps {
  code: string;
}

export function CopyableSnippet({ code }: CopyableSnippetProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Snippet copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="relative rounded-md bg-muted p-4 font-mono text-sm overflow-x-auto group">
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground hover:bg-muted-foreground/20 rounded-md"
        title="Copy snippet"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre>
        <code className="text-muted-foreground">{code}</code>
      </pre>
    </div>
  );
}
