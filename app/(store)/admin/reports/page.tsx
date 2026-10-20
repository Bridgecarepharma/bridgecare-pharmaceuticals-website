import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate, naira } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";
import { PAID_ORDER_STATUSES, parseReportDate } from "@/lib/reporting";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Reports", robots: { index: false, follow: false } };

type Params = { from?: string; to?: string };

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireAdmin();
  const { from = "", to = "" } = await searchParams;
  const fromDate = parseReportDate(from);
  const toDate = parseReportDate(to, true);
  const configured = Boolean(process.env.DATABASE_URL);
  const dateFilter = fromDate || toDate ? { createdAt: { ...(fromDate ? { gte: fromDate } : {}), ...(toDate ? { lte: toDate } : {}) } } : {};
  const paidWhere = { status: { in: [...PAID_ORDER_STATUSES] as never[] }, ...dateFilter };

  const [orders, revenue, orderCount, customerCount] = configured
    ? await Promise.all([
        prisma.order.findMany({ where: paidWhere, orderBy: { createdAt: "desc" }, include: { items: true, payment: true } }),
        prisma.order.aggregate({ where: paidWhere, _sum: { totalKobo: true, shippingKobo: true, subtotalKobo: true } }),
        prisma.order.count({ where: dateFilter }),
        prisma.customer.count({ where: fromDate || toDate ? { createdAt: { ...(fromDate ? { gte: fromDate } : {}), ...(toDate ? { lte: toDate } : {}) } } : {} }),
      ])
    : [[], { _sum: { totalKobo: 0, shippingKobo: 0, subtotalKobo: 0 } }, 0, 0];

  const productTotals = new Map<string, { name: string; quantity: number; revenueKobo: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const current = productTotals.get(item.productSlug) || { name: item.productName, quantity: 0, revenueKobo: 0 };
      current.quantity += item.quantity;
      current.revenueKobo += item.lineTotalKobo;
      productTotals.set(item.productSlug, current);
    }
  }
  const topProducts = [...productTotals.values()].sort((a, b) => b.quantity - a.quantity);
  const averageOrderKobo = orders.length ? Math.round((revenue._sum.totalKobo || 0) / orders.length) : 0;
  const query = new URLSearchParams();
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  const exportHref = `/api/admin/reports/export${query.size ? `?${query.toString()}` : ""}`;

  return <section className="section admin-shell"><div className="container">
    <AdminNav />
    <div className="admin-heading"><div><span className="eyebrow">Bridgecare intelligence</span><h1>Sales reports</h1><p>Review paid revenue, customer activity and product performance.</p></div></div>
    <form className="admin-filters report-filters" method="get">
      <label>From<input type="date" name="from" defaultValue={from} /></label>
      <label>To<input type="date" name="to" defaultValue={to} /></label>
      <button className="button" type="submit">Apply dates</button>
      <Link className="button secondary" href="/admin/reports">Clear</Link>
      <a className="button secondary" href={exportHref}>Export CSV</a>
    </form>
    {!configured ? <div className="admin-alert">DATABASE_URL is not configured.</div> : <>
      <div className="admin-kpis report-kpis">
        <article><span>Paid revenue</span><strong>{naira(revenue._sum.totalKobo || 0)}</strong></article>
        <article><span>Paid orders</span><strong>{orders.length}</strong></article>
        <article><span>Average order</span><strong>{naira(averageOrderKobo)}</strong></article>
        <article><span>All orders</span><strong>{orderCount}</strong></article>
        <article><span>Customers</span><strong>{customerCount}</strong></article>
        <article><span>Shipping collected</span><strong>{naira(revenue._sum.shippingKobo || 0)}</strong></article>
      </div>

      <div className="reports-grid">
        <article className="admin-report-panel">
          <div className="admin-panel-heading"><h2>Product performance</h2><span>{topProducts.length} products</span></div>
          {topProducts.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Units sold</th><th>Product revenue</th></tr></thead><tbody>
            {topProducts.map(product => <tr key={product.name}><td><strong>{product.name}</strong></td><td>{product.quantity}</td><td><strong>{naira(product.revenueKobo)}</strong></td></tr>)}
          </tbody></table></div> : <div className="admin-empty">No paid product sales in this period.</div>}
        </article>

        <article className="admin-report-panel">
          <div className="admin-panel-heading"><h2>Recent paid orders</h2><Link href="/admin/orders?status=PAID">Open orders</Link></div>
          {orders.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Date</th></tr></thead><tbody>
            {orders.slice(0, 12).map(order => <tr key={order.id}><td><Link href={`/admin/orders/${order.id}`}><strong>{order.orderNumber}</strong></Link></td><td>{order.customerName}<small>{order.state}</small></td><td><strong>{naira(order.totalKobo)}</strong></td><td>{adminDate(order.createdAt)}</td></tr>)}
          </tbody></table></div> : <div className="admin-empty">No paid orders in this period.</div>}
        </article>
      </div>
    </>}
  </div></section>;
}
