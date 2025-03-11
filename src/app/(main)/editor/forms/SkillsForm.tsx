import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { SkillsValues } from "@/lib/validation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SkillsForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<SkillsValues>({
    defaultValues: {
      skills: resumeData.skills || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      //Update resume data
      setResumeData({
        ...resumeData,
        skills: values.skills?.filter((skill) => skill !== undefined).map(skill => skill.trim()).filter((skill) => skill !== "") || [], // Check for each skill that it is not undefined
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
        <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-semibold">Skills</h2>
            <p className="text-muted-foreground text-sm">What are you good at?</p>
        </div>
        <Form {...form}>
            <form className="space-y-3">
                <FormField
                control = {form.control}
                name = "skills"
                render = {({field}) => (
                    <FormItem>
                        <FormLabel className="sr-only">Skills</FormLabel>
                        <FormControl>
                            <Textarea {...field}
                            placeholder = "e.g. C, C++, Python, React, Node.js, ..."
                            onChange = {(e) => {
                                const skills = e.target.value.split(",");
                                field.onChange(skills);
                            }}
                            />
                        </FormControl>
                        <FormDescription>
                            Separate each skill with a comma
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
            </form>
        </Form>
    </div>
  )
}
