import { cn, fileReplacer, mapToResumeValues } from "@/lib/utils";
import type { ResumeServerData } from "@/lib/types";

// Mock File if not available in test environment
class MockFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  constructor(name: string, size: number, type: string, lastModified: number) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.lastModified = lastModified;
  }
}

describe("cn", () => {
  it("merges tailwind classes correctly", () => {
    expect(cn("text-sm", "font-bold")).toBe("text-sm font-bold");
    expect(cn("px-2", "px-4")).toBe("px-4"); // tailwind-merge replaces
  });
});

describe("fileReplacer", () => {
  it("stringifies File correctly", () => {
    const file = new MockFile("image.png", 12345, "image/png", 1616161616);
    const result = JSON.stringify({ photo: file }, fileReplacer);
    expect(result).toEqual(
      JSON.stringify({
        photo: {
          name: "image.png",
          size: 12345,
          type: "image/png",
          lastModified: 1616161616,
        },
      })
    );
    
  });

  it("returns value unchanged if not a File", () => {
    const obj = { test: "value" };
    const result = fileReplacer("test", obj.test);
    expect(result).toBe("value");
  });
});


describe("fileReplacer", () => {
    it("should replace a File object with an object containing its properties", () => {
      const mockFile = new File(["content"], "example.png", { type: "image/png", lastModified: 1700000000000 });
  
      const result = fileReplacer("photo", mockFile);
  
      expect(result).toEqual({
        name: "example.png",
        size: mockFile.size,
        type: "image/png",
        lastModified: 1700000000000,
      });
    });
  
    it("should return the value as-is if it's not a File", () => {
      expect(fileReplacer("key", "stringValue")).toBe("stringValue");
      expect(fileReplacer("key", 123)).toBe(123);
      expect(fileReplacer("key", { test: "object" })).toEqual({ test: "object" });
      expect(fileReplacer("key", null)).toBe(null);
    });
  });

describe("mapToResumeValues", () => {
  const mockServerData: ResumeServerData = {
    id: "resume-123",
    userId: "user-456",
    title: "Senior Frontend Dev",
    description: "React, TypeScript, Tailwind",
    photoUrl: null,
    colorHex: "#123456",
    borderStyle: "squircle",
    summary: "Experienced frontend developer specializing in React.",
    firstName: "John",
    lastName: "Doe",
    jobTitle: "Frontend Developer",
    city: "New York",
    country: "USA",
    phone: "+1 234 567 890",
    email: "john.doe@example.com",
    createdAt: new Date("2024-01-01T10:00:00Z"),
    updatedAt: new Date("2024-01-01T12:00:00Z"),
    skills: ["React", "Next.js", "TypeScript"],
    suggestions: null,
    workExperiences: [
      {
        id: "work-123",
        position: "Software Engineer",
        company: "TechCorp",
        startDate: new Date("2022-01-01"),
        endDate: new Date("2023-12-31"),
        description: "Developed modern web applications using React and Next.js.",
        resumeId: "resume-123",
        createdAt: new Date("2024-01-01T10:00:00Z"),
        updatedAt: new Date("2024-01-01T12:00:00Z"),
      },
    ],
    educations: [
      {
        id: "edu-123",
        degree: "Bachelor of Computer Science",
        school: "University of XYZ",
        startDate: new Date("2018-08-01"),
        endDate: new Date("2022-05-30"),
        resumeId: "resume-123",
        createdAt: new Date("2024-01-01T10:00:00Z"),
        updatedAt: new Date("2024-01-01T12:00:00Z"),
      },
    ],
    projects: [
      {
        id: "proj-123",
        title: "AI Resume Builder",
        description: "An AI-powered tool for generating resumes.",
        skills_used: "React, TypeScript, OpenAI API",
        resumeId: "resume-123",
        createdAt: new Date("2024-01-01T10:00:00Z"),
        updatedAt: new Date("2024-01-01T12:00:00Z"),
        link: "https://github.com/example",
      },
    ],
  };

  it("correctly maps server data to ResumeValues", () => {
    const result = mapToResumeValues(mockServerData);

    expect(result.id).toBe("resume-123");
    expect(result.title).toBe("Senior Frontend Dev");
    expect(result.description).toBe("React, TypeScript, Tailwind");
    expect(result.photo).toBeUndefined();
    expect(result.firstName).toBe("John");
    expect(result.lastName).toBe("Doe");
    expect(result.jobTitle).toBe("Frontend Developer");
    expect(result.city).toBe("New York");
    expect(result.country).toBe("USA");
    expect(result.phone).toBe("+1 234 567 890");
    expect(result.email).toBe("john.doe@example.com");
    expect(result.skills).toEqual(["React", "Next.js", "TypeScript"]);
    expect(result.borderStyle).toBe("squircle");
    expect(result.colorHex).toBe("#123456");
    expect(result.summary).toBe("Experienced frontend developer specializing in React.");

    expect(result.workExperiences![0].position).toBe("Software Engineer");
    expect(result.workExperiences![0].startDate).toBe("2022-01-01");
    expect(result.workExperiences![0].endDate).toBe("2023-12-31");

    expect(result.educations![0].degree).toBe("Bachelor of Computer Science");
    expect(result.educations![0].startDate).toBe("2018-08-01");
    expect(result.educations![0].endDate).toBe("2022-05-30");

    expect(result.projects![0].title).toBe("AI Resume Builder");
    expect(result.projects![0].skills_used).toBe("React, TypeScript, OpenAI API");
  });
});
