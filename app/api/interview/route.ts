import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    // Check API key
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GROQ_API_KEY is missing. Please check your .env.local file.",
        },
        { status: 500 }
      );
    }

    const { role, experience } = await req.json();

    // Validate input
    if (!role?.trim() || !experience?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Role and experience level are required.",
        },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey,
    });

    const prompt = `
Prepare a detailed and practical interview preparation guide.

Job Role:
${role}

Candidate Experience:
${experience}

Return the response in clean Markdown format using these sections:

# Interview Preparation Guide

## Introduction

## 10 HR Questions

For every HR question, include:
- Question
- Strong sample answer

## 10 Technical Questions

For every technical question, include:
- Question
- Key points expected in a good answer

## Interview Tips

## Salary Negotiation Tips

## Final Advice

Rules:
- Customize all questions specifically for the job role.
- Adjust the difficulty according to the candidate's experience level.
- Keep answers realistic and professional.
- Do not make up company-specific information.
- Use numbered lists and bullet points for readability.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content:
            "You are an experienced recruiter, HR professional, and technical interviewer who helps candidates prepare for job interviews.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_completion_tokens: 3000,
    });

    const interview =
      completion.choices?.[0]?.message?.content ||
      "Unable to generate the interview preparation guide.";

    return NextResponse.json({
      success: true,
      interview,
    });
  } catch (error: unknown) {
    console.error("Interview API Error:", error);

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