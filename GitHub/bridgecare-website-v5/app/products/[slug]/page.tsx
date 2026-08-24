import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, MessageCircle, ShieldCheck, Sparkles, UserRoundCheck } from 'lucide-react';
import { AddToCartButton, CartButton } from '../../components/Cart';
import { getProductBySlug, products } from '../../../lib/products';
import StructuredData from '../../components/StructuredData';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}/` },
    openGraph: { title: product.name, description: product.summary, url: `/products/${product.slug}/`, images: [{ url: product.image, alt: product.name }], type: 'website' },
    twitter: { card: 'summary_large_image', title: product.name, description: product.summary, images: [product.image] },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);
  const cartProduct = { slug: product.slug, name: product.name, price: product.priceValue, priceLabel: product.price, image: product.image };
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: `https://bridgecarepharma.com${product.image}`,
    description: product.summary,
    brand: { '@type': 'Brand', name: 'Bridgecare Pharmaceuticals' },
    category: product.categoryLabel,
    offers: {
      '@type': 'Offer',
      url: `https://bridgecarepharma.com/products/${product.slug}/`,
      priceCurrency: 'NGN',
      price: product.priceValue,
      seller: { '@type': 'Organization', name: 'Bridgecare Pharmaceuticals Limited' },
    },
  };

  return <><StructuredData data={productSchema}/><main className="productPage" style={{ '--accent': product.accent } as React.CSSProperties}>
    <div className="container">
      <div className="productTopbar"><Link className="back" href="/#products"><ArrowLeft size={18}/> Back to products</Link><CartButton/></div>
      <section className="productDetail">
        <div className="detailImage"><Image src={product.image} alt={product.name} width={850} height={650} priority sizes="(max-width: 900px) 92vw, 48vw"/></div>
        <div className="detailCopy"><span className="kicker">{product.categoryLabel}</span><h1>{product.name}</h1><p className="lead">{product.overview}</p>
          <div className="productBenefitList">{product.benefits.map((benefit)=><span key={benefit.label}><CheckCircle2 size={19}/>{benefit.label}</span>)}</div>
          <div className="detailPrice">{product.price}</div>
          <div className="detailActions"><AddToCartButton className="primary detailAdd" product={cartProduct}/><a className="secondary" href={product.paystack} target="_blank" rel="noreferrer">Buy now <ArrowRight size={18}/></a></div>
          <a className="whatsappProduct" href={`https://wa.me/2348077733373?text=${encodeURIComponent(`Hello Bridgecare, I would like to ask about ${product.name}.`)}`} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Ask about this product</a>
        </div>
      </section>

      <section className="productInfoGrid">
        <article><Sparkles/><h2>Who it may suit</h2><ul>{product.whoFor.map((item)=><li key={item}>{item}</li>)}</ul></article>
        <article><UserRoundCheck/><h2>Directions for use</h2><p>{product.directions}</p></article>
        <article><ShieldCheck/><h2>Important information</h2><ul>{product.keyInformation.map((item)=><li key={item}>{item}</li>)}</ul></article>
      </section>

      <section className="productFaq"><div><span className="kicker">Product questions</span><h2>Frequently asked questions</h2><p>These answers are general education and do not replace personalised medical advice.</p></div><div>{product.faqs.map((faq)=><details key={faq.question}><summary><HelpCircle size={19}/>{faq.question}<ArrowRight size={17}/></summary><p>{faq.answer}</p></details>)}</div></section>

      <aside className="medicalNotice"><ShieldCheck/><p><strong>Important:</strong> Product information is for general education only. It does not diagnose, treat, cure or prevent disease and does not replace advice from a doctor, pharmacist or other qualified healthcare professional. Always follow the pack label and professional guidance.</p></aside>

      <section className="relatedProducts"><div className="relatedHeading"><div><span className="kicker">Explore more</span><h2>Related Bridgecare products</h2></div><Link href="/#products">View all products <ArrowRight size={17}/></Link></div><div className="relatedGrid">{related.map((item)=><article key={item.slug} style={{'--accent':item.accent} as React.CSSProperties}><div><Image src={item.image} alt={item.name} width={420} height={300} loading="lazy" sizes="(max-width: 760px) 90vw, 30vw"/></div><span>{item.categoryLabel}</span><h3>{item.name}</h3><p>{item.price}</p><Link href={`/products/${item.slug}`}>View product <ArrowRight size={16}/></Link></article>)}</div></section>
    </div>
  </main></>;
}
