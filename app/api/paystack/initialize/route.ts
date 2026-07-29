import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/checkout-schema";
import { prisma } from "@/lib/prisma";
import { shippingFeeForState, STORE_PRODUCTS } from "@/lib/store";

function orderNumber(){return `BC-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`}
function reference(){return `BC-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}

export async function POST(request:Request){
 try{
  if(!process.env.DATABASE_URL){
   console.error("DATABASE_URL is not configured.");
   return NextResponse.json({error:"Checkout is temporarily unavailable. Please contact Bridgecare support or use the direct Paystack payment link while we resolve this issue."},{status:503});
  }
  const payload=checkoutSchema.parse(await request.json());
  const items=payload.items.map(item=>{
   const product=STORE_PRODUCTS[item.slug];
   if(!product) throw new Error(`Unknown product: ${item.slug}`);
   return {...product,quantity:item.quantity,lineTotalKobo:product.priceKobo*item.quantity};
  });
  const subtotalKobo=items.reduce((sum,item)=>sum+item.lineTotalKobo,0);
  const baseShipping=shippingFeeForState(payload.delivery.state);
  const shippingKobo=payload.delivery.deliveryMethod==="express"?Math.round(baseShipping*1.5):baseShipping;
  const totalKobo=subtotalKobo+shippingKobo;
  const paystackReference=reference();
  const siteUrl=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
  const order=await prisma.order.create({
   data:{
    orderNumber:orderNumber(),paystackReference,subtotalKobo,shippingKobo,totalKobo,
    customerName:payload.customer.fullName,customerEmail:payload.customer.email,customerPhone:payload.customer.phone,
    recipientName:payload.delivery.recipientName,recipientPhone:payload.delivery.recipientPhone,
    addressLine1:payload.delivery.addressLine1,addressLine2:payload.delivery.addressLine2||null,
    landmark:payload.delivery.landmark||null,city:payload.delivery.city,lga:payload.delivery.lga,state:payload.delivery.state,
    postalCode:payload.delivery.postalCode||null,deliveryInstructions:payload.delivery.deliveryInstructions||null,
    deliveryMethod:payload.delivery.deliveryMethod,
    items:{create:items.map(item=>({productSlug:item.slug,productName:item.name,quantity:item.quantity,unitPriceKobo:item.priceKobo,lineTotalKobo:item.lineTotalKobo}))}
   }
  });
  const secret=process.env.PAYSTACK_SECRET_KEY;
  if(!secret) return NextResponse.json({error:"PAYSTACK_SECRET_KEY is not configured."},{status:500});
  const response=await fetch("https://api.paystack.co/transaction/initialize",{
   method:"POST",
   headers:{Authorization:`Bearer ${secret}`,"Content-Type":"application/json"},
   body:JSON.stringify({
    email:payload.customer.email,amount:totalKobo,currency:"NGN",reference:paystackReference,
    callback_url:`${siteUrl}/order-success`,
    metadata:{
     order_id:order.id,order_number:order.orderNumber,
     custom_fields:[
      {display_name:"Order Number",variable_name:"order_number",value:order.orderNumber},
      {display_name:"Delivery State",variable_name:"delivery_state",value:payload.delivery.state},
      {display_name:"Delivery Address",variable_name:"delivery_address",value:`${payload.delivery.addressLine1}, ${payload.delivery.city}, ${payload.delivery.state}`}
     ]
    }
   })
  });
  const result=await response.json();
  if(!response.ok||!result.status){
   await prisma.order.update({where:{id:order.id},data:{status:"CANCELLED"}});
   return NextResponse.json({error:result.message||"Unable to initialize payment."},{status:502});
  }
  return NextResponse.json({authorizationUrl:result.data.authorization_url,reference:paystackReference,orderNumber:order.orderNumber});
 }catch(error){
    console.error(error);
  return NextResponse.json({error:"We could not process your checkout. Please try again later or contact Bridgecare support."},{status:500});
 }
}
