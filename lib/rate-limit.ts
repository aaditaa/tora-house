const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;
const MAX_KEYS = 10_000;

const hits = new Map<string, number[]>();

/**
 * Five requests per IP per hour. An in-memory map is enough for launch: it resets on
 * a cold start and is per-instance, which is noted in the README. If abuse appears,
 * move this to Upstash — the call site does not change.
 */
export function allow(
  key: string,
  limit = LIMIT,
  windowMs = WINDOW_MS,
): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }

  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
