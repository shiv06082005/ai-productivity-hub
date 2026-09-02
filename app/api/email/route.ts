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

    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter your email requirements.",
        },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey,
    });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
            "You are a professional email writing assistant. Write clear, professional and well-structured emails.",
        },
        {
          role: "user",
          content: `Write a professional email based on this request:

${prompt}

Include:
- Subject line
- Professional greeting
- Clear email body
- Professional closing

Return the email in clean Markdown format.`,
        },
      ],

      temperature: 0.7,
      max_completion_tokens: 1500,
    });

    const email =
      completion.choices?.[0]?.message?.content ||
      "Unable to generate email.";

    return NextResponse.json({
      success: true,
      email,
    });
  } catch (error: unknown) {
    console.error("Email API Error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}