import { NextResponse } from "next/server";
import {
  adminCookie,
  createAdminSessionToken,
  getAdminConfiguration,
  safePasswordMatches,
} from "@/lib/admin-auth";

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
  return {
    allowed: current.count <= MAX_ATTEMPTS,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const configuration = getAdminConfiguration();
  if (!configuration.ready) {
    console.error("Admin login is not configured. ADMIN_PASSWORD and ADMIN_SESSION_SECRET are required.");
    return NextResponse.redirect(`${origin}/admin/login?error=config`, 303);
  }

  const key = clientKey(request);
  const rateLimit = checkRateLimit(key);
  if (!rateLimit.allowed) {
    const response = NextResponse.redirect(`${origin}/admin/login?error=rate`, 303);
    response.headers.set("Retry-After", String(rateLimit.retryAfter));
    return response;
  }

  const form = await request.formData();
  const password = String(form.get("password") || "");
  if (!safePasswordMatches(password)) {
    return NextResponse.redirect(`${origin}/admin/login?error=invalid`, 303);
  }

  attempts.delete(key);
  const response = NextResponse.redirect(`${origin}/admin`, 303);
  response.cookies.set(adminCookie.name, createAdminSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: adminCookie.maxAge,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
