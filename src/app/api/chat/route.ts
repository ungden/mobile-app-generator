import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt, modifyPrompt } from "@/lib/templates";

export const runtime = "edge";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type AIModel = "gpt-4.1" | "gpt-4o" | "claude-sonnet-4" | "gemini-2.0-flash";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = "gpt-4.1", history = [], currentCode = "" } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemContent = currentCode ? modifyPrompt : systemPrompt;
    const userContent = currentCode
      ? `Current code:\n\`\`\`javascript\n${currentCode}\n\`\`\`\n\nUser request: ${prompt}\n\nPlease modify the code according to the request. Return the complete updated code.`
      : `Create a React Native app based on this description: ${prompt}`;

    // Route to appropriate provider
    if (model === "gpt-4.1" || model === "gpt-4o") {
      return handleOpenAI(model, systemContent, userContent, history);
    } else if (model === "claude-sonnet-4") {
      return handleAnthropic(systemContent, userContent, history);
    } else if (model === "gemini-2.0-flash") {
      return handleGemini(systemContent, userContent, history);
    }

    return NextResponse.json({ error: "Invalid model selected" }, { status: 400 });
  } catch (error: any) {
    console.error("Error generating code:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

async function handleOpenAI(
  model: string,
  systemContent: string,
  userContent: string,
  history: Message[]
) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemContent },
  ];

  history.forEach((msg: Message) => {
    messages.push({ role: msg.role, content: msg.content });
  });

  messages.push({ role: "user", content: userContent });

  const stream = await openai.chat.completions.create({
    model: model,
    messages,
    temperature: 0.7,
    max_tokens: 4000,
    stream: true,
  });

  return createStreamResponse(stream, "openai");
}

async function handleAnthropic(
  systemContent: string,
  userContent: string,
  history: Message[]
) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Anthropic API key not configured. Add ANTHROPIC_API_KEY to environment variables." },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const messages: Anthropic.MessageParam[] = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  messages.push({ role: "user", content: userContent });

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: systemContent,
    messages,
  });

  return createStreamResponse(stream, "anthropic");
}

async function handleGemini(
  systemContent: string,
  userContent: string,
  history: Message[]
) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return NextResponse.json(
      { error: "Google AI API key not configured. Add GOOGLE_AI_API_KEY to environment variables." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: systemContent }] },
      { role: "model", parts: [{ text: "Understood. I will generate React Native code as requested." }] },
      ...history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model" as const,
        parts: [{ text: msg.content }],
      })),
    ],
  });

  const result = await chat.sendMessageStream(userContent);

  return createStreamResponse(result, "gemini");
}

function createStreamResponse(stream: any, provider: string) {
  const encoder = new TextEncoder();
  let fullContent = "";

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        if (provider === "openai") {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            fullContent += content;
            controller.enqueue(encoder.encode(content));
          }
        } else if (provider === "anthropic") {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              const content = event.delta.text || "";
              fullContent += content;
              controller.enqueue(encoder.encode(content));
            }
          }
        } else if (provider === "gemini") {
          for await (const chunk of stream.stream) {
            const content = chunk.text() || "";
            fullContent += content;
            controller.enqueue(encoder.encode(content));
          }
        }

        // Clean up markdown code blocks
        let cleanCode = fullContent;
        if (cleanCode.includes("```")) {
          cleanCode = cleanCode
            .replace(/```(?:javascript|jsx|js|tsx|react)?\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
        }

        if (cleanCode !== fullContent) {
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
}
