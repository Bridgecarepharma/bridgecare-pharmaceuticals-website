import { verifyAdminSessionToken } from "@/lib/admin-auth";

export function mobileAdminToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const [scheme, token] = authorization.split(/\s+/, 2);
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) return null;
  return verifyAdminSessionToken(token) ? token : null;
}

export function mobileAdminUnauthorized() {
  return Response.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
}
