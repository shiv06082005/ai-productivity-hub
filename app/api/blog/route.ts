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

    const { topic } = await req.json();

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a blog topic.",
        },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey,
    });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: `
You are an expert professional blog writer.

Rules:
- Write an engaging and informative blog.
- Include a compelling title.
- Use proper Markdown headings.
- Use bullet points where appropriate.
- Keep the article between 500 and 700 words.
- Write clear, professional, and easy-to-understand content.
- Include an introduction and conclusion.
- Return only the blog content.
`,
        },
        {
          role: "user",
          content: `Write a blog about: ${topic}`,
        },
      ],

      temperature: 0.7,
      max_completion_tokens: 2000,
    });

    const blog =
      completion.choices?.[0]?.message?.content ||
      "Unable to generate the blog.";

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error: unknown) {
    console.error("BLOG API ERROR:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown server error";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}