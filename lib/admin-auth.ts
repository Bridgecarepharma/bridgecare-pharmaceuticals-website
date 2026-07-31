import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "bridgecare_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function createAdminToken() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token || !secret()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(expires);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return suppliedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE_NAME)?.value);
}

export const adminCookie = { name: COOKIE_NAME, maxAge: MAX_AGE_SECONDS };
