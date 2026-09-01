import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/admin/PrintButton";
import { requireAdmin } from "@/lib/admin-auth";
import { adminDate } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Delivery Waybill", robots: { index: false, follow: false } };
const CODE39: Record<string, string> = {
  "0":"nnnwwnwnn","1":"wnnwnnnnw","2":"nnwwnnnnw","3":"wnwwnnnnn","4":"nnnwwnnnw",
  "5":"wnnwwnnnn","6":"nnwwwnnnn","7":"nnnwnnwnw","8":"wnnwnnwnn","9":"nnwwnnwnn",
  "A":"wnnnnwnnw","B":"nnwnnwnnw","C":"wnwnnwnnn","D":"nnnnwwnnw","E":"wnnnwwnnn",
  "F":"nnwnwwnnn","G":"nnnnnwwnw","H":"wnnnnwwnn","I":"nnwnnwwnn","J":"nnnnwwwnn",
  "K":"wnnnnnnww","L":"nnwnnnnww","M":"wnwnnnnwn","N":"nnnnwnnww","O":"wnnnwnnwn",
  "P":"nnwnwnnwn","Q":"nnnnnnwww","R":"wnnnnnwwn","S":"nnwnnnwwn","T":"nnnnwnwwn",
  "U":"wwnnnnnnw","V":"nwwnnnnnw","W":"wwwnnnnnn","X":"nwnnwnnnw","Y":"wwnnwnnnn",
  "Z":"nwwnwnnnn","-":"nwnnnnwnw",".":"wwnnnnwnn"," ":"nwwnnnwnn","*":"nwnnwnwnn"
};

function Code39Barcode({ value }: { value: string }) {
  const text = value.toUpperCase().replace(/[^0-9A-Z.\- ]/g, "");
  const encoded = `*${text}*`;
  const narrow = 1;
  const wide = 2.6;
  const gap = 1;
  let x = 0;
  const bars: Array<{ x: number; width: number }> = [];

  for (const char of encoded) {
    const pattern = CODE39[char] || CODE39["-"];
    pattern.split("").forEach((kind, index) => {
      const width = kind === "w" ? wide : narrow;
      if (index % 2 === 0) bars.push({ x, width });
      x += width;
    });
    x += gap;
  }

  return (
    <div className="waybill-barcode" aria-label={`Barcode ${text}`}>
      <svg viewBox={`0 0 ${x} 42`} role="img" preserveAspectRatio="none" shapeRendering="crispEdges">
        {bars.map((bar, index) => <rect key={index} x={bar.x} y="0" width={bar.width} height="42" fill="currentColor" />)}
      </svg>
      <strong>{text}</strong>
    </div>
  );
}


