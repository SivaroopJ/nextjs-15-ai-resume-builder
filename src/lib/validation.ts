// validation.ts
import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB",
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperiences"]
>[number];

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export type EducationValues = z.infer<typeof educationSchema>;

export const projectSchema = z.object({
  projects: z
    .array(
      z.object({
        title: optionalString,
        link: optionalString,
        description: optionalString,
        skills_used: optionalString,
      }),
    )
    .optional(),
});

export type ProjectValues = z.infer<typeof projectSchema>;

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
});

export type SkillsValues = z.infer<typeof skillsSchema>;

export const summarySchema = z.object({
  summary: optionalString,
});

export type SummaryValues = z.infer<typeof summarySchema>;

export const suggestionsSchema = z.object({
  suggestions: optionalString,
});

export type SuggestionsValues = z.infer<typeof suggestionsSchema>;

export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...projectSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  ...suggestionsSchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
});

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
  photo?: File | string | null;
};

export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least 20 characters"),
});

export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>;

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
});

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;

export const generateProjectsSchema = z.object({
  githubUrl: z.string().url().min(1, "GitHub URL is required"),
  role: z.string().min(1, "Role is required"),
});

export type GenerateProjectsInput = z.infer<typeof generateProjectsSchema>;

export type Project = NonNullable<
  z.infer<typeof projectSchema>["projects"]
>[number];

export interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null; // Can be null if no description
  language?: string; // Optional, not always present
  // Add other fields if needed later
}

export const generateSuggestionsSchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...projectSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
});

export type GenerateSuggestionsInput = z.infer<typeof generateSuggestionsSchema>;