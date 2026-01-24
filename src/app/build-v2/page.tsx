"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useToast } from "@/components/Toast";
import {
  ArrowLeft,
  Download,
  Save,
  Share2,
  QrCode,
  X,
  Loader2,
  Sparkles,
  Send,
  RotateCcw,
  FileCode,
  ChevronRight,
  FolderTree,
  Smartphone,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Code,
  Eye,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  createSnackProject,
  generateSnackUrls,
  getDefaultSnackProject,
  SnackProject,
  SnackUrls,
} from "@/lib/snack-service";
import { downloadAsExpoProject } from "@/lib/export";

// Message types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  changes?: FileChange[];
  isExpanded?: boolean;
}

interface FileChange {
  path: string;
  action: "created" | "edited" | "deleted";
}

interface ProjectState {
  name: string;
  files: Record<string, string>;
  dependencies: Record<string, string>;
}

function BuildV2Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const projectId = searchParams.get("project");

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // State
  const [projectState, setProjectState] = useState<ProjectState>(() => {
    const defaultProject = getDefaultSnackProject();
    const files: Record<string, string> = {};
    for (const [path, file] of Object.entries(defaultProject.files)) {
      files[path] = file.contents;
    }
    return {
      name: "My App",
      files,
      dependencies: defaultProject.dependencies,
    };
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm 24fit AI. Describe the app you want to build and I'll create a complete multi-file project for you with screens, components, and navigation!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showFilesPanel, setShowFilesPanel] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string>("App.js");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [projectName, setProjectName] = useState("My App");
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(
    projectId
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(!!projectId);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [snackUrls, setSnackUrls] = useState<SnackUrls | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);

  // Generate Snack URLs when project changes
  useEffect(() => {
    const snackProject = createSnackProject(
      projectName,
      projectState.files,
      projectState.dependencies,
      "Built with 24fit"
    );
    const urls = generateSnackUrls(snackProject);
    setSnackUrls(urls);
  }, [projectState, projectName]);

  // Load project if ID provided
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
        router.replace("/build-v2");
        return;
      }

      const project = data.project;
      setProjectName(project.name || "My App");
      setCurrentProjectId(project.id);

      // Load multi-file project or legacy single file
      if (project.files) {
        // Convert from stored format to our format
        const files: Record<string, string> = {};
        for (const [path, file] of Object.entries(project.files)) {
          files[path] = (file as any).contents || (file as string);
        }
        setProjectState({
          name: project.name,
          files,
          dependencies: project.dependencies || {},
        });
      } else if (project.code) {
        // Legacy single file - create basic project structure
        setProjectState({
          name: project.name,
          files: { "App.js": project.code },
          dependencies: {},
        });
      }

      setPreviewKey((k) => k + 1);
    } catch (error) {
      console.error("Failed to load project:", error);
      showToast("Failed to load project", "error");
    } finally {
      setIsLoadingProject(false);
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle form submit - Call /api/generate
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);
    setIsPreviewLoading(true);

    try {
      // Determine if this is a new app or modification
      const hasExistingApp =
        Object.keys(projectState.files).length > 1 ||
        (projectState.files["App.js"] &&
          !projectState.files["App.js"].includes("Welcome to 24fit"));

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          existingFiles: hasExistingApp ? projectState.files : undefined,
          isModification: hasExistingApp,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate app");
      }

      // Extract the generated app
      const { app, message } = data;

      if (!app || !app.files) {
        throw new Error("Invalid response from AI");
      }

      // Calculate file changes
      const changes: FileChange[] = [];
      const oldFiles = projectState.files;
      const newFiles = app.files;

      // Check for new/modified files
      for (const path of Object.keys(newFiles)) {
        if (!oldFiles[path]) {
          changes.push({ path, action: "created" });
        } else if (oldFiles[path] !== newFiles[path]) {
          changes.push({ path, action: "edited" });
        }
      }

      // Check for deleted files
      for (const path of Object.keys(oldFiles)) {
        if (!newFiles[path]) {
          changes.push({ path, action: "deleted" });
        }
      }

      // Update project state
      setProjectState({
        name: app.appName || projectName,
        files: newFiles,
        dependencies: app.dependencies || {},
      });

      if (app.appName) {
        setProjectName(app.appName);
      }

      // Refresh preview
      setPreviewKey((k) => k + 1);

      // Add assistant message with changes
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          message ||
          `Done! I've created "${app.appName}" with ${Object.keys(newFiles).length} files.`,
        changes: changes.length > 0 ? changes : undefined,
        isExpanded: true,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Show toast for changes
      if (changes.length > 0) {
        const created = changes.filter((c) => c.action === "created").length;
        const edited = changes.filter((c) => c.action === "edited").length;
        const parts = [];
        if (created > 0) parts.push(`${created} created`);
        if (edited > 0) parts.push(`${edited} updated`);
        showToast(`Files: ${parts.join(", ")}`, "success");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Error: ${error.message || "Something went wrong. Please try again."}`,
        },
      ]);
      showToast("Generation failed", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle message expansion
  const toggleMessageExpanded = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, isExpanded: !m.isExpanded } : m
      )
    );
  };

  // Reset project
  const handleReset = () => {
    const defaultProject = getDefaultSnackProject();
    const files: Record<string, string> = {};
    for (const [path, file] of Object.entries(defaultProject.files)) {
      files[path] = file.contents;
    }
    setProjectState({
      name: "My App",
      files,
      dependencies: defaultProject.dependencies,
    });
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Project reset! Describe the app you want to build.",
      },
    ]);
    setCurrentProjectId(null);
    setProjectName("My App");
    setSelectedFile("App.js");
    setPreviewKey((k) => k + 1);
    router.replace("/build-v2");
  };

  // Save project
  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      // Convert files to storage format
      const filesForStorage: Record<string, { contents: string }> = {};
      for (const [path, contents] of Object.entries(projectState.files)) {
        filesForStorage[path] = { contents };
      }

      const isUpdate = !!currentProjectId;
      const response = await fetch("/api/projects", {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentProjectId,
          name: projectName,
          files: filesForStorage,
          dependencies: projectState.dependencies,
          version: 2, // Mark as multi-file project
        }),
      });

      const data = await response.json();
      if (data.error) {
        if (data.error === "Unauthorized") {
          window.location.href = "/login?redirect=/build-v2";
        } else {
          showToast(data.error, "error");
        }
      } else {
        if (!currentProjectId && data.project?.id) {
          setCurrentProjectId(data.project.id);
          window.history.replaceState(
            {},
            "",
            `/build-v2?project=${data.project.id}`
          );
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

  // Download project
  const handleDownload = async () => {
    const appCode = projectState.files["App.js"] || "";
    await downloadAsExpoProject(appCode, projectName);
    setShowDownloadMenu(false);
    showToast("Project downloaded!", "success");
  };

  // Refresh preview
  const handleRefreshPreview = () => {
    setIsPreviewLoading(true);
    setPreviewKey((k) => k + 1);
  };

  // Create new file
  const handleCreateFile = () => {
    const fileName = prompt("Enter file name (e.g., screens/NewScreen.js):");
    if (fileName) {
      const defaultContent = fileName.includes("Screen")
        ? `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ${fileName.split("/").pop()?.replace(".js", "")}() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>New Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});
