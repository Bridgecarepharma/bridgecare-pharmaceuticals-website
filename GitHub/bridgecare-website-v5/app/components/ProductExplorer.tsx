'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowRight, Baby, Brain, Circle, CircleDot, Droplets, HeartPulse, Leaf, Search, ShieldCheck, ShoppingBag, Sprout, Users, X, Zap, Scale } from 'lucide-react';
import { products, type BenefitIcon, type ProductCategory } from '../../lib/products';
import { AddToCartButton } from './Cart';

const iconMap = { heart: HeartPulse, brain: Brain, shield: ShieldCheck, zap: Zap, leaf: Leaf, circle: Circle, baby: Baby, scale: Scale, activity: Activity, droplets: Droplets, sprout: Sprout, blood: CircleDot, users: Users } satisfies Record<BenefitIcon, React.ComponentType<{ 'aria-hidden'?: boolean }>>;
type Category = 'All products' | ProductCategory;
const categories: Category[] = ['All products', 'Daily wellness', "Women's wellness", 'Herbal wellness', 'Specialised support'];

export default function ProductExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('All products');
  const [selected, setSelected] = useState<(typeof products)[number] | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return products.filter((p) => (category === 'All products' || p.category === category) && (!q || [p.name, p.categoryLabel, p.summary, ...p.searchTerms].join(' ').toLowerCase().includes(q))); }, [query, category]);

  useEffect(() => { if (!selected) return; const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; closeRef.current?.focus(); const key = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null); window.addEventListener('keydown', key); return () => { document.body.style.overflow = old; window.removeEventListener('keydown', key); }; }, [selected]);

  return <>
    <div className="productExplorerTools"><label className="productSearch"><Search aria-hidden="true"/><span className="srOnly">Search products</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by product or wellness need"/>{query && <button type="button" onClick={()=>setQuery('')} aria-label="Clear search"><X/></button>}</label><div className="productFilters" aria-label="Filter products by category">{categories.map((item)=><button type="button" key={item} className={category===item?'active':''} onClick={()=>setCategory(item)}>{item}</button>)}</div></div>
    <div className="productResultsSummary" aria-live="polite">Showing <strong>{filtered.length}</strong> {filtered.length===1?'product':'products'}</div>
    {filtered.length ? <div className="productGrid">{filtered.map((p,index)=><article className="card premiumCard" key={p.slug} style={{'--accent':p.accent,'--delay':`${index*.08}s`} as React.CSSProperties}><div className="spotlight"/><div className="category">{p.categoryLabel}</div><div className="cardImage"><Image src={p.image} alt={p.name} width={560} height={420}/><span className="reflection"/></div><div className="cardBody"><h3>{p.name}</h3><p>{p.summary}</p><div className="benefitArt" aria-label={`${p.name} wellness support areas`}>{p.benefits.map((b)=>{const Icon=iconMap[b.icon]; return <div className="benefitItem" key={b.label}><span className="benefitIcon"><Icon aria-hidden={true}/></span><strong>{b.label}</strong></div>})}</div><div className="price">{p.price}</div><div className="cardActions threeActions"><button type="button" className="quickViewButton" onClick={()=>setSelected(p)}>Quick view</button><AddToCartButton product={{slug:p.slug,name:p.name,price:p.priceValue,priceLabel:p.price,image:p.image}}/></div><Link className="learnMoreLink" href={`/products/${p.slug}`}>Full product details <ArrowRight size={16}/></Link><a className="quickBuy" href={p.paystack} target="_blank" rel="noreferrer">Buy now securely <ArrowRight size={17}/></a></div></article>)}</div> : <div className="noProductResults"><ShoppingBag/><h3>No matching products</h3><p>Try another product name, wellness need or category.</p><button type="button" onClick={()=>{setQuery('');setCategory('All products')}}>Show all products</button></div>}
    {selected && <div className="quickViewBackdrop" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)setSelected(null)}}><section className="quickViewModal" role="dialog" aria-modal="true" aria-labelledby="quick-view-title"><button ref={closeRef} className="quickViewClose" type="button" onClick={()=>setSelected(null)} aria-label="Close quick view"><X/></button><div className="quickViewImage" style={{'--accent':selected.accent} as React.CSSProperties}><Image src={selected.image} alt={selected.name} width={700} height={560}/></div><div className="quickViewContent"><span className="kicker">{selected.categoryLabel}</span><h2 id="quick-view-title">{selected.name}</h2><p>{selected.overview}</p><div className="quickViewBenefits">{selected.benefits.map((b)=>{const Icon=iconMap[b.icon];return <span key={b.label}><Icon aria-hidden={true}/>{b.label}</span>})}</div><div className="quickViewPrice">{selected.price}</div><div className="quickViewActions"><AddToCartButton className="addCart quickViewAdd" product={{slug:selected.slug,name:selected.name,price:selected.priceValue,priceLabel:selected.price,image:selected.image}}/><a href={selected.paystack} target="_blank" rel="noreferrer">Buy now <ArrowRight size={18}/></a></div><Link className="quickViewDetails" href={`/products/${selected.slug}`}>View full product page <ArrowRight size={16}/></Link><small>Educational product information only. Follow pack directions and professional guidance.</small></div></section></div>}
  </>;
}
