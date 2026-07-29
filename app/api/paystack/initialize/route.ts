import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkoutSchema } from "@/lib/checkout-schema";
import { prisma } from "@/lib/prisma";
import { shippingFeeForOrder, STORE_PRODUCTS } from "@/lib/store";

function orderNumber(){return `BC-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`}
function reference(){return `BC-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}
function publicError(message:string,status=500){return NextResponse.json({error:message},{status})}

export async function POST(request:Request){
 let orderId:string|undefined;
 try{
  const secret=process.env.PAYSTACK_SECRET_KEY;
  if(!secret)return publicError("Secure payment is temporarily unavailable. Please contact Bridgecare support.");

  const payload=checkoutSchema.parse(await request.json());
  const items=payload.items.map(item=>{
   const product=STORE_PRODUCTS[item.slug];
   if(!product)throw new Error("INVALID_PRODUCT");
   return {...product,quantity:item.quantity,lineTotalKobo:product.priceKobo*item.quantity};
  });
  const packCount=items.reduce((sum,item)=>sum+item.quantity,0);
  const subtotalKobo=items.reduce((sum,item)=>sum+item.lineTotalKobo,0);
  const shippingKobo=shippingFeeForOrder(payload.delivery.state,packCount);
  const totalKobo=subtotalKobo+shippingKobo;
  const paystackReference=reference();
  const generatedOrderNumber=orderNumber();
  const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||new URL(request.url).origin).replace(/\/$/,"");
  const databaseEnabled=Boolean(process.env.DATABASE_URL);

  let savedOrderId:string|undefined;
  let savedOrderNumber=generatedOrderNumber;

  if(databaseEnabled){
   const order=await prisma.order.create({data:{
    orderNumber:generatedOrderNumber,paystackReference,subtotalKobo,shippingKobo,totalKobo,
    customerName:payload.customer.fullName,customerEmail:payload.customer.email,customerPhone:payload.customer.phone,
    recipientName:payload.delivery.recipientName,recipientPhone:payload.delivery.recipientPhone,
    addressLine1:payload.delivery.addressLine1,addressLine2:payload.delivery.addressLine2||null,
    landmark:payload.delivery.landmark||null,city:payload.delivery.city,lga:payload.delivery.lga,state:payload.delivery.state,
    postalCode:payload.delivery.postalCode||null,deliveryInstructions:payload.delivery.deliveryInstructions||null,
    deliveryMethod:"standard",
    items:{create:items.map(item=>({productSlug:item.slug,productName:item.name,quantity:item.quantity,unitPriceKobo:item.priceKobo,lineTotalKobo:item.lineTotalKobo}))}
   }});
   orderId=order.id;
   savedOrderId=order.id;
   savedOrderNumber=order.orderNumber;
  }

  const response=await fetch("https://api.paystack.co/transaction/initialize",{
   method:"POST",headers:{Authorization:`Bearer ${secret}`,"Content-Type":"application/json"},cache:"no-store",
   body:JSON.stringify({
    email:payload.customer.email,amount:totalKobo,currency:"NGN",reference:paystackReference,
    callback_url:`${siteUrl}/order-success`,
    metadata:{
     order_id:savedOrderId||null,
     order_number:savedOrderNumber,
     database_saved:databaseEnabled,
     subtotal_kobo:subtotalKobo,
     shipping_kobo:shippingKobo,
     total_kobo:totalKobo,
     customer_name:payload.customer.fullName,
     customer_phone:payload.customer.phone,
     recipient_name:payload.delivery.recipientName,
     recipient_phone:payload.delivery.recipientPhone,
     address_line_1:payload.delivery.addressLine1,
     address_line_2:payload.delivery.addressLine2||"",
     city:payload.delivery.city,
     lga:payload.delivery.lga,
     state:payload.delivery.state,
     items:items.map(item=>({productName:item.name,quantity:item.quantity,lineTotalKobo:item.lineTotalKobo})),
     custom_fields:[
      {display_name:"Order Number",variable_name:"order_number",value:savedOrderNumber},
      {display_name:"Delivery State",variable_name:"delivery_state",value:payload.delivery.state},
      {display_name:"Delivery Address",variable_name:"delivery_address",value:`${payload.delivery.addressLine1}, ${payload.delivery.city}, ${payload.delivery.state}`}
     ]
    }
   })
  });
  const result=await response.json();
  if(!response.ok||!result.status||!result.data?.authorization_url){
   if(orderId){await prisma.order.update({where:{id:orderId},data:{status:"CANCELLED"}});}
   console.error("Paystack initialization failed",result);
   return publicError("We could not open secure payment. Please try again.",502);
  }
  return NextResponse.json({authorizationUrl:result.data.authorization_url,reference:paystackReference,orderNumber:savedOrderNumber,totalKobo,databaseSaved:databaseEnabled});
 }catch(error){
  if(orderId){try{await prisma.order.update({where:{id:orderId},data:{status:"CANCELLED"}})}catch{}}
  console.error("Checkout initialization error",error);
  if(error instanceof ZodError)return publicError("Please check the delivery form and try again.",400);
  if(error instanceof Error&&error.message==="INVALID_PRODUCT")return publicError("One of the selected products is unavailable.",400);
  return publicError("Checkout is temporarily unavailable. Please try again or contact Bridgecare support.");
 }
}
