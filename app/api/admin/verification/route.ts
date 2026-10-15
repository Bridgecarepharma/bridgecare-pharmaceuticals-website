import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { csvCell, generateSecurityCodes, VERIFICATION_PRODUCTS } from "@/lib/verification-codes";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store, private", "X-Content-Type-Options": "nosniff" };
const batchSchema = z.object({ productSlug: z.enum(["asfenositol", "globivida"]), batchNumber: z.string().trim().min(1).max(60).regex(/^[A-Za-z0-9][A-Za-z0-9 ._/-]*$/), manufacturedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), expiresAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), count: z.coerce.number().int().min(1).max(5000) });

export async function POST(request: Request) {
 if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Please sign in again." }, { status: 401, headers: noStore });
 if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403, headers: noStore });
 if (Number(request.headers.get("content-length") || 0) > 4096) return NextResponse.json({ error: "Request too large." }, { status: 413, headers: noStore });
 try {
  const text = await request.text();
  if (text.length > 4096) throw new Error("Invalid request.");
  const input = JSON.parse(text);
  if (input.action === "create") {
   const data = batchSchema.parse(input);
   const manufacturedAt = new Date(`${data.manufacturedAt}T00:00:00.000Z`);
   const expiresAt = new Date(`${data.expiresAt}T23:59:59.999Z`);
   if (!Number.isFinite(+manufacturedAt) || !Number.isFinite(+expiresAt) || manufacturedAt.toISOString().slice(0,10) !== data.manufacturedAt || expiresAt.toISOString().slice(0,10) !== data.expiresAt || manufacturedAt > new Date() || expiresAt <= new Date() || expiresAt <= manufacturedAt) throw new Error("Check the manufacturing and expiry dates.");
   const product = VERIFICATION_PRODUCTS[data.productSlug];
   const codes = generateSecurityCodes(data.count);
   const batch = await prisma.$transaction(async tx => {
    const batch = await tx.verificationBatch.create({ data: { productSlug: data.productSlug, productName: product.name, batchNumber: data.batchNumber, manufacturedAt, expiresAt } });
    await tx.verificationCode.createMany({ data: codes.map(code => ({ codeHash: code.codeHash, batchId: batch.id })) });
    await tx.adminAuditLog.create({ data: { action: "GENERATE_SECURITY_CODES", entity: "VerificationBatch", entityId: batch.id, details: { count: data.count } } });
    return batch;
   }, { timeout: 20000 });
   const csv = [["product", "batch_number", "manufactured", "expiry", "security_code", "verification_url"], ...codes.map(code => [product.name, batch.batchNumber, data.manufacturedAt, data.expiresAt, code.code, "https://bridgecarepharmang.com/verify"])].map(row => row.map(csvCell).join(",")).join("\r\n");
   return new Response(csv, { headers: { ...noStore, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="bridgecare-security-codes-${batch.id}.csv"` } });
  }
  const action = z.enum(["activate", "deactivate", "disable-code"]).parse(input.action);
  const id = z.string().min(1).max(100).parse(input.id);
  const codeId = action === "disable-code" ? z.string().min(1).max(100).parse(input.codeId) : undefined;
  await prisma.$transaction(async tx => {
   await tx.$queryRaw`SELECT "id" FROM "VerificationBatch" WHERE "id" = ${id} FOR UPDATE`;
   const batch = await tx.verificationBatch.findUniqueOrThrow({ where: { id } });
   if (action === "activate" && batch.expiresAt <= new Date()) throw new Error("An expired batch cannot be activated.");
   if (action === "disable-code") {
    await tx.verificationCode.update({ where: { id: codeId!, batchId: id }, data: { disabled: true } });
   } else await tx.verificationBatch.update({ where: { id }, data: { active: action === "activate" } });
   await tx.adminAuditLog.create({ data: { action: `VERIFICATION_${action.toUpperCase()}`, entity: "VerificationBatch", entityId: id, details: codeId ? { codeId } : {} } });
  });
  return NextResponse.json({ ok: true }, { headers: noStore });
 } catch (error) {
  const duplicate = typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
  const message = duplicate ? "That product batch already exists. Codes cannot be downloaded again." : error instanceof ZodError ? "Check the product, batch number, dates and code count." : error instanceof Error && ["Check the manufacturing and expiry dates.", "An expired batch cannot be activated."].includes(error.message) ? error.message : "Unable to complete this action. Refresh the batch list before trying again.";
  return NextResponse.json({ error: message }, { status: 400, headers: noStore });
 }
}
