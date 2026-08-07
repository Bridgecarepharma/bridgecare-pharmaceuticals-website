import { NextResponse } from "next/server";
import { z } from "zod";
import { STORE_PRODUCTS } from "@/lib/store";
import { getProductPriceMap } from "@/lib/product-prices";
import { shippingFeeForSelectedZone } from "@/lib/shipping";
import { CouponError, evaluateCoupon } from "@/lib/coupons";

const schema = z.object({
  code: z.string().min(1).max(50),
  customerEmail: z.string().email().optional().or(z.literal("")),
  shippingZoneCode: z.string().min(1),
  state: z.string().min(2),
  items: z.array(z.object({ slug: z.string(), quantity: z.number().int().min(1).max(20) })).min(1),
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const priceMap = await getProductPriceMap();
    const items = payload.items.map((item) => {
      const product = STORE_PRODUCTS[item.slug];
      if (!product) throw new Error("INVALID_PRODUCT");
      return { slug: item.slug, quantity: item.quantity, unitPriceKobo: priceMap[item.slug] ?? product.priceKobo };
    });
    const subtotalKobo = items.reduce((sum, item) => sum + item.unitPriceKobo * item.quantity, 0);
    const packCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const shippingKobo = await shippingFeeForSelectedZone(payload.shippingZoneCode, payload.state, packCount);
    if (shippingKobo === null) return NextResponse.json({ error: "Select the delivery zone matching your state." }, { status: 400 });
    const applied = await evaluateCoupon({ code: payload.code, customerEmail: payload.customerEmail, subtotalKobo, shippingKobo, items });
    if (!applied) return NextResponse.json({ error: "Enter a coupon code." }, { status: 400 });
    return NextResponse.json({
      code: applied.coupon.code,
      message: applied.message,
      discountKobo: applied.discountKobo,
      shippingDiscountKobo: applied.shippingDiscountKobo,
      totalDiscountKobo: applied.totalDiscountKobo,
      totalKobo: subtotalKobo + shippingKobo - applied.totalDiscountKobo,
    });
  } catch (error) {
    if (error instanceof CouponError) return NextResponse.json({ error: error.message, code: error.code }, { status: 400 });
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Check the coupon and checkout details." }, { status: 400 });
    console.error("Coupon validation error", error);
    return NextResponse.json({ error: "The coupon could not be checked right now." }, { status: 500 });
  }
}
