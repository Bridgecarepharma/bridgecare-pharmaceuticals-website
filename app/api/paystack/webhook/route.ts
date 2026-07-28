import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request:Request){
 const secret=process.env.PAYSTACK_SECRET_KEY;
 if(!secret)return NextResponse.json({error:"Not configured"},{status:500});
 const raw=await request.text();
 const signature=request.headers.get("x-paystack-signature")||"";
 const expected=crypto.createHmac("sha512",secret).update(raw).digest("hex");
 const supplied=Buffer.from(signature);
 const calculated=Buffer.from(expected);
 if(supplied.length!==calculated.length||!crypto.timingSafeEqual(supplied,calculated))return NextResponse.json({error:"Invalid signature"},{status:401});
 const event=JSON.parse(raw);
 if(event.event==="charge.success"){
  const tx=event.data;
  const order=await prisma.order.findUnique({where:{paystackReference:tx.reference}});
  if(order&&tx.amount===order.totalKobo&&tx.currency==="NGN"){
   await prisma.order.update({where:{id:order.id},data:{status:"PAID",paidAt:new Date(tx.paid_at||Date.now()),paymentChannel:tx.channel||null}});
  }
 }
 return NextResponse.json({received:true});
}
