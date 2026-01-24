import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAppGenerationPrompt, getAppModificationPrompt, parseGeneratedApp, getDefaultDependencies } from "@/lib/ai-agent";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60 seconds for generation

interface GenerateRequest {
  prompt: string;
  model?: string;
  existingFiles?: Record<string, string>;
  isModification?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      prompt, 
      model = "claude-sonnet-4-5-20250514",
      existingFiles,
      isModification = false,
    }: GenerateRequest = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Choose system prompt based on whether this is a new app or modification
    const systemPrompt = isModification && existingFiles
      ? getAppModificationPrompt(existingFiles)
      : getAppGenerationPrompt();

    // Map model name to actual model ID
    let anthropicModel = "claude-sonnet-4-5-20250514";
    if (model.includes("opus")) {
      anthropicModel = "claude-sonnet-4-5-20250514"; // Use sonnet as fallback
    } else if (model.includes("sonnet")) {
      anthropicModel = "claude-sonnet-4-5-20250514";
    }

    console.log(`Generating app with model: ${anthropicModel}, prompt: ${prompt.substring(0, 100)}...`);

    // Generate the app
    const response = await anthropic.messages.create({
      model: anthropicModel,
      max_tokens: 16000, // Increased for full app generation
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text content
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json(
        { error: "No text response from AI" },
        { status: 500 }
      );
    }

    // Parse the generated app
    const parsed = parseGeneratedApp(textContent.text);

    if (parsed.error || !parsed.app) {
      console.error("Failed to parse AI response:", parsed.error);
      return NextResponse.json(
        { 
          error: parsed.error || "Failed to parse generated app",
          rawResponse: textContent.text.substring(0, 500),
        },
        { status: 500 }
      );
    }

    // Merge with default dependencies
    const finalDependencies = {
      ...getDefaultDependencies(),
      ...parsed.app.dependencies,
    };

    // If this is a modification, merge with existing files
    let finalFiles = parsed.app.files;
    if (isModification && existingFiles) {
      finalFiles = {
        ...existingFiles,
        ...parsed.app.files,
      };
    }

    console.log(`Generated app "${parsed.app.appName}" with ${Object.keys(finalFiles).length} files`);

    return NextResponse.json({
      success: true,
      app: {
        appName: parsed.app.appName,
        description: parsed.app.description,
        files: finalFiles,
        dependencies: finalDependencies,
      },
      message: parsed.message,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
