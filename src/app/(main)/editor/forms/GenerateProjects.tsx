// GenerateProjects.tsx
import LoadingButton from "@/components/LoadingButton";
import {
  GenerateProjectsInput,
  generateProjectsSchema,
  Project,
} from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateProjects } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModel from "@/hooks/usePremiumModel";
import { canUseAITools } from "@/lib/permissions";

interface GenerateProjectsButtonProps {
  onProjectsGenerated: (projects: Project[]) => void;
}

export default function GenerateProjects({
  onProjectsGenerated,
}: GenerateProjectsButtonProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModel = usePremiumModel();
  const [showInputDialog, setShowInputDialog] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        type="button"
        onClick={() => {
          if (!canUseAITools(subscriptionLevel)) {
            premiumModel.setOpen(true);
            return;
          }
          setShowInputDialog(true);
        }}
        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
      >
        <WandSparklesIcon className="size-4" />
        Generate Projects (AI)
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onProjectsGenerated={(projects) => {
          console.log("Generated projects in GenerateProjects:", projects);
          onProjectsGenerated(projects);
          setShowInputDialog(false);
        }}
      />
    </>
  );
}

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectsGenerated: (projects: Project[]) => void;
}

function InputDialog({
  open,
  onOpenChange,
  onProjectsGenerated,
}: InputDialogProps) {
  const form = useForm<GenerateProjectsInput>({
    resolver: zodResolver(generateProjectsSchema),
    defaultValues: {
      githubUrl: "",
      role: "",
    },
  });

  async function onSubmit(input: GenerateProjectsInput) {
    try {
      const projects = await generateProjects(input);
      if (projects.length === 0) {
        toast.warning("No relevant projects found for this role.");
      } else {
        toast.success(`Generated ${projects.length} project(s) successfully!`);
      }
      onProjectsGenerated(projects);
    } catch (error) {
      console.error("Error generating projects:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate projects. Please try again."
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Projects</DialogTitle>
          <DialogDescription>
            Provide your GitHub URL and role to generate optimized project
            entries using AI.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., https://github.com/username"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Frontend Developer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              Generate
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}