export default async function WaybillPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  const totalPacks = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return <main className="waybill-screen">
    <div className="waybill-actions no-print">
      <Link className="button secondary" href={`/admin/orders/${order.id}`}>Back to order</Link>
      <PrintButton label="Print waybill" />
    </div>

    <article className="waybill-label">
      <header className="waybill-header">
        <Image src="/images/brand/bridgecare-logo.png" alt="Bridgecare Pharmaceuticals Limited" width={250} height={90} className="waybill-logo" priority />
        <div className="waybill-title"><strong>DELIVERY</strong><span>WAYBILL</span></div>
      </header>

      <section className="waybill-order-row">
        <div><small>ORDER NO.</small><strong>{order.orderNumber}</strong></div>
        <div className="waybill-date"><small>ORDER DATE</small><strong>{adminDate(order.createdAt)}</strong></div>
      </section>

      <section className="waybill-recipient">
        <small>DELIVER TO</small>
        <h1>{order.recipientName || order.customerName}</h1>
        <a href={`tel:${order.recipientPhone || order.customerPhone}`}>{order.recipientPhone || order.customerPhone}</a>
        <p>{order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}<br/>{order.city}, {order.lga}, {order.state}{order.postalCode ? ` ${order.postalCode}` : ""}</p>
        {order.landmark ? <p className="waybill-callout"><strong>LANDMARK:</strong> {order.landmark}</p> : null}
        {order.deliveryInstructions ? <p className="waybill-callout"><strong>DELIVERY NOTE:</strong> {order.deliveryInstructions}</p> : null}
      </section>

      <section className="waybill-items">
        <div className="waybill-section-head"><small>PACKAGE CONTENT</small><strong>{totalPacks} PACK{totalPacks === 1 ? "" : "S"}</strong></div>
        {order.items.map(item => <div className="waybill-item" key={item.id}><span>{item.productName}</span><strong>× {item.quantity}</strong></div>)}
      </section>

      <footer className="waybill-footer">
        <div><small>FROM</small><strong>Bridgecare Pharmaceuticals Limited</strong><span>Lascofed Building, 13 Isaacstan Close, off Wemco Road, Ogba, Lagos.</span><span>0812 221 8470 · 0807 773 3373</span><span>bridgecarepharmang.com</span></div>
      </footer>

      <Code39Barcode value={order.orderNumber} />
    </article>

    <style>{`
      .waybill-screen{min-height:100vh;background:#eef3f6;padding:28px 16px 60px;font-family:Arial,Helvetica,sans-serif;color:#102f46}
      .waybill-actions{width:min(100%,720px);margin:0 auto 18px;display:flex;gap:10px;justify-content:flex-end}
      .waybill-label{box-sizing:border-box;width:100mm;min-height:150mm;margin:auto;background:#fff;border:1px solid #cbd5dc;box-shadow:0 12px 35px rgba(15,43,62,.12);padding:7mm;display:flex;flex-direction:column}
      .waybill-header{display:flex;align-items:center;justify-content:space-between;gap:8mm;padding-bottom:4mm;border-bottom:2px solid #0b76ad}
      .waybill-logo{width:49mm;height:auto;object-fit:contain;object-position:left center}
      .waybill-title{text-align:right;line-height:1}.waybill-title strong{display:block;font-size:17pt;letter-spacing:.04em}.waybill-title span{font-size:9pt;font-weight:800;letter-spacing:.22em;color:#4e6675}
      .waybill-order-row{display:grid;grid-template-columns:1.2fr .8fr;gap:4mm;padding:4mm 0;border-bottom:1px solid #cfd9df}.waybill-order-row>div{display:grid;gap:1mm}.waybill-order-row small,.waybill-recipient>small,.waybill-section-head small,.waybill-footer small{font-size:7.5pt;font-weight:900;letter-spacing:.12em;color:#657986}.waybill-order-row strong{font-size:10pt}.waybill-date{text-align:right}
      .waybill-recipient{padding:5mm 0;border-bottom:2px solid #173f58}.waybill-recipient h1{margin:1.5mm 0 0;font-size:19pt;line-height:1.08;text-transform:uppercase;letter-spacing:-.02em}.waybill-recipient>a{display:block;margin-top:2mm;font-size:15pt;font-weight:900;color:#102f46;text-decoration:none}.waybill-recipient>p{margin:2mm 0 0;font-size:11pt;font-weight:700;line-height:1.35;color:#233f50}.waybill-callout{padding:2mm 2.5mm;background:#f0f7fa;border-left:3px solid #0b76ad;font-size:9.5pt!important}.waybill-callout strong{color:#0b5f8b}
      .waybill-items{padding:4mm 0;flex:1}.waybill-section-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:2mm}.waybill-section-head>strong{font-size:9pt;padding:1mm 2.5mm;border-radius:999px;background:#e8f4fa;color:#0b5f8b}.waybill-item{display:flex;justify-content:space-between;gap:6mm;padding:2.2mm 0;border-bottom:1px dashed #ccd7dd;font-size:10pt;font-weight:700}.waybill-item strong{white-space:nowrap;font-size:11pt}
      .waybill-footer{padding-top:3mm;border-top:2px solid #173f58}.waybill-footer>div{display:grid;gap:.5mm}.waybill-footer strong{font-size:9pt}.waybill-footer span{font-size:7.4pt;line-height:1.25;color:#536b79}.waybill-barcode{padding-top:3mm;text-align:center;color:#071b2b}.waybill-barcode svg{display:block;width:100%;height:13mm}.waybill-barcode strong{display:block;margin-top:1mm;font-size:8pt;letter-spacing:.08em}
      @media(max-width:520px){.waybill-screen{padding:14px 8px 35px}.waybill-label{width:100%;min-height:auto;padding:18px}.waybill-logo{width:45%}.waybill-title strong{font-size:15pt}.waybill-recipient h1{font-size:17pt}.waybill-actions{justify-content:stretch}.waybill-actions>*{flex:1}}
      @page{size:100mm 150mm;margin:0}
      @media print{
        html,body{width:100mm!important;height:150mm!important;margin:0!important;padding:0!important;overflow:hidden!important;background:#fff!important}
        .site-header,.footer,.floating-contact,.cart-drawer-layer,.no-print,iframe,[id^="tawk"],[class*="tawk"]{display:none!important}
        .waybill-screen{position:fixed!important;inset:0!important;width:100mm!important;height:150mm!important;min-height:150mm!important;margin:0!important;padding:0!important;overflow:hidden!important;background:#fff!important;z-index:2147483647!important}
        .waybill-label{box-sizing:border-box!important;width:100mm!important;height:150mm!important;min-height:150mm!important;max-height:150mm!important;margin:0!important;border:0!important;box-shadow:none!important;padding:7mm!important;overflow:hidden!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
      }
    `}</style>
  </main>;
}
