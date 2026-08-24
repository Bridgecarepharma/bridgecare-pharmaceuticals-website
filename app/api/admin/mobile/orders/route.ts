export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { mobileAdminToken, mobileAdminUnauthorized } from "@/lib/mobile-admin-auth";
import { prisma } from "@/lib/prisma";

const allowedStatuses = new Set(["PENDING_PAYMENT", "PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED", "CANCELLED", "REFUNDED"]);

export async function GET(request: Request) {
  if (!mobileAdminToken(request)) return mobileAdminUnauthorized();
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "";
  const where = allowedStatuses.has(status) ? { status: status as any } : undefined;

  const orders = await prisma.order.findMany({
    where,
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { payment: true, items: true },
  });

  return Response.json({
    ok: true,
    orders: orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      totalKobo: order.totalKobo,
      status: order.status,
      paymentStatus: order.payment?.status || "PENDING",
      createdAt: order.createdAt.toISOString(),
      packs: order.items.reduce((sum, item) => sum + item.quantity, 0),
      products: order.items.map(item => ({ name: item.productName, quantity: item.quantity })),
    })),
  }, { headers: { "Cache-Control": "no-store" } });
}
