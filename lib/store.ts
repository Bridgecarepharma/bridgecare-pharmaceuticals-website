export type StoreProduct={slug:string;name:string;priceKobo:number};
export const STORE_PRODUCTS:Record<string,StoreProduct>={
 aspivit:{slug:"aspivit",name:"Aspivit®",priceKobo:800000},
 asfenositol:{slug:"asfenositol",name:"AsFenositol®",priceKobo:600000},
 globivida:{slug:"globivida",name:"Globivida® Capsules",priceKobo:1500000},
 "herbal-bitter-tea":{slug:"herbal-bitter-tea",name:"Bridgecare Herbal Bitter Tea®",priceKobo:550000}
};
export const SHIPPING_FEES_KOBO:Record<string,number>={Lagos:250000,default:300000};
export function shippingFeeForState(state:string){return SHIPPING_FEES_KOBO[state]??SHIPPING_FEES_KOBO.default}
export function formatNaira(kobo:number){return new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(kobo/100)}
export function productImageForSlug(slug:string){return `/images/products/${slug}.png`}
