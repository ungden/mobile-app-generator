"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Sparkles, User, ChevronDown, RotateCcw } from "lucide-react";
import CategorySelector from "./CategorySelector";
import UsageIndicator from "./UsageIndicator";
import {
  APP_CATEGORIES,
  AppCategory,
  getEnhancedSystemPrompt,
  formatUserPrompt,
} from "@/lib/app-templates";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Available AI models
export type AIModel = "claude-sonnet-4.5" | "claude-opus-4.5" | "gpt-5.2" | "gemini-3-pro" | "gemini-3-flash";

const modelOptions: { value: AIModel; label: string; icon: string; description: string }[] = [
  { value: "claude-sonnet-4.5", label: "Sonnet 4.5", icon: "Anthropic", description: "Best for coding" },
  { value: "claude-opus-4.5", label: "Opus 4.5", icon: "Anthropic", description: "Most intelligent" },
  { value: "gpt-5.2", label: "GPT-5.2", icon: "OpenAI", description: "Very capable" },
  { value: "gemini-3-pro", label: "Gemini 3 Pro", icon: "Google", description: "Powerful" },
  { value: "gemini-3-flash", label: "Gemini 3 Flash", icon: "Google", description: "Very fast" },
];

interface ChatPanelProps {
  onCodeGenerated: (code: string) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  initialPrompt?: string;
  initialCategory?: string;
  currentCode?: string;
  pendingFixError?: string | null;
  onFixErrorHandled?: () => void;
}

