import { z } from "zod";
export const checkoutSchema=z.object({
 customer:z.object({fullName:z.string().min(2).max(100),email:z.string().email(),phone:z.string().min(7).max(25)}),
 delivery:z.object({
  recipientName:z.string().min(2).max(100),recipientPhone:z.string().min(7).max(25),
  addressLine1:z.string().min(5).max(180),addressLine2:z.string().max(180).optional().default(""),
  landmark:z.string().max(180).optional().default(""),city:z.string().min(2).max(100),
  lga:z.string().min(2).max(100),state:z.string().min(2).max(100),
  postalCode:z.string().max(20).optional().default(""),deliveryInstructions:z.string().max(500).optional().default(""),
  deliveryMethod:z.enum(["standard","express"]),
  shippingZoneCode:z.string().min(1).max(50)
 }),
 couponCode:z.string().max(50).optional().default(""),
 items:z.array(z.object({slug:z.string().min(1),quantity:z.number().int().min(1).max(20)})).min(1)
});
