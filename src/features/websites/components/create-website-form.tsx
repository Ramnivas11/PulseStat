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
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="h-4 w-4 text-primary" aria-hidden="true" />
          Create Website
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end"
          onSubmit={handleCreateWebsite}
        >
          <div className="space-y-2">
            <Label htmlFor="website-name">Website name</Label>
            <Input
              id="website-name"
              placeholder="Marketing site"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website-domain">Domain</Label>
            <Input
              id="website-domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={isSubmitting}
              autoCapitalize="none"
              autoComplete="url"
              spellCheck={false}
            />
            <p className="text-xs text-muted-foreground">
              Protocols and paths are stripped automatically.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
