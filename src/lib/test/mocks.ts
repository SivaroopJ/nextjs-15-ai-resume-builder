// lib/test/mocks.ts
import { ResumeServerData } from "@/lib/types";

export const mockResume: Partial<ResumeServerData> = {
  id: "1",
  title: "Software Engineer Resume",
  description: "Experienced in building scalable applications.",
  createdAt: new Date("2024-03-01"),
  updatedAt: new Date("2024-03-01"),
  educations: [],
  projects: [],
  workExperiences: [],
};

export enum SubscriptionLevel {
  FREE = "free",
  PRO = "pro",
  PREMIUM = "premium",
}
