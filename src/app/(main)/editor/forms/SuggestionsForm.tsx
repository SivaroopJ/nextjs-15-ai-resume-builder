import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { suggestionsSchema, SuggestionsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import GenerateSuggestionsButton from './GenerateSuggestionsButton';

export default function SuggestionsForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<SuggestionsValues>({
    resolver: zodResolver(suggestionsSchema),
    defaultValues: {
      suggestions: resumeData.suggestions || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      //Update resume data
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">AI Suggestions</h2>
        <p className="text-muted-foreground text-sm">
          Let the AI generate suggestions from your entered data and job Title
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="suggestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">AI Suggestions</FormLabel>
                <FormControl>
                  <Textarea
                    readOnly
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <GenerateSuggestionsButton
                  resumeData={resumeData}
                  onSuggestionsGenerated={suggestions =>
                    form.setValue("suggestions", suggestions)
                  }
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
