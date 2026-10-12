/**
 * Tiny in-memory per-IP rate limiter for public API routes.
 * Sufficient for the single-instance standalone deployment (SQLite-backed).
 * For multi-instance deployments, replace with a shared store (e.g. Redis).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Prevent unbounded growth in long-running processes.
const MAX_BUCKETS = 5000;

function prune(now: number) {
  if (buckets.size <= MAX_BUCKETS) return;
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
    if (buckets.size <= MAX_BUCKETS) break;
  }
}

export interface RateLimit {
  /** Max requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

/**
 * Returns true when the request is allowed (and counts it), false when the
 * caller should respond with 429. Keyed by client IP + route scope.
 */
export function checkRateLimit(req: Request, scope: string, { limit, windowMs }: RateLimit): boolean {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown";
  const now = Date.now();
  prune(now);
  const key = `${scope}:${ip}`;
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}
