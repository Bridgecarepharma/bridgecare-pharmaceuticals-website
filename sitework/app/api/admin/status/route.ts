export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getAdminConfiguration } from "@/lib/admin-auth";

export async function GET() {
  const configuration = getAdminConfiguration();
  const response = NextResponse.json({
    ready: configuration.ready,
    passwordConfigured: configuration.passwordConfigured,
    sessionSecretConfigured: configuration.sessionSecretConfigured,
    netlify: process.env.NETLIFY === "true",
    context: process.env.CONTEXT || null,
    siteName: process.env.SITE_NAME || null,
    url: process.env.URL || null,
    deployUrl: process.env.DEPLOY_URL || null,
    commitRef: process.env.COMMIT_REF || null,
  });

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}
