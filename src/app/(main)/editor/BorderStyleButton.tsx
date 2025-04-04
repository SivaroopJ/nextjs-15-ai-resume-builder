import { Button } from "@/components/ui/button";
import { Circle, Square, Squircle } from "lucide-react";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import usePremiumModel from "@/hooks/usePremiumModel";
import { canUseCustomizations } from "@/lib/permissions";

export const BorderStyles = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "squircle",
};

const borderStyles = Object.values(BorderStyles);

interface BorderStyleButtonProps {
  borderStyle: string | undefined;
  onChange: (borderStyle: string) => void;
}

export default function BorderStyleButton({
  borderStyle,
  onChange,
}: BorderStyleButtonProps) {

  const subscriptionLevel = useSubscriptionLevel();
  
  const premiumModel = usePremiumModel();

  function handleClick() {
    if (!canUseCustomizations(subscriptionLevel)) {
      premiumModel.setOpen(true);
      return;
    }

    const currentIndex = borderStyle ? borderStyles.indexOf(borderStyle) : 0;
    const nextIndex = (currentIndex + 1) % borderStyles.length;
    onChange(borderStyles[nextIndex]);
  }

  const Icon =
  borderStyle === "square"
    ? (props: React.ComponentProps<"svg">) => <Square data-testid="border-icon" {...props} />
    : borderStyle === "circle"
      ? (props: React.ComponentProps<"svg">) => <Circle data-testid="border-icon" {...props} />
      : (props: React.ComponentProps<"svg">) => <Squircle data-testid="border-icon" {...props} />;


  return (
    <Button
      variant="outline"
      size="icon"
      title="Change border style"
      onClick={handleClick}
    >
       <Icon className="size-5" />
    </Button>
  );
}