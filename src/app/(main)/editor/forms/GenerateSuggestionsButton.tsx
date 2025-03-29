import LoadingButton  from "@/components/LoadingButton";
import { ResumeValues } from "@/lib/validation"
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react"
import { toast } from "sonner"
import { generateSuggestions } from "./actions";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModel from "@/hooks/usePremiumModel";
import { canUseAITools } from "@/lib/permissions";

interface GenerateSuggestionsButtonProps {
    resumeData: ResumeValues;
    onSuggestionsGenerated: (suggestions: string) => void;
}

export default function GenerateSuggestionsButton({
    resumeData,
    onSuggestionsGenerated,
}: GenerateSuggestionsButtonProps) {
    const subscriptionLevel = useSubscriptionLevel();
      
    const premiumModel = usePremiumModel(); 

    const [loading, setLoading] = useState(false)

    async function handleClick() {
        if(!canUseAITools(subscriptionLevel)){
            premiumModel.setOpen(true);
            return;
        }
        try {
            setLoading(true)
            const aiResponse = await generateSuggestions(resumeData);
            onSuggestionsGenerated(aiResponse);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false)
        }
    }

    return <LoadingButton
    variant="outline"
    onClick={handleClick}
    loading={loading}
    >
        <WandSparklesIcon className="size-4" />
        Generate (AI)
    </LoadingButton>
}