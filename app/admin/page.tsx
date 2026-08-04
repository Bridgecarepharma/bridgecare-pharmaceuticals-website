import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate, naira } from "@/lib/admin-format";
import { ensureInventoryProducts } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Dashboard", robots: { index: false, follow: false } };
const paidStatuses = ["PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED"] as const;

export default async function AdminDashboard() {
  await requireAdmin();
  const configured = Boolean(process.env.DATABASE_URL);
  if (configured) await ensureInventoryProducts();

  const [totalOrders, paidOrders, pendingOrders, customerCount, revenue, recent, inventory, recentCustomers] = configured
    ? await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: { in: [...paidStatuses] } } }),
        prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
        prisma.customer.count(),
        prisma.order.aggregate({ _sum: { totalKobo: true }, where: { status: { in: [...paidStatuses] } } }),
        prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { payment: true } }),
        prisma.inventory.findMany({ orderBy: { productName: "asc" } }),
        prisma.customer.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { orders: { select: { totalKobo: true, status: true } } } }),
      ])
    : [0, 0, 0, 0, { _sum: { totalKobo: 0 } }, [], [], []];

  const lowStock = inventory.filter(item => item.isActive && item.stock <= item.reorderLevel);
  const outOfStock = inventory.filter(item => !item.isActive || item.stock === 0);

  return <section className="section admin-shell"><div className="container">
    <AdminNav />
    <div className="admin-heading admin-dashboard-heading"><div><span className="eyebrow">Bridgecare operations</span><h1>Admin dashboard</h1><p>Manage products, prices, stock, orders, customers and sales from one place.</p></div><Link className="button secondary" href="/" target="_blank">Open storefront</Link></div>
    {!configured ? <div className="admin-alert">DATABASE_URL is not configured.</div> : <>
      <div className="admin-kpis dashboard-kpis">
        <article><span>Total orders</span><strong>{totalOrders}</strong><Link href="/admin/orders">View orders</Link></article>
        <article><span>Paid orders</span><strong>{paidOrders}</strong><Link href="/admin/orders?status=PAID">Review paid</Link></article>
        <article><span>Pending payment</span><strong>{pendingOrders}</strong><Link href="/admin/orders?status=PENDING_PAYMENT">Follow up</Link></article>
        <article><span>Customers</span><strong>{customerCount}</strong><Link href="/admin/customers">View customers</Link></article>
        <article><span>Recorded revenue</span><strong>{naira(revenue._sum.totalKobo || 0)}</strong><Link href="/admin/reports">Open analytics</Link></article>
        <article><span>Low / out of stock</span><strong>{lowStock.length + outOfStock.length}</strong><Link href="/admin/products">Update stock</Link></article>
      </div>

      <div className="admin-quick-grid">
        <Link href="/admin/products"><span>Products & stock</span><strong>Update quantities and availability</strong></Link>
        <Link href="/admin/prices"><span>Product prices</span><strong>Change live selling prices</strong></Link>
        <Link href="/admin/orders"><span>Orders</span><strong>Process and dispatch orders</strong></Link>
        <Link href="/admin/customers"><span>Customers</span><strong>Review contact and order history</strong></Link>
        <Link href="/admin/reports"><span>Sales analytics</span><strong>Revenue and product performance</strong></Link>
      </div>

      {(lowStock.length > 0 || outOfStock.length > 0) && <article className="admin-report-panel stock-attention-panel">
        <div className="admin-panel-heading"><h2>Stock requiring attention</h2><Link href="/admin/products">Manage stock</Link></div>
        <div className="stock-attention-list">{inventory.filter(item => !item.isActive || item.stock <= item.reorderLevel).map(item => <div key={item.id}><span><strong>{item.productName}</strong><small>{item.sku}</small></span><b>{item.stock} units</b></div>)}</div>
      </article>}

      <div className="dashboard-content-grid">
        <article className="admin-report-panel">
          <div className="admin-panel-heading"><h2>Recent orders</h2><Link href="/admin/orders">View all</Link></div>
          {recent.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead><tbody>
            {recent.map(order => <tr key={order.id}><td><Link href={`/admin/orders/${order.id}`}><strong>{order.orderNumber}</strong></Link></td><td>{order.customerName}<small>{order.customerEmail}</small></td><td><strong>{naira(order.totalKobo)}</strong></td><td>{order.payment?.status || "PENDING"}</td><td>{order.status.replaceAll("_", " ")}</td><td>{adminDate(order.createdAt)}</td></tr>)}
          </tbody></table></div> : <div className="admin-empty">No orders yet.</div>}
        </article>

        <article className="admin-report-panel dashboard-customer-panel">
          <div className="admin-panel-heading"><h2>Newest customers</h2><Link href="/admin/customers">View all</Link></div>
          <div className="dashboard-customer-list">{recentCustomers.length ? recentCustomers.map(customer => {
            const paidSpend = customer.orders.filter(order => paidStatuses.includes(order.status as typeof paidStatuses[number])).reduce((sum, order) => sum + order.totalKobo, 0);
            return <Link href={`/admin/customers/${customer.id}`} key={customer.id}><span><strong>{customer.name}</strong><small>{customer.email}</small></span><b>{naira(paidSpend)}</b></Link>;
          }) : <div className="admin-empty">No customers yet.</div>}</div>
        </article>
      </div>
    </>}
  </div></section>;
}
