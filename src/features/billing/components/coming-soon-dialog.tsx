"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ComingSoonDialogProps {
  triggerLabel: string;
  disabled?: boolean;
}

export function ComingSoonDialog({
  triggerLabel,
  disabled = false,
}: ComingSoonDialogProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Enter your email to join the waitlist.");
      return;
    }

    setSubmitted(true);
    toast.success("Thanks! We'll notify you when subscriptions launch.");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Subscriptions Coming Soon</DialogTitle>
          <DialogDescription>
            Pro-level analytics and premium reporting are being prepared for launch.
            Join the waitlist to get early access and product updates.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Realtime dashboards",
              "Advanced event exports",
              "Team collaboration tools",
              "Custom alerts and insights",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-muted px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium">{item}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-muted p-6 bg-muted/60">
            <p className="text-sm text-muted-foreground">
              No payment is required today. We&apos;ll keep the existing free plan intact while we prepare the best Pro experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {submitted ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="text-sm font-semibold">You&apos;re on the waitlist.</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  We&apos;ll email you as soon as the Pro subscription experience is ready.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                <label className="block text-sm font-medium">Notify me when Pro is ready</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-muted bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button type="submit" className="w-full">
                  Join waitlist
                </Button>
              </div>
            )}
          </form>
        </div>

        <DialogFooter className="mt-4" showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
