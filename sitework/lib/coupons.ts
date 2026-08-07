import type { Coupon, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type CouponItem = { slug: string; quantity: number; unitPriceKobo: number };

export type AppliedCoupon = {
  coupon: Coupon;
  discountKobo: number;
  shippingDiscountKobo: number;
  totalDiscountKobo: number;
  message: string;
};

export class CouponError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export function normalizeCouponCode(value?: string | null) {
  return (value || "").trim().toUpperCase().replace(/\s+/g, "");
}

function productSlugs(coupon: Coupon): string[] {
  if (!Array.isArray(coupon.applicableProductSlugs)) return [];
  return coupon.applicableProductSlugs.filter((value): value is string => typeof value === "string");
}

export async function evaluateCoupon(input: {
  code?: string | null;
  customerEmail?: string | null;
  subtotalKobo: number;
  shippingKobo: number;
  items: CouponItem[];
}): Promise<AppliedCoupon | null> {
  const code = normalizeCouponCode(input.code);
  if (!code) return null;

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.isActive) throw new CouponError("INVALID", "This coupon is not available.");

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) throw new CouponError("NOT_STARTED", "This coupon is not active yet.");
  if (coupon.expiresAt && coupon.expiresAt < now) throw new CouponError("EXPIRED", "This coupon has expired.");
  if (input.subtotalKobo < coupon.minimumSubtotalKobo) {
    throw new CouponError("MINIMUM", `This coupon requires a minimum product subtotal of ₦${Math.ceil(coupon.minimumSubtotalKobo / 100).toLocaleString("en-NG")}.`);
  }

  const recentReservationCutoff = new Date(Date.now() - 30 * 60 * 1000);
  const reservedCount = await prisma.couponRedemption.count({
    where: {
      couponId: coupon.id,
      OR: [
        { status: "REDEEMED" },
        { status: "PENDING", createdAt: { gte: recentReservationCutoff } },
      ],
    },
  });
  if (coupon.usageLimit !== null && reservedCount >= coupon.usageLimit) {
    throw new CouponError("LIMIT", "This coupon has reached its usage limit.");
  }

  const email = (input.customerEmail || "").trim().toLowerCase();
  if ((coupon.perCustomerLimit > 0 || coupon.firstOrderOnly) && !email) {
    throw new CouponError("EMAIL_REQUIRED", "Enter your email address before applying this coupon.");
  }

  if (email && coupon.perCustomerLimit > 0) {
    const customerUses = await prisma.couponRedemption.count({
      where: {
        couponId: coupon.id,
        customerEmail: email,
        OR: [
          { status: "REDEEMED" },
          { status: "PENDING", createdAt: { gte: recentReservationCutoff } },
        ],
      },
    });
    if (customerUses >= coupon.perCustomerLimit) {
      throw new CouponError("CUSTOMER_LIMIT", "This coupon has already been used the maximum number of times for this email address.");
    }
  }

  if (email && coupon.firstOrderOnly) {
    const paidOrders = await prisma.order.count({ where: { customerEmail: email, status: { in: ["PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED"] } } });
    if (paidOrders > 0) throw new CouponError("FIRST_ORDER", "This coupon is only available for a customer's first paid order.");
  }

  const restrictedSlugs = productSlugs(coupon);
  const eligibleSubtotal = input.items.reduce((sum, item) => {
    if (restrictedSlugs.length > 0 && !restrictedSlugs.includes(item.slug)) return sum;
    return sum + item.unitPriceKobo * item.quantity;
  }, 0);
  if (restrictedSlugs.length > 0 && eligibleSubtotal === 0) {
    throw new CouponError("PRODUCTS", "This coupon does not apply to the products currently in your cart.");
  }

  let discountKobo = 0;
  let shippingDiscountKobo = 0;
  if (coupon.type === "PERCENTAGE") {
    discountKobo = Math.floor((eligibleSubtotal * coupon.percentageBasisPoints) / 10000);
    if (coupon.maximumDiscountKobo !== null) discountKobo = Math.min(discountKobo, coupon.maximumDiscountKobo);
  } else if (coupon.type === "FIXED_AMOUNT") {
    discountKobo = Math.min(coupon.valueKobo, eligibleSubtotal);
  } else if (coupon.type === "FREE_SHIPPING") {
    shippingDiscountKobo = input.shippingKobo;
  }

  const totalDiscountKobo = Math.min(input.subtotalKobo + input.shippingKobo, discountKobo + shippingDiscountKobo);
  if (totalDiscountKobo <= 0) throw new CouponError("NO_DISCOUNT", "This coupon does not reduce the current order total.");

  return {
    coupon,
    discountKobo,
    shippingDiscountKobo,
    totalDiscountKobo,
    message: coupon.type === "FREE_SHIPPING" ? "Free delivery applied." : `${coupon.code} applied successfully.`,
  };
}

export async function cancelCouponReservation(orderId: string) {
  await prisma.couponRedemption.updateMany({ where: { orderId, status: "PENDING" }, data: { status: "CANCELLED" } });
}

export async function redeemCouponForOrder(tx: Prisma.TransactionClient, orderId: string) {
  const redemption = await tx.couponRedemption.findUnique({ where: { orderId } });
  if (!redemption) return;
  const updated = await tx.couponRedemption.updateMany({
    where: { id: redemption.id, status: "PENDING" },
    data: { status: "REDEEMED", redeemedAt: new Date() },
  });
  if (updated.count === 1) {
    await tx.coupon.update({ where: { id: redemption.couponId }, data: { usesCount: { increment: 1 } } });
  }
}
