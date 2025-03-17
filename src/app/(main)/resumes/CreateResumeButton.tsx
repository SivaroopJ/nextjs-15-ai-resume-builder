"use client"; // To be able to use the hook

import usePremiumModel from "@/hooks/usePremiumModel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusSquare } from "lucide-react";

interface CreateResumeButtonProps {
  canCreate: boolean;
}

export default function CreateResumeButton({
  canCreate,
}: CreateResumeButtonProps) {
  const premiumModel = usePremiumModel();

  if (canCreate) {
    return (
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href="/editor">
          <PlusSquare className="test size-5" />
          New resume
        </Link>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => premiumModel.setOpen(true)}
      className="mx-auto flex w-fit gap-2"
    >
      <PlusSquare className="test size-5" />
      New resume
    </Button>
  );
}
