import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(request:Request){
 try{
  const reference=new URL(request.url).searchParams.get("reference");
  if(!reference)return NextResponse.json({error:"Missing payment reference."},{status:400});
  const secret=process.env.PAYSTACK_SECRET_KEY;
  if(!secret||!process.env.DATABASE_URL)return NextResponse.json({error:"Payment verification is temporarily unavailable."},{status:500});
  const response=await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,{headers:{Authorization:`Bearer ${secret}`},cache:"no-store"});
  const result=await response.json();
  if(!response.ok||!result.status)return NextResponse.json({error:"Unable to verify payment."},{status:502});
  const order=await prisma.order.findUnique({where:{paystackReference:reference},include:{items:true}});
  if(!order)return NextResponse.json({error:"Order not found."},{status:404});
  const paid=result.data.status==="success"&&result.data.amount===order.totalKobo&&result.data.currency===order.currency;
  if(paid){
   await prisma.order.update({where:{id:order.id},data:{status:"PAID",paidAt:new Date(result.data.paid_at||Date.now()),paymentChannel:result.data.channel||null,paystackTransactionId:String(result.data.id)}});
  }
  const refreshed=await prisma.order.findUnique({where:{id:order.id},include:{items:true}});
  return NextResponse.json({paid,order:refreshed});
 }catch(error){console.error("Payment verification error",error);return NextResponse.json({error:"Unable to verify payment right now."},{status:500});}
}
