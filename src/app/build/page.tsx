"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import ChatPanel from "@/components/ChatPanel";
import CodePreview from "@/components/CodePreview";
import { defaultAppCode } from "@/lib/templates";
import { downloadAsFile, downloadAsExpoProject } from "@/lib/export";
import { useToast } from "@/components/Toast";
import {
  ArrowLeft,
  Download,
  ChevronDown,
  Save,
  Share2,
  QrCode,
  X,
  Loader2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

function BuildContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const initialPrompt = searchParams.get("prompt") || "";
  const projectId = searchParams.get("project");
  const initialCategory = searchParams.get("category") || "";

  const [code, setCode] = useState(defaultAppCode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [projectName, setProjectName] = useState("My App");
  const [isSaving, setIsSaving] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(projectId);
  const [isLoadingProject, setIsLoadingProject] = useState(!!projectId);
  const [pendingFixError, setPendingFixError] = useState<string | null>(null);

  // Load project if ID is provided
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    setIsLoadingProject(true);
    try {
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();

      if (data.error) {
        console.error("Failed to load project:", data.error);
        // Redirect to build without project ID if not found
        router.replace("/build");
        return;
      }

      setCode(data.project.code);
      setProjectName(data.project.name || "My App");
      setCurrentProjectId(data.project.id);
    } catch (error) {
      console.error("Failed to load project:", error);
    } finally {
      setIsLoadingProject(false);
    }
  };

  const handleCodeGenerated = (newCode: string) => {
    setCode(newCode);
    setPendingFixError(null); // Clear any pending fix when new code is generated
  };

  // Handle fix error request from CodePreview
  const handleFixError = (error: string) => {
    setPendingFixError(error);
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
      // If we have a project ID, update it. Otherwise, create new.
      const isUpdate = !!currentProjectId;
      const response = await fetch("/api/projects", {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentProjectId,
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
          showToast(data.error, "error");
        }
      } else {
        // Update the current project ID if this was a new project
        if (!currentProjectId && data.project?.id) {
          setCurrentProjectId(data.project.id);
          // Update URL without reload
          window.history.replaceState({}, "", `/build?project=${data.project.id}`);
        }
        showToast(isUpdate ? "Project updated!" : "Project saved!", "success");
      }
    } catch (error) {
      console.error("Failed to save:", error);
      showToast("Failed to save project", "error");
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

          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
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
        {isLoadingProject ? (
          <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-3" />
              <p className="text-gray-400">Loading project...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Panel */}
            <div className="w-[400px] border-r border-[#222] flex-shrink-0">
              <ChatPanel
                onCodeGenerated={handleCodeGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                initialPrompt={initialPrompt}
                initialCategory={initialCategory}
                currentCode={code}
                pendingFixError={pendingFixError}
                onFixErrorHandled={() => setPendingFixError(null)}
              />
            </div>

            {/* Code Preview */}
            <div className="flex-1">
              <CodePreview 
                code={code} 
                isGenerating={isGenerating} 
                onFixError={handleFixError}
              />
            </div>
          </>
        )}
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
