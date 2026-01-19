"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ChatPanel from "@/components/ChatPanel";
import CodePreview from "@/components/CodePreview";
import { defaultAppCode } from "@/lib/templates";
import { downloadAsFile, downloadAsExpoProject } from "@/lib/export";
import {
  Sparkles,
  ArrowLeft,
  Download,
  ChevronDown,
  Save,
  Share2,
  QrCode,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

function BuildContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";

  const [code, setCode] = useState(defaultAppCode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [projectName, setProjectName] = useState("My App");
  const [isSaving, setIsSaving] = useState(false);

  const handleCodeGenerated = (newCode: string) => {
    setCode(newCode);
  };

  const handleDownload = async (type: "js" | "zip") => {
    if (type === "js") {
      downloadAsFile(code, "App.js");
    } else {
      await downloadAsExpoProject(code, projectName);
    }
    setShowDownloadMenu(false);
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          code,
        }),
      });

      const data = await response.json();
      if (data.error) {
        if (data.error === "Unauthorized") {
          // Redirect to login
          window.location.href = "/login?redirect=/build";
        } else {
          alert(data.error);
        }
      } else {
        alert("Project saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Create a Snack URL for Expo Go preview
  const getSnackUrl = () => {
    const encodedCode = encodeURIComponent(code);
    return `https://snack.expo.dev/?code=${encodedCode}&name=${encodeURIComponent(projectName)}`;
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
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-transparent text-lg font-bold focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-1 max-w-[200px]"
              placeholder="Project Name"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* QR Code button */}
          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
            title="Test on phone"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Save button */}
          <button
            onClick={handleSaveProject}
            disabled={isSaving}
            className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            title="Save project"
          >
            <Save className="w-4 h-4" />
          </button>

          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showDownloadMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDownloadMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50">
                  <button
                    onClick={() => handleDownload("js")}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-[#222] transition-colors rounded-t-lg"
                  >
                    <div className="font-medium">Download App.js</div>
                    <div className="text-xs text-gray-500">Just the code file</div>
                  </button>
                  <button
                    onClick={() => handleDownload("zip")}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-[#222] transition-colors rounded-b-lg border-t border-[#333]"
                  >
                    <div className="font-medium">Download Expo Project</div>
                    <div className="text-xs text-gray-500">
                      Full project ready to build
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Publish</span>
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

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Test on your phone</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl mb-4 flex justify-center">
              <QRCodeSVG value={getSnackUrl()} size={200} />
            </div>

            <div className="text-sm text-gray-400 space-y-2">
              <p className="font-medium text-white">To test on your device:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Install Expo Go app from App Store / Play Store</li>
                <li>Open your camera and scan the QR code</li>
                <li>The app will open in Expo Go</li>
              </ol>
            </div>

            <div className="mt-4 pt-4 border-t border-[#222]">
              <a
                href={getSnackUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                Or open in Expo Snack →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuildPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <BuildContent />
    </Suspense>
  );
}
