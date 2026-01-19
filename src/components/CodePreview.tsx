"use client";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";
import { Code2, Smartphone, Loader2, Tablet, Monitor } from "lucide-react";
import { useState } from "react";

interface CodePreviewProps {
  code: string;
  isGenerating: boolean;
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

export default function CodePreview({ code, isGenerating }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("iphone15");

  const device = devices.find((d) => d.id === selectedDevice) || devices[0];
  
  // Scale device to fit in viewport
  const maxHeight = 700;
  const scale = device.height > maxHeight ? maxHeight / device.height : 1;
  const scaledWidth = device.width * scale;
  const scaledHeight = device.height * scale;

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

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
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
