// Involves a lot of experiments to come up with this hook
// Difficult it is to understand the code
import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // Changed a bit, take a look
import { saveResume } from "./actions";
import { fileReplacer } from "@/lib/utils";

export default function useAutoSaveResume(resumeData: ResumeValues) {
  const searchParams = useSearchParams();

  // const {toast} = Toaster();

  const debouncedResumeData = useDebounce(resumeData, 1500);

  const [resumeId, setResumeId] = useState(resumeData.id);

  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData), // structuredClone is a custom function in javascript, not any import
    // It creates a deep clone of the resumeData objectimport { is } from './../../../../.next/static/chunks/main';
  );


  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeData]);

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true);
        setIsError(false);

        // Create a clone in the very beginning and not when te save is in progress
        const newData = structuredClone(debouncedResumeData);

        const updatedResume = await saveResume({
          ...newData,
          // Handle the photo separately
          ...(JSON.stringify(lastSavedData.photo, fileReplacer) == JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          id: resumeId,
        });

        setResumeId(updatedResume.id);
        setLastSavedData(newData);

        if (searchParams.get("resumeId") !== updatedResume.id) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set("resumeId", updatedResume.id);
            window.history.replaceState(
                null, "", `?${newSearchParams.toString()}` // back-quotes
            )
        }

      } catch (error) {
        setIsError(true)
        console.error(error)
        const toastId = toast.error("Could not save changes.", {
          action: {
            label: "Retry",
            onClick: () => {
              toast.dismiss(toastId);
              save();
            }
          }
        })
      } finally {
        setIsSaving(false);
      }
    }

    // Just for debugging
    console.log("debouncedResumeData", JSON.stringify(debouncedResumeData), fileReplacer);
    console.log("lastSavedData", JSON.stringify(lastSavedData), fileReplacer);

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save();
    }
  }, [debouncedResumeData, isSaving, lastSavedData, isError, resumeId, searchParams]);

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  };
}