`
        : `// ${fileName}\n`;

      setProjectState((prev) => ({
        ...prev,
        files: {
          ...prev.files,
          [fileName]: defaultContent,
        },
      }));
      setSelectedFile(fileName);
      setActiveTab("code");
      setPreviewKey((k) => k + 1);
    }
  };

  // Delete file
  const handleDeleteFile = (path: string) => {
    if (path === "App.js") {
      showToast("Cannot delete App.js", "error");
      return;
    }
    if (confirm(`Delete ${path}?`)) {
      setProjectState((prev) => {
        const newFiles = { ...prev.files };
        delete newFiles[path];
        return { ...prev, files: newFiles };
      });
      if (selectedFile === path) {
        setSelectedFile("App.js");
      }
      setPreviewKey((k) => k + 1);
    }
  };

  // Update file content
  const handleFileContentChange = (content: string) => {
    setProjectState((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [selectedFile]: content,
      },
    }));
  };

  // Render file change card
  const renderFileChanges = (message: Message) => {
    if (!message.changes || message.changes.length === 0) return null;

    return (
      <div className="mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden">
        <button
          onClick={() => toggleMessageExpanded(message.id)}
          className="w-full flex items-center gap-3 p-3 hover:bg-[#222] transition-colors text-left"
        >
          <FileCode className="w-4 h-4 text-purple-400" />
          <span className="flex-1 text-sm">
            {message.changes.length} file(s) changed
          </span>
          <ChevronRight
            className={`w-4 h-4 text-gray-400 transition-transform ${
              message.isExpanded ? "rotate-90" : ""
            }`}
          />
        </button>

        {message.isExpanded && (
          <div className="border-t border-[#333] p-3 space-y-2">
            {message.changes.map((change, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[#222] p-2 rounded-lg"
                onClick={() => {
                  setSelectedFile(change.path);
                  setActiveTab("code");
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    change.action === "created"
                      ? "bg-green-400"
                      : change.action === "edited"
                        ? "bg-blue-400"
                        : "bg-red-400"
                  }`}
                />
                <span className="text-gray-300 font-mono text-xs">
                  {change.path}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {change.action}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Organize files into tree structure
  const getFileTree = () => {
    const files = Object.keys(projectState.files).sort();
    const tree: {
      path: string;
      name: string;
      isFolder: boolean;
      depth: number;
    }[] = [];
    const folders = new Set<string>();

    // First pass: collect all folders
    files.forEach((path) => {
      const parts = path.split("/");
      if (parts.length > 1) {
        folders.add(parts[0]);
      }
    });

    // Add folders and their files
    Array.from(folders)
      .sort()
      .forEach((folder) => {
        tree.push({ path: folder, name: folder, isFolder: true, depth: 0 });
        files
          .filter((f) => f.startsWith(folder + "/"))
          .forEach((f) => {
            tree.push({
              path: f,
              name: f.split("/").pop()!,
              isFolder: false,
              depth: 1,
            });
          });
      });

    // Add root-level files
    files
      .filter((f) => !f.includes("/"))
      .forEach((f) => {
        tree.push({ path: f, name: f, isFolder: false, depth: 0 });
      });

    return tree;
  };

  // Loading state
  if (isLoadingProject) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-3" />
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

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
          {/* File count indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-[#1a1a1a] px-3 py-1.5 rounded-lg">
            <FileCode className="w-3 h-3" />
            {Object.keys(projectState.files).length} files
          </div>

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
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </button>

          {/* Download button */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            {showDownloadMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDownloadMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50">
                  <button
                    onClick={handleDownload}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-[#222] transition-colors rounded-lg"
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

          {/* Files panel toggle */}
          <button
            onClick={() => setShowFilesPanel(!showFilesPanel)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              showFilesPanel
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            title="Show files"
          >
            <FolderTree className="w-4 h-4" />
          </button>

          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Publish</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-[400px] border-r border-[#222] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#222]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI Assistant
              </h2>
              <button
                onClick={handleReset}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#222] rounded-lg transition-colors"
                title="Reset project"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
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
                      <span className="text-xs">You</span>
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
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
                {message.role === "assistant" && renderFileChanges(message)}
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
                placeholder="Describe your app or changes..."
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
          </form>
        </div>

        {/* Preview / Code Panel */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="h-12 border-b border-[#222] flex items-center px-4 gap-4">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeTab === "preview"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeTab === "code"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Code className="w-4 h-4" />
              Code
            </button>

            {/* Refresh preview */}
            {activeTab === "preview" && (
              <button
                onClick={handleRefreshPreview}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-400 transition-colors"
                title="Refresh preview"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isPreviewLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            )}

            {/* Open in Snack link */}
            {snackUrls && (
              <a
                href={snackUrls.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-purple-400 transition-colors"
              >
                Open in Expo Snack
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Files Panel (collapsible) */}
            {showFilesPanel && (
              <div className="w-52 border-r border-[#222] overflow-y-auto bg-[#0d0d0d] flex flex-col">
                <div className="p-3 border-b border-[#222] flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase">
                    Files
                  </h3>
                  <button
                    onClick={handleCreateFile}
                    className="p-1 text-gray-400 hover:text-white hover:bg-[#222] rounded"
                    title="New file"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 p-2 space-y-0.5">
                  {getFileTree().map((item) => (
                    <div
                      key={item.path}
                      className={`group flex items-center gap-1 px-2 py-1.5 rounded text-sm font-mono transition-colors ${
                        item.isFolder
                          ? "text-gray-500 cursor-default"
                          : selectedFile === item.path
                            ? "bg-purple-600/20 text-purple-400"
                            : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white cursor-pointer"
                      }`}
                      style={{ paddingLeft: `${8 + item.depth * 12}px` }}
                      onClick={() => {
                        if (!item.isFolder) {
                          setSelectedFile(item.path);
                          setActiveTab("code");
                        }
                      }}
                    >
                      <span className="truncate flex-1">
                        {item.isFolder ? `${item.name}/` : item.name}
                      </span>
                      {!item.isFolder && item.path !== "App.js" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(item.path);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main content area */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "preview" ? (
                <div className="w-full h-full flex items-center justify-center p-4 overflow-auto bg-[#111]">
                  <div
                    className="relative bg-black border-4 border-[#333] shadow-2xl overflow-hidden"
                    style={{
                      width: 393,
                      height: 852,
                      borderRadius: "3rem",
                    }}
                  >
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-10" />

                    {/* Screen */}
                    <div
                      className="w-full h-full overflow-hidden relative"
                      style={{ borderRadius: "calc(3rem - 4px)" }}
                    >
                      {/* Loading overlay */}
                      {isPreviewLoading && (
                        <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center z-20">
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">
                              Loading preview...
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Snack iframe */}
                      {snackUrls && (
                        <iframe
                          ref={iframeRef}
                          key={previewKey}
                          src={snackUrls.embedUrl}
                          className="w-full h-full border-0"
                          style={{ background: "#0a0a0a" }}
                          onLoad={() => setIsPreviewLoading(false)}
                          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                        />
                      )}
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {/* File name header */}
                  <div className="h-10 bg-[#1a1a1a] border-b border-[#333] flex items-center px-4">
                    <span className="text-sm font-mono text-gray-400">
                      {selectedFile}
                    </span>
                  </div>

                  {/* Code editor */}
                  <div className="flex-1 overflow-hidden">
                    <textarea
                      value={projectState.files[selectedFile] || ""}
                      onChange={(e) => handleFileContentChange(e.target.value)}
                      className="w-full h-full bg-[#0d0d0d] text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none"
                      spellCheck={false}
                      style={{ tabSize: 2 }}
                    />
                  </div>

                  {/* Update preview button */}
                  <div className="h-12 bg-[#1a1a1a] border-t border-[#333] flex items-center justify-end px-4">
                    <button
                      onClick={handleRefreshPreview}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Update Preview
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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
              {snackUrls?.qrCodeUrl ? (
                <QRCodeSVG value={snackUrls.qrCodeUrl} size={200} />
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Preview not ready yet
                </div>
              )}
            </div>

            <div className="text-sm text-gray-400 space-y-2">
              <p className="font-medium text-white">To test on your phone:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Install Expo Go from App Store / Play Store</li>
                <li>Open the Expo Go app</li>
                <li>Scan the QR code above</li>
              </ol>
            </div>

            <div className="mt-4 pt-4 border-t border-[#222]">
              {snackUrls && (
                <a
                  href={snackUrls.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                >
                  Or open in Expo Snack
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuildV2Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <BuildV2Content />
    </Suspense>
  );
}
