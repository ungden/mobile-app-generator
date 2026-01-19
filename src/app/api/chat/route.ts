import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit, incrementUsageManual } from "@/lib/usage";
import { isModelAllowedForTier, PlanType } from "@/lib/stripe";
import {
  APP_CATEGORIES,
  getEnhancedSystemPrompt,
  getEnhancedModifyPrompt,
} from "@/lib/app-templates";
import { checkIpRateLimit, incrementIpUsage, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs"; // Changed from edge to support Supabase server client

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Available AI models (using real model names)
type AIModel = "gpt-4o" | "claude-sonnet-4" | "claude-opus-4" | "gemini-2.0-flash";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = "gpt-4.1", history = [], currentCode = "", categoryId = "" } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Check authentication and usage limits
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Determine user's subscription tier
    let userTier: PlanType = "free";

    if (user) {
      // User is logged in - check their usage limits and tier
      const usage = await checkUsageLimit(user.id);
      userTier = usage.tier;

      if (!usage.allowed) {
        const resetTime = usage.resetAt
          ? `Resets at ${usage.resetAt.toLocaleTimeString()}`
          : "Upgrade to Pro for unlimited generations";

        return NextResponse.json(
          {
            error: `Daily limit reached (${usage.limit} generations). ${resetTime}`,
            code: "LIMIT_REACHED",
            usage,
          },
          { status: 429 }
        );
      }

      // Check if user's tier allows this model
      if (!isModelAllowedForTier(model, userTier)) {
        return NextResponse.json(
          {
            error: `${model} is not available on the ${userTier} plan. Upgrade to Pro for all models.`,
            code: "MODEL_NOT_ALLOWED",
            allowedModels: userTier === "free" ? ["gemini-2.0-flash"] : undefined,
          },
          { status: 403 }
        );
      }
    }
    // Anonymous users - rate limit by IP
    if (!user) {
      const clientIp = getClientIp(request);
      const ipLimit = checkIpRateLimit(clientIp);

      if (!ipLimit.allowed) {
        return NextResponse.json(
          {
            error: `You've reached the limit for anonymous users (${ipLimit.limit} generations/day). Sign up for free to get ${5} generations/day, or upgrade to Pro for unlimited access.`,
            code: "ANONYMOUS_LIMIT_REACHED",
            resetAt: ipLimit.resetAt.toISOString(),
          },
          { status: 429 }
        );
      }

      // Increment IP usage before making the API call
      incrementIpUsage(clientIp);
    }

    // Get category for enhanced prompts
    const category = categoryId
      ? APP_CATEGORIES.find((c) => c.id === categoryId)
      : undefined;

    // Use enhanced prompts for better MVP generation
    const systemContent = currentCode
      ? getEnhancedModifyPrompt(category)
      : getEnhancedSystemPrompt(category);

    const userContent = currentCode
      ? `Current code:\n\`\`\`javascript\n${currentCode}\n\`\`\`\n\nUser request: ${prompt}\n\nModify the code according to the request. Return the complete updated code.`
      : prompt; // Prompt is already enhanced by the client

    // Increment usage before making the API call (to prevent abuse)
    // We count the attempt, not just successful completions
    if (user) {
      await incrementUsageManual(user.id, model);
    }

    // Route to appropriate provider based on model
    if (model === "gpt-4o" || model.startsWith("gpt-")) {
      return handleOpenAI(model, systemContent, userContent, history);
    } else if (model === "claude-sonnet-4" || model === "claude-opus-4" || model.startsWith("claude-")) {
      return handleAnthropic(model, systemContent, userContent, history);
    } else if (model === "gemini-2.0-flash" || model.startsWith("gemini-")) {
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
    max_tokens: 8000, // Increased for MVP-quality code
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

  // Map to actual Anthropic model names
  const anthropicModel = model === "claude-opus-4" 
    ? "claude-sonnet-4-20250514"  // Use sonnet as fallback (opus may not be available)
    : "claude-sonnet-4-20250514";

  const stream = await anthropic.messages.stream({
    model: anthropicModel,
    max_tokens: 8000, // Increased for MVP-quality code
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
  // Use Gemini 2.0 Flash - fast and capable
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
