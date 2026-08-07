import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "bridgecare_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type AdminSession = {
  exp: number;
  iat: number;
  role: "admin";
  version: 1;
};

/**
 * Read private environment values using static property access.
 *
 * Netlify/Next.js traces statically referenced server environment variables
 * into the server function bundle. Dynamic access such as process.env[name]
 * may not be included by the bundler, even when the variables exist in the
 * Netlify UI.
 */
function adminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

function adminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "";
}

export function getAdminConfiguration() {
  const passwordConfigured = Boolean(adminPassword());
  const sessionSecretConfigured = Boolean(adminSessionSecret());
  return {
    passwordConfigured,
    sessionSecretConfigured,
    ready: passwordConfigured && sessionSecretConfigured,
  };
}

function getSecret() {
  return adminSessionSecret();
}

function sign(value: string) {
  const secret = getSecret();
  if (!secret) return "";
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function safePasswordMatches(candidate: string) {
  const configured = adminPassword();
  if (!configured || !candidate) return false;

  const candidateBuffer = Buffer.from(candidate, "utf8");
  const configuredBuffer = Buffer.from(configured, "utf8");

  return (
    candidateBuffer.length === configuredBuffer.length &&
    crypto.timingSafeEqual(candidateBuffer, configuredBuffer)
  );
}

export function createAdminSessionToken() {
  if (!getAdminConfiguration().ready) {
    throw new Error("ADMIN_AUTH_NOT_CONFIGURED");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSession = {
    exp: now + SESSION_TTL_SECONDS,
    iat: now,
    role: "admin",
    version: 1,
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export const createAdminToken = createAdminSessionToken;

export function verifyAdminSessionToken(token?: string) {
  if (!token || !getAdminConfiguration().ready) return false;

  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra) return false;

  const expected = sign(encoded);
  if (!expected) return false;

  const suppliedBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as AdminSession;
    const now = Math.floor(Date.now() / 1000);

    return (
      payload.role === "admin" &&
      payload.version === 1 &&
      Number.isFinite(payload.iat) &&
      Number.isFinite(payload.exp) &&
      payload.iat <= now + 60 &&
      payload.exp > now
    );
  } catch {
    return false;
  }
}

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
