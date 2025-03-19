import LoadingButton  from "@/components/LoadingButton";
import { ResumeValues } from "@/lib/validation"
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react"
import { toast } from "sonner"
import { generateSummary } from "./actions";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModel from "@/hooks/usePremiumModel";
import { canUseAITools } from "@/lib/permissions";

interface GenerateSummaryButtonProps {
    resumeData: ResumeValues;
    onSummaryGenerated: (summary: string) => void;
}

export default function GenerateSummaryButton({
    resumeData,
    onSummaryGenerated,
}: GenerateSummaryButtonProps) {
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
            const aiResponse = await generateSummary(resumeData);
            onSummaryGenerated(aiResponse);
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