"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, User, ChevronDown, RotateCcw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export type AIModel = "gpt-4o" | "claude-3.5-sonnet" | "gemini-pro";

const modelOptions: { value: AIModel; label: string; icon: string }[] = [
  { value: "gpt-4o", label: "GPT-4o", icon: "OpenAI" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5", icon: "Anthropic" },
  { value: "gemini-pro", label: "Gemini Pro", icon: "Google" },
];

interface ChatPanelProps {
  onCodeGenerated: (code: string) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  initialPrompt?: string;
}

export default function ChatPanel({
  onCodeGenerated,
  isGenerating,
  setIsGenerating,
  initialPrompt = "",
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm AppForge AI. Describe the mobile app you want to create and I'll generate the code for you. Feel free to ask for modifications after!",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModel>("gpt-4o");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialPromptProcessed = useRef(false);

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

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          model: selectedModel,
          history: conversationHistory,
          currentCode: currentCode,
        }),
      });

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
            
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: "assistant",
                content:
                  "Done! I've updated your app. Check the preview on the right. Want any changes?",
              },
            ]);
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
          "Hi! I'm AppForge AI. Describe the mobile app you want to create and I'll generate the code for you. Feel free to ask for modifications after!",
      },
    ]);
    setCurrentCode("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-4 border-b border-[#222]">
        <div className="flex items-center justify-between mb-2">
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
              <p className="text-sm leading-relaxed">{message.content}</p>
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
                Generating your app...
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
            ? 'Try: "Add a dark mode toggle" or "Change the colors to blue"'
            : 'Try: "Create a habit tracker" or "Build a recipe app"'}
        </p>
      </form>
    </div>
  );
}
