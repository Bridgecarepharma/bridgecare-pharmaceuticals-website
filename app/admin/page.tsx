import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate, naira } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Dashboard", robots: { index: false, follow: false } };

export default async function AdminDashboard() {
  await requireAdmin();
  const configured = Boolean(process.env.DATABASE_URL);
  const [totalOrders, paidOrders, pendingOrders, revenue, recent] = configured
    ? await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: { in: ["PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED"] } } }),
        prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
        prisma.order.aggregate({ _sum: { totalKobo: true }, where: { status: { in: ["PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED"] } } }),
        prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { payment: true } }),
      ])
    : [0, 0, 0, { _sum: { totalKobo: 0 } }, []];

  return <section className="section admin-shell"><div className="container">
    <AdminNav />
    <div className="admin-heading"><div><span className="eyebrow">Bridgecare operations</span><h1>Dashboard</h1><p>Orders, payments and customer activity at a glance.</p></div></div>
    {!configured ? <div className="admin-alert">DATABASE_URL is not configured.</div> : <>
      <div className="admin-kpis">
        <article><span>Total orders</span><strong>{totalOrders}</strong></article>
        <article><span>Paid orders</span><strong>{paidOrders}</strong></article>
        <article><span>Pending payment</span><strong>{pendingOrders}</strong></article>
        <article><span>Recorded revenue</span><strong>{naira(revenue._sum.totalKobo || 0)}</strong></article>
      </div>
      <div className="admin-panel-heading"><h2>Recent orders</h2><Link href="/admin/orders">View all orders</Link></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead><tbody>
        {recent.map(order => <tr key={order.id}><td><Link href={`/admin/orders/${order.id}`}><strong>{order.orderNumber}</strong></Link></td><td>{order.customerName}<small>{order.customerEmail}</small></td><td><strong>{naira(order.totalKobo)}</strong></td><td>{order.payment?.status || "PENDING"}</td><td>{order.status.replaceAll("_", " ")}</td><td>{adminDate(order.createdAt)}</td></tr>)}
      </tbody></table></div>
    </>}
  </div></section>;
}
