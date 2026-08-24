export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { mobileAdminToken, mobileAdminUnauthorized } from "@/lib/mobile-admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!mobileAdminToken(request)) return mobileAdminUnauthorized();
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { payment: true, items: true } });
  if (!order) return Response.json({ ok: false, error: "ORDER_NOT_FOUND" }, { status: 404 });

  return Response.json({
    ok: true,
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      recipientName: order.recipientName,
      recipientPhone: order.recipientPhone,
      addressLine1: order.addressLine1,
      addressLine2: order.addressLine2,
      landmark: order.landmark,
      city: order.city,
      lga: order.lga,
      state: order.state,
      deliveryInstructions: order.deliveryInstructions,
      deliveryMethod: order.deliveryMethod,
      subtotalKobo: order.subtotalKobo,
      shippingKobo: order.shippingKobo,
      discountKobo: order.discountKobo,
      totalKobo: order.totalKobo,
      status: order.status,
      paymentStatus: order.payment?.status || "PENDING",
      paymentChannel: order.paymentChannel || order.payment?.channel || null,
      paystackReference: order.paystackReference,
      paidAt: order.paidAt?.toISOString() || null,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map(item => ({ id: item.id, productName: item.productName, productSlug: item.productSlug, quantity: item.quantity, unitPriceKobo: item.unitPriceKobo, lineTotalKobo: item.lineTotalKobo })),
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
