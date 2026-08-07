import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate, naira } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Customer Details", robots: { index: false, follow: false } };

export default async function CustomerDetails({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(); const { id } = await params;
  const customer = process.env.DATABASE_URL ? await prisma.customer.findUnique({ where: { id }, include: { orders: { orderBy: { createdAt: "desc" }, include: { payment: true } } } }) : null;
  if (!customer) notFound();
  const paid = customer.orders.filter(o => ["PAID","PROCESSING","PACKED","DISPATCHED","DELIVERED"].includes(o.status));
  return <section className="section admin-shell"><div className="container"><AdminNav/>
    <div className="admin-heading"><div><span className="eyebrow">Customer profile</span><h1>{customer.name}</h1><p>{customer.email} · {customer.phone}</p></div></div>
    <div className="admin-kpis"><article><span>Total orders</span><strong>{customer.orders.length}</strong></article><article><span>Paid orders</span><strong>{paid.length}</strong></article><article><span>Lifetime spend</span><strong>{naira(paid.reduce((sum,o)=>sum+o.totalKobo,0))}</strong></article><article><span>Customer since</span><strong className="admin-kpi-date">{adminDate(customer.createdAt)}</strong></article></div>
    <div className="admin-panel-heading"><h2>Order history</h2></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead><tbody>{customer.orders.map(order => <tr key={order.id}><td><Link href={`/admin/orders/${order.id}`}><strong>{order.orderNumber}</strong></Link></td><td>{naira(order.totalKobo)}</td><td>{order.payment?.status || "PENDING"}</td><td>{order.status.replaceAll("_"," ")}</td><td>{adminDate(order.createdAt)}</td></tr>)}</tbody></table></div>
  </div></section>;
}
