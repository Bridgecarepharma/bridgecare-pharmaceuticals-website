import { NextResponse } from "next/server";
import { adminCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(
    `${new URL(request.url).origin}/admin/login`,
    303,
  );
  response.cookies.set(adminCookie.name, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
