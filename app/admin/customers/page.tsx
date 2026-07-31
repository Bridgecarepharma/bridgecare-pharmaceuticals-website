import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate, naira } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Customers", robots: { index: false, follow: false } };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const { q = "" } = await searchParams;
  const customers = process.env.DATABASE_URL ? await prisma.customer.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] } : undefined,
    include: { orders: { select: { id: true, totalKobo: true, status: true, createdAt: true } } }, orderBy: { createdAt: "desc" }, take: 200,
  }) : [];
  return <section className="section admin-shell"><div className="container"><AdminNav/>
    <div className="admin-heading"><div><span className="eyebrow">Bridgecare operations</span><h1>Customers</h1><p>Customer order history and lifetime value.</p></div></div>
    <form className="admin-filters" method="get"><input name="q" defaultValue={q} placeholder="Name, email or phone"/><button className="button" type="submit">Search</button><Link className="button secondary" href="/admin/customers">Clear</Link></form>
    {!process.env.DATABASE_URL ? <div className="admin-alert">DATABASE_URL is not configured.</div> : customers.length === 0 ? <div className="admin-empty">No matching customers found.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Phone</th><th>Orders</th><th>Lifetime spend</th><th>Last order</th></tr></thead><tbody>{customers.map(customer => {
      const paidOrders = customer.orders.filter(o => ["PAID","PROCESSING","PACKED","DISPATCHED","DELIVERED"].includes(o.status));
      const latest = customer.orders.sort((a,b) => b.createdAt.getTime()-a.createdAt.getTime())[0];
      return <tr key={customer.id}><td><Link href={`/admin/customers/${customer.id}`}><strong>{customer.name}</strong></Link><small>{customer.email}</small></td><td>{customer.phone}</td><td>{customer.orders.length}</td><td><strong>{naira(paidOrders.reduce((sum,o)=>sum+o.totalKobo,0))}</strong></td><td>{latest ? adminDate(latest.createdAt) : "—"}</td></tr>;
    })}</tbody></table></div>}
  </div></section>;
}
