import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { normalizeSecurityCode, securityCodeHash } from "@/lib/verification-codes";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store, private" };
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers });

export async function POST(request: Request) {
 try {
  if (!process.env.DATABASE_URL || !process.env.ADMIN_SESSION_SECRET) return reply({ error: "Verification is temporarily unavailable. Please contact Bridgecare." }, 503);
  if (Number(request.headers.get("content-length") || 0) > 2048) return reply({ error: "Request is too large." }, 413);
  // Netlify supplies this header. Do not trust a caller-controlled forwarded-for list.
  const ip = request.headers.get("x-nf-client-connection-ip") || "shared-fallback";
  const window = Math.floor(Date.now() / 900000);
  const key = createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(`${ip}:${window}`).digest("hex");
  const limit = await prisma.verificationLimit.upsert({ where: { key }, create: { key, expiresAt: new Date((window + 2) * 900000) }, update: { count: { increment: 1 } } });
  if (limit.count === 1) await prisma.verificationLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  if (limit.count > 30) return NextResponse.json({ error: "Too many checks. Please try again in 15 minutes." }, { status: 429, headers: { ...headers, "Retry-After": "900" } });
  const raw = await request.text();
  if (raw.length > 2048) return reply({ error: "Request is too large." }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return reply({ error: "Enter your security code." }, 400); }
  if (typeof body?.code !== "string" || body.code.length > 100) return reply({ error: "Enter your security code." }, 400);
  const code = normalizeSecurityCode(body.code);
  if (!/^(?:[0-9]{16}|[A-F0-9]{24})$/.test(code)) return reply({ error: "Enter the full 16-digit code from the scratch panel. Older 24-character Bridgecare codes are also accepted." }, 400);
  const codeHash = securityCodeHash(code);
  const result = await prisma.$transaction(async tx => {
   const found = await tx.verificationCode.findUnique({ where: { codeHash } });
   if (!found) {
    await tx.verificationEvent.create({ data: { outcome: "UNRECOGNISED" } });
    return { status: "UNRECOGNISED" };
   }
   // Lock batch first, then code. Batch/code deactivation uses the same order.
   await tx.$queryRaw`SELECT "id" FROM "VerificationBatch" WHERE "id" = ${found.batchId} FOR UPDATE`;
   await tx.$queryRaw`SELECT "id" FROM "VerificationCode" WHERE "id" = ${found.id} FOR UPDATE`;
   const pack = await tx.verificationCode.findUniqueOrThrow({ where: { id: found.id }, include: { batch: true } });
   const now = new Date();
   const status = pack.disabled || !pack.batch.active ? "INACTIVE" : pack.batch.expiresAt < now ? "EXPIRED" : pack.checks > 0 ? "PREVIOUSLY_CHECKED" : "RECOGNISED";
   if (status === "RECOGNISED" || status === "PREVIOUSLY_CHECKED") {
    await tx.verificationCode.update({ where: { id: pack.id }, data: { checks: { increment: 1 }, firstCheckedAt: pack.firstCheckedAt || now, lastCheckedAt: now } });
   }
   await tx.verificationEvent.create({ data: { codeId: pack.id, outcome: status } });
   return { status, product: pack.batch.productName, checkCount: pack.checks + ((status === "RECOGNISED" || status === "PREVIOUSLY_CHECKED") ? 1 : 0), firstCheckedAt: pack.firstCheckedAt?.toISOString() || (status === "RECOGNISED" ? now.toISOString() : null) };
  });
  return reply(result);
 } catch {
  return reply({ error: "Verification is temporarily unavailable. Please contact Bridgecare; do not assume this pack has been verified." }, 503);
 }
}
