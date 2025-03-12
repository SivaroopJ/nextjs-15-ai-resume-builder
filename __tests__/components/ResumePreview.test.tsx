import { render, screen } from "@testing-library/react";
import ResumePreview from "@/components/ResumePreview";
import { ResumeValues } from "@/lib/validation";

// Mock useDimensions to avoid dealing with actual DOM sizes
jest.mock("@/hooks/useDimensions", () => ({
  __esModule: true,
  default: () => ({ width: 794 }),
}));

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mock-url");
  global.URL.revokeObjectURL = jest.fn();
});

const mockResumeData: ResumeValues = {
  firstName: "John",
  lastName: "Doe",
  jobTitle: "Frontend Developer",
  city: "New York",
  country: "USA",
  phone: "1234567890",
  email: "john@example.com",
  summary: "Experienced frontend developer with expertise in React.",
  photo: "", // Skipping image tests for simplicity
  colorHex: "#1E90FF",
  borderStyle: "rounded",
  workExperiences: [
    {
      position: "Software Engineer",
      company: "Tech Inc",
      startDate: "2020-01-01",
      endDate: "2022-01-01",
      description: "Developed modern UI components.",
    },
  ],
  educations: [
    {
      degree: "B.Sc. Computer Science",
      school: "University X",
      startDate: "2016-01-01",
      endDate: "2020-01-01",
    },
  ],
  projects: [
    {
      title: "Portfolio Website",
      link: "https://portfolio.com",
      description: "Built a personal portfolio site with Next.js.",
      skills_used: "Next.js, Tailwind CSS",
    },
  ],
  skills: ["React", "TypeScript", "Tailwind CSS"],
};


const mockResumeData1: ResumeValues = {
    firstName: "John",
    lastName: "Doe",
    jobTitle: "Frontend Developer",
    city: "New York",
    country: "USA",
    phone: "1234567890",
    email: "john@example.com",
    summary: "Experienced frontend developer with expertise in React.",
    photo: "", // Skipping image tests for simplicity
    colorHex: "#1E90FF",
    borderStyle: "square",
    workExperiences: [
      {
        position: "Software Engineer",
        company: "Tech Inc",
        startDate: "2020-01-01",
        endDate: "2022-01-01",
        description: "Developed modern UI components.",
      },
    ],
    educations: [
      {
        degree: "B.Sc. Computer Science",
        school: "University X",
        startDate: "2016-01-01",
        endDate: "2020-01-01",
      },
    ],
    projects: [
      {
        title: "Portfolio Website",
        link: "https://portfolio.com",
        description: "Built a personal portfolio site with Next.js.",
        skills_used: "Next.js, Tailwind CSS",
      },
    ],
    skills: ["React", "TypeScript", "Tailwind CSS"],
  };

  const mockResumeData2: ResumeValues = {
    firstName: "John",
    lastName: "Doe",
    jobTitle: "Frontend Developer",
    city: "New York",
    country: "USA",
    phone: "1234567890",
    email: "john@example.com",
    summary: "Experienced frontend developer with expertise in React.",
    photo: "", // Skipping image tests for simplicity
    colorHex: "#1E90FF",
    borderStyle: "circle",
    workExperiences: [
      {
        position: "Software Engineer",
        company: "Tech Inc",
        startDate: "2020-01-01",
        endDate: "2022-01-01",
        description: "Developed modern UI components.",
      },
    ],
    educations: [
      {
        degree: "B.Sc. Computer Science",
        school: "University X",
        startDate: "2016-01-01",
        endDate: "2020-01-01",
      },
    ],
    projects: [
      {
        title: "Portfolio Website",
        link: "https://portfolio.com",
        description: "Built a personal portfolio site with Next.js.",
        skills_used: "Next.js, Tailwind CSS",
      },
    ],
    skills: ["React", "TypeScript", "Tailwind CSS"],
  };
  

describe("ResumePreview", () => {
  it("renders all resume sections correctly", async () => {
    render(<ResumePreview resumeData={mockResumeData} />);

    // Personal Info
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("New York, USA"))).toBeInTheDocument();

    // Summary
    expect(screen.getByText("Professional profile")).toBeInTheDocument();
    expect(screen.getByText("Experienced frontend developer with expertise in React.")).toBeInTheDocument();

    // Work Experience
    expect(screen.getByText("Work experience")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Tech Inc")).toBeInTheDocument();
    expect(screen.getByText("Developed modern UI components.")).toBeInTheDocument();

    // Education
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("B.Sc. Computer Science")).toBeInTheDocument();
    expect(screen.getByText("University X")).toBeInTheDocument();

    // Projects
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
    expect(screen.getByText("Link to Project:")).toBeInTheDocument();
    expect(screen.getByText("Skills Used:")).toBeInTheDocument();
    expect(screen.getByText("Next.js, Tailwind CSS")).toBeInTheDocument();

    // Skills
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();
  });
});


describe("ResumePreview1", () => {
    it("renders all resume sections correctly", async () => {
      render(<ResumePreview resumeData={mockResumeData1} />);
  
      // Personal Info
      expect(await screen.findByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes("New York, USA"))).toBeInTheDocument();
  
      // Summary
      expect(screen.getByText("Professional profile")).toBeInTheDocument();
      expect(screen.getByText("Experienced frontend developer with expertise in React.")).toBeInTheDocument();
  
      // Work Experience
      expect(screen.getByText("Work experience")).toBeInTheDocument();
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("Tech Inc")).toBeInTheDocument();
      expect(screen.getByText("Developed modern UI components.")).toBeInTheDocument();
  
      // Education
      expect(screen.getByText("Education")).toBeInTheDocument();
      expect(screen.getByText("B.Sc. Computer Science")).toBeInTheDocument();
      expect(screen.getByText("University X")).toBeInTheDocument();
  
      // Projects
      expect(screen.getByText("Projects")).toBeInTheDocument();
      expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
      expect(screen.getByText("Link to Project:")).toBeInTheDocument();
      expect(screen.getByText("Skills Used:")).toBeInTheDocument();
      expect(screen.getByText("Next.js, Tailwind CSS")).toBeInTheDocument();
  
      // Skills
      expect(screen.getByText("Skills")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();
    });
  });

  describe("ResumePreview2", () => {
    it("renders all resume sections correctly", async () => {
      render(<ResumePreview resumeData={mockResumeData2} />);
  
      // Personal Info
      expect(await screen.findByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes("New York, USA"))).toBeInTheDocument();
  
      // Summary
      expect(screen.getByText("Professional profile")).toBeInTheDocument();
      expect(screen.getByText("Experienced frontend developer with expertise in React.")).toBeInTheDocument();
  
      // Work Experience
      expect(screen.getByText("Work experience")).toBeInTheDocument();
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("Tech Inc")).toBeInTheDocument();
      expect(screen.getByText("Developed modern UI components.")).toBeInTheDocument();
  
      // Education
      expect(screen.getByText("Education")).toBeInTheDocument();
      expect(screen.getByText("B.Sc. Computer Science")).toBeInTheDocument();
      expect(screen.getByText("University X")).toBeInTheDocument();
  
      // Projects
      expect(screen.getByText("Projects")).toBeInTheDocument();
      expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
      expect(screen.getByText("Link to Project:")).toBeInTheDocument();
      expect(screen.getByText("Skills Used:")).toBeInTheDocument();
      expect(screen.getByText("Next.js, Tailwind CSS")).toBeInTheDocument();
  
      // Skills
      expect(screen.getByText("Skills")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();
    });
  });


  