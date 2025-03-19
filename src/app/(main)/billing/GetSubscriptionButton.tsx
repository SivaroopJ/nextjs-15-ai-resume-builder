"use client";

import { Button } from "@/components/ui/button";
import usePremiumModel from "@/hooks/usePremiumModel";

export default function GetSubscriptionButton() {
  const premiumModel = usePremiumModel();

  return (
    <Button onClick={() => premiumModel.setOpen(true)} variant="premium">
      Get Premium subscription
    </Button>
  );
}