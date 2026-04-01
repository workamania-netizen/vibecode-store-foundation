// ---------------------------------------------------------------------------
// In-memory sliding window rate limiter
// ---------------------------------------------------------------------------
// Tracks request timestamps per key (typically IP address).
// Not shared across serverless instances — acceptable for small stores.
// ---------------------------------------------------------------------------

const windowMs = 60 * 60 * 1000; // 1 hour
const maxRequests = 5;
const store = new Map<string, number[]>();

// Auto-clean when map gets large
function cleanup() {
  if (store.size > 1000) {
    const now = Date.now();
    for (const [key, timestamps] of store) {
      const valid = timestamps.filter((t) => now - t < windowMs);
      if (valid.length === 0) {
        store.delete(key);
      } else {
        store.set(key, valid);
      }
    }
  }
}

export function rateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  cleanup();
  const now = Date.now();
  const timestamps = store.get(key) || [];

  // Remove expired timestamps
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= maxRequests) {
    const oldestValid = valid[0];
    const retryAfterMs = windowMs - (now - oldestValid);
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  valid.push(now);
  store.set(key, valid);

  return { allowed: true, retryAfterSeconds: 0 };
}
