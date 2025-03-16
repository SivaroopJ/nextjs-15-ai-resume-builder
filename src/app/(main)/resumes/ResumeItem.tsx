"use client";

import { ResumeServerData } from "@/lib/types";
import  Link  from "next/link";
import { formatDate } from "date-fns";
import ResumePreview from "@/components/ResumePreview";
import { mapToResumeValues } from "@/lib/utils";

interface ResumeItemProps {
  resume: ResumeServerData;
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const wasUpdated = resume.updatedAt !== resume.createdAt;

  return (
    <div className="group rounded-lg border border-muted bg-secondary p-3 transition-colors hover:border-primary">
      <div className="space-y-3">
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          <p className="line-clamp-1 font-semibold">
            {resume.title || "No title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}
          </p>
        </Link>
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="relative inline-block w-full"
        >
          <ResumePreview
            resumeData={mapToResumeValues(resume)}
            className="overflow-hidden group-hover:shadow-lg shadow-sm transition-shadow"
          />
          <div 
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
          >
            
          </div>
        </Link>
      </div>
    </div>
  );
}
