import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { destination, days, budget } = await req.json();

    if (!destination || !days || !budget) {
      return NextResponse.json(
        {
          success: false,
          error: "Please fill in all fields.",
        },
        { status: 400 }
      );
    }

    const prompt = `
Create a professional and detailed travel itinerary.

Destination: ${destination}

Number of Days: ${days}

Total Budget: ${budget}

Return the answer in clean Markdown format with the following sections:

# Trip Overview

## Day-wise Itinerary

Create a detailed plan for each day.

## Places to Visit

List the best places to visit.

## Recommended Hotels

Suggest suitable hotels according to the budget.

## Best Restaurants

Suggest good restaurants and local food options.

## Local Foods to Try

List famous local dishes.

## Estimated Expenses

Provide an approximate budget breakdown for:
- Travel
- Accommodation
- Food
- Activities
- Local Transport
- Miscellaneous

## Travel Tips

Give practical travel advice.

## Packing List

Provide a useful packing checklist.

Make the travel plan realistic, practical, and budget-friendly.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content:
            "You are an expert professional travel planner. Create detailed, practical and budget-friendly travel itineraries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_completion_tokens: 2500,
    });

    const plan =
      completion.choices[0]?.message?.content ||
      "Unable to generate a travel plan.";

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Travel API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}