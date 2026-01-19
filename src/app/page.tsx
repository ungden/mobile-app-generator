"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, Globe, ChevronDown, Sparkles } from "lucide-react";

// AI Models available
const AI_MODELS = [
  { id: "claude-sonnet-4", name: "Sonnet 4", icon: "sparkles" },
  { id: "claude-opus-4", name: "Opus 4", icon: "sparkles" },
  { id: "gpt-4o", name: "GPT-4o", icon: "sparkles" },
  { id: "gemini-pro", name: "Gemini Pro", icon: "sparkles" },
  { id: "gemini-flash", name: "Gemini Flash", icon: "sparkles" },
];

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    router.push(`/build?prompt=${encodeURIComponent(prompt)}&model=${selectedModel.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Minimal Navigation */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white" />
          <span className="text-lg font-semibold tracking-tight">24fit</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/faq" className="hover:text-white transition-colors">
            FAQ
          </Link>
          <Link href="https://twitter.com/24fit" className="hover:text-white transition-colors">
            X
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
        </div>

        <Link 
          href="/login"
          className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </Link>
      </nav>

      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-3 tracking-tight">
          Build native mobile apps, fast.
        </h1>
        
        <p className="text-gray-400 text-center mb-12 text-lg">
          24fit builds complete, cross-platform mobile apps using AI and Expo (React Native).
        </p>

        {/* Main Input Card */}
        <div className="w-full max-w-2xl">
          <div className="bg-[#141414] rounded-2xl border border-[#2a2a2a] overflow-hidden">
            {/* Textarea */}
            <div className="p-4">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe the mobile app you want to build..."
                className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-base leading-relaxed min-h-[60px]"
                rows={1}
              />
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                {/* Attachment button */}
                <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </button>

                {/* Model Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>{selectedModel.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  {showModelDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowModelDropdown(false)}
                      />
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden">
                        {AI_MODELS.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model);
                              setShowModelDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center gap-2 ${
                              selectedModel.id === model.id ? "text-white bg-white/5" : "text-gray-400"
                            }`}
                          >
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            {model.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Public/Private Toggle */}
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{isPublic ? "Public" : "Private"}</span>
                </button>

                {/* Voice Input */}
                <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              "A fitness app with workout tracking",
              "E-commerce app with cart",
              "Social media feed",
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-gray-600">
          Press Enter to generate • Powered by AI
        </p>
      </footer>
    </div>
  );
}
