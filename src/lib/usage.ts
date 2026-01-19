import { createClient } from "@/lib/supabase/server";
import { PLANS, PlanType } from "./stripe";

interface UsageCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: Date | null;
  tier: PlanType;
}

export async function checkUsageLimit(userId: string): Promise<UsageCheckResult> {
  const supabase = await createClient();

  // Get user's profile with subscription info
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("subscription_tier, generation_count, generation_reset_at")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    // Default to free tier if no profile found
    return {
      allowed: true,
      remaining: PLANS.free.limits.generationsPerDay,
      limit: PLANS.free.limits.generationsPerDay,
      resetAt: null,
      tier: "free",
    };
  }

  const tier = (profile.subscription_tier || "free") as PlanType;
  const plan = PLANS[tier];
  const limit = plan.limits.generationsPerDay;

  // Unlimited for pro/enterprise
  if (limit === -1) {
    return {
      allowed: true,
      remaining: -1,
      limit: -1,
      resetAt: null,
      tier,
    };
  }

  // Check if we need to reset the counter (new day)
  const resetAt = profile.generation_reset_at
    ? new Date(profile.generation_reset_at)
    : new Date();
  const now = new Date();

  // Reset if more than 24 hours have passed
  const hoursSinceReset = (now.getTime() - resetAt.getTime()) / (1000 * 60 * 60);

  if (hoursSinceReset >= 24) {
    // Reset the counter
    await supabase
      .from("profiles")
      .update({
        generation_count: 0,
        generation_reset_at: now.toISOString(),
      })
      .eq("id", userId);

    return {
      allowed: true,
      remaining: limit,
      limit,
      resetAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      tier,
    };
  }

  const count = profile.generation_count || 0;
  const remaining = Math.max(0, limit - count);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
    resetAt: new Date(resetAt.getTime() + 24 * 60 * 60 * 1000),
    tier,
  };
}

export async function incrementUsage(userId: string, model: string): Promise<void> {
  const supabase = await createClient();

  // Increment generation count
  await supabase.rpc("increment_generation_count", { user_id: userId });

  // Log the usage
  await supabase.from("usage_logs").insert({
    user_id: userId,
    model,
    tokens_used: 0, // TODO: track actual tokens
  });
}

// Fallback if RPC doesn't exist - increment manually
export async function incrementUsageManual(userId: string, model: string): Promise<void> {
  const supabase = await createClient();

  // Get current count
  const { data: profile } = await supabase
    .from("profiles")
    .select("generation_count")
    .eq("id", userId)
    .single();

  const currentCount = profile?.generation_count || 0;

  // Update count
  await supabase
    .from("profiles")
    .update({ generation_count: currentCount + 1 })
    .eq("id", userId);

  // Log the usage
  await supabase.from("usage_logs").insert({
    user_id: userId,
    model,
    tokens_used: 0,
  });
}
