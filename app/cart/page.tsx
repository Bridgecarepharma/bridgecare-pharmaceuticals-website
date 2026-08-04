import Link from "next/link";
import { products, cartPaymentLink } from "@/data/site";
import { formatNaira } from "@/lib/store";

export const metadata = { title: "Order Products" };

export default function OrderPage() {
  return <>
    <section className="page-hero"><div className="container narrow"><span className="eyebrow">Secure payment</span><h1>Order Bridgecare Products</h1><p>Select a product and complete payment securely on Paystack. For mixed-product or bulk orders, use the combined-order link or contact us on WhatsApp.</p></div></section>
    <section className="section"><div className="container"><div className="product-grid">
      {products.map(product => <article className={`product-card ${product.accent}`} key={product.slug}>
        <span className="eyebrow product-category">{product.category}</span><h2>{product.name}</h2><p>{product.summary}</p><strong className="product-price">{formatNaira(product.priceKobo)}</strong>
        <div className="product-card-actions"><a className="button" href={product.paymentLink} target="_blank" rel="noopener noreferrer">Pay with Paystack</a><Link className="text-link" href={`/products/${product.slug}`}>View details</Link></div>
      </article>)}
    </div><div className="notice" style={{marginTop:"2rem"}}><strong>Ordering more than one product?</strong> Use the <a href={cartPaymentLink} target="_blank" rel="noopener noreferrer">combined-order payment link</a>, or contact Bridgecare so delivery and free-shipping eligibility can be confirmed.</div></div></section>
  </>;
}
