import { z } from "zod";

const deliverySchema = z.object({
 recipientName:z.string().min(2).max(100),recipientPhone:z.string().min(7).max(25),
 addressLine1:z.string().trim().max(180).optional().default(""),
 addressLine2:z.string().max(180).optional().default(""),
 landmark:z.string().max(180).optional().default(""),
 busPark:z.string().trim().max(180).optional().default(""),
 city:z.string().trim().min(2).max(100),
 lga:z.string().trim().max(100).optional().default(""),state:z.string().trim().min(2).max(100),
 postalCode:z.string().max(20).optional().default(""),deliveryInstructions:z.string().max(500).optional().default(""),
 deliveryMethod:z.enum(["standard","express"]),shippingZoneCode:z.string().min(1).max(50)
}).superRefine((delivery,ctx)=>{
 if(delivery.state==="Lagos"){
  if(delivery.addressLine1.length<5)ctx.addIssue({code:z.ZodIssueCode.custom,path:["addressLine1"],message:"Enter your house number and street address."});
  if(delivery.lga.length<2)ctx.addIssue({code:z.ZodIssueCode.custom,path:["lga"],message:"Enter your Local Government Area."});
 }else if(delivery.busPark.length<2){
  ctx.addIssue({code:z.ZodIssueCode.custom,path:["busPark"],message:"Enter the nearest bus park or bus station."});
 }
}).transform(delivery=>delivery.state==="Lagos"?{...delivery,busPark:""}:{
 ...delivery,
 // Store the pickup destination in the existing address field so admin,
 // receipts and waybills can use it without a database migration.
 addressLine1:`Bus park / bus station: ${delivery.busPark}`,
 addressLine2:"",landmark:"",lga:"",postalCode:"",deliveryInstructions:""
});

export const checkoutSchema=z.object({
 customer:z.object({fullName:z.string().min(2).max(100),email:z.string().email(),phone:z.string().min(7).max(25)}),
 delivery:deliverySchema,
 couponCode:z.string().max(50).optional().default(""),
 items:z.array(z.object({slug:z.string().min(1),quantity:z.number().int().min(1).max(20)})).min(1)
});
