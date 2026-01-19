"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ChatPanel from "@/components/ChatPanel";
import CodePreview from "@/components/CodePreview";
import { defaultAppCode } from "@/lib/templates";
import { Sparkles, ArrowLeft, Download, ChevronDown } from "lucide-react";

function BuildContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  
  const [code, setCode] = useState(defaultAppCode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const handleCodeGenerated = (newCode: string) => {
    setCode(newCode);
  };

  const downloadCode = (type: "js" | "zip") => {
    if (type === "js") {
      const blob = new Blob([code], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "App.js";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // TODO: Implement zip download with full Expo project
      alert("Expo project download coming soon!");
    }
    setShowDownloadMenu(false);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="h-14 border-b border-[#222] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Back</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">AppForge</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50">
                <button
                  onClick={() => downloadCode("js")}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#222] transition-colors rounded-t-lg"
                >
                  Download App.js
                </button>
                <button
                  onClick={() => downloadCode("zip")}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#222] transition-colors rounded-b-lg border-t border-[#333]"
                >
                  Download Expo Project
                </button>
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Publish
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
            initialPrompt={initialPrompt}
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

export default function BuildPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    }>
      <BuildContent />
    </Suspense>
  );
}
