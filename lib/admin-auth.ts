import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "bridgecare_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type AdminSession = {
  exp: number;
  role: "admin";
};

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createAdminSessionToken() {
  const payload: AdminSession = {
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    role: "admin",
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

// Backward-compatible name used by the inventory login route.
export const createAdminToken = createAdminSessionToken;

export function verifyAdminSessionToken(token?: string) {
  if (!token || !getSecret()) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  const expected = sign(encoded);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString(),
    ) as AdminSession;
    return payload.role === "admin" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

// Backward-compatible name used by newer inventory routes.
export const verifyAdminToken = verifyAdminSessionToken;

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_TTL_SECONDS,
};