export default function ChatPanel({
  onCodeGenerated,
  isGenerating,
  setIsGenerating,
  initialPrompt = "",
  initialCategory = "",
  currentCode: externalCode,
  pendingFixError,
  onFixErrorHandled,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm 24fit AI. Choose an app category above, then describe your app. I'll generate a complete full-stack app with UI, backend, and database!",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModel>("claude-sonnet-4.5");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | null>(
    () => {
      if (initialCategory) {
        return APP_CATEGORIES.find((c) => c.id === initialCategory) || null;
      }
      return null;
    }
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialPromptProcessed = useRef(false);
  const [usageKey, setUsageKey] = useState(0);

  // Refresh usage indicator after generation
  const refreshUsage = useCallback(() => {
    setUsageKey((k) => k + 1);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial prompt from URL
  useEffect(() => {
    if (initialPrompt && !initialPromptProcessed.current) {
      initialPromptProcessed.current = true;
      setInput(initialPrompt);
      // Auto-submit after a short delay
      setTimeout(() => {
        handleSubmitWithPrompt(initialPrompt);
      }, 500);
    }
  }, [initialPrompt]);

  // Handle "Fix with AI" - auto-trigger when pendingFixError is set
  useEffect(() => {
    if (pendingFixError && !isGenerating) {
      // Use the external code (from parent) if available, otherwise use local currentCode
      const codeToFix = externalCode || currentCode;
      
      const fixPrompt = `Fix this error in my React Native code:

ERROR: ${pendingFixError}

Please analyze the error and fix the code. Return the complete fixed code.`;
      
      // Add a message showing what we're fixing
      const fixMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Fix this error: ${pendingFixError.split('\n')[0]}`,
      };
      setMessages((prev) => [...prev, fixMessage]);
      
      // Trigger the fix
      handleSubmitWithPrompt(fixPrompt);
      
      // Clear the pending error
      if (onFixErrorHandled) {
        onFixErrorHandled();
      }
    }
  }, [pendingFixError]);

  const handleSubmitWithPrompt = async (promptText: string) => {
    if (!promptText.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: promptText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter((m) => m.id !== "1") // Exclude initial greeting
        .map((m) => ({ role: m.role, content: m.content }));

      // Get enhanced prompt based on category
      const enhancedUserPrompt = currentCode
        ? promptText // For modifications, keep the original prompt
        : formatUserPrompt(promptText, selectedCategory || undefined);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: enhancedUserPrompt,
          model: selectedModel,
          history: conversationHistory,
          currentCode: currentCode,
          categoryId: selectedCategory?.id,
        }),
      });

      // Handle rate limit error
      if (response.status === 429) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: `${data.error}\n\nUpgrade to Pro for unlimited generations!`,
          },
        ]);
        setIsGenerating(false);
        return;
      }

      // Handle streaming response
      if (response.headers.get("content-type")?.includes("text/event-stream")) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullCode = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            fullCode += chunk;

            // Check for clean code marker
            if (fullCode.includes("__CLEAN_CODE__")) {
              const cleanCode = fullCode.split("__CLEAN_CODE__")[1].trim();
              onCodeGenerated(cleanCode);
              fullCode = cleanCode;
            } else {
              // Remove markdown if present for preview
              let previewCode = fullCode;
              if (previewCode.includes("```")) {
                previewCode = previewCode
                  .replace(/```(?:javascript|jsx|js|tsx|react)?\n?/g, "")
                  .replace(/```\n?/g, "")
                  .trim();
              }
              onCodeGenerated(previewCode);
            }
          }

          if (fullCode) {
            // Final cleanup
            let cleanCode = fullCode;
            if (cleanCode.includes("```")) {
              cleanCode = cleanCode
                .replace(/```(?:javascript|jsx|js|tsx|react)?\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            }
            setCurrentCode(cleanCode);
            onCodeGenerated(cleanCode);

            const successMessage = currentCode
              ? "Done! I've updated your app. Check the preview on the right."
              : `Your ${selectedCategory?.name || ""} app is ready! Check the preview. Want any changes?`;

            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: "assistant",
                content: successMessage,
              },
            ]);

            // Refresh usage after successful generation
            refreshUsage();
          }
        }
      } else if (response.ok) {
        // Fallback for non-streaming response
        const data = await response.json();

        if (data.code) {
          setCurrentCode(data.code);
          onCodeGenerated(data.code);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content:
                "Done! I've generated your app. Check the preview on the right. Feel free to ask for modifications!",
            },
          ]);
        } else if (data.error) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: `Error: ${data.error}`,
            },
          ]);
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitWithPrompt(input);
  };

  const resetConversation = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'm 24fit AI. Choose an app category above, then describe your app. I'll generate a complete full-stack app with UI, backend, and database!",
      },
    ]);
    setCurrentCode("");
    setSelectedCategory(null);
  };

  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-4 border-b border-[#222] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Assistant
          </h2>
          <button
            onClick={resetConversation}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#222] rounded-lg transition-colors"
            title="Start new conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Category Selector */}
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectPrompt={handleSelectPrompt}
        />

        {/* Usage Indicator */}
        <UsageIndicator key={usageKey} variant="compact" />

        {/* Model Selector */}
        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm w-full hover:border-[#444] transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="flex-1 text-left">
              {modelOptions.find((m) => m.value === selectedModel)?.label}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showModelDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowModelDropdown(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 overflow-hidden">
                {modelOptions.map((model) => (
                  <button
                    key={model.value}
                    onClick={() => {
                      setSelectedModel(model.value);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm hover:bg-[#222] transition-colors flex items-center justify-between ${
                      selectedModel === model.value ? "bg-[#222]" : ""
                    }`}
                  >
                    <span>{model.label}</span>
                    <span className="text-xs text-gray-500">{model.icon}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user"
                  ? "bg-purple-600"
                  : "bg-gradient-to-br from-purple-500 to-pink-500"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-[#1a1a1a] border border-[#333]"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Crafting your {selectedCategory?.name?.toLowerCase() || ""} app...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#222]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              currentCode
                ? "Describe changes you want..."
                : selectedCategory
                ? `Describe your ${selectedCategory.name.toLowerCase()} app...`
                : "Describe your app idea..."
            }
            disabled={isGenerating}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          {currentCode
            ? 'Try: "Add a dark mode toggle" or "Make the cards bigger"'
            : selectedCategory
            ? `Tip: Be specific about features you want`
            : "Select a category above for better results"}
        </p>
      </form>
    </div>
  );
}
