import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { csvCell, PAID_ORDER_STATUSES, parseReportDate } from "@/lib/reporting";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.redirect(new URL("/admin/login", request.url), 303);
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });

  const url = new URL(request.url);
  const from = url.searchParams.get("from") || undefined;
  const to = url.searchParams.get("to") || undefined;
  const fromDate = parseReportDate(from);
  const toDate = parseReportDate(to, true);
  const dateFilter = fromDate || toDate ? { createdAt: { ...(fromDate ? { gte: fromDate } : {}), ...(toDate ? { lte: toDate } : {}) } } : {};

  const orders = await prisma.order.findMany({
    where: { status: { in: [...PAID_ORDER_STATUSES] as never[] }, ...dateFilter },
    orderBy: { createdAt: "desc" },
    include: { items: true, payment: true },
  });

  const rows = [["Order number", "Date", "Customer", "Email", "Phone", "State", "Products", "Subtotal NGN", "Shipping NGN", "Total NGN", "Payment status", "Order status", "Paystack reference"]];
  for (const order of orders) {
    rows.push([
      order.orderNumber,
      order.createdAt.toISOString(),
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      order.state,
      order.items.map(item => `${item.quantity} x ${item.productName}`).join("; "),
      (order.subtotalKobo / 100).toFixed(2),
      (order.shippingKobo / 100).toFixed(2),
      (order.totalKobo / 100).toFixed(2),
      order.payment?.status || "PENDING",
      order.status,
      order.paystackReference,
    ]);
  }
  const csv = rows.map(row => row.map(csvCell).join(",")).join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bridgecare-sales-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
