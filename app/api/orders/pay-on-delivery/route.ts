import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkoutSchema } from "@/lib/checkout-schema";
import { createOrderNumber, createPaystackReference } from "@/lib/order-reference";
import { prisma } from "@/lib/prisma";
import { STORE_PRODUCTS } from "@/lib/store";
import { shippingFeeForSelectedZone } from "@/lib/shipping";
import { getProductPriceMap } from "@/lib/product-prices";
import { assertStockAvailable, ensureInventoryProducts } from "@/lib/inventory";
import { CouponError, evaluateCoupon } from "@/lib/coupons";

export const runtime = "nodejs";
const LAGOS_COD_ZONES = new Set(["LAGOS_MAINLAND", "LAGOS_ISLAND"]);
function publicError(message:string,status=500){return NextResponse.json({error:message},{status})}

export async function POST(request:Request){
 try{
  if(!process.env.DATABASE_URL)return publicError("Pay on Delivery is temporarily unavailable. Please pay online or contact Bridgecare support.",503);
  const payload=checkoutSchema.parse(await request.json());
  if(payload.delivery.state!=="Lagos"||!LAGOS_COD_ZONES.has(payload.delivery.shippingZoneCode))return publicError("Pay on Delivery is available only for Lagos Mainland and Lagos Island delivery addresses.",400);

  const priceMap=await getProductPriceMap();
  const items=payload.items.map(item=>{const product=STORE_PRODUCTS[item.slug];if(!product)throw new Error("INVALID_PRODUCT");const priceKobo=priceMap[item.slug]??product.priceKobo;return {...product,priceKobo,quantity:item.quantity,lineTotalKobo:priceKobo*item.quantity}});
  await ensureInventoryProducts();
  await assertStockAvailable(items.map(item=>({slug:item.slug,quantity:item.quantity})));
  const packCount=items.reduce((sum,item)=>sum+item.quantity,0);
  const subtotalKobo=items.reduce((sum,item)=>sum+item.lineTotalKobo,0);
  const selectedShippingKobo=await shippingFeeForSelectedZone(payload.delivery.shippingZoneCode,payload.delivery.state,packCount);
  if(selectedShippingKobo===null)return publicError("The selected Lagos delivery zone does not match the delivery address.",400);
  const shippingKobo=selectedShippingKobo;
  const appliedCoupon=await evaluateCoupon({code:payload.couponCode,customerEmail:payload.customer.email,subtotalKobo,shippingKobo,items:items.map(item=>({slug:item.slug,quantity:item.quantity,unitPriceKobo:item.priceKobo}))});
  const discountKobo=appliedCoupon?.totalDiscountKobo??0;
  const totalKobo=Math.max(0,subtotalKobo+shippingKobo-discountKobo);
  const reference=`COD-${createPaystackReference()}`;
  const orderNumber=createOrderNumber();

  const order=await prisma.$transaction(async tx=>{
   const customer=await tx.customer.upsert({where:{email:payload.customer.email.toLowerCase()},update:{name:payload.customer.fullName,phone:payload.customer.phone},create:{name:payload.customer.fullName,email:payload.customer.email.toLowerCase(),phone:payload.customer.phone}});
   const created=await tx.order.create({data:{orderNumber,paystackReference:reference,status:"PENDING_PAYMENT",subtotalKobo,shippingKobo,discountKobo,couponCode:appliedCoupon?.coupon.code??null,totalKobo,customerId:customer.id,customerName:payload.customer.fullName,customerEmail:payload.customer.email.toLowerCase(),customerPhone:payload.customer.phone,recipientName:payload.delivery.recipientName,recipientPhone:payload.delivery.recipientPhone,addressLine1:payload.delivery.addressLine1,addressLine2:payload.delivery.addressLine2||null,landmark:payload.delivery.landmark||null,city:payload.delivery.city,lga:payload.delivery.lga,state:payload.delivery.state,postalCode:payload.delivery.postalCode||null,deliveryInstructions:payload.delivery.deliveryInstructions||null,deliveryMethod:"standard",paymentChannel:"PAY_ON_DELIVERY",internalNotes:"Pay on Delivery order — confirm customer by phone or WhatsApp before dispatch.",items:{create:items.map(item=>({productSlug:item.slug,productName:item.name,quantity:item.quantity,unitPriceKobo:item.priceKobo,lineTotalKobo:item.lineTotalKobo}))},payment:{create:{provider:"cash_on_delivery",reference,amountKobo:totalKobo,currency:"NGN",status:"PENDING",channel:"PAY_ON_DELIVERY"}},statusHistory:{create:{status:"PENDING_PAYMENT",note:"Pay on Delivery order received; awaiting customer confirmation and fulfilment."}}}});
   if(appliedCoupon)await tx.couponRedemption.create({data:{couponId:appliedCoupon.coupon.id,orderId:created.id,customerEmail:payload.customer.email.toLowerCase(),discountKobo:appliedCoupon.discountKobo,shippingDiscountKobo:appliedCoupon.shippingDiscountKobo}});
   return created;
  });
  return NextResponse.json({ok:true,reference:order.paystackReference,orderNumber:order.orderNumber,totalKobo,paymentMethod:"PAY_ON_DELIVERY"});
 }catch(error){
  console.error("Pay on Delivery order error",error);
  if(error instanceof ZodError)return publicError("Please check the delivery form and try again.",400);
  if(error instanceof CouponError)return publicError(error.message,400);
  if(error instanceof Error&&error.message==="INVALID_PRODUCT")return publicError("One of the selected products is unavailable.",400);
  if(error instanceof Error&&error.message.startsWith("INSUFFICIENT_STOCK:")){const[,name,available]=error.message.split(":");return publicError(`${name} does not have enough stock. Available quantity: ${available}.`,409)}
  return publicError("Unable to place the Pay on Delivery order. Please try again or contact Bridgecare support.");
 }
}
