"use client";

import UsageIndicator from "./UsageIndicator";
import { Sparkles, Folder, Clock } from "lucide-react";

interface DashboardStatsProps {
  projectCount: number;
  userEmail: string;
}

export default function DashboardStats({ projectCount, userEmail }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Usage Card */}
      <UsageIndicator variant="full" />

      {/* Projects Card */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Folder className="w-5 h-5 text-blue-400" />
          <span className="font-medium">Projects</span>
        </div>
        <div className="space-y-2">
          <div>
            <span className="text-2xl font-bold">{projectCount}</span>
            <span className="text-gray-500 text-sm ml-1">total</span>
          </div>
          <p className="text-xs text-gray-500">
            {projectCount === 0
              ? "Create your first app to get started"
              : `You have ${projectCount} project${projectCount !== 1 ? "s" : ""} saved`}
          </p>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="font-medium">Quick Start</span>
        </div>
        <div className="space-y-2">
          <a
            href="/build"
            className="block w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors text-center"
          >
            Create New App
          </a>
          <a
            href="/build?category=ecommerce"
            className="block w-full bg-[#222] hover:bg-[#333] text-white text-sm py-2 px-3 rounded-lg transition-colors text-center"
          >
            E-Commerce Template
          </a>
        </div>
      </div>
    </div>
  );
}
