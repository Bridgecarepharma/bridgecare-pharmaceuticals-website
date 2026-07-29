import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request:Request){
 const secret=process.env.PAYSTACK_SECRET_KEY;
 if(!secret)return NextResponse.json({error:"Not configured"},{status:500});
 const raw=await request.text();
 const signature=request.headers.get("x-paystack-signature")||"";
 const expected=crypto.createHmac("sha512",secret).update(raw).digest("hex");
 const supplied=Buffer.from(signature,"utf8");
 const calculated=Buffer.from(expected,"utf8");
 if(supplied.length!==calculated.length||!crypto.timingSafeEqual(supplied,calculated))return NextResponse.json({error:"Invalid signature"},{status:401});
 try{
  const event=JSON.parse(raw);
  if(event.event==="charge.success"&&process.env.DATABASE_URL){
   const tx=event.data;
   const order=await prisma.order.findUnique({where:{paystackReference:tx.reference}});
   if(order&&tx.status==="success"&&tx.amount===order.totalKobo&&tx.currency===order.currency){
    await prisma.order.update({where:{id:order.id},data:{status:"PAID",paidAt:new Date(tx.paid_at||Date.now()),paymentChannel:tx.channel||null,paystackTransactionId:String(tx.id)}});
   }else if(order){console.error("Webhook amount/currency mismatch",{reference:tx.reference,receivedAmount:tx.amount,expectedAmount:order.totalKobo,receivedCurrency:tx.currency});}
  }
  return NextResponse.json({received:true});
 }catch(error){console.error("Paystack webhook processing error",error);return NextResponse.json({received:true});}
}
