import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { StockistManager } from "./StockistManager";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Shop locations administration",robots:{index:false,follow:false}};
export default async function AdminStockists({searchParams}:{searchParams:Promise<{q?:string;page?:string}>}) {
 await requireAdmin();const params=await searchParams;const q=(params.q||"").slice(0,120);const page=Math.max(1,Math.min(10000,Math.floor(Number(params.page)||1)));
 const where=q?{OR:[{name:{contains:q,mode:"insensitive" as const}},{city:{contains:q,mode:"insensitive" as const}},{state:{contains:q,mode:"insensitive" as const}}]}:{};
 const loaded=await Promise.all([prisma.stockist.findMany({where,orderBy:[{updatedAt:"desc"},{id:"asc"}],skip:(page-1)*20,take:20}),prisma.stockist.count({where})]).catch(()=>null);
 return <section className="section admin-shell"><div className="container"><AdminNav/><span className="eyebrow">Bridgecare stockists</span><h1>Shop locations</h1><p>Add and update the shops customers can find on your website.</p><Link className="button secondary" href="/store-locations" target="_blank">View Where to Buy page</Link>{loaded?<><form className="form stockist-admin-search" method="get"><label>Find a shop<input name="q" defaultValue={q} placeholder="Search name, city or state" maxLength={120}/></label><button className="button secondary">Search</button></form><p>{loaded[1]} shops found (including hidden shops).</p><StockistManager shops={loaded[0].map(shop=>({id:shop.id,name:shop.name,address:shop.address,city:shop.city,state:shop.state,phone:shop.phone,whatsapp:shop.whatsapp,openingHours:shop.openingHours,productSlugs:shop.productSlugs,isActive:shop.isActive}))}/><div className="hero-actions">{page>1&&<Link className="button secondary" href={`?q=${encodeURIComponent(q)}&page=${page-1}`}>Previous</Link>}{page*20<loaded[1]&&<Link className="button secondary" href={`?q=${encodeURIComponent(q)}&page=${page+1}`}>Next</Link>}</div></>:<div className="error-box"><h2>Shop storage is unavailable</h2><p>Apply the store-locations database migration and check the database connection, then refresh this page.</p></div>}</div></section>;
}
