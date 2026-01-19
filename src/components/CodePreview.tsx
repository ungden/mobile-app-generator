"use client";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";
import { Code2, Smartphone, Loader2, Tablet, AlertTriangle, Sparkles, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface CodePreviewProps {
  code: string;
  isGenerating: boolean;
  onFixError?: (error: string) => void;
}

type DeviceType = "iphone15" | "iphoneSE" | "pixel" | "ipad";

const devices: {
  id: DeviceType;
  name: string;
  width: number;
  height: number;
  notch: boolean;
  borderRadius: string;
  icon: typeof Smartphone;
}[] = [
  {
    id: "iphone15",
    name: "iPhone 15",
    width: 393,
    height: 852,
    notch: true,
    borderRadius: "3rem",
    icon: Smartphone,
  },
  {
    id: "iphoneSE",
    name: "iPhone SE",
    width: 375,
    height: 667,
    notch: false,
    borderRadius: "2.5rem",
    icon: Smartphone,
  },
  {
    id: "pixel",
    name: "Pixel 7",
    width: 412,
    height: 915,
    notch: false,
    borderRadius: "2rem",
    icon: Smartphone,
  },
  {
    id: "ipad",
    name: "iPad",
    width: 820,
    height: 1180,
    notch: false,
    borderRadius: "1.5rem",
    icon: Tablet,
  },
];

// Error listener component inside Sandpack
function ErrorListener({ onError }: { onError: (error: string | null) => void }) {
  const { sandpack } = useSandpack();
  
  useEffect(() => {
    const errors = sandpack.error;
    if (errors) {
      onError(errors.message || String(errors));
    } else {
      onError(null);
    }
  }, [sandpack.error, onError]);

  return null;
}

export default function CodePreview({ code, isGenerating, onFixError }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("iphone15");
  const [error, setError] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  const device = devices.find((d) => d.id === selectedDevice) || devices[0];
  
  // Scale device to fit in viewport
  const maxHeight = 700;
  const scale = device.height > maxHeight ? maxHeight / device.height : 1;
  const scaledWidth = device.width * scale;
  const scaledHeight = device.height * scale;

  const handleError = useCallback((err: string | null) => {
    setError(err);
  }, []);

  const handleFixWithAI = () => {
    if (error && onFixError) {
      setIsFixing(true);
      onFixError(error);
      // Reset after triggering fix
      setTimeout(() => setIsFixing(false), 1000);
    }
  };

  // Format error with line numbers highlighted
  const formatError = (fullError: string) => {
    // Extract line number if present
    const lineMatch = fullError.match(/\((\d+):(\d+)\)/);
    const syntaxMatch = fullError.match(/SyntaxError:[^:]*:\s*(.+)/);
    
    if (lineMatch) {
      const line = lineMatch[1];
      const col = lineMatch[2];
      const message = syntaxMatch ? syntaxMatch[1] : fullError.split('\n')[0];
      
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-red-500/20 rounded text-red-400">
              Line {line}:{col}
            </span>
            <span>{message}</span>
          </div>
        </div>
      );
    }
    
    // Fallback: first line
    const firstLine = fullError.split('\n')[0];
    return <span>{firstLine.length > 150 ? firstLine.slice(0, 150) + '...' : firstLine}</span>;
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#222] px-2">
        <div className="flex">
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "preview"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Preview
            {error && <span className="w-2 h-2 rounded-full bg-red-500" />}
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "code"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Code
          </button>
        </div>

        {/* Device Selector */}
        {activeTab === "preview" && (
          <div className="flex items-center gap-1">
            {devices.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDevice(d.id)}
                className={`p-2 rounded-lg transition-colors ${
                  selectedDevice === d.id
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-gray-500 hover:text-gray-300 hover:bg-[#222]"
                }`}
                title={d.name}
              >
                <d.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && !isGenerating && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-400">Error detected</p>
              <div className="mt-2 bg-red-500/10 rounded-lg p-2 font-mono text-xs text-red-300/80 overflow-x-auto">
                {formatError(error)}
              </div>
            </div>
            <button
              onClick={handleFixWithAI}
              disabled={isFixing || isGenerating}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
            >
              {isFixing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fixing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Fix with AI
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {isGenerating && (
          <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-sm text-gray-400">
                {isFixing ? "Fixing errors..." : "Generating your app..."}
              </p>
            </div>
          </div>
        )}

        <SandpackProvider
          template="react"
          theme={nightOwl}
          files={{
            "/App.js": code,
            "/index.js": `import { AppRegistry } from 'react-native';
import App from './App';
AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', { rootTag: document.getElementById('root') });`,
          }}
          customSetup={{
            dependencies: {
              "react-native-web": "^0.19.10",
            },
            entry: "/index.js",
          }}
          options={{
            externalResources: [
              "https://unpkg.com/react-native-web@0.19.10/dist/index.js",
            ],
            recompileMode: "delayed",
            recompileDelay: 1000,
            autorun: !isGenerating,
            autoReload: false,
          }}
        >
          <ErrorListener onError={handleError} />
          <SandpackLayout
            style={{
              height: "100%",
              border: "none",
              borderRadius: 0,
              background: "transparent",
            }}
          >
            {activeTab === "preview" ? (
              <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                <div
                  className="relative bg-black border-4 border-[#333] shadow-2xl overflow-hidden transition-all duration-300"
                  style={{
                    width: scaledWidth,
                    height: scaledHeight,
                    borderRadius: device.borderRadius,
                  }}
                >
                  {/* Dynamic Island / Notch for iPhone */}
                  {device.notch && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-10" />
                  )}

                  {/* Screen */}
                  <div
                    className="w-full h-full overflow-hidden"
                    style={{
                      borderRadius: `calc(${device.borderRadius} - 4px)`,
                    }}
                  >
                    <SandpackPreview
                      showNavigator={false}
                      showOpenInCodeSandbox={false}
                      showRefreshButton={false}
                      style={{
                        height: "100%",
                        border: "none",
                        background: "#0a0a0a",
                      }}
                    />
                  </div>

                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
                </div>

                {/* Device name label */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                  {device.name}
                </div>
              </div>
            ) : (
              <SandpackCodeEditor
                showLineNumbers
                showTabs={false}
                style={{
                  height: "100%",
                  flex: 1,
                }}
              />
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}
