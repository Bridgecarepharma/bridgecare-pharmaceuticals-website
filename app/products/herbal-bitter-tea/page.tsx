import { PremiumProductPage } from "@/components/product/PremiumProductPage";
import { PRODUCT_BY_SLUG } from "@/data/products";
export const metadata = { title: "Bridgecare Herbal Bitter Tea® | Bridgecare Pharmaceuticals", description: PRODUCT_BY_SLUG["herbal-bitter-tea"].summary };
export default function Page(){ return <PremiumProductPage product={PRODUCT_BY_SLUG["herbal-bitter-tea"]}/>; }
