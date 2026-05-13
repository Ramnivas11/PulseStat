"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { PlanKey } from "@/config/plans";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface UpgradeButtonProps {
  planKey: PlanKey;
  disabled?: boolean;
}

export function UpgradeButton({
  planKey,
  disabled = false,
}: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpgrade() {
    if (disabled) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    if (!window.Razorpay) {
      toast.error(
        "Razorpay checkout is not loaded. Refresh the page and try again."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/billing/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ planKey }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to create checkout order.");
      }

      const { order, key } = data;

      if (!order || !key) {
        throw new Error("Invalid checkout response.");
      }

      const checkout = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "PulseStat",
        description: "PulseStat Pro Upgrade",
        order_id: order.id,
        handler: async (payload: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyResponse = await fetch(
              "/api/billing/confirm",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_payment_id:
                    payload.razorpay_payment_id,
                  razorpay_order_id:
                    payload.razorpay_order_id,
                  razorpay_signature:
                    payload.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData?.error ||
                  "Unable to confirm payment."
              );
            }

            toast.success(
              "Payment confirmed. Your Pro subscription is active."
            );
            window.location.reload();
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Payment verification failed."
            );
          }
        },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      });

      checkout.open();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to start upgrade flow."
      );
      setIsLoading(false);
    }
  }

  return (
    <button
      disabled={disabled || isLoading}
      onClick={handleUpgrade}
      className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {isLoading ? "Processing…" : disabled ? "Current plan" : "Upgrade"}
    </button>
  );
}
