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
   const order=await prisma.order.findUnique({where:{paystackReference:tx.reference},include:{payment:true}});
   if(order&&tx.status==="success"&&tx.amount===order.totalKobo&&tx.currency===order.currency){
    const paidAt=new Date(tx.paid_at||Date.now());
    await prisma.$transaction(async (db) => {
     // A repeated charge.success webhook must not deduct inventory twice.
     const latest = await db.order.findUniqueOrThrow({ where: { id: order.id }, include: { items: true } });
     if (latest.status !== "PAID") {
      for (const item of latest.items) {
       const inventory = await db.inventory.findUnique({ where: { productSlug: item.productSlug } });
       if (!inventory || inventory.stock < item.quantity) throw new Error(`INSUFFICIENT_STOCK_AT_PAYMENT:${item.productSlug}`);
       const updated = await db.inventory.update({ where: { id: inventory.id }, data: { stock: { decrement: item.quantity } } });
       await db.inventoryMovement.create({ data: { inventoryId: inventory.id, type: "SALE", quantity: -item.quantity, balanceAfter: updated.stock, reference: latest.orderNumber, note: `Paid order ${latest.orderNumber}`, createdBy: "paystack-webhook" } });
      }
     }
     await db.order.update({where:{id:order.id},data:{status:"PAID",paidAt,paymentChannel:tx.channel||null,paystackTransactionId:String(tx.id)}});
     await db.payment.upsert({
      where:{reference:tx.reference},
      update:{status:"SUCCESS",channel:tx.channel||null,providerTransactionId:String(tx.id),paidAt,rawEvent:event},
      create:{orderId:order.id,reference:tx.reference,amountKobo:tx.amount,currency:tx.currency,status:"SUCCESS",channel:tx.channel||null,providerTransactionId:String(tx.id),paidAt,rawEvent:event}
     });
    });
   }else if(order){
    console.error("Webhook amount/currency mismatch",{reference:tx.reference,receivedAmount:tx.amount,expectedAmount:order.totalKobo,receivedCurrency:tx.currency});
   }
  }
  return NextResponse.json({received:true});
 }catch(error){
  console.error("Paystack webhook processing error",error);
  return NextResponse.json({received:true});
 }
}
