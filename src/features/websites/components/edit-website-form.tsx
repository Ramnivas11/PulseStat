"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  domain: z
    .string()
    .min(3, "Domain is required")
    .max(253)
    .transform((v) => v.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim().toLowerCase()),
});

type FormValues = z.infer<typeof schema>;

interface EditWebsiteFormProps {
  id: string;
  initialName: string;
  initialDomain: string;
}

export function EditWebsiteForm({ id, initialName, initialDomain }: EditWebsiteFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: initialName, domain: initialDomain },
  });

  async function onSubmit(data: FormValues) {
    const res = await fetch(`/api/websites/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json();
      toast.error(json.error ?? "Failed to update website");
      return;
    }

    toast.success("Website updated.");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website Name</FormLabel>
              <FormControl><Input placeholder="My Blog" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl><Input placeholder="example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting} size="sm">
            {form.formState.isSubmitting
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
              : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
          </Button>
        </div>
      </form>
    </Form>
  );
}
