import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/admin/PrintButton";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate, naira } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order Invoice", robots: { index: false, follow: false } };

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true, payment: true } });
  if (!order) notFound();

  return <main className="admin-document-shell">
    <div className="admin-document-actions no-print"><Link className="button secondary" href={`/admin/orders/${order.id}`}>Back to order</Link><PrintButton label="Print invoice" /></div>
    <article className="admin-document">
      <header className="admin-document-header"><div><p className="eyebrow">Bridgecare Pharmaceuticals Limited</p><h1>Invoice</h1><p>Customer support: +234 807 773 3373<br/>info@bridgecarepharmang.com</p></div><div className="admin-document-meta"><strong>{order.orderNumber}</strong><span>Issued {adminDate(order.createdAt)}</span><span>Payment: {order.payment?.status || "PENDING"}</span></div></header>
      <div className="admin-document-grid"><section><h2>Bill to</h2><p><strong>{order.customerName}</strong><br/>{order.customerEmail}<br/>{order.customerPhone}</p></section><section><h2>Deliver to</h2><p><strong>{order.recipientName}</strong><br/>{order.recipientPhone}<br/>{order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}<br/>{order.city}, {order.lga}, {order.state}</p></section></div>
      <table className="admin-document-table"><thead><tr><th>Product</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead><tbody>{order.items.map(item => <tr key={item.id}><td>{item.productName}</td><td>{item.quantity}</td><td>{naira(item.unitPriceKobo)}</td><td>{naira(item.lineTotalKobo)}</td></tr>)}</tbody></table>
      <div className="admin-document-totals"><p><span>Subtotal</span><strong>{naira(order.subtotalKobo)}</strong></p><p><span>Delivery</span><strong>{naira(order.shippingKobo)}</strong></p><p className="grand"><span>Total</span><strong>{naira(order.totalKobo)}</strong></p></div>
      <footer className="admin-document-footer"><p>Thank you for choosing Bridgecare Pharmaceuticals Limited.</p><p>Paystack reference: {order.paystackReference}</p></footer>
    </article>
  </main>;
}
