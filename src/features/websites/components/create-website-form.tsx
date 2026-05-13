"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";

export function CreateWebsiteForm() {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  async function handleCreateWebsite() {
    if (!name || !domain) {
      toast.error("Please provide both name and domain");
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
          name,
          domain,
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
    <div className="rounded-lg border p-4 space-y-4">
      <h2 className="text-xl font-semibold">
        Create Website
      </h2>

      <input
        className="w-full rounded-md border p-2"
        placeholder="Website Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        disabled={isSubmitting}
      />

      <input
        className="w-full rounded-md border p-2"
        placeholder="example.com"
        value={domain}
        onChange={(e) =>
          setDomain(e.target.value)
        }
        disabled={isSubmitting}
      />

      <button
        onClick={handleCreateWebsite}
        disabled={isSubmitting}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create"}
      </button>
    </div>
  );
}