import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  APP_CATEGORIES,
  getEnhancedSystemPrompt,
  getEnhancedModifyPrompt,
} from "@/lib/app-templates";

export const runtime = "nodejs";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Available AI models
type AIModel = 
  | "gpt-5.2" 
  | "claude-sonnet-4.5" 
  | "claude-opus-4.5" 
  | "gemini-3-pro" 
  | "gemini-3-flash";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = "claude-sonnet-4.5", history = [], currentCode = "", categoryId = "" } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Get category for enhanced prompts
    const category = categoryId
      ? APP_CATEGORIES.find((c) => c.id === categoryId)
      : undefined;

    // Use enhanced prompts for better MVP generation
    const systemContent = currentCode
      ? getEnhancedModifyPrompt()
      : getEnhancedSystemPrompt(category);

    const userContent = currentCode
      ? `Current code:\n\`\`\`javascript\n${currentCode}\n\`\`\`\n\nUser request: ${prompt}\n\nModify the code according to the request. Return the complete updated code.`
      : prompt;

    // Route to appropriate provider based on model
    if (model === "gpt-5.2" || model.startsWith("gpt-")) {
      return handleOpenAI(systemContent, userContent, history);
    } else if (model.startsWith("claude-")) {
      return handleAnthropic(model, systemContent, userContent, history);
    } else if (model.startsWith("gemini-")) {
      return handleGemini(model, systemContent, userContent, history);
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
    model: "gpt-5.2-2025-12-11",
    messages,
    temperature: 0.7,
    max_tokens: 8000,
    stream: true,
  });

  return createStreamResponse(stream, "openai");
}

async function handleAnthropic(
  model: string,
  systemContent: string,
  userContent: string,
  history: Message[]
) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Anthropic API key not configured" },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const messages: Anthropic.MessageParam[] = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  messages.push({ role: "user", content: userContent });

  // Map to actual Anthropic model names
  const anthropicModel = model === "claude-opus-4.5" 
    ? "claude-opus-4-5-20251101"
    : "claude-sonnet-4-5-20250929";

  const stream = await anthropic.messages.stream({
    model: anthropicModel,
    max_tokens: 8000,
    system: systemContent,
    messages,
  });

  return createStreamResponse(stream, "anthropic");
}

async function handleGemini(
  modelId: string,
  systemContent: string,
  userContent: string,
  history: Message[]
) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return NextResponse.json(
      { error: "Google AI API key not configured" },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  
  // Map to actual Gemini model names
  const geminiModel = modelId === "gemini-3-flash" 
    ? "gemini-3-flash-preview"
    : "gemini-3-pro-preview";
    
  const model = genAI.getGenerativeModel({ model: geminiModel });

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: systemContent }] },
      { role: "model", parts: [{ text: "Understood. I will generate high-quality React Native code as requested." }] },
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
