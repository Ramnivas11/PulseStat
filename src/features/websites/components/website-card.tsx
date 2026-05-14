"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Check, Copy, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WebsiteCardProps {
  id?: string;
  name: string;
  domain: string;
  siteKey: string;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      title={`Copy ${label}`}
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function WebsiteCard({ id, name, domain, siteKey }: WebsiteCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const scriptUrl = `${siteConfig.url}/tracker.js`;
  const snippet = `<script async src="${scriptUrl}" data-site-id="${siteKey}"></script>`;

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/websites/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Website removed");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Could not delete the website");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="flex flex-col glass border-white/20 shadow-xl transition-all hover:shadow-blue-500/10 group">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-bold tracking-tight truncate">
            {name}
          </CardTitle>
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href={`https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
              title="Visit website"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {id && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title="Delete website"
                    aria-label={`Delete ${name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete {name}?</DialogTitle>
                    <DialogDescription>
                      This will permanently remove{" "}
                      <strong>{domain}</strong> and all its analytics data.
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting…
                        </>
                      ) : (
                        "Delete Website"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 pt-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
            Domain
          </p>
          <p className="text-sm font-medium text-primary/80 truncate">{domain}</p>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
            Site Key
          </p>
          <div className="flex items-center gap-1.5">
            <code className="flex-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 px-3 py-2 text-xs font-mono overflow-hidden text-ellipsis whitespace-nowrap">
              {siteKey}
            </code>
            <CopyButton text={siteKey} label="Site Key" />
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
            Tracking Script
          </p>
          <div className="flex items-center gap-1.5">
            <code className="flex-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 px-3 py-2 text-xs font-mono overflow-hidden text-ellipsis whitespace-nowrap">
              {snippet}
            </code>
            <CopyButton text={snippet} label="Script" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
