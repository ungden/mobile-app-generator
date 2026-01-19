"use client";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";
import { Code2, Smartphone, Loader2 } from "lucide-react";
import { useState } from "react";

interface CodePreviewProps {
  code: string;
  isGenerating: boolean;
}

export default function CodePreview({ code, isGenerating }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Tabs */}
      <div className="flex border-b border-[#222]">
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

      {/* Content */}
      <div className="flex-1 relative">
        {isGenerating && (
          <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-sm text-gray-400">Generating your app...</p>
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
          }}
        >
          <SandpackLayout
            style={{
              height: "100%",
              border: "none",
              borderRadius: 0,
              background: "transparent",
            }}
          >
            {activeTab === "preview" ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <div className="relative w-[375px] h-[667px] bg-black rounded-[3rem] border-4 border-[#333] shadow-2xl overflow-hidden">
                  {/* Phone notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
                  {/* Screen */}
                  <div className="w-full h-full overflow-hidden rounded-[2.5rem]">
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
