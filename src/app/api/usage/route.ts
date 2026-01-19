import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit } from "@/lib/usage";
import { getIpUsage, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Handle anonymous users - return IP-based usage
    if (!user) {
      const clientIp = getClientIp(request);
      const ipUsage = getIpUsage(clientIp);

      return NextResponse.json({
        tier: "anonymous",
        remaining: ipUsage.remaining,
        limit: ipUsage.limit,
        resetAt: ipUsage.resetAt.toISOString(),
        unlimited: false,
        isAnonymous: true,
      });
    }

    // Authenticated user - return database-tracked usage
    const usage = await checkUsageLimit(user.id);

    return NextResponse.json({
      tier: usage.tier,
      remaining: usage.remaining,
      limit: usage.limit,
      resetAt: usage.resetAt?.toISOString() || null,
      unlimited: usage.limit === -1,
      isAnonymous: false,
    });
  } catch (error: any) {
    console.error("Error checking usage:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to check usage" },
      { status: 500 }
    );
  }
}
