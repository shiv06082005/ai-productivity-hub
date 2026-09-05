import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GROQ_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    const { resume, jobDescription } = await req.json();

    if (!resume || !resume.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide your resume.",
        },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey,
    });

    const prompt = `
You are an expert ATS Resume Analyzer and professional career consultant.

Analyze the following resume professionally.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription || "Not provided"}

Return the analysis in clean Markdown format using exactly these sections:

# Resume Analysis

## ATS Score
Give a score out of 100.

## Overall Summary
Give a brief professional evaluation.

## Strengths
List the strongest parts of the resume.

## Areas for Improvement
Explain what needs improvement.

## Missing Skills and Keywords
List important missing skills or ATS keywords.

## Job Match Analysis
Analyze how well the resume matches the job description.
If no job description is provided, explain the general job readiness.

## Formatting Suggestions
Provide suggestions for improving resume formatting and structure.

## Action Plan
Give clear steps the candidate should take to improve the resume.

Be constructive, realistic, professional, and helpful.
Do not invent information that is not present in the resume.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_completion_tokens: 2500,
    });

    const analysis =
      completion.choices?.[0]?.message?.content ||
      "Unable to analyze the resume.";

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: unknown) {
    console.error("Resume Analyzer API Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while analyzing the resume.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}