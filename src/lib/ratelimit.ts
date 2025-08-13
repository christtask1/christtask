// Simple in-memory token bucket per IP (per process). For production, use Upstash or Redis.
const buckets = new Map<string, { tokens: number; updatedAt: number }>()

export function allowRequest(ip: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now()
  const refillRate = limit / windowMs // tokens per ms
  const bucket = buckets.get(ip) || { tokens: limit, updatedAt: now }
  // Refill tokens
  const elapsed = now - bucket.updatedAt
  bucket.tokens = Math.min(limit, bucket.tokens + elapsed * refillRate)
  bucket.updatedAt = now
  // Consume one token if available
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    buckets.set(ip, bucket)
    return true
  }
  buckets.set(ip, bucket)
  return false
}


