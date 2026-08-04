import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/admin/PrintButton";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Packing Slip", robots: { index: false, follow: false } };

export default async function PackingSlipPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return <main className="admin-document-shell">
    <div className="admin-document-actions no-print"><Link className="button secondary" href={`/admin/orders/${order.id}`}>Back to order</Link><PrintButton label="Print packing slip" /></div>
    <article className="admin-document packing-slip">
      <header className="admin-document-header"><div><p className="eyebrow">Bridgecare Pharmaceuticals Limited</p><h1>Packing slip</h1></div><div className="admin-document-meta"><strong>{order.orderNumber}</strong><span>Placed {adminDate(order.createdAt)}</span><span>Status: {order.status.replaceAll("_", " ")}</span></div></header>
      <section className="packing-address"><h2>Delivery address</h2><p><strong>{order.recipientName}</strong><br/>{order.recipientPhone}<br/>{order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}<br/>{order.city}, {order.lga}, {order.state}{order.postalCode ? ` ${order.postalCode}` : ""}</p>{order.landmark ? <p><strong>Landmark:</strong> {order.landmark}</p> : null}{order.deliveryInstructions ? <p><strong>Delivery instructions:</strong> {order.deliveryInstructions}</p> : null}</section>
      <table className="admin-document-table packing-table"><thead><tr><th>Check</th><th>Product</th><th>Quantity</th></tr></thead><tbody>{order.items.map(item => <tr key={item.id}><td className="packing-check">□</td><td>{item.productName}</td><td><strong>{item.quantity}</strong></td></tr>)}</tbody></table>
      <section className="packing-signoff"><p>Packed by: _________________________</p><p>Date: _________________________</p><p>Courier/rider: _________________________</p></section>
    </article>
  </main>;
}
