CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED');

CREATE TABLE "ProductReview" (
  "id" TEXT NOT NULL,
  "productSlug" TEXT NOT NULL,
  "productName" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "city" TEXT,
  "orderNumber" TEXT,
  "rating" INTEGER NOT NULL,
  "title" TEXT,
  "body" TEXT NOT NULL,
  "verifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
  "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "adminReply" TEXT,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "helpfulCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReviewImage" (
  "id" TEXT NOT NULL,
  "reviewId" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "altText" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReviewImage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProductReview_productSlug_status_createdAt_idx" ON "ProductReview"("productSlug", "status", "createdAt");
CREATE INDEX "ProductReview_status_createdAt_idx" ON "ProductReview"("status", "createdAt");
CREATE INDEX "ProductReview_customerEmail_productSlug_idx" ON "ProductReview"("customerEmail", "productSlug");
CREATE INDEX "ReviewImage_reviewId_idx" ON "ReviewImage"("reviewId");

ALTER TABLE "ReviewImage" ADD CONSTRAINT "ReviewImage_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "ProductReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
