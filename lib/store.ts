export type StoreProduct={slug:string;name:string;priceKobo:number};
export const STORE_PRODUCTS:Record<string,StoreProduct>={
 aspivit:{slug:"aspivit",name:"Aspivit®",priceKobo:800000},
 asfenositol:{slug:"asfenositol",name:"AsFenositol®",priceKobo:600000},
 globivida:{slug:"globivida",name:"Globivida® Capsules",priceKobo:1500000},
 "herbal-bitter-tea":{slug:"herbal-bitter-tea",name:"Bridgecare Herbal Bitter Tea®",priceKobo:550000}
};
export const SHIPPING_FEES_KOBO:Record<string,number>={Lagos:350000,default:700000};
export const FREE_SHIPPING_PACK_COUNT=4;
/** Legacy fallback only. Live checkout rates are managed in Admin → Shipping. */
export function shippingFeeForOrder(state:string,packCount:number){
 if(packCount>=FREE_SHIPPING_PACK_COUNT)return 0;
 if(state==="Lagos")return 350000;
 if(["Ekiti","Ogun","Ondo","Osun","Oyo"].includes(state))return 450000;
 if(["Abia","Akwa Ibom","Anambra","Bayelsa","Cross River","Delta","Ebonyi","Edo","Enugu","Imo","Rivers"].includes(state))return 500000;
 return 550000;
}
/** @deprecated Use the database-backed shipping configuration. */
export function shippingFeeForState(state:string){return shippingFeeForOrder(state,1)}
export function formatNaira(kobo:number){return new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(kobo/100)}
export function productImageForSlug(slug:string){return `/images/products/${slug}.png`}
