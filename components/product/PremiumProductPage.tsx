import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BuyNowButton } from "@/components/cart/BuyNowButton";
import { BrandIcon } from "./BrandIcon";
import { IngredientCard, SafetyPanel, SectionTitle } from "./ProductPageSections";
import { formatNaira } from "@/lib/store";
import { BadgeCheck, Headphones, LockKeyhole, Truck } from "lucide-react";
import type { Product } from "@/data/products";
import { PRODUCTS } from "@/data/products";
import { ProductReviews } from "@/components/reviews/ProductReviews";

export async function PremiumProductPage({ product }: { product: Product }) {
  const related = PRODUCTS.filter((entry) => entry.slug !== product.slug).slice(0, 3);
  const imageVersion = `6.3.5-pack-${product.slug}`;
  const detailsImageVersion = `6.3.5-details-${product.slug}`;

  return <main key={product.slug} className={`product-page ${product.theme}-theme`}>
    <section className="premium-product-hero"><div className="container premium-product-grid">
      <div className="premium-pack-stage"><div className="pack-halo"/><div className="premium-pack-image"><Image key={`hero-${product.slug}`} src={`${product.image}?v=${imageVersion}`} alt={`${product.name} product information artwork`} fill priority unoptimized sizes="(max-width: 900px) 94vw, 48vw"/></div><div className="glass-pedestal"><span/></div></div>
      <div className="premium-product-copy"><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><p className="approved-indication">Product focus</p><h2>{product.indication}</h2><p className="lead">{product.summary}</p><div className="purchase-line"><strong>{formatNaira(product.priceKobo)}</strong><span>{product.packSize} per pack</span></div><div className="hero-actions"><AddToCartButton slug={product.slug} name={product.name} priceKobo={product.priceKobo}/><BuyNowButton slug={product.slug} name={product.name} priceKobo={product.priceKobo}/></div><div className="product-trust-badges"><span><LockKeyhole size={17}/><b>Secure Paystack</b><small>Protected payment</small></span><span><Truck size={17}/><b>Nationwide delivery</b><small>Rates shown at checkout</small></span><span><Headphones size={17}/><b>Customer support</b><small>Help when you need it</small></span><span><BadgeCheck size={17}/><b>Bridgecare direct</b><small>Order from the source</small></span></div></div>
    </div></section>

    <nav className="product-anchor-nav" aria-label="Product page sections"><div className="container"><a href="#overview">Overview</a><a href="#specifications">Specifications</a><a href="#ingredients">Composition</a><a href="#directions">Directions</a><a href="#safety">Safety</a><a href="#faq">FAQs</a><a href="#reviews">Reviews</a></div></nav>

    <section className="section" id="overview"><div className="container product-content-narrow"><SectionTitle eyebrow="Product efficacy" title={`Why choose ${product.name}?`} intro={product.overview}/><div className="product-description-copy">{product.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="why-grid">{product.reasons.map((reason) => <article className="product-info-card" key={reason.title}><BrandIcon symbol={reason.symbol}/><h3>{reason.title}</h3><p>{reason.text}</p></article>)}</div></div></section>

    <section className="section product-tint" id="specifications"><div className="container product-content-narrow"><SectionTitle eyebrow="Product specifications" title="At-a-glance product information"/><dl className="product-spec-grid">{product.specifications.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl></div></section>

    <section className="section" id="ingredients"><div className="container"><SectionTitle eyebrow="Composition" title="What the formulation contains" intro="Ingredient strengths and concise descriptions are presented from the supplied product information."/><div className="ingredient-grid">{product.ingredients.map((ingredient) => <IngredientCard key={ingredient.name} icon={<BrandIcon symbol={ingredient.symbol}/>} name={ingredient.name} strength={ingredient.strength}>{ingredient.summary || null}</IngredientCard>)}</div></div></section>

    <section className="section product-tint"><div className="container"><SectionTitle eyebrow="Key benefits" title="Nutritional and wellness support"/><div className="benefit-grid">{product.benefits.map((benefit) => <article className="product-info-card" key={benefit.title}><BrandIcon symbol={benefit.symbol}/><h3>{benefit.title}</h3><p>{benefit.text}</p></article>)}</div></div></section>

    {product.whoCanBenefit?.length ? <section className="section"><div className="container product-content-narrow"><SectionTitle eyebrow="Who can benefit?" title="Who this product may suit"/><ul className="product-check-list">{product.whoCanBenefit.map((item) => <li key={item}>{item}</li>)}</ul></div></section> : null}

    <section className="section directions-section" id="directions"><div className="container"><SectionTitle eyebrow="Suggested use" title="Easy-to-follow usage guidance"/><div className="dosage-layout">{product.directions.map((direction, index) => <article className={`dosage-card ${index === 0 ? "featured" : ""}`} key={direction.label}><span>{direction.label}</span><strong>{direction.value}</strong><p>{direction.text}</p></article>)}</div></div></section>

    <section className="section"><div className="container"><SectionTitle eyebrow="Storage" title="Protect product quality"/><div className="storage-grid">{product.storage.map((item) => <article className="product-info-card" key={item.title}><BrandIcon symbol={item.symbol}/><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>

    {product.highlights?.length ? <section className="section product-tint"><div className="container product-content-narrow"><SectionTitle eyebrow="Product highlights" title="Key reasons to choose this product"/><ul className="product-highlight-list">{product.highlights.map((item) => <li key={item}>{item}</li>)}</ul></div></section> : null}

    <section className="section" id="safety"><div className="container product-content-narrow"><SafetyPanel><h2>Warnings and safety information</h2><ul>{product.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></SafetyPanel>{product.nafdac ? <p className="regulatory-note">Pack reference supplied by Bridgecare: NAFDAC {product.nafdac}. Check the physical pack for current batch, manufacturing and expiry information.</p> : null}</div></section>

    {product.faqs.length ? <section className="section product-tint" id="faq"><div className="container product-content-narrow"><SectionTitle eyebrow="Frequently asked questions" title="Helpful answers before purchase"/><div className="faq-list">{product.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></div></section> : null}

    <section className="section product-detail-artwork-section" aria-labelledby={`product-artwork-${product.slug}`}><div className="container product-content-narrow"><SectionTitle eyebrow="Complete product guide" title={`${product.name} information artwork`} intro="Review the supplied product information artwork after reading the structured product details above."/><div className="product-detail-artwork"><Image src={`${product.detailsImage}?v=${detailsImageVersion}`} alt={`${product.name} complete product information guide`} width={1024} height={1536} unoptimized sizes="(max-width: 900px) 94vw, 900px"/></div></div></section>

    <ProductReviews key={`reviews-${product.slug}`} productSlug={product.slug} productName={product.name}/>

    <section className="section"><div className="container"><SectionTitle eyebrow="Resources" title="Product support and information"/><div className="resource-grid"><Link href="/downloads" className="resource-card"><BrandIcon symbol="PDF"/><h3>Product resources</h3><p>Access available product and corporate downloads.</p></Link><Link href="/contact" className="resource-card"><BrandIcon symbol="?"/><h3>Need more information?</h3><p>Speak with Bridgecare customer support.</p></Link></div></div></section>

    <section className="section product-tint"><div className="container"><SectionTitle eyebrow="Related products" title="Explore more from Bridgecare"/><div className="related-grid">{related.map((entry) => <Link href={`/products/${entry.slug}`} className="related-product" key={entry.slug}><span className="related-image"><Image key={`related-${entry.slug}`} src={`${entry.image}?v=6.3.5-pack-${entry.slug}`} alt={`${entry.name} product pack`} fill unoptimized sizes="180px"/></span><strong>{entry.name}</strong><small>{formatNaira(entry.priceKobo)}</small></Link>)}</div></div></section>

    <section className="product-closing-cta"><div className="container product-closing-grid"><div><span className="eyebrow">Shop directly from Bridgecare</span><h2>Order {product.name} securely</h2><p>Clear delivery fees and free shipping when your basket contains any three packs or more.</p></div><div className="closing-purchase"><strong>{formatNaira(product.priceKobo)}</strong><AddToCartButton slug={product.slug} name={product.name} priceKobo={product.priceKobo}/><Link className="button secondary" href="/products">Explore all products</Link></div></div></section>
  </main>;
}
