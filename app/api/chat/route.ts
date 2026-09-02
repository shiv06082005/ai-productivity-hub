import Groq from "groq-sdk";
import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

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

    const body = await req.json();

    const messages: ChatMessage[] = body.messages || [];
    const image = body.image || null;

    if (!messages.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a message.",
        },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    const groqMessages: any[] = [
      {
        role: "system",
        content: `
You are a helpful AI assistant inside an AI Productivity Hub.

IMPORTANT:
- Always consider the complete previous conversation.
- Remember information the user provided earlier in the chat.
- Answer follow-up questions using the previous conversation context.
- Be helpful, clear, and professional.
- If the user asks about something mentioned earlier, use that information.
`,
      },
    ];

    messages.forEach((message, index) => {
      const isLastMessage = index === messages.length - 1;

      // Last user message with image
      if (
        isLastMessage &&
        message.role === "user" &&
        image
      ) {
        groqMessages.push({
          role: "user",
          content: [
            {
              type: "text",
              text: message.content,
            },
          ],
        });
      } else {
        groqMessages.push({
          role: message.role,
          content: message.content,
        });
      }
    });

    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",

        messages: groqMessages,

        temperature: 0.7,

        max_completion_tokens: 1500,
      });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    return NextResponse.json({
      success: true,
      answer: answer,
    });

  } catch (error: unknown) {
    console.error("CHAT API ERROR:", error);

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