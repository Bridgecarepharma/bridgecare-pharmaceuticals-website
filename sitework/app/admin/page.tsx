import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { SalesTrendChart } from "@/components/admin/SalesTrendChart";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate, naira } from "@/lib/admin-format";
import { ensureInventoryProducts } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Executive Dashboard", robots: { index: false, follow: false } };
const paidStatuses = ["PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED"] as const;

type PaidStatus = typeof paidStatuses[number];

function lagosBoundary(kind: "day" | "month", offset = 0) {
  const lagosNow = new Date(Date.now() + 60 * 60 * 1000);
  const year = lagosNow.getUTCFullYear();
  const month = lagosNow.getUTCMonth();
  const date = lagosNow.getUTCDate();
  const localMidnight = kind === "day"
    ? Date.UTC(year, month, date + offset)
    : Date.UTC(year, month + offset, 1);
  return new Date(localMidnight - 60 * 60 * 1000);
}

function dayKey(date: Date) {
  const lagos = new Date(date.getTime() + 60 * 60 * 1000);
  return `${lagos.getUTCFullYear()}-${String(lagos.getUTCMonth() + 1).padStart(2, "0")}-${String(lagos.getUTCDate()).padStart(2, "0")}`;
}

function shortDay(date: Date) {
  return new Intl.DateTimeFormat("en-NG", { weekday: "short", timeZone: "Africa/Lagos" }).format(date);
}

