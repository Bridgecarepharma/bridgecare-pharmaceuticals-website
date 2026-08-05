import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate, naira } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order Details", robots: { index: false, follow: false } };

const statuses = ["PENDING_PAYMENT", "PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED", "CANCELLED", "REFUNDED"];

export default async function OrderDetails({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  if (!process.env.DATABASE_URL) return <section className="section admin-shell"><div className="container"><AdminNav/><div className="admin-alert">DATABASE_URL is not configured.</div></div></section>;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true, payment: true, statusHistory: { orderBy: { createdAt: "desc" } } } });
  if (!order) notFound();
  const whatsappPhone = order.customerPhone.replace(/\D/g, "").replace(/^0/, "234");
  const whatsappText = encodeURIComponent(`Hello ${order.customerName}, this is Bridgecare Pharmaceuticals regarding order ${order.orderNumber}.`);

  return <section className="section admin-shell"><div className="container"><AdminNav/>
    <div className="admin-heading admin-order-heading"><div><span className="eyebrow">Order management</span><h1>{order.orderNumber}</h1><p>Placed {adminDate(order.createdAt)} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} pack(s)</p></div><div className="admin-order-actions"><Link className="button secondary" href={`/admin/orders/${order.id}/invoice`}>Invoice</Link><Link className="button secondary" href={`/admin/orders/${order.id}/packing-slip`}>Packing slip</Link><a className="button secondary" href={`https://wa.me/${whatsappPhone}?text=${whatsappText}`} target="_blank" rel="noreferrer">WhatsApp customer</a></div></div>
    {saved ? <div className="admin-success">Order updated successfully.</div> : null}
    <div className="admin-order-state"><span className={`admin-status status-${order.status.toLowerCase().replaceAll("_", "-")}`}>{order.status.replaceAll("_", " ")}</span><span className={`admin-status status-${(order.payment?.status || "PENDING").toLowerCase()}`}>Payment {order.payment?.status || "PENDING"}</span>{order.trackingNumber ? <span className="tracking-chip">Tracking: {order.trackingNumber}</span> : null}</div>
    <div className="admin-detail-grid">
      <article className="admin-card"><h2>Customer & delivery</h2><p><strong>{order.customerName}</strong><br/><a href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a><br/><a href={`tel:${order.customerPhone}`}>{order.customerPhone}</a></p><p><strong>Recipient:</strong> {order.recipientName}, {order.recipientPhone}<br/>{order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}<br/>{order.city}, {order.lga}, {order.state}</p>{order.landmark ? <p><strong>Landmark:</strong> {order.landmark}</p> : null}{order.deliveryInstructions ? <p><strong>Delivery instructions:</strong> {order.deliveryInstructions}</p> : null}</article>
      <article className="admin-card"><h2>Payment summary</h2><p>Subtotal: <strong>{naira(order.subtotalKobo)}</strong><br/>Shipping: <strong>{naira(order.shippingKobo)}</strong><br/>{order.discountKobo > 0 && <>Coupon {order.couponCode || "discount"}: <strong>-{naira(order.discountKobo)}</strong><br/></>}Total: <strong>{naira(order.totalKobo)}</strong></p><p>Payment: <strong>{order.payment?.status || "PENDING"}</strong><br/>Channel: {order.paymentChannel || order.payment?.channel || "—"}<br/>Paid: {order.paidAt ? adminDate(order.paidAt) : "Not yet"}<br/>Reference: <small>{order.paystackReference}</small></p></article>
    </div>
    <article className="admin-card"><h2>Items to fulfil</h2>{order.items.map(item => <div className="admin-line-item" key={item.id}><span>{item.quantity} × {item.productName}<small>{naira(item.unitPriceKobo)} each</small></span><strong>{naira(item.lineTotalKobo)}</strong></div>)}</article>
    <article className="admin-card"><h2>Fulfilment update</h2><form className="form admin-order-form" action={`/api/admin/orders/${order.id}`} method="post"><label>Status<select name="status" defaultValue={order.status}>{statuses.map(s => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}</select></label><label>Tracking number<input name="trackingNumber" defaultValue={order.trackingNumber || ""} placeholder="Courier tracking or rider reference" /></label><label>Status note<input name="statusNote" placeholder="Optional note for this status change" /></label><label className="full">Internal staff notes<textarea name="internalNotes" rows={5} defaultValue={order.internalNotes || ""} placeholder="Private notes visible only to administrators" /></label><button className="button" type="submit">Save order update</button></form></article>
    <article className="admin-card"><h2>Status timeline</h2>{order.statusHistory.length ? order.statusHistory.map(entry => <div className="admin-history" key={entry.id}><strong>{entry.status.replaceAll("_", " ")}</strong><span>{adminDate(entry.createdAt)}</span>{entry.note ? <small>{entry.note}</small> : null}</div>) : <p>No status changes recorded yet.</p>}</article>
  </div></section>;
}
