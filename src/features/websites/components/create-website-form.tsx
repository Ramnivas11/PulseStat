"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Globe, Loader2, Plus } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  domain: z
    .string()
    .min(3, "Domain is required")
    .max(253)
    .transform((v) => v.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim()),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateWebsiteForm() {
  const router = useRouter();
  const [limitReached, setLimitReached] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", domain: "" },
  });

  async function onSubmit(data: FormValues) {
    try {
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 403 && json.upgrade) {
          setLimitReached(true);
          setLimitMessage(json.error);
          return;
        }
        throw new Error(json.error || "Failed to create website");
      }

      toast.success("Website added successfully!");
      form.reset();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  }

  if (limitReached) {
    return (
      <UpgradePrompt
        title="Website Limit Reached"
        description={
          limitMessage || "You have reached the maximum number of websites for your plan."
        }
      />
    );
  }

  return (
    <Card className="glass border-white/20 shadow-lg">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Globe className="h-5 w-5 text-primary" />
          Add Website
        </CardTitle>
        <CardDescription>
          Enter a name and domain to start tracking analytics.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Website Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Blog" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="shrink-0"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Website
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
