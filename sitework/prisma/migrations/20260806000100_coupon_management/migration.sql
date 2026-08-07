CREATE TYPE "CouponType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING');
CREATE TYPE "CouponRedemptionStatus" AS ENUM ('PENDING', 'REDEEMED', 'CANCELLED');

ALTER TABLE "Order"
ADD COLUMN "discountKobo" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "couponCode" TEXT;

CREATE TABLE "Coupon" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" "CouponType" NOT NULL,
  "percentageBasisPoints" INTEGER NOT NULL DEFAULT 0,
  "valueKobo" INTEGER NOT NULL DEFAULT 0,
  "minimumSubtotalKobo" INTEGER NOT NULL DEFAULT 0,
  "maximumDiscountKobo" INTEGER,
  "startsAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "usageLimit" INTEGER,
  "usesCount" INTEGER NOT NULL DEFAULT 0,
  "perCustomerLimit" INTEGER NOT NULL DEFAULT 1,
  "firstOrderOnly" BOOLEAN NOT NULL DEFAULT false,
  "applicableProductSlugs" JSONB,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CouponRedemption" (
  "id" TEXT NOT NULL,
  "couponId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "discountKobo" INTEGER NOT NULL,
  "shippingDiscountKobo" INTEGER NOT NULL DEFAULT 0,
  "status" "CouponRedemptionStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "redeemedAt" TIMESTAMP(3),
  CONSTRAINT "CouponRedemption_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
CREATE INDEX "Coupon_isActive_startsAt_expiresAt_idx" ON "Coupon"("isActive", "startsAt", "expiresAt");
CREATE INDEX "Coupon_createdAt_idx" ON "Coupon"("createdAt");
CREATE UNIQUE INDEX "CouponRedemption_orderId_key" ON "CouponRedemption"("orderId");
CREATE INDEX "CouponRedemption_couponId_status_createdAt_idx" ON "CouponRedemption"("couponId", "status", "createdAt");
CREATE INDEX "CouponRedemption_customerEmail_couponId_status_idx" ON "CouponRedemption"("customerEmail", "couponId", "status");

ALTER TABLE "CouponRedemption" ADD CONSTRAINT "CouponRedemption_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CouponRedemption" ADD CONSTRAINT "CouponRedemption_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
