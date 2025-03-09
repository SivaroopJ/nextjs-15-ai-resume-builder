"use client";

import { Button } from "@/components/ui/button";
import  Link from "next/link";

export default function ResumeEditor() {
  return (
    <div className="flex grow flex-col">
      <header className="space-y1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-muted-foreground text-sm">
          Follow the steps below to ceate your own resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full"></div>
      </main>
      <footer className="w-full border-t px-3 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
            <div className="flex items-center gap-3">
                <Button variant="secondary">Previous step</Button>
                <Button>Next step</Button>
            </div>
            <div className="flex items-start gap-3">
                <Button variant="secondary" asChild>
                    <Link href="/resumes">Close</Link>
                </Button>
                <p className="text-muted-foreground opacity-0">Saving...</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
