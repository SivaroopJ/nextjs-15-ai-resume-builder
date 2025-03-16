"use server";

import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import groq from "@/lib/deepseek";

export async function generateSummary(input: GenerateSummaryInput) {
  //TODO: Block for non-premium users

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

**Example Output:**
"Results-driven Software Developer specializing in Next.js, React.js, and Python. Previously a Senior Data Analyst at Blackrock, excelling in data interpretation. Holds a B.Tech from IITKGP and an MS from MIT. Proficient in C, C++, Python, JavaScript, and TypeScript."

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
  //TODO: Block for non-premium users

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