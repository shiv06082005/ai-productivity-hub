import Groq from "groq-sdk";
import { NextResponse } from "next/server";

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

    const { subjects, examDate, hours } = await req.json();

    if (!subjects || !examDate || !hours) {
      return NextResponse.json(
        {
          success: false,
          error: "Subjects, exam date and study hours are required.",
        },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    const prompt = `
Create a detailed and personalized study plan.

Subjects:
${subjects}

Exam Date:
${examDate}

Study Hours Per Day:
${hours}

Create a realistic day-wise study schedule.

Return the answer in clean Markdown format with:

# Study Plan

## Overview

## Daily Schedule

For every day include:
- Topics to study
- Study duration
- Revision tasks
- Practice tasks

## Final Revision Strategy

Make the plan practical, organized, and suitable for a student preparing for exams.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_completion_tokens: 2000,
    });

    const plan = completion.choices?.[0]?.message?.content;

    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          error: "AI could not generate a study plan.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error: unknown) {
    console.error("Study Planner API Error:", error);

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