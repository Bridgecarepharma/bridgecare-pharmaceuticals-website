import { NextResponse } from "next/server";
import { verifyAdminSessionToken, adminCookie } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = new Set(["PENDING_PAYMENT", "PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED", "CANCELLED", "REFUNDED"]);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookie = request.headers.get("cookie")?.split(";").map(v => v.trim()).find(v => v.startsWith(`${adminCookie.name}=`))?.split("=").slice(1).join("=");
  if (!verifyAdminSessionToken(cookie)) return NextResponse.redirect(new URL("/admin/login", request.url), 303);
  const { id } = await params;
  const form = await request.formData();
  const status = String(form.get("status") || "");
  if (!ALLOWED.has(status)) return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  const trackingNumber = String(form.get("trackingNumber") || "").trim().slice(0, 120) || null;
  const internalNotes = String(form.get("internalNotes") || "").trim().slice(0, 4000) || null;
  const current = await prisma.order.findUnique({ where: { id }, select: { status: true } });
  if (!current) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  await prisma.$transaction(async tx => {
    await tx.order.update({ where: { id }, data: { status: status as never, trackingNumber, internalNotes } });
    if (current.status !== status) await tx.orderStatusHistory.create({ data: { orderId: id, status: status as never, note: internalNotes } });
    await tx.adminAuditLog.create({ data: { action: "ORDER_UPDATED", entity: "Order", entityId: id, details: { previousStatus: current.status, status, trackingNumber } } });
  });
  return NextResponse.redirect(new URL(`/admin/orders/${id}?saved=1`, request.url), 303);
}
