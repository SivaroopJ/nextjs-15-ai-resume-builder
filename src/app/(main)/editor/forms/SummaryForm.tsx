import { Form, FormField, FormItem, FormMessage, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { summarySchema, SummaryValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SummaryForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary || "",
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
                <h2 className="font-semibold text-2xl">Professional Summary</h2>
                <p className="text-sm text-muted-foreground">
                    Write a short introduction about yourself or let the AI generate one from your entered data
                </p>
            </div>
        <Form {...form}>
            <form className = "space-y-3">
                <FormField
                control = {form.control}
                name = "summary"
                render = {({field}) => (
                    <FormItem>
                        <FormLabel className="sr-only">Professional Summary</FormLabel>
                        <FormControl>
                            <Textarea {...field}
                            placeholder="A brief, engaging text about you"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
            </form>
        </Form>
        </div>
    );
}
