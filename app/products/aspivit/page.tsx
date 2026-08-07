import { PremiumProductPage } from "@/components/product/PremiumProductPage";
import { PRODUCT_BY_SLUG } from "@/data/products";
export const metadata = { title: "Aspivit® | Bridgecare Pharmaceuticals", description: PRODUCT_BY_SLUG.aspivit.summary };
export default function Page(){ return <PremiumProductPage product={PRODUCT_BY_SLUG.aspivit}/>; }
