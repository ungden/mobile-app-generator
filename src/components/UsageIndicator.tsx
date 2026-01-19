"use client";

import { useState, useEffect } from "react";
import { Zap, Crown, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

interface UsageData {
  remaining: number;
  limit: number;
  tier: string;
  resetAt: string | null;
  isAnonymous?: boolean;
}

interface UsageIndicatorProps {
  variant?: "compact" | "full" | "minimal";
  showUpgrade?: boolean;
  className?: string;
}

export default function UsageIndicator({
  variant = "compact",
  showUpgrade = true,
  className = "",
}: UsageIndicatorProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/usage");
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh usage after generation (call this from parent)
  const refresh = () => fetchUsage();

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs">Loading...</span>
      </div>
    );
  }

  if (!usage) {
    return null;
  }

  const isUnlimited = usage.limit === -1;
  const isPro = usage.tier === "pro" || usage.tier === "enterprise";
  const isAnonymous = usage.isAnonymous || usage.tier === "anonymous";
  const isLow = !isUnlimited && usage.remaining <= 2;
  const isEmpty = !isUnlimited && usage.remaining === 0;
  const percentage = isUnlimited ? 100 : Math.round((usage.remaining / usage.limit) * 100);

  // Format reset time
  const formatResetTime = () => {
    if (!usage.resetAt) return null;
    const reset = new Date(usage.resetAt);
    const now = new Date();
    const hoursLeft = Math.max(0, Math.round((reset.getTime() - now.getTime()) / (1000 * 60 * 60)));
    return hoursLeft > 0 ? `Resets in ${hoursLeft}h` : "Resets soon";
  };

  // Minimal variant - just icon and number
  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <Zap className={`w-3.5 h-3.5 ${isEmpty ? "text-red-400" : isLow ? "text-yellow-400" : "text-purple-400"}`} />
        <span className={`text-xs font-medium ${isEmpty ? "text-red-400" : isLow ? "text-yellow-400" : "text-gray-400"}`}>
          {isUnlimited ? "Unlimited" : usage.remaining}
        </span>
      </div>
    );
  }

  // Compact variant - progress bar
  if (variant === "compact") {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {isPro ? (
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
            ) : (
              <Zap className={`w-3.5 h-3.5 ${isEmpty ? "text-red-400" : isLow ? "text-yellow-400" : "text-purple-400"}`} />
            )}
            <span className="text-gray-400">
              {isUnlimited ? (
                <span className="text-yellow-400">Unlimited</span>
              ) : (
                <>
                  <span className={isEmpty ? "text-red-400" : isLow ? "text-yellow-400" : "text-white"}>
                    {usage.remaining}
                  </span>
                  <span className="text-gray-500">/{usage.limit} left</span>
                </>
              )}
            </span>
          </div>
          {!isUnlimited && usage.resetAt && (
            <span className="text-gray-500 text-[10px]">{formatResetTime()}</span>
          )}
        </div>

        {!isUnlimited && (
          <div className="h-1 bg-[#222] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isEmpty ? "bg-red-500" : isLow ? "bg-yellow-500" : "bg-purple-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}

        {isEmpty && showUpgrade && (
          <Link
            href={isAnonymous ? "/login" : "/pricing"}
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Crown className="w-3 h-3" />
            {isAnonymous ? "Sign up for more" : "Upgrade for unlimited"}
          </Link>
        )}

        {isAnonymous && !isEmpty && (
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-400 transition-colors"
          >
            Sign in for 5/day free
          </Link>
        )}
      </div>
    );
  }

  // Full variant - card style with more details
  return (
    <div className={`bg-[#1a1a1a] border border-[#333] rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isPro ? (
            <>
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="font-medium text-yellow-400">Pro Plan</span>
            </>
          ) : isAnonymous ? (
            <>
              <Zap className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-400">Guest</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Free Plan</span>
            </>
          )}
        </div>
        {!isPro && showUpgrade && (
          <Link
            href="/pricing"
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            <Crown className="w-3 h-3" />
            Upgrade
          </Link>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold">
              {isUnlimited ? "Unlimited" : usage.remaining}
            </span>
            {!isUnlimited && (
              <span className="text-gray-500 text-sm ml-1">/ {usage.limit}</span>
            )}
          </div>
          {!isUnlimited && (
            <span className="text-gray-500 text-xs pb-1">{formatResetTime()}</span>
          )}
        </div>

        {!isUnlimited && (
          <>
            <div className="h-2 bg-[#222] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isEmpty ? "bg-red-500" : isLow ? "bg-yellow-500" : "bg-purple-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <p className="text-xs text-gray-500">
              {isEmpty
                ? isAnonymous
                  ? "Sign up to continue generating apps"
                  : "You've used all your generations for today"
                : isLow
                ? "Running low on generations"
                : isAnonymous
                ? "Guest generations remaining"
                : "Generations remaining today"}
            </p>
          </>
        )}

        {isUnlimited && (
          <p className="text-xs text-gray-500">
            Enjoy unlimited AI generations with your Pro subscription
          </p>
        )}
      </div>

      {isAnonymous && showUpgrade && (
        <Link
          href="/login"
          className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          Sign Up Free - Get 5 Generations/Day
        </Link>
      )}

      {(isEmpty || isLow) && !isPro && !isAnonymous && showUpgrade && (
        <Link
          href="/pricing"
          className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Crown className="w-4 h-4" />
          Upgrade to Pro - Unlimited Generations
        </Link>
      )}
    </div>
  );
}

// Export a hook for programmatic usage refresh
export function useUsageRefresh() {
  const [key, setKey] = useState(0);
  const refresh = () => setKey((k) => k + 1);
  return { key, refresh };
}
