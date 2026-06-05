// Hardened proxy to the Anthropic Messages API.
//
// SECURITY MODEL:
//  - CORS locked to an allowlist (set ALLOWED_ORIGINS env var, comma-separated).
//  - Optional shared-secret gate (set APP_SHARED_SECRET; frontend sends x-app-secret).
//  - Hard caps on model + max_tokens + request size, so even a leak is low-cost.
//  - Best-effort per-IP rate limit (resets on cold start — not bulletproof; for hard
//    guarantees use Vercel KV / Upstash).
//
// NOTE: nothing in the current frontend calls this endpoint. If you don't plan to use
// server-side Claude calls, the safest option is to DELETE this file (and its entry in
// vercel.json) entirely.

const ALLOWED_MODELS = new Set([
  "claude-sonnet-4-20250514",
  "claude-3-5-haiku-20241022",
]);
const MAX_OUTPUT_TOKENS = 1024;
const MAX_BODY_BYTES = 16 * 1024;     // 16 KB request cap
const RATE_LIMIT = 20;                // requests...
const RATE_WINDOW_MS = 60 * 1000;     // ...per minute per IP

const hits = new Map(); // ip -> { count, resetAt }  (per-instance, best-effort)

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > RATE_LIMIT;
}

export default async function handler(req, res) {
  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.origin || "";
  const originOk = allowed.length > 0 && allowed.includes(origin);

  // CORS: only ever reflect an allowed origin — never "*"
  if (originOk) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-app-secret");
  }

  if (req.method === "OPTIONS") return res.status(originOk ? 200 : 403).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!originOk) return res.status(403).json({ error: "Origin not allowed" });

  // Optional shared-secret gate (only enforced when APP_SHARED_SECRET is set)
  const sharedSecret = process.env.APP_SHARED_SECRET;
  if (sharedSecret && req.headers["x-app-secret"] !== sharedSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ error: "Rate limit exceeded" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing API key" });

  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);
    if (!body || typeof body !== "object") return res.status(400).json({ error: "Bad request" });

    if (JSON.stringify(body).length > MAX_BODY_BYTES) {
      return res.status(413).json({ error: "Request too large" });
    }
    if (!ALLOWED_MODELS.has(body.model)) {
      return res.status(400).json({ error: "Model not allowed" });
    }
    body.max_tokens = Math.min(Number(body.max_tokens) || MAX_OUTPUT_TOKENS, MAX_OUTPUT_TOKENS);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
