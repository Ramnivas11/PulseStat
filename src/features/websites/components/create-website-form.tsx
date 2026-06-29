"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";

export function CreateWebsiteForm() {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  async function handleCreateWebsite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDomain = domain.trim();

    if (!trimmedName || !trimmedDomain) {
      toast.error("Please provide both a website name and domain");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/websites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          domain: trimmedDomain,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.upgrade) {
          setLimitReached(true);
          setLimitMessage(data.error);
          return;
        }
        
        throw new Error(data.error || "Failed to create website");
      }

      toast.success("Website created successfully!");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (limitReached) {
    return (
      <UpgradePrompt 
        title="Website Limit Reached" 
        description={limitMessage || "You have reached the maximum number of websites for your current plan."} 
      />
    );
  }

  return (
    <Card className="rounded-none border border-dashed border-border bg-black hover:border-primary/50 transition-colors">
      <CardHeader className="border-b border-border bg-muted/5 pb-4">
        <CardTitle className="flex items-center gap-2 text-sm font-heading font-black uppercase tracking-wider text-white">
          <Plus className="h-4 w-4 text-primary" aria-hidden="true" />
          Create Website
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form
          className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-start"
          onSubmit={handleCreateWebsite}
        >
          <div className="space-y-2">
            <Label htmlFor="website-name" className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Website name</Label>
            <Input
              id="website-name"
              placeholder="Marketing site"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              autoComplete="off"
              className="h-12 rounded-none border-border bg-transparent focus-visible:ring-1 focus-visible:ring-primary font-mono text-xs text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website-domain" className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Domain</Label>
            <Input
              id="website-domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={isSubmitting}
              autoCapitalize="none"
              autoComplete="url"
              spellCheck={false}
              className="h-12 rounded-none border-border bg-transparent focus-visible:ring-1 focus-visible:ring-primary font-mono text-xs text-white"
            />
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-2">
              {"// Protocols and paths are stripped automatically"}
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto h-12 rounded-none font-mono text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground md:mt-[26px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                CREATING
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                CREATE
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
