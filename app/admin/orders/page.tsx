import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate, naira } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Orders", robots: { index: false, follow: false } };

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; payment?: string; from?: string; to?: string }> }) {
  await requireAdmin();
  const { q = "", status = "", payment = "", from = "", to = "" } = await searchParams;
  const dateWhere = from || to ? { createdAt: { ...(from ? { gte: new Date(`${from}T00:00:00`) } : {}), ...(to ? { lte: new Date(`${to}T23:59:59.999`) } : {}) } } : {};
  const orders = process.env.DATABASE_URL ? await prisma.order.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(payment ? { payment: { is: { status: payment as never } } } : {}),
      ...dateWhere,
      ...(q ? { OR: [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { paystackReference: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { customerEmail: { contains: q, mode: "insensitive" } },
        { customerPhone: { contains: q } },
      ] } : {}),
    },
    orderBy: { createdAt: "desc" }, take: 250, include: { items: true, payment: true },
  }) : [];
  const statuses = ["", "PENDING_PAYMENT", "PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED", "CANCELLED", "REFUNDED"];
  const payments = ["", "PENDING", "SUCCESS", "FAILED", "ABANDONED", "REFUNDED"];
  const filteredRevenue = orders.filter(order => order.payment?.status === "SUCCESS").reduce((sum, order) => sum + order.totalKobo, 0);

  return <section className="section admin-shell"><div className="container">
    <AdminNav />
    <div className="admin-heading"><div><span className="eyebrow">Bridgecare operations</span><h1>Orders</h1><p>Search, filter, process, print and dispatch customer orders.</p></div></div>
    <div className="admin-order-kpis"><article><span>Matching orders</span><strong>{orders.length}</strong></article><article><span>Paid revenue shown</span><strong>{naira(filteredRevenue)}</strong></article><article><span>Awaiting fulfilment</span><strong>{orders.filter(o => ["PAID","PROCESSING","PACKED"].includes(o.status)).length}</strong></article></div>
    <form className="admin-filters admin-order-filters" method="get"><input name="q" defaultValue={q} placeholder="Order, Paystack ref, customer, email or phone" /><select name="status" defaultValue={status}>{statuses.map(value => <option key={value} value={value}>{value ? value.replaceAll("_", " ") : "All order statuses"}</option>)}</select><select name="payment" defaultValue={payment}>{payments.map(value => <option key={value} value={value}>{value ? `Payment ${value}` : "All payment statuses"}</option>)}</select><label>From<input type="date" name="from" defaultValue={from}/></label><label>To<input type="date" name="to" defaultValue={to}/></label><button className="button" type="submit">Filter</button><Link className="button secondary" href="/admin/orders">Clear</Link></form>
    {!process.env.DATABASE_URL ? <div className="admin-alert">DATABASE_URL is not configured.</div> : orders.length === 0 ? <div className="admin-empty">No matching orders found.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Products</th><th>Total</th><th>Payment</th><th>Status</th><th>Tracking</th><th>Date</th></tr></thead><tbody>
      {orders.map(order => <tr key={order.id}><td><Link href={`/admin/orders/${order.id}`}><strong>{order.orderNumber}</strong></Link><small>{order.paystackReference}</small></td><td><strong>{order.customerName}</strong><small>{order.customerEmail}</small><small>{order.customerPhone}</small></td><td>{order.items.map(item => <small key={item.id}>{item.quantity} × {item.productName}</small>)}</td><td><strong>{naira(order.totalKobo)}</strong></td><td><span className={`admin-status status-${(order.payment?.status || "PENDING").toLowerCase()}`}>{order.paymentChannel === "PAY_ON_DELIVERY" || order.payment?.channel === "PAY_ON_DELIVERY" ? "PAY ON DELIVERY" : order.payment?.status || "PENDING"}</span></td><td><span className={`admin-status status-${order.status.toLowerCase().replaceAll("_", "-")}`}>{order.status.replaceAll("_", " ")}</span></td><td>{order.trackingNumber || "—"}</td><td>{adminDate(order.createdAt)}</td></tr>)}
    </tbody></table></div>}
  </div></section>;
}
