import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Say Hello from Groq API",
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({
      success: true,
      response: chatCompletion.choices[0]?.message?.content,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}