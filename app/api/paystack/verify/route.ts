import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request:Request){
 try{
  const reference=new URL(request.url).searchParams.get("reference");
  if(!reference)return NextResponse.json({error:"Missing payment reference."},{status:400});
  const secret=process.env.PAYSTACK_SECRET_KEY;
  if(!secret)return NextResponse.json({error:"Payment verification is temporarily unavailable."},{status:500});

  const response=await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,{headers:{Authorization:`Bearer ${secret}`},cache:"no-store"});
  const result=await response.json();
  if(!response.ok||!result.status)return NextResponse.json({error:"Unable to verify payment."},{status:502});

  if(process.env.DATABASE_URL){
   const order=await prisma.order.findUnique({where:{paystackReference:reference},include:{items:true,payment:true}});
   if(!order)return NextResponse.json({error:"Order not found."},{status:404});
   const paid=result.data.status==="success"&&result.data.amount===order.totalKobo&&result.data.currency===order.currency;
   if(paid){
    const paidAt=new Date(result.data.paid_at||Date.now());
    await prisma.$transaction([
     prisma.order.update({where:{id:order.id},data:{status:"PAID",paidAt,paymentChannel:result.data.channel||null,paystackTransactionId:String(result.data.id)}}),
     prisma.payment.upsert({
      where:{reference},
      update:{status:"SUCCESS",channel:result.data.channel||null,providerTransactionId:String(result.data.id),paidAt,rawEvent:result.data},
      create:{orderId:order.id,reference,amountKobo:result.data.amount,currency:result.data.currency,status:"SUCCESS",channel:result.data.channel||null,providerTransactionId:String(result.data.id),paidAt,rawEvent:result.data}
     })
    ]);
   }
   const refreshed=await prisma.order.findUnique({where:{id:order.id},include:{items:true,payment:true,customer:true}});
   return NextResponse.json({paid,order:refreshed});
  }

  const metadata=result.data.metadata||{};
  const paid=result.data.status==="success"&&result.data.amount===Number(metadata.total_kobo||result.data.amount)&&result.data.currency==="NGN";
  if(!paid)return NextResponse.json({paid:false,error:"Payment has not been confirmed."},{status:400});

  const items=Array.isArray(metadata.items)?metadata.items:[];
  const fallbackOrder={
   orderNumber:String(metadata.order_number||reference),paystackReference:reference,status:"PAID",totalKobo:Number(result.data.amount||0),
   recipientName:String(metadata.recipient_name||metadata.customer_name||"Customer"),addressLine1:String(metadata.address_line_1||"Delivery address submitted at checkout"),
   addressLine2:String(metadata.address_line_2||""),city:String(metadata.city||""),lga:String(metadata.lga||""),state:String(metadata.state||""),
   items:items.map((item:{productName?:string;quantity?:number;lineTotalKobo?:number},index:number)=>({id:`fallback-${index}`,productName:String(item.productName||"Bridgecare product"),quantity:Number(item.quantity||1),lineTotalKobo:Number(item.lineTotalKobo||0)}))
  };
  return NextResponse.json({paid:true,order:fallbackOrder,databaseSaved:false});
 }catch(error){console.error("Payment verification error",error);return NextResponse.json({error:"Unable to verify payment right now."},{status:500});}
}
