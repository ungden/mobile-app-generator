import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAgentSystemPrompt, AVAILABLE_TOOLS } from "@/lib/ai-agent";

export const runtime = "nodejs";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AgentRequest {
  prompt: string;
  model?: string;
  history?: Message[];
  projectFiles: string[]; // List of current file paths
  fileContents?: Record<string, string>; // File contents for context
}

export async function POST(request: NextRequest) {
  try {
    const { 
      prompt, 
      model = "claude-sonnet-4.5", 
      history = [], 
      projectFiles = [],
      fileContents = {}
    }: AgentRequest = await request.json();

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

    // Build system prompt with current project state
    const systemPrompt = getAgentSystemPrompt(projectFiles);

    // Build user message with file contents if provided
    let userMessage = prompt;
    if (Object.keys(fileContents).length > 0) {
      userMessage = `## CURRENT FILE CONTENTS FOR CONTEXT:\n\n`;
      for (const [path, contents] of Object.entries(fileContents)) {
        userMessage += `### ${path}\n\`\`\`javascript\n${contents}\n\`\`\`\n\n`;
      }
      userMessage += `## USER REQUEST:\n${prompt}`;
    }

    // Build message history
    const messages: Anthropic.MessageParam[] = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
    messages.push({ role: "user", content: userMessage });

    // Map model name
    const anthropicModel = model === "claude-opus-4.5" 
      ? "claude-opus-4-5-20251101"
      : "claude-sonnet-4-5-20250929";

    // Stream the response
    const stream = await anthropic.messages.stream({
      model: anthropicModel,
      max_tokens: 8000,
      system: systemPrompt,
      messages,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              const content = event.delta.text || "";
              controller.enqueue(encoder.encode(content));
            }
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
    console.error("Agent error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
