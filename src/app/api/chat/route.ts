import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { systemPrompt } from "@/lib/templates";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables." },
        { status: 500 }
      );
    }

    // Initialize OpenAI client inside the handler
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Create a React Native app based on this description: ${prompt}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const generatedCode = completion.choices[0]?.message?.content;

    if (!generatedCode) {
      return NextResponse.json(
        { error: "Failed to generate code" },
        { status: 500 }
      );
    }

    // Clean up the code - remove markdown code blocks if present
    let cleanCode = generatedCode;
    if (cleanCode.includes("```")) {
      cleanCode = cleanCode
        .replace(/```(?:javascript|jsx|js|tsx)?\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
    }

    return NextResponse.json({ code: cleanCode });
  } catch (error: any) {
    console.error("Error generating code:", error);
    
    if (error?.code === "invalid_api_key") {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
