import React from "react";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import { EditorFormProps } from "@/lib/types";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";
import ProjectForm from "./forms/ProjectForm";
import SuggestionsForm from "./forms/SuggestionsForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "General info", component: GeneralInfoForm, key: "general-info" },
  { title: "Personal info", component: PersonalInfoForm, key: "personal-info"},
  { title: "Work experience", component: WorkExperienceForm, key: "work-experience" },
  { title: "Education", component: EducationForm, key: "education" },
  { title: "Project", component: ProjectForm, key: "project" },
  { title: "Skills", component: SkillsForm, key: "skills" },
  { title: "Summary", component: SummaryForm, key: "summary" },
  { title: "AI Suggestions", component: SuggestionsForm, key: "ai-suggestions" },
];
