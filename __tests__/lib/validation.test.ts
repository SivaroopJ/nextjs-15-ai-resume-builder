import {
    generalInfoSchema,
    personalInfoSchema,
    workExperienceSchema,
    educationSchema,
    projectSchema,
    skillsSchema,
    summarySchema,
    suggestionsSchema,
  } from "@/lib/validation";
  
  // Create a mock File for testing in Node
  function createMockFile({
    name = "photo.png",
    type = "image/png",
    size = 1024,
  }: {
    name?: string;
    type?: string;
    size?: number;
  } = {}): File {
    const file = new File(["dummy content"], name, {
      type,
      lastModified: Date.now(),
    });
  
    // Override size since File constructor doesn't let us set it directly
    Object.defineProperty(file, "size", {
      value: size,
      writable: false,
    });
  
    return file;
  }
  
  describe("Validation Schemas", () => {
    test("valid general info", () => {
      const result = generalInfoSchema.safeParse({
        title: "My Resume",
        description: "Software Developer Resume",
      });
      expect(result.success).toBe(true);
    });
  
    test("valid personal info with image file", () => {
      const file = createMockFile({ size: 1024 * 1024 }); // 1MB
      const result = personalInfoSchema.safeParse({
        photo: file,
        firstName: "John",
        lastName: "Doe",
        jobTitle: "Frontend Developer",
        city: "New York",
        country: "USA",
        phone: "1234567890",
        email: "john@example.com",
      });
      expect(result.success).toBe(true);
    });
  
    test("invalid personal info with large file", () => {
      const file = createMockFile({ size: 1024 * 1024 * 5 }); // 5MB
      const result = personalInfoSchema.safeParse({
        photo: file,
        firstName: "John",
      });
      expect(result.success).toBe(false);
      expect(result.error?.format().photo?._errors[0]).toContain("less than 4MB");
    });
  
    test("invalid personal info with non-image file", () => {
      const file = createMockFile({ name: "resume.pdf", type: "application/pdf" });
      const result = personalInfoSchema.safeParse({
        photo: file,
        firstName: "Jane",
      });
      expect(result.success).toBe(false);
      expect(result.error?.format().photo?._errors[0]).toContain("Must be an image file");
    });
  
    test("valid work experience", () => {
      const result = workExperienceSchema.safeParse({
        workExperiences: [
          {
            position: "Engineer",
            company: "Tech Inc.",
            startDate: "2022-01-01",
            endDate: "2023-01-01",
            description: "Worked on cool stuff.",
          },
        ],
      });
      expect(result.success).toBe(true);
    });
  
    test("valid education", () => {
      const result = educationSchema.safeParse({
        educations: [
          {
            degree: "BSc",
            school: "University",
            startDate: "2018-01-01",
            endDate: "2022-01-01",
          },
        ],
      });
      expect(result.success).toBe(true);
    });
  
    test("valid project", () => {
      const result = projectSchema.safeParse({
        projects: [
          {
            title: "Portfolio",
            link: "https://example.com",
            description: "Built with React",
            skills_used: "React, Tailwind",
          },
        ],
      });
      expect(result.success).toBe(true);
    });
  
    test("valid skills", () => {
      const result = skillsSchema.safeParse({
        skills: ["React", "TypeScript"],
      });
      expect(result.success).toBe(true);
    });
  
    test("valid summary", () => {
      const result = summarySchema.safeParse({
        summary: "Experienced frontend developer.",
      });
      expect(result.success).toBe(true);
    });
  
    test("valid suggestions", () => {
      const result = suggestionsSchema.safeParse({
        suggestions: "Use more action words in descriptions.",
      });
      expect(result.success).toBe(true);
    });
  });
  