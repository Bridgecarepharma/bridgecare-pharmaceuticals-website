import { NextResponse } from "next/server";
import { adminCookie, createAdminSessionToken } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const origin = new URL(request.url).origin;

  if (!configuredPassword) {
    return NextResponse.redirect(`${origin}/admin/login?error=not-configured`, 303);
  }

  if (password !== configuredPassword) {
    return NextResponse.redirect(`${origin}/admin/login?error=invalid`, 303);
  }

  const response = NextResponse.redirect(`${origin}/admin/orders`, 303);
  response.cookies.set(adminCookie.name, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: adminCookie.maxAge,
  });
  return response;
}
