import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Bone,
  Brain,
  CheckCircle2,
  Droplets,
  Flower2,
  HeartPulse,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
  Waves,
  Handshake,
} from "lucide-react";
import { products } from "@/data/site";
import { formatNaira } from "@/lib/store";
import { getProductPriceMap } from "@/lib/product-prices";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

const benefits = {
  aspivit: [
    [Brain, "Neuro support"],
    [ShieldCheck, "Immune defence"],
    [Bone, "Joint & bone"],
    [HeartPulse, "Heart support"],
  ],
  asfenositol: [
    [Flower2, "Women’s wellness"],
    [Sparkles, "Hormonal balance"],
    [Baby, "Fertility support"],
    [CheckCircle2, "Daily nutrition"],
  ],
  globivida: [
    [Droplets, "Sickle-cell support"],
    [Waves, "Red blood cells"],
    [ShieldCheck, "Antioxidants"],
    [Users, "Nutritional support"],
  ],
  "herbal-bitter-tea": [
    [Droplets, "Blood sugar"],
    [Leaf, "Digestive health"],
    [Sprout, "Liver support"],
    [HeartPulse, "Natural wellness"],
  ],
} as const;

export function PageHero({eyebrow,title,text}:{eyebrow?:string;title:string;text:string}){
  return <section className="page-hero"><div className="container narrow">{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{text}</p></div></section>;
}

export async function ProductGrid(){
  const prices = await getProductPriceMap();
  return <div className="product-grid">{products.map((p)=>{
    const priceKobo = prices[p.slug] ?? p.priceKobo;
    const productBenefits = benefits[p.slug as keyof typeof benefits];
    return <article className={`product-card ${p.accent}`} key={p.slug}>
      <Link href={`/products/${p.slug}`} className="product-image-wrap">
        <Image src={p.image} alt={`${p.name} product pack`} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 25vw" className="product-image"/>
      </Link>
      <span className="eyebrow product-category">{p.category}</span>
      <h3>{p.name}</h3>
      <p className="product-summary">{p.summary}</p>
      <div className="product-benefits" aria-label={`${p.name} support areas`}>
        {productBenefits.map(([Icon,label])=><span className="product-benefit" key={label}><span className="product-benefit-icon"><Icon size={18}/></span><small>{label}</small></span>)}
      </div>
      <strong className="product-price">{formatNaira(priceKobo)}</strong>
      <div className="product-card-actions"><AddToCartButton slug={p.slug} name={p.name} priceKobo={priceKobo}/><Link className="text-link" href={`/products/${p.slug}`}>View details <ArrowRight size={17}/></Link></div>
    </article>;
  })}</div>;
}

export function TrustCards(){const items=[[ShieldCheck,"Quality First","Quality-focused processes and responsible product information."],[HeartPulse,"People-Centred","Healthcare solutions designed around real everyday needs."],[Handshake,"Trusted Partnerships","Long-term relationships with healthcare and distribution partners."]] as const;return <div className="three-grid">{items.map(([Icon,t,x])=><article className="icon-card" key={t}><Icon/><h3>{t}</h3><p>{x}</p></article>)}</div>}
export function CTA(){return <section className="cta"><div className="container cta-inner"><div><span className="eyebrow">Connect with Bridgecare</span><h2>Let’s improve healthcare access together.</h2></div><div className="cta-actions"><Link className="button light-button" href="/contact">Contact us</Link><Link className="button outline-light" href="/distributors">Partner with us</Link></div></div></section>}
