"use server";

import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  generateProjectsSchema,
  WorkExperience,
  GenerateSuggestionsInput,
  generateSuggestionsSchema,
} from "@/lib/validation";
import groq from "@/lib/deepseek";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canUseAITools } from "@/lib/permissions";
import { GenerateProjectsInput, Project } from "@/lib/validation";
import { GitHubRepo } from "@/lib/validation";

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
   You are a professional AI resume writer. Your task is to generate a **concise, professional, and structured** resume summary based on the provided user data.

### **Rules for the Summary:**
- **DO NOT** include any thoughts, explanations, or reasoning.
- **DO NOT** use "<think>" or any step-by-step breakdown.
- **ONLY** return the final summary as plain text.
- Keep it **50-60 words** maximum.
- Start with a strong **job title** (e.g., "Results-driven Software Developer").
- Highlight **key technical skills** relevant to the role.
- Mention **previous key roles** with impact statements.
- Concisely list **education and skills** at the end.


    `;

  const userMessage = `
    Please generate a professional resume summary from this data:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}

    Educations:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}

      Skills:
      ${skills}
    `;

    console.log("systemMessage", systemMessage);
    console.log("userMessage", userMessage);

    const completion = await groq.chat.completions.create({
        model: "deepseek-r1-distill-llama-70b",
        messages: [
            {
                role: "system",
                content: systemMessage
            },
            {
                role: "user",
                content: userMessage
            }
        ]
    });

    const initialResponse = completion.choices[0].message.content;

    if(!initialResponse) {
        throw new Error("Failed to generate AI response");
    }
    const aiResponse = initialResponse.replace(/<think>.*<\/think>/gs, "").trim();

    if (aiResponse.split(" ").length > 60) {
      throw new Error("Generated summary is too long. Please refine the output.");
    }

    return aiResponse;
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

  Job title: <job title>
  Company: <company name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be inferred from the job title>
  `;

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `;

  const completion = await groq.chat.completions.create({
    model: "deepseek-r1-distill-llama-70b",
    messages: [
        {
            role: "system",
            content: systemMessage
        },
        {
            role: "user",
            content: userMessage
        }
    ]
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  console.log("aiResponse",aiResponse);

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}


export async function generateProjects(input: GenerateProjectsInput): Promise<Project[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { githubUrl, role } = generateProjectsSchema.parse(input);

  console.log("Input:", { githubUrl, role });

  // Extract username from GitHub URL
  const usernameMatch = githubUrl.match(/github\.com\/([A-Za-z0-9-]+)(\/|$)/);
  if (!usernameMatch) {
    throw new Error("Invalid GitHub URL");
  }
  const username = usernameMatch[1];

  // Fetch repositories from GitHub API
  const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`, // Optional PAT
    },
  });

  if (!reposResponse.ok) {
    console.error("Repos API error:", reposResponse.status, reposResponse.statusText);
    throw new Error(`GitHub API error: ${reposResponse.status} - ${reposResponse.statusText}`);
  }

  const repos: GitHubRepo[] = await reposResponse.json();
  console.log("Fetched repos:", repos.length);

  // Process all repos (no limit)
  const repoDetails = await Promise.all(
    repos.map(async (repo: GitHubRepo) => {
      const readmeResponse = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/readme`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `token ${process.env.GITHUB_API_TOKEN}`, // Optional PAT
          },
        }
      );

      let readmeContent = repo.description || "No description available";
      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json();
        readmeContent = Buffer.from(readmeData.content, "base64").toString("utf-8");
        // Truncate to 750 chars (~200 tokens) to manage token usage
        readmeContent = readmeContent.slice(0, 750) + (readmeContent.length > 750 ? "..." : "");
      } else {
        console.warn(`README fetch failed for ${repo.name}: ${readmeResponse.status}`);
      }

      return {
        name: repo.name,
        html_url: repo.html_url,
        description: repo.description || "No description",
        language: repo.language || "Unknown",
        readme: readmeContent,
      };
    })
  );

  console.log("Repo details:", repoDetails);

  // System message with strict formatting
  const systemMessage = `
You are a resume generator AI. Generate project entries for the role "${role}" from GitHub repo data.
Each entry MUST use this exact format, with no extra text, headers, or <think> blocks:
Title: <repo name>
Link: <repo html_url>
Description:
- <bullet point 1>
- <bullet point 2>
Skills used: <skills from README or repo language>

- Assess relevance to "${role}" using repo name, description, README, and language.
- For "${role}", look for keywords like JavaScript, React, CSS, HTML, UI, Flutter, frontend (case-insensitive).
- If no explicit match, infer relevance from language or purpose (e.g., Dart/Flutter for frontend).
- Use repo language (e.g., "${repoDetails.map(r => r.language).join(", ")}") as fallback for skills if not specified in README.
- Return an empty string if no projects are relevant.
  `;

  const userMessage = `
Generate project entries for "${role}" from these repos:
${repoDetails.map(repo => `${repo.name}: ${repo.description} | README: ${repo.readme} | Language: ${repo.language} - ${repo.html_url}`).join("\n\n")}
  `;

  console.log("User message sent to AI:", userMessage);

  const completion = await groq.chat.completions.create({
    model: "deepseek-r1-distill-llama-70b",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    console.error("AI returned no response");
    throw new Error("Failed to generate AI response");
  }

  console.log("AI response:", aiResponse);

  // Parse AI response into Project array
  const projects: Project[] = [];
  const projectBlocks = aiResponse.split(/\n\s*\n/).filter(Boolean);

  for (const block of projectBlocks) {
    const titleMatch = block.match(/Title: (.*)/);
    const linkMatch = block.match(/Link: (.*)/);
    const descMatch = block.match(/Description:([\s\S]*?)(?=Skills used|$)/);
    const skillsMatch = block.match(/Skills used: (.*)/);

    const project: Project = {
      title: titleMatch?.[1] || "",
      link: linkMatch?.[1] || "",
      description: descMatch?.[1]?.trim() || "",
      skills_used: skillsMatch?.[1] || "",
    };

    // Fallback: Use repo language if skills_used is empty
    if (project.title && !project.skills_used) {
      const matchingRepo = repoDetails.find(repo => repo.name === project.title);
      project.skills_used = matchingRepo?.language || "Unknown";
    }

    // Only include projects with title and link
    if (project.title && project.link) {
      projects.push(project);
    }
  }

  console.log("Parsed projects:", projects);

  return projects;
}

export async function generateSuggestions(input: GenerateSuggestionsInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { jobTitle, workExperiences, educations, skills, projects } =
    generateSuggestionsSchema.parse(input);

  const systemMessage = `
   You are a professional AI resume writer. Your task is to generate **concise, professional, and structured** resume suggestions based on the provided user data and the role user is going to apply for.

### **Rules for the Suggestions:**
- If the job title is not specified, **IMMEDIATELY RETURN** with a suggestion to give the jobtitle.
- Go to the steps given below **ONLY IF** the job title **IS SPECIFIED**.
- **DO NOT** include any thoughts, explanations, or reasoning.
- **DO NOT** use "<think>" or any step-by-step breakdown.
- **ONLY** return the final suggestions as plain text.
- Keep it **50-60 words** maximum.
- Given the projects, work experiences, and jobTitle:
  1. You have to tell which projects or workexperiences are irrelevant for this jobtitle and should be removed.
  2. You have to tell in which order the relevant projects and workexperiences should be placed on the resume for maximum impact.
  3. For the above tasks you have to use the information you can get in the workexperiences and projects.
  4. **DO NOT** fetch the project link and **DO NOT** try to take the input from that.
  5. **DO NOT** forget to account for the **Skills used** section in the projects section while making a decision.
    `;

  const userMessage = `
    Please generate suggestions from this resume data for my projects and work experiences:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}

    Educations:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}

    Skills:
    ${skills}

    Projects:
    ${projects
      ?.map(
        (pro) => `
        title: ${pro.title || "N/A"}
        Description:
        ${pro.description || "N/A"}
        Skills Used: ${pro.skills_used || "N/A"}
        `
      )}
    `;

    console.log("systemMessage", systemMessage);
    console.log("userMessage", userMessage);

    const completion = await groq.chat.completions.create({
        model: "deepseek-r1-distill-llama-70b",
        messages: [
            {
                role: "system",
                content: systemMessage
            },
            {
                role: "user",
                content: userMessage
            }
        ]
    });

    const initialResponse = completion.choices[0].message.content;

    if(!initialResponse) {
        throw new Error("Failed to generate AI response");
    }
    const aiResponse = initialResponse.replace(/<think>.*<\/think>/gs, "").trim();

    if (aiResponse.split(" ").length > 60) {
      throw new Error("Generated suggestions are too long. Please refine the output.");
    }

    return aiResponse;
}