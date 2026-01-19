import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { systemPrompt, modifyPrompt } from "@/lib/templates";

export const runtime = "edge";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = "gpt-4o", history = [], currentCode = "" } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables." },
        { status: 500 }
      );
    }

    // For now, we only support OpenAI. Claude and Gemini can be added later.
    if (model !== "gpt-4o") {
      return NextResponse.json(
        { error: `Model ${model} is coming soon! Please use GPT-4o for now.` },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Build messages array
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: currentCode ? modifyPrompt : systemPrompt,
      },
    ];

    // Add conversation history for context
    history.forEach((msg: Message) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    // Add current request
    if (currentCode) {
      messages.push({
        role: "user",
        content: `Current code:\n\`\`\`javascript\n${currentCode}\n\`\`\`\n\nUser request: ${prompt}\n\nPlease modify the code according to the request. Return the complete updated code.`,
      });
    } else {
      messages.push({
        role: "user",
        content: `Create a React Native app based on this description: ${prompt}`,
      });
    }

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 4000,
      stream: true,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    let fullContent = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            fullContent += content;
            controller.enqueue(encoder.encode(content));
          }

          // Clean up the final code
          let cleanCode = fullContent;
          if (cleanCode.includes("```")) {
            cleanCode = cleanCode
              .replace(/```(?:javascript|jsx|js|tsx|react)?\n?/g, "")
              .replace(/```\n?/g, "")
              .trim();
          }

          // If we cleaned up markdown, send the clean version
          if (cleanCode !== fullContent) {
            // Clear and send clean code
            controller.enqueue(encoder.encode("\n__CLEAN_CODE__\n" + cleanCode));
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error generating code:", error);

    if (error?.code === "invalid_api_key") {
      return NextResponse.json({ error: "Invalid OpenAI API key" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
