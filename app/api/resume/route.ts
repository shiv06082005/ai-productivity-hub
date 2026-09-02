import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GROQ_API_KEY is missing. Check your .env.local file.",
        },
        { status: 500 }
      );
    }

    const {
      name,
      education,
      skills,
      experience,
      objective,
    } = await req.json();

    if (!name || !education || !skills) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, education and skills are required.",
        },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey,
    });

    const prompt = `
Create a professional and ATS-friendly resume using ONLY the information provided below.

FULL NAME:
${name}

EDUCATION:
${education}

SKILLS:
${skills}

EXPERIENCE / INTERNSHIP:
${experience || "No professional experience provided."}

CAREER OBJECTIVE:
${objective || "No career objective provided."}

IMPORTANT RULES:

- Do not invent company names.
- Do not invent degrees.
- Do not invent projects.
- Do not invent work experience.
- Do not add fake achievements or certifications.
- If experience is not provided, create a suitable "Relevant Skills and Strengths" section instead.
- Keep the resume professional and ATS-friendly.
- Use clean Markdown formatting.

Return the resume in this structure:

# ${name}

## Professional Summary

Write a concise professional summary based only on the provided information.

## Education

List the provided education.

## Technical Skills

Organize the provided skills clearly.

## Experience

Include only the provided experience or internship information.

## Relevant Skills and Strengths

Highlight relevant strengths based on the provided skills and education.

## Career Objective

Use the provided objective. If none was provided, create a short generic objective WITHOUT inventing facts.

`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer who creates professional ATS-friendly resumes without inventing candidate information.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.5,
      max_completion_tokens: 2000,
    });

    const resume =
      completion.choices?.[0]?.message?.content ||
      "Unable to generate resume.";

    return NextResponse.json({
      success: true,
      resume,
    });

  } catch (error: unknown) {
    console.error("Resume API Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown server error";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}