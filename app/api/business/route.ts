import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    // Check API Key
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

    const { category, budget, audience } = await req.json();

    // Validate fields
    if (!category?.trim() || !budget?.trim() || !audience?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Category, budget and target audience are required.",
        },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    const prompt = `
Generate a detailed, realistic, and professional startup business idea.

Business Category:
${category}

Available Budget:
${budget}

Target Audience:
${audience}

Return the response in clean Markdown format using exactly these sections:

# Business Name

## Business Idea

## Problem Solved

## Target Audience

## Revenue Model

## Marketing Strategy

## Estimated Cost

## Growth Plan

## Future Scope

## Conclusion

Rules:
- Make the business idea realistic and practical.
- Consider the given budget carefully.
- Make the idea suitable for the specified target audience.
- Do not invent unrealistic financial guarantees.
- Use clear headings and bullet points where appropriate.
- Provide actionable suggestions.
`;

    const completion = await groq.chat.completions.create({
      // IMPORTANT: Use the model that is available in your Groq account
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content:
            "You are an experienced startup consultant, entrepreneur, and business strategist.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_completion_tokens: 2000,
    });

    const idea =
      completion.choices?.[0]?.message?.content ||
      "Unable to generate a business idea.";

    return NextResponse.json({
      success: true,
      idea,
    });
  } catch (error: unknown) {
    console.error("Business API Error:", error);

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