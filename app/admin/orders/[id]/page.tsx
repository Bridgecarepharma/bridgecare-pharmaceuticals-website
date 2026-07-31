import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate, naira } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order Details", robots: { index: false, follow: false } };

export default async function OrderDetails({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  if (!process.env.DATABASE_URL) return <section className="section admin-shell"><div className="container"><AdminNav/><div className="admin-alert">DATABASE_URL is not configured.</div></div></section>;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true, payment: true, statusHistory: { orderBy: { createdAt: "desc" } } } });
  if (!order) notFound();
  const statuses = ["PENDING_PAYMENT", "PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED", "CANCELLED", "REFUNDED"];
  return <section className="section admin-shell"><div className="container"><AdminNav/>
    <div className="admin-heading"><div><span className="eyebrow">Order details</span><h1>{order.orderNumber}</h1><p>Placed {adminDate(order.createdAt)}</p></div></div>
    {saved ? <div className="admin-success">Order updated successfully.</div> : null}
    <div className="admin-detail-grid">
      <article className="admin-card"><h2>Customer & delivery</h2><p><strong>{order.customerName}</strong><br/>{order.customerEmail}<br/>{order.customerPhone}</p><p><strong>Recipient:</strong> {order.recipientName}, {order.recipientPhone}<br/>{order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}<br/>{order.city}, {order.lga}, {order.state}</p>{order.deliveryInstructions ? <p><strong>Instructions:</strong> {order.deliveryInstructions}</p> : null}</article>
      <article className="admin-card"><h2>Payment summary</h2><p>Subtotal: <strong>{naira(order.subtotalKobo)}</strong><br/>Shipping: <strong>{naira(order.shippingKobo)}</strong><br/>Total: <strong>{naira(order.totalKobo)}</strong></p><p>Payment: <strong>{order.payment?.status || "PENDING"}</strong><br/>Channel: {order.paymentChannel || order.payment?.channel || "—"}<br/>Paid: {order.paidAt ? adminDate(order.paidAt) : "Not yet"}</p></article>
    </div>
    <article className="admin-card"><h2>Items</h2>{order.items.map(item => <div className="admin-line-item" key={item.id}><span>{item.quantity} × {item.productName}</span><strong>{naira(item.lineTotalKobo)}</strong></div>)}</article>
    <article className="admin-card"><h2>Fulfilment</h2><form className="form" action={`/api/admin/orders/${order.id}`} method="post"><label>Status<select name="status" defaultValue={order.status}>{statuses.map(s => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}</select></label><label>Tracking number<input name="trackingNumber" defaultValue={order.trackingNumber || ""} /></label><label>Internal notes<textarea name="internalNotes" rows={5} defaultValue={order.internalNotes || ""} /></label><button className="button" type="submit">Save order</button></form></article>
    <article className="admin-card"><h2>Status history</h2>{order.statusHistory.length ? order.statusHistory.map(entry => <div className="admin-history" key={entry.id}><strong>{entry.status.replaceAll("_", " ")}</strong><span>{adminDate(entry.createdAt)}</span>{entry.note ? <small>{entry.note}</small> : null}</div>) : <p>No status changes recorded yet.</p>}</article>
  </div></section>;
}
