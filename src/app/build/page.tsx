"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function BuildRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Preserve query params when redirecting
    const params = new URLSearchParams();
    
    const project = searchParams.get("project");
    const prompt = searchParams.get("prompt");
    const category = searchParams.get("category");
    
    if (project) params.set("project", project);
    if (prompt) params.set("prompt", prompt);
    if (category) params.set("category", category);
    
    const queryString = params.toString();
    const redirectUrl = `/build-v2${queryString ? `?${queryString}` : ""}`;
    
    router.replace(redirectUrl);
  }, [searchParams, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-400">Redirecting to new builder...</p>
      </div>
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
      <BuildRedirect />
    </Suspense>
  );
}