export default async function AdminDashboard() {
  await requireAdmin();
  const configured = Boolean(process.env.DATABASE_URL);
  if (configured) await ensureInventoryProducts();

  const todayStart = lagosBoundary("day");
  const tomorrowStart = lagosBoundary("day", 1);
  const monthStart = lagosBoundary("month");
  const nextMonthStart = lagosBoundary("month", 1);
  const trendStart = lagosBoundary("day", -13);

  const [
    totalOrders, paidOrders, pendingOrders, customerCount, revenue, recent, inventory, recentCustomers,
    todayRevenue, monthRevenue, ordersToday, deliveredToday, trendOrders, productItems, customerOrderCounts,
  ] = configured
    ? await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: { in: [...paidStatuses] } } }),
        prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
        prisma.customer.count(),
        prisma.order.aggregate({ _sum: { totalKobo: true }, where: { status: { in: [...paidStatuses] } } }),
        prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { payment: true } }),
        prisma.inventory.findMany({ orderBy: { productName: "asc" } }),
        prisma.customer.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { orders: { select: { totalKobo: true, status: true } } } }),
        prisma.order.aggregate({ _sum: { totalKobo: true }, where: { status: { in: [...paidStatuses] }, paidAt: { gte: todayStart, lt: tomorrowStart } } }),
        prisma.order.aggregate({ _sum: { totalKobo: true }, where: { status: { in: [...paidStatuses] }, paidAt: { gte: monthStart, lt: nextMonthStart } } }),
        prisma.order.count({ where: { createdAt: { gte: todayStart, lt: tomorrowStart } } }),
        prisma.order.count({ where: { status: "DELIVERED", updatedAt: { gte: todayStart, lt: tomorrowStart } } }),
        prisma.order.findMany({ where: { status: { in: [...paidStatuses] }, paidAt: { gte: trendStart } }, select: { totalKobo: true, paidAt: true } }),
        prisma.orderItem.findMany({ where: { order: { status: { in: [...paidStatuses] } } }, select: { productSlug: true, productName: true, quantity: true, lineTotalKobo: true } }),
        prisma.customer.findMany({ select: { id: true, orders: { where: { status: { in: [...paidStatuses] } }, select: { id: true } } } }),
      ])
    : [0, 0, 0, 0, { _sum: { totalKobo: 0 } }, [], [], [], { _sum: { totalKobo: 0 } }, { _sum: { totalKobo: 0 } }, 0, 0, [], [], []];

  const lowStock = inventory.filter(item => item.isActive && item.stock > 0 && item.stock <= item.reorderLevel);
  const outOfStock = inventory.filter(item => !item.isActive || item.stock === 0);
  const repeatCustomers = customerOrderCounts.filter(customer => customer.orders.length > 1).length;
  const averageOrderKobo = paidOrders ? Math.round((revenue._sum.totalKobo || 0) / paidOrders) : 0;

  const trendMap = new Map<string, { revenueKobo: number; orders: number }>();
  for (const order of trendOrders) {
    if (!order.paidAt) continue;
    const key = dayKey(order.paidAt);
    const current = trendMap.get(key) || { revenueKobo: 0, orders: 0 };
    current.revenueKobo += order.totalKobo;
    current.orders += 1;
    trendMap.set(key, current);
  }
  const trendPoints = Array.from({ length: 14 }, (_, index) => {
    const date = lagosBoundary("day", index - 13);
    const key = dayKey(date);
    const value = trendMap.get(key) || { revenueKobo: 0, orders: 0 };
    return { label: shortDay(date), ...value };
  });

  const productMap = new Map<string, { name: string; units: number; revenueKobo: number }>();
  for (const item of productItems) {
    const current = productMap.get(item.productSlug) || { name: item.productName, units: 0, revenueKobo: 0 };
    current.units += item.quantity;
    current.revenueKobo += item.lineTotalKobo;
    productMap.set(item.productSlug, current);
  }
  const topProducts = [...productMap.values()].sort((a, b) => b.revenueKobo - a.revenueKobo).slice(0, 5);
  const maxProductRevenue = Math.max(...topProducts.map(product => product.revenueKobo), 1);

  return <section className="section admin-shell"><div className="container">
    <AdminNav />
    <div className="admin-heading admin-dashboard-heading"><div><span className="eyebrow">Bridgecare business intelligence</span><h1>Executive dashboard</h1><p>Monitor revenue, orders, customers, product performance and inventory from one live workspace.</p></div><div className="executive-heading-actions"><Link className="button secondary" href="/admin/reports">Export reports</Link><Link className="button" href="/" target="_blank">Open storefront</Link></div></div>
    {!configured ? <div className="admin-alert">DATABASE_URL is not configured.</div> : <>
      <div className="executive-kpis">
        <article className="executive-kpi featured"><span>Today&apos;s revenue</span><strong>{naira(todayRevenue._sum.totalKobo || 0)}</strong><small>{ordersToday} orders created today</small></article>
        <article className="executive-kpi"><span>This month</span><strong>{naira(monthRevenue._sum.totalKobo || 0)}</strong><small>{naira(averageOrderKobo)} average paid order</small></article>
        <article className="executive-kpi"><span>Pending orders</span><strong>{pendingOrders}</strong><Link href="/admin/orders?status=PENDING_PAYMENT">Review pending</Link></article>
        <article className="executive-kpi"><span>Delivered today</span><strong>{deliveredToday}</strong><Link href="/admin/orders?status=DELIVERED">View deliveries</Link></article>
        <article className="executive-kpi"><span>Total customers</span><strong>{customerCount}</strong><small>{repeatCustomers} repeat customers</small></article>
        <article className="executive-kpi warning"><span>Stock alerts</span><strong>{lowStock.length + outOfStock.length}</strong><Link href="/admin/products">Manage inventory</Link></article>
      </div>

      <div className="executive-main-grid">
        <article className="admin-report-panel executive-sales-panel">
          <div className="admin-panel-heading"><div><span className="executive-panel-label">Last 14 days</span><h2>Revenue trend</h2></div><strong>{naira(revenue._sum.totalKobo || 0)} lifetime</strong></div>
          <SalesTrendChart points={trendPoints} />
        </article>

        <article className="admin-report-panel executive-product-panel">
          <div className="admin-panel-heading"><div><span className="executive-panel-label">Sales mix</span><h2>Top products</h2></div><Link href="/admin/reports">Full report</Link></div>
          <div className="executive-product-list">{topProducts.length ? topProducts.map((product, index) => <div key={product.name} className="executive-product-row"><span className="executive-rank">{index + 1}</span><div><strong>{product.name}</strong><small>{product.units} units · {naira(product.revenueKobo)}</small><i><b style={{ width: `${Math.max(6, product.revenueKobo / maxProductRevenue * 100)}%` }} /></i></div></div>) : <div className="admin-empty">No paid product sales yet.</div>}</div>
        </article>
      </div>

      <div className="admin-quick-grid executive-quick-grid">
        <Link href="/admin/orders"><span>Process orders</span><strong>{paidOrders} paid orders</strong></Link>
        <Link href="/admin/products"><span>Inventory</span><strong>{inventory.reduce((sum, item) => sum + item.stock, 0)} total units</strong></Link>
        <Link href="/admin/prices"><span>Pricing</span><strong>Update selling prices</strong></Link>
        <Link href="/admin/shipping"><span>Shipping</span><strong>Manage zones and rates</strong></Link>
        <Link href="/admin/customers"><span>CRM</span><strong>{repeatCustomers} repeat customers</strong></Link>
        <Link href="/admin/reports"><span>Analytics</span><strong>Download sales data</strong></Link>
      </div>

      {(lowStock.length > 0 || outOfStock.length > 0) && <article className="admin-report-panel stock-attention-panel">
        <div className="admin-panel-heading"><h2>Stock requiring attention</h2><Link href="/admin/products">Manage stock</Link></div>
        <div className="stock-attention-list">{inventory.filter(item => !item.isActive || item.stock <= item.reorderLevel).map(item => <div key={item.id}><span><strong>{item.productName}</strong><small>{item.sku} · reorder at {item.reorderLevel}</small></span><b>{item.stock} units</b></div>)}</div>
      </article>}

      <div className="dashboard-content-grid">
        <article className="admin-report-panel">
          <div className="admin-panel-heading"><h2>Latest orders</h2><Link href="/admin/orders">View all</Link></div>
          {recent.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead><tbody>
            {recent.map(order => <tr key={order.id}><td><Link href={`/admin/orders/${order.id}`}><strong>{order.orderNumber}</strong></Link></td><td>{order.customerName}<small>{order.customerEmail}</small></td><td><strong>{naira(order.totalKobo)}</strong></td><td>{order.payment?.status || "PENDING"}</td><td>{order.status.replaceAll("_", " ")}</td><td>{adminDate(order.createdAt)}</td></tr>)}
          </tbody></table></div> : <div className="admin-empty">No orders yet.</div>}
        </article>

        <article className="admin-report-panel dashboard-customer-panel">
          <div className="admin-panel-heading"><h2>Newest customers</h2><Link href="/admin/customers">View all</Link></div>
          <div className="dashboard-customer-list">{recentCustomers.length ? recentCustomers.map(customer => {
            const paidSpend = customer.orders.filter(order => paidStatuses.includes(order.status as PaidStatus)).reduce((sum, order) => sum + order.totalKobo, 0);
            return <Link href={`/admin/customers/${customer.id}`} key={customer.id}><span><strong>{customer.name}</strong><small>{customer.email}</small></span><b>{naira(paidSpend)}</b></Link>;
          }) : <div className="admin-empty">No customers yet.</div>}</div>
        </article>
      </div>
    </>}
  </div></section>;
}
