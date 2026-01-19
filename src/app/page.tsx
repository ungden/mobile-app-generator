"use client";

import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import CodePreview from "@/components/CodePreview";
import { defaultAppCode } from "@/lib/templates";
import { Sparkles, Github, ExternalLink } from "lucide-react";

export default function Home() {
  const [code, setCode] = useState(defaultAppCode);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCodeGenerated = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="h-14 border-b border-[#222] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">AppForge AI</span>
          <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
            Beta
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <ExternalLink className="w-4 h-4" />
            Export App
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-[400px] border-r border-[#222] flex-shrink-0">
          <ChatPanel
            onCodeGenerated={handleCodeGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        </div>

        {/* Code Preview */}
        <div className="flex-1">
          <CodePreview code={code} isGenerating={isGenerating} />
        </div>
      </div>
    </div>
  );
}
