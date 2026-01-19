/**
 * Simple in-memory rate limiting for anonymous users
 * In production, use Redis or a distributed cache
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (will reset on server restart)
// For production, use Redis or Upstash
const ipStore = new Map<string, RateLimitEntry>();

// Anonymous user limits
const ANONYMOUS_LIMIT = 3; // 3 generations per day (to encourage sign-up)
const ANONYMOUS_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipStore.entries()) {
    if (entry.resetAt <= now) {
      ipStore.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;
}

/**
 * Check rate limit for an IP address (anonymous users)
 */
export function checkIpRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = ipStore.get(ip);

  // No existing entry or expired - create new one
  if (!entry || entry.resetAt <= now) {
    const resetAt = now + ANONYMOUS_WINDOW_MS;
    ipStore.set(ip, { count: 0, resetAt });
    return {
      allowed: true,
      remaining: ANONYMOUS_LIMIT,
      limit: ANONYMOUS_LIMIT,
      resetAt: new Date(resetAt),
    };
  }

  // Check if limit exceeded
  const remaining = Math.max(0, ANONYMOUS_LIMIT - entry.count);
  return {
    allowed: remaining > 0,
    remaining,
    limit: ANONYMOUS_LIMIT,
    resetAt: new Date(entry.resetAt),
  };
}

/**
 * Increment usage count for an IP address
 */
export function incrementIpUsage(ip: string): void {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || entry.resetAt <= now) {
    // Create new entry with count 1
    ipStore.set(ip, { count: 1, resetAt: now + ANONYMOUS_WINDOW_MS });
  } else {
    // Increment existing entry
    entry.count += 1;
    ipStore.set(ip, entry);
  }
}

/**
 * Get usage stats for an IP (for anonymous usage API endpoint)
 */
export function getIpUsage(ip: string): RateLimitResult {
  return checkIpRateLimit(ip);
}

/**
 * Get client IP from request headers
 * Works with Vercel, Cloudflare, and direct connections
 */
export function getClientIp(request: Request): string {
  // Vercel
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Cloudflare
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Real IP header (nginx, etc)
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback - shouldn't happen in production
  return "unknown";
}
