import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate, naira } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Orders", robots: { index: false, follow: false } };

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  await requireAdmin();
  const { q = "", status = "" } = await searchParams;
  const orders = process.env.DATABASE_URL ? await prisma.order.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(q ? { OR: [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { customerEmail: { contains: q, mode: "insensitive" } },
        { customerPhone: { contains: q } },
      ] } : {}),
    },
    orderBy: { createdAt: "desc" }, take: 150, include: { items: true, payment: true },
  }) : [];
  const statuses = ["", "PENDING_PAYMENT", "PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED", "CANCELLED", "REFUNDED"];

  return <section className="section admin-shell"><div className="container">
    <AdminNav />
    <div className="admin-heading"><div><span className="eyebrow">Bridgecare operations</span><h1>Orders</h1><p>Search, review and manage customer orders.</p></div></div>
    <form className="admin-filters" method="get"><input name="q" defaultValue={q} placeholder="Order number, customer, email or phone" /><select name="status" defaultValue={status}>{statuses.map(value => <option key={value} value={value}>{value ? value.replaceAll("_", " ") : "All statuses"}</option>)}</select><button className="button" type="submit">Filter</button><Link className="button secondary" href="/admin/orders">Clear</Link></form>
    {!process.env.DATABASE_URL ? <div className="admin-alert">DATABASE_URL is not configured.</div> : orders.length === 0 ? <div className="admin-empty">No matching orders found.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Products</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead><tbody>
      {orders.map(order => <tr key={order.id}><td><Link href={`/admin/orders/${order.id}`}><strong>{order.orderNumber}</strong></Link><small>{order.paystackReference}</small></td><td><strong>{order.customerName}</strong><small>{order.customerEmail}</small><small>{order.customerPhone}</small></td><td>{order.items.map(item => <small key={item.id}>{item.quantity} × {item.productName}</small>)}</td><td><strong>{naira(order.totalKobo)}</strong></td><td><span className={`admin-status status-${(order.payment?.status || "PENDING").toLowerCase()}`}>{order.payment?.status || "PENDING"}</span></td><td><span className={`admin-status status-${order.status.toLowerCase().replaceAll("_", "-")}`}>{order.status.replaceAll("_", " ")}</span></td><td>{adminDate(order.createdAt)}</td></tr>)}
    </tbody></table></div>}
  </div></section>;
}
