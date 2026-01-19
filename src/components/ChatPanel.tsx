"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Send, Loader2, Sparkles, User, ChevronDown, RotateCcw, 
  ChevronRight, Code, RotateCw, Share2, CheckCircle2, FileCode,
  AlertCircle
} from "lucide-react";
import CategorySelector from "./CategorySelector";
import UsageIndicator from "./UsageIndicator";
import {
  APP_CATEGORIES,
  AppCategory,
  formatUserPrompt,
} from "@/lib/app-templates";
import { validateCode, tryAutoFix, extractCode } from "@/lib/code-validator";

// Message types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "code-change";
  codeChange?: CodeChange;
}

// Code change tracking (like Rork)
interface CodeChange {
  id: string;
  timestamp: Date;
  description: string;
  files: FileChange[];
  code: string;
  previousCode?: string;
}

interface FileChange {
  name: string;
  action: "created" | "edited" | "deleted";
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
      content: "Hi! I'm 24fit AI. Choose an app category above, then describe your app idea.",
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModel>("claude-sonnet-4.5");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [codeHistory, setCodeHistory] = useState<CodeChange[]>([]);
  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set());
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
      setTimeout(() => {
        handleSubmitWithPrompt(initialPrompt);
      }, 500);
    }
  }, [initialPrompt]);

  // Handle "Fix with AI" - auto-trigger when pendingFixError is set
  useEffect(() => {
    if (pendingFixError && !isGenerating) {
      const codeToFix = externalCode || currentCode;
      
      const fixPrompt = `Fix this error in my React Native code:

ERROR: ${pendingFixError}

IMPORTANT: Return ONLY the fixed code. Verify ALL commas and brackets are correct.`;
      
      const fixMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Fix error: ${pendingFixError.split('\n')[0].substring(0, 50)}...`,
        type: "text",
      };
      setMessages((prev) => [...prev, fixMessage]);
      
      handleSubmitWithPrompt(fixPrompt);
      
      if (onFixErrorHandled) {
        onFixErrorHandled();
      }
    }
  }, [pendingFixError]);

  // Toggle change expansion
  const toggleChangeExpanded = (changeId: string) => {
    setExpandedChanges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(changeId)) {
        newSet.delete(changeId);
      } else {
        newSet.add(changeId);
      }
      return newSet;
    });
  };

  // Restore to a previous version
  const handleRestore = (change: CodeChange) => {
    if (change.code) {
      setCurrentCode(change.code);
      onCodeGenerated(change.code);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: `Restored to: ${change.description}`,
        type: "text",
      }]);
    }
  };

  // Rerun a change
  const handleRerun = (change: CodeChange) => {
    if (change.previousCode) {
      setCurrentCode(change.previousCode);
      // Find the user message that triggered this change and resubmit
      const userMessageIndex = messages.findIndex(
        m => m.codeChange?.id === change.id
      );
      if (userMessageIndex > 0) {
        const prevMessage = messages[userMessageIndex - 1];
        if (prevMessage.role === "user") {
          handleSubmitWithPrompt(prevMessage.content);
        }
      }
    }
  };

  const handleSubmitWithPrompt = async (promptText: string) => {
    if (!promptText.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: promptText,
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    try {
      const conversationHistory = messages
        .filter((m) => m.id !== "1" && m.type === "text")
        .map((m) => ({ role: m.role, content: m.content }));

      const enhancedUserPrompt = currentCode
        ? promptText
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

      if (response.status === 429) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: `${data.error}\n\nUpgrade to Pro for unlimited generations!`,
            type: "text",
          },
        ]);
        setIsGenerating(false);
        return;
      }

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

            // Show preview while streaming
            if (fullCode.includes("__CLEAN_CODE__")) {
              const cleanCode = fullCode.split("__CLEAN_CODE__")[1].trim();
              onCodeGenerated(cleanCode);
            } else {
              let previewCode = extractCode(fullCode);
              onCodeGenerated(previewCode);
            }
          }

          if (fullCode) {
            // Extract and clean code
            let cleanCode = extractCode(fullCode);
            
            // Validate code
            const validation = validateCode(cleanCode);
            
            // Try auto-fix if there are errors
            if (!validation.valid) {
              const { code: fixedCode, fixes } = tryAutoFix(cleanCode);
              if (fixes.length > 0) {
                cleanCode = fixedCode;
                console.log("Auto-fixed issues:", fixes);
              }
            }

            const previousCode = currentCode;
            setCurrentCode(cleanCode);
            onCodeGenerated(cleanCode);

            // Create code change record
            const changeId = Date.now().toString();
            const codeChange: CodeChange = {
              id: changeId,
              timestamp: new Date(),
              description: currentCode 
                ? `Updated: ${promptText.substring(0, 50)}${promptText.length > 50 ? '...' : ''}`
                : `Created ${selectedCategory?.name || 'Custom'} app`,
              files: [
                { name: "App.js", action: currentCode ? "edited" : "created" },
              ],
              code: cleanCode,
              previousCode: previousCode || undefined,
            };

            // Add to history
            setCodeHistory(prev => [...prev, codeChange]);

            // Expand the new change by default
            setExpandedChanges(prev => new Set([...prev, changeId]));

            // Check validation status for message
            const revalidation = validateCode(cleanCode);
            const hasWarnings = revalidation.warnings.length > 0;
            const hasErrors = !revalidation.valid;

            // Add assistant message with code change
            const assistantMessage: Message = {
              id: changeId,
              role: "assistant",
              content: hasErrors 
                ? "Code generated but has some issues. Click 'Fix with AI' if you see errors."
                : currentCode 
                  ? "Updated successfully!" 
                  : "App created successfully!",
              type: "code-change",
              codeChange,
            };

            setMessages((prev) => [...prev, assistantMessage]);
            refreshUsage();
          }
        }
      } else if (response.ok) {
        const data = await response.json();
        if (data.code) {
          setCurrentCode(data.code);
          onCodeGenerated(data.code);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: "Done! Check the preview.",
              type: "text",
            },
          ]);
        } else if (data.error) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: `Error: ${data.error}`,
              type: "text",
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
          type: "text",
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
        content: "Hi! I'm 24fit AI. Choose an app category above, then describe your app idea.",
        type: "text",
      },
    ]);
    setCurrentCode("");
    setCodeHistory([]);
    setExpandedChanges(new Set());
    setSelectedCategory(null);
  };

  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
  };

  // Render code change card (like Rork)
  const renderCodeChange = (message: Message) => {
    const change = message.codeChange;
    if (!change) return null;

    const isExpanded = expandedChanges.has(change.id);

    return (
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden">
        {/* Header - always visible */}
        <button
          onClick={() => toggleChangeExpanded(change.id)}
          className="w-full flex items-center gap-3 p-3 hover:bg-[#222] transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{change.description}</p>
            <p className="text-xs text-gray-500">
              {change.files.length} file{change.files.length > 1 ? 's' : ''} changed
            </p>
          </div>
          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t border-[#333]">
            {/* Files list */}
            <div className="p-3 space-y-2">
              {change.files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${
                    file.action === 'created' ? 'bg-green-400' :
                    file.action === 'edited' ? 'bg-blue-400' : 'bg-red-400'
                  }`} />
                  <FileCode className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{file.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{file.action}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 p-3 pt-0">
              <button
                onClick={() => handleRestore(change)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#222] hover:bg-[#333] rounded-lg transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Restore
              </button>
              {change.previousCode && (
                <button
                  onClick={() => handleRerun(change)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#222] hover:bg-[#333] rounded-lg transition-colors"
                >
                  <RotateCw className="w-3 h-3" />
                  Rerun
                </button>
              )}
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#222] hover:bg-[#333] rounded-lg transition-colors"
              >
                <Code className="w-3 h-3" />
                Code
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#222] hover:bg-[#333] rounded-lg transition-colors"
              >
                <Share2 className="w-3 h-3" />
                Share
              </button>
            </div>
          </div>
        )}
      </div>
    );
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
          <div key={message.id}>
            {message.type === "code-change" ? (
              renderCodeChange(message)
            ) : (
              <div className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
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
            )}
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
                Generating {selectedCategory?.name?.toLowerCase() || "your"} app...
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
