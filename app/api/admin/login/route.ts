import { NextResponse } from "next/server";
import { adminCookie, createAdminToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") || "");
  const configured = process.env.ADMIN_PASSWORD || "";
  const origin = new URL(request.url).origin;
  if (!configured || password !== configured) {
    return NextResponse.redirect(`${origin}/admin/login?error=1`, 303);
  }
  const response = NextResponse.redirect(`${origin}/admin/inventory`, 303);
  response.cookies.set(adminCookie.name, createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: adminCookie.maxAge,
  });
  return response;
}
