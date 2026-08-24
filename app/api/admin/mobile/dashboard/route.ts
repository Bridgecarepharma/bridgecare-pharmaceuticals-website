export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { mobileAdminToken, mobileAdminUnauthorized } from "@/lib/mobile-admin-auth";
import { prisma } from "@/lib/prisma";

const paidStatuses = ["PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED"] as const;

function lagosBoundary(kind: "day" | "month", offset = 0) {
  const lagosNow = new Date(Date.now() + 60 * 60 * 1000);
  const year = lagosNow.getUTCFullYear();
  const month = lagosNow.getUTCMonth();
  const date = lagosNow.getUTCDate();
  const localMidnight = kind === "day" ? Date.UTC(year, month, date + offset) : Date.UTC(year, month + offset, 1);
  return new Date(localMidnight - 60 * 60 * 1000);
}

export async function GET(request: Request) {
  if (!mobileAdminToken(request)) return mobileAdminUnauthorized();
  if (!process.env.DATABASE_URL) return Response.json({ ok: false, error: "DATABASE_NOT_CONFIGURED" }, { status: 503 });

  const todayStart = lagosBoundary("day");
  const tomorrowStart = lagosBoundary("day", 1);
  const monthStart = lagosBoundary("month");
  const nextMonthStart = lagosBoundary("month", 1);

  const [todayRevenue, monthRevenue, paidOrders, pendingOrders, ordersToday, recentOrders] = await Promise.all([
    prisma.order.aggregate({ _sum: { totalKobo: true }, where: { status: { in: [...paidStatuses] }, paidAt: { gte: todayStart, lt: tomorrowStart } } }),
    prisma.order.aggregate({ _sum: { totalKobo: true }, where: { status: { in: [...paidStatuses] }, paidAt: { gte: monthStart, lt: nextMonthStart } } }),
    prisma.order.count({ where: { status: { in: [...paidStatuses] } } }),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.order.count({ where: { createdAt: { gte: todayStart, lt: tomorrowStart } } }),
    prisma.order.findMany({ take: 12, orderBy: { createdAt: "desc" }, include: { payment: true, items: true } }),
  ]);

  return Response.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    metrics: {
      todayRevenueKobo: todayRevenue._sum.totalKobo || 0,
      monthRevenueKobo: monthRevenue._sum.totalKobo || 0,
      paidOrders,
      pendingOrders,
      ordersToday,
    },
    recentOrders: recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      totalKobo: order.totalKobo,
      status: order.status,
      paymentStatus: order.payment?.status || "PENDING",
      createdAt: order.createdAt.toISOString(),
      packs: order.items.reduce((sum, item) => sum + item.quantity, 0),
      products: order.items.map(item => item.productName),
    })),
  }, { headers: { "Cache-Control": "no-store" } });
}
