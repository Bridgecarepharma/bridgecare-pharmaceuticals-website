import { NextRequest, NextResponse } from "next/server";

const verificationHost = "verify.bridgecarepharmang.com";
function configuredVerificationOrigin() {
  const value = process.env.VERIFICATION_SITE_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === verificationHost && !url.port && !url.username && !url.password ? url.origin : null;
  } catch { return null; }
}
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = (request.headers.get("host") || request.nextUrl.hostname).split(":")[0].toLowerCase();
  if (hostname === verificationHost) {
    if (pathname === "/robots.txt") return new NextResponse("User-agent: *\nDisallow: /\n", { headers: { "Content-Type": "text/plain" } });
    if (pathname.startsWith("/_next/") || ["/favicon.ico", "/icon.png", "/apple-touch-icon.png", "/api/verify"].includes(pathname)) return NextResponse.next();
    if (pathname === "/" && ["GET", "HEAD"].includes(request.method)) {
      const target = request.nextUrl.clone(); target.pathname = "/verify"; target.search = "";
      return NextResponse.rewrite(target);
    }
    if (["GET", "HEAD"].includes(request.method)) return NextResponse.redirect(new URL(`https://${verificationHost}/`), 307);
    return new NextResponse(null, { status: 404 });
  }
  // Enable only after the subdomain is connected and its HTTPS certificate is ready.
  const origin = configuredVerificationOrigin();
  if (pathname === "/verify" && origin && ["GET", "HEAD"].includes(request.method)) return NextResponse.redirect(new URL("/", origin), 307);
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
