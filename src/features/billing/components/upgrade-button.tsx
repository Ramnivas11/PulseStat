"use client";

import { ComingSoonDialog } from "./coming-soon-dialog";
import type { PlanKey } from "@/config/plans";

interface UpgradeButtonProps {
  planKey: PlanKey;
  disabled?: boolean;
}

export function UpgradeButton(props: UpgradeButtonProps) {
  return (
    <ComingSoonDialog
      triggerLabel={props.disabled ? "Current Plan" : "Upgrade"}
      disabled={props.disabled}
    />
  );
}