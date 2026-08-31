export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { createAdminSessionToken, getAdminConfiguration, safePasswordMatches } from "@/lib/admin-auth";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-nf-client-connection-ip") || "unknown";
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  attempts.set(key, current);
  return { allowed: current.count <= MAX_ATTEMPTS, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
}

export async function POST(request: Request) {
  if (!getAdminConfiguration().ready) {
    return Response.json({ ok: false, error: "ADMIN_AUTH_NOT_CONFIGURED" }, { status: 503 });
  }

  const key = clientKey(request);
  const rate = checkRateLimit(key);
  if (!rate.allowed) {
    return Response.json({ ok: false, error: "RATE_LIMITED", retryAfter: rate.retryAfter }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
  }

  let password = "";
  try {
    const body = await request.json();
    password = String(body?.password || "");
  } catch {
    return Response.json({ ok: false, error: "INVALID_REQUEST" }, { status: 400 });
  }

  if (!safePasswordMatches(password)) {
    return Response.json({ ok: false, error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  attempts.delete(key);
  return Response.json({ ok: true, token: createAdminSessionToken(), expiresInSeconds: 60 * 60 * 8 });
}
