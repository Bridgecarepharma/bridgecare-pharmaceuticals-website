import { notFound } from "next/navigation";
import { PRODUCT_BY_SLUG, PRODUCTS } from "@/data/products";
import { PremiumProductPage } from "@/components/product/PremiumProductPage";

export function generateStaticParams(){ return PRODUCTS.map(({slug})=>({slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=PRODUCT_BY_SLUG[slug];return p?{title:`${p.name} | Bridgecare Pharmaceuticals`,description:p.summary}:{title:"Product not found"};}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const product=PRODUCT_BY_SLUG[slug];if(!product)notFound();return <PremiumProductPage product={product}/>;}
