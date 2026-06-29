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
          className="w-full rounded-none font-mono text-xs uppercase tracking-wider group bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl rounded-none border border-border bg-black p-0 overflow-hidden">
        <div className="h-1 w-full bg-primary"></div>
        <div className="p-8">
          <DialogHeader className="mb-6 border-b border-border pb-6">
            <DialogTitle className="font-heading font-black text-2xl uppercase tracking-tight text-white">Subscriptions Coming Soon</DialogTitle>
            <DialogDescription className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-2 leading-relaxed">
              {"// Pro-level analytics and premium reporting are being prepared for launch. Join the waitlist to get early access and product updates."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Realtime dashboards",
                "Advanced event exports",
                "Team collaboration tools",
                "Custom alerts and insights",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-none border border-border px-4 py-3 bg-muted/5 flex items-start gap-3"
                >
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="rounded-none border border-border p-4 bg-muted/5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground leading-relaxed">
                {"// No payment is required today. We'll keep the existing free plan intact while we prepare the best Pro experience."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-border">
              {submitted ? (
                <div className="rounded-none border border-primary/30 bg-primary/10 p-4">
                  <div className="flex items-center gap-3 text-primary mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <p className="text-xs font-mono uppercase font-bold tracking-wider">You're on the waitlist.</p>
                  </div>
                  <p className="text-[10px] font-mono text-primary/80 uppercase tracking-wider">
                    We'll email you as soon as the Pro subscription experience is ready.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">{"// Notify me when Pro is ready"}</label>
                  <div className="flex gap-2">
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      className="flex-1 rounded-none border border-border bg-transparent px-4 py-3 font-mono text-xs text-white outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <Button type="submit" className="rounded-none font-mono text-xs uppercase px-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Join
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          <DialogFooter className="mt-6 pt-6 border-t border-border" showCloseButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
