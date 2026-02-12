// Simple in-memory rate limiter (per-user, per-minute)
// For production at scale, swap for Redis-backed limiter

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now > entry.resetAt) store.delete(key);
  });
}, 5 * 60 * 1000);

export function rateLimit(
  key: string,
  { maxRequests = 5, windowMs = 60_000 } = {}
): { success: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  if (entry.count >= maxRequests) {
    const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { success: false, remaining: 0, resetInSeconds };
  }

  entry.count++;
  const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000);
  return { success: true, remaining: maxRequests - entry.count, resetInSeconds };
}
