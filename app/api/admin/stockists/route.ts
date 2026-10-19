import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { stockistSchema } from "@/lib/stockists";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store, private" };
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers });
export async function POST(request: Request) {
 if (!(await isAdminAuthenticated())) return reply({ error: "Please sign in again." }, 401);
 if (request.headers.get("origin") !== new URL(request.url).origin) return reply({ error: "Invalid request origin." }, 403);
 try {
  if (Number(request.headers.get("content-length") || 0) > 8192) return reply({ error: "Request too large." }, 413);
  const raw = await request.text();
  if (raw.length > 8192) return reply({ error: "Request too large." }, 413);
  const input = JSON.parse(raw);
  const action = z.enum(["save", "delete"]).parse(input?.action);
  const id = input.id === undefined ? undefined : z.string().min(1).max(100).parse(input.id);
  if (action === "delete") {
   if (!id) return reply({ error: "Choose a shop to remove." }, 400);
   await prisma.$transaction(async tx => {
    const deleted = await tx.stockist.delete({ where: { id } });
    await tx.adminAuditLog.create({ data: { action: "DELETE_STOCKIST", entity: "Stockist", entityId: id, details: { name: deleted.name } } });
   });
   return reply({ ok: true });
  }
  const data = stockistSchema.parse(input);
  const saved = await prisma.$transaction(async tx => {
   const shop = id ? await tx.stockist.update({ where: { id }, data }) : await tx.stockist.create({ data });
   await tx.adminAuditLog.create({ data: { action: id ? "UPDATE_STOCKIST" : "CREATE_STOCKIST", entity: "Stockist", entityId: shop.id, details: { name: shop.name, isActive: shop.isActive } } });
   return shop;
  });
  return reply({ ok: true, id: saved.id });
 } catch(error) {
  if(error instanceof ZodError) return reply({ error: error.issues.map(issue=>`${issue.path.join(".")}: ${issue.message}`).join(" ") }, 400);
  if(error instanceof SyntaxError) return reply({ error: "Invalid request." }, 400);
  return reply({ error: "Unable to save this change. Check the database migration and refresh before trying again." }, 503);
 }
}
