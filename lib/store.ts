export type StoreProduct={slug:string;name:string;priceKobo:number};
export const STORE_PRODUCTS:Record<string,StoreProduct>={
 aspivit:{slug:"aspivit",name:"Aspivit®",priceKobo:1200000},
 asfenositol:{slug:"asfenositol",name:"AsFenositol®",priceKobo:1800000},
 globivida:{slug:"globivida",name:"Globivida® Capsules",priceKobo:2500000},
 "herbal-bitter-tea":{slug:"herbal-bitter-tea",name:"Bridgecare Herbal Bitter Tea®",priceKobo:1000000}
};
export const SHIPPING_FEES_KOBO:Record<string,number>={Lagos:250000,Abuja:350000,Rivers:400000,Ogun:300000,Oyo:350000,Anambra:400000,Enugu:400000,Kano:450000,Kaduna:450000,default:500000};
export function shippingFeeForState(state:string){return SHIPPING_FEES_KOBO[state]??SHIPPING_FEES_KOBO.default}
export function formatNaira(kobo:number){return new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(kobo/100)}
export function productImageForSlug(slug:string){return `/images/products/${slug}.png`}